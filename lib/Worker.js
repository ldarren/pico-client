/*
 * TODO: worker and job declaration should be separated,
 * job should be together with UI and css, but execute in worker.
 * worker proxy should run multiple workers (define in spec), when job come
 * worker proxy use round robin way to choose worker to run job
 */
var
Callback=require('po/Callback'),
specMgr=require('p/specMgr'),
dummyCB=function(){},
funcBody=function(func){
    return func.substring(func.indexOf('{')+1,func.lastIndexOf('}'))
},
_start=function(worker,queue){
	if(!queue.length) return
	var job=queue[0] //shift at _continue message call

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
			return postMessage(['_continue'])
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
workerCBs=function(self){
	return [
	function(e){
		var params=e.data
		if (!Array.isArray(params)) return self.callback.trigger(params)
		switch(params[0]){
		case '_continue':
			self.queue.shift()
			/* through */
		case '_init':
			return _start(self.worker,self.queue)
		default:
			self.callback.trigger.apply(self.callback.trigger,params)
		}
	},
	function(e){
		//e.preventDefault()
		console.error('WebWorker Error',e.filename,':',e.lineno,':',e.message)
		self.callback.trigger('error',e.message,e.filename,e.lineno)
	}]
}

function WorkerProxy(spec){
	if (!window.Worker) return console.error('Web Worker is not supported')
	this.callback=new Callback
	this.queue=specMgr.findAllByType('job',spec)

	var
	dataurl= URL.createObjectURL(new Blob([funcBody(bootstrap.toString())], {type: 'application/javascript'})),
	w=this.worker = new Worker(dataurl),
	cbs=workerCBs(this)

	URL.revokeObjectURL(dataurl)
	w.addEventListener('message',cbs[0])
	w.addEventListener('error',cbs[1])
}           

WorkerProxy.prototype={
	run:function(jobs){
		if (!jobs || !Array.isArray(jobs)) return
		var q=this.queue
		if (q.length) return q.push.apply(q, jobs) // loading in progress
		this.queue=jobs
		_start(this.worker,jobs)
	},
	// TODO: a more elegant way to stop 1 url, a list or url and all
	// TODO: a more elegant way to get callback from worker
	stop:function(urls){
		this.worker.postMessage(['_stop',urls])
	},
	pause:function(urls){
		this.worker.postMessage(['_pause',urls])
	},
	resume:function(urls){
		this.worker.postMessage(['_resume',urls])
	},
	state:function(urls){
		this.worker.postMessage(['_state',urls])
	},
	postMessage:function(){
		this.worker.postMessage(Array.prototype.slice.call(arguments))
	},
	close:function(){
		var
		w=this.worker,
		f=function(){clearTimeout(t),w.terminate()},
		t=setTimeout(f,5000)

		this.worker.postMessage(['_close'])
	}
}

function Job(url,script,spec){
	this.url=url
	this.script=script
	this.deps=specMgr.spec2Obj(spec)
}

return {
	Proxy:WorkerProxy,
	Job:Job
}
