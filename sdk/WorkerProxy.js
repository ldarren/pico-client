var
PARAMS=['deps','signals','importScripts','XMLHttpRequest'],
dummyCB=function(){},
funcBody=function(func){
    return func.substring(func.indexOf('{')+1,func.lastIndexOf('}'))
},
_import=function(worker,queue,cb){
	if(!queue.length) return cb()
	var
	s=queue[0], //shift at _import message call
	u=s[0]

	require(u,function(err,script){
		if(err) return cb(err)
		worker.postMessage(['_start',u,script,s[1]])
		cb()
	})
},
bootstrap=function(self,importScripts,postMessage,close){
	var
	actives={},
	suspended={},
	start=function(url,code,deps){
		if (actives[url] || suspended[url]) stop(url)

		var
		signals={},
		w=Function(...PARAMS,code)(deps,signals),
		defaults=w.deps,
		v

		for(var key in defaults){
			if (deps[key]) continue
			v=defaults[key]
			if (!Array.isArray(v)) return console.error('deps:',key,'not defined')
			deps[key] = v[1]
		}

		w.signals.forEach(function(evt){
			signals[evt]=function(){
				postMessage([evt,...arguments])
			}
		})

		w.create()

		actives[url]=w

		return true
	},
	stop=function(url){
		var w=actives[url]||suspended[url]
		if (!w) return false
		w.close()
		delete actives[url]
		delete suspended[url]
		return true
	},
	pause=function(url){
		var w=actives[url]
		if (!w) return false
		suspended[url]=w
		delete actives[url]
		return true
	},
	resume=function(url){
		var w=suspended[url]
		if (!w) return false
		actives[url]=w
		delete suspended[url]
		return true
	},
	state=function(url){
		return actives[url] ? 1 : suspended[url] ? -1 : 0
	},
	signal=function(evt,params){
		var w
		for(var key in actives){
			w=actives[key]
			if (!w.slots || !w.slots[evt]) continue
			w.slots[evt](...params)
		}
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
			return postMessage(['_stopped',params[0],pause(params[0])])
		case '_pause':
			return postMessage(['_paused',params[0],pause(params[0])])
		case '_resume':
			return postMessage(['_resumed',params[0],resume(params[0])])
		case '_state':
			return postMessage(['_state',params[0],state(params[0])])
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
			return _import(self.worker,self.queue,dummyCB)
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

function WorkerProxy(scripts){
	if (!window.Worker) return console.error('WebWorker not supported')

	this.queue=scripts||[]

	var
	dataurl= URL.createObjectURL(new Blob([funcBody(bootstrap.toString())], {type: 'application/javascript'})),
	w=this.worker = new Worker(dataurl),
	cbs=callbacks(this)

	URL.revokeObjectURL(dataurl)
    w.onmessage=cbs[0]
    w.onerror=cbs[1]
}           

_.extend(WorkerProxy.prototype, Backbone.Events,{
	run:function(scripts){
		if (!scripts || !Array.isArray(scripts)) return
		var q=this.queue
		if (q.length) return q.push.apply(q, scripts) // loading in progress
		this.queue=scripts
		_import(this.worker,scripts,dummyCB)
	},
	stop:function(scripts,cb){
	},
	pause:function(scripts,cb){
	},
	resume:function(scripts,cb){
	},
	state:function(scripts,cb){
	},
	postMessage:function(){
		this.worker.postMessage(Array.prototype.slice.call(arguments))
	},
	close:function(){
		var
		w=this.worker,
		f=function(){clearTimeout(t),w.terminate()},
		t=setTimeout(f,5000)

		this.stop(f)
	}
})

return WorkerProxy
