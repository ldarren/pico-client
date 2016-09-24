var
specMgr=require('js/specMgr'),
onMessage=function(self){
	return function(evt){
	}
},
postMessage=function(msg,cb){
	var messageChannel = new MessageChannel()
	messageChannel.port1.onmessage = function(evt) { cb(evt.data.error,evt.data) }

	navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
}

function ServiceProxy(url,spec){
	if (!window.navigator || !navigator.serviceWorker) return console.log('Service Worker is not supported')

	navigator.serviceWorker.addEventListener('message',onMessage(this))
	navigator.serviceWorker.register(url).then(function(reg) {
		console.log(':^)', reg)
		// TODO should have a delay here, it fails on first time due to service worker on yet activated
		// use navigator.serviceWorker.ready?a
		var deps=specMgr.spec2Obj(spec)
		if (deps.pushManager){
			reg.pushManager.subscribe({
				userVisibleOnly: true
			}).then(function(sub) {
				console.log('endpoint:', sub.endpoint)
				this.trigger(['endpoint',sub.endpoint])
			})
		}
	}).catch(function(error) {
		console.log(':^(', error)
	})
} 

_.extend(ServiceProxy.prototype, Backbone.Events, {
})

return ServiceProxy
