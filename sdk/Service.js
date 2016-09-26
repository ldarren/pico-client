var
specMgr=require('js/specMgr'),
dummyCB=function(){},
onMessage=function(self){
	return function(evt){
		console.log('received msg from sw',arguments)
		var msg=evt.data
		switch(msg[0]){
		case 'activated':
			break
		}
	}
},
postMessage=function(evt,msg,cb){
	var ctrl=navigator.serviceWorker.controller
	if (!ctrl) return
	cb=cb||dummyCB	
	var channel= new MessageChannel()

	channel.port1.onmessage = function(evt) { cb(evt.data.error,evt.data) }

	ctrl.postMessage([evt,msg], [channel.port2])
}

function ServiceProxy(url,spec){
	if (!window.navigator || !navigator.serviceWorker) return console.log('Service Worker is not supported')

	var
	self=this,
	sw=navigator.serviceWorker

	sw.addEventListener('message',onMessage(this))
	sw.register(url).then(function(reg){
		console.log('serviceworker registered', reg)
		// wait for service installation and activation
		sw.ready.then(function(reg){
			// TODO should have a delay here, it fails on first time due to service worker on yet activated
			var deps=specMgr.spec2Obj(spec)
			self.deps=deps
			if (deps.pushMgrOpt){
				reg.pushManager.subscribe({
					userVisibleOnly: true
				}).then(function(sub) {
					console.log('endpoint:', sub.endpoint)
					self.trigger(['endpoint',sub.endpoint])
					postMessage('pushMgrOpt',deps.pushMgrOpt)
				})
			}
		})
	}).catch(function(err) {
		console.error('serviceworker registration error', err)
	})
} 

_.extend(ServiceProxy.prototype, Backbone.Events, {
})

return ServiceProxy
