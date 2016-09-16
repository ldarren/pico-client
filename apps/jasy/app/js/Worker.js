var
specMgr=require('js/specMgr'),
dummyCB=function(){},
funcBody=function(func){
    return func.substring(func.indexOf('{')+1,func.lastIndexOf('}'))
},
_import=function(worker,queue){
	if(!queue.length) return
	var job=queue[0] //shift at _import message call

	worker.postMessage(['_start',job.url,job.script,job.deps])
},
bootstrap=function(self,importScripts,postMessage,close){
	var
	PARAMS=['deps','signals','importScripts','XMLHttpRequest'],
	actives={},
	suspended={},
	start=function(url,code,deps){
		if (actives[url] || suspended[url]) stop(url)

		var
		signals={},
		job=Function(...PARAMS,code)(deps,signals),
		defaults=job.deps,
		v

		for(var key in defaults){
			if (deps[key]) continue
			v=defaults[key]
			if (!Array.isArray(v)) return console.error('deps:',key,'not defined')
			deps[key] = v[1]
		}

		job.signals.forEach(function(evt){
			signals[evt]=function(){
				postMessage([evt,...arguments])
			}
		})

		job.create()

		actives[url]=job

		return true
	},
	stop=function(url){
		var job=actives[url]||suspended[url]
		if (!job) return false
		job.close()
		delete actives[url]
		delete suspended[url]
		return true
	},
	pause=function(url){
		var job=actives[url]
		if (!job) return false
		suspended[url]=job
		delete actives[url]
		return true
	},
	resume=function(url){
		var job=suspended[url]
		if (!job) return false
		actives[url]=job
		delete suspended[url]
		return true
	},
	state=function(url){
		return actives[url] ? 1 : suspended[url] ? -1 : 0
	},
	signal=function(evt,params){
		var job
		for(var key in actives){
			job=actives[key]
			if (!job.slots || !job.slots[evt]) continue
			job.slots[evt](...params)
		}
	}
	keys=function(){
		return Object.keys(actives).concat(Object.keys(suspended))
	},
	all=function(urls,evt,func){
		if (!urls.length) return
		var url=urls.shift()
		postMessage([evt,url,func(url)])
		all(urls,evt,func)
	}

	onmessage=function(e){
		var 
		params=e.data,
		evt=params.shift()

		switch(evt){
		case '_start':
			postMessage(['_started',params[0],start(params[0],params[1],params[2])])
			return postMessage(['_import'])
		case '_stop':
			return all(params.length?params[0]:keys(),'_stopped',stop)
		case '_pause':
			return all(params.length?params[0]:keys(),'_paused',pause)
		case '_resume':
			return all(params.length?params[0]:keys(),'_resumed',resume)
		case '_state':
			return all(params.length?params[0]:keys(),'_state',state)
		case '_close':
			all(keys(),'_stopped',stop)
			return close()
		default:
			return signal(evt,params)
		}
	}

	postMessage(['_init'])
},
callbacks=function(self){
	return [
	function(e){
		var params=e.data
		if (!Array.isArray(params)) return self.trigger(params)
		switch(params[0]){
		case '_import':
			self.queue.shift()
			/* through */
		case '_init':
			return _import(self.worker,self.queue)
		default:
			self.trigger.apply(self.trigger,params)
		}
	},
	function(e){
		//e.preventDefault()
		console.error('WebWorker Error',e.filename,':',e.lineno,':',e.message)
		self.trigger('error',e.message,e.filename,e.lineno)
	}]
}

function WorkerProxy(spec){
	if (!window.Worker) return console.error('Web Worker is not supported')

	this.queue=specMgr.findAllByType('job',spec)

	var
	dataurl= URL.createObjectURL(new Blob([funcBody(bootstrap.toString())], {type: 'application/javascript'})),
	w=this.worker = new Worker(dataurl),
	cbs=callbacks(this)

	URL.revokeObjectURL(dataurl)
    w.onmessage=cbs[0]
    w.onerror=cbs[1]

	var use=specMgr.findAllByType('use',spec)[0]
	if (!use) return
	if (!window.navigator || !navigator.serviceWorker) console.log('Service Worker is not supported')
	navigator.serviceWorker.register(use.url).then(function(reg) {
		console.log(':^)', reg)
		// TODO should have a delay here, it fails on first time due to service worker on yet activated
		// use navigator.serviceWorker.ready?
		if (use.deps.pushManager){
			reg.pushManager.subscribe({
				userVisibleOnly: true
			}).then(function(sub) {
				console.log('endpoint:', sub.endpoint)
			})
		}
	}).catch(function(error) {
		console.log(':^(', error)
	})
}           

_.extend(WorkerProxy.prototype, Backbone.Events,{
	run:function(jobs){
		if (!jobs || !Array.isArray(jobs)) return
		var q=this.queue
		if (q.length) return q.push.apply(q, jobs) // loading in progress
		this.queue=jobs
		_import(this.worker,jobs)
	},
	// TODO: a more elegant way to stop 1 url, a list or url and all
	// TODO: a more elegant way to get callback from worker
	stop:function(urls,cb){
	},
	stopAll:function(cb){
		this.worker.postMessage(['_stop'])
	},
	pause:function(urls,cb){
	},
	resume:function(urls,cb){
	},
	state:function(urls,cb){
	},
	postMessage:function(){
		this.worker.postMessage(Array.prototype.slice.call(arguments))
	},
	close:function(){
		var
		w=this.worker,
		f=function(){clearTimeout(t),w.terminate()},
		t=setTimeout(f,5000)

		this.stopAll(f)
	}
})

function spec2Deps(spec){
	var deps={}
	for(var i=0,s;s=spec[i];i++){ deps[specMgr.getId(s)]=specMgr.getValue(s) }
	return deps
}

function Job(url,script,spec){
	this.url=url
	this.script=script
	this.deps=spec2Deps(spec)
}

function Use(url,spec){
	this.url=url
	this.deps=spec2Deps(spec)
}

return {
	Proxy:WorkerProxy,
	Job:Job,
	Use:Use
}
