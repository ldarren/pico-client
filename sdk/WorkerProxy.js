var
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
		worker.postMessage(['_load',u,script,s[1]])
		cb()
	})
},
bootstrap=function(self,importScripts,postMessage,close){
	var workers={}

	onmessage=function(e){
		var params=e.data
		switch(params[0]){
		case '_load':
			var
			signals={},
			url=params[1],
			deps=params[3],
			worker=Function('signals','importScripts','XMLHttpRequest',params[2])(signals,null,null),
			defaults=worker.deps,
			v

			for(var key in defaults){
				if (deps[key]) continue
				v=defaults[key]
				if (!Array.isArray(v)) return console.error('deps:',key,'not defined')
				deps[key] = v[1]
			}

			worker.signals.forEach(function(evt){
				signals[evt]=function(){
					var args=Array.prototype.slice.call(arguments)
					args.unshift(evt)
					postMessage(args)
				}
			})

			worker.create(deps)

			workers[url]=[signals,worker]

			return postMessage(['_import'])
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
