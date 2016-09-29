var
specMgr=require('js/specMgr'),
dummyCB=function(){},
onStateChange=function(e){
	switch(e.target.state){
	case 'installing':
	case 'installed':
	case 'activating':
	case 'activated':
	case 'redundant':
		break
	}
},
onMessage=function(self){
	return function(evt){
		console.log('received msg from sw',arguments)
		var msg=evt.data
		switch(msg[0]){
		case 'pushed':
			self.trigger(['pushed'])
			break
		}
	}
},
postMessage=function(evt,msg,cb){
	var ctrl=navigator.serviceWorker.controller
	if (!ctrl) return console.warn('failed to postMessage',evt,msg)

	if (cb){
		var channel= new MessageChannel()
		channel.port1.onmessage = function(evt) { cb(evt.data.error,evt.data) }
		ctrl.postMessage([evt,msg], [channel.port2])
	}else{
		ctrl.postMessage([evt,msg])
	}
}

function ServiceProxy(url,spec){
	if (!window.navigator || !navigator.serviceWorker) return console.warn('Service Worker is not supported')

	var
	self=this,
	sw=navigator.serviceWorker

	sw.addEventListener('message',onMessage(this))
	sw.register(url).then(function(reg){
		console.log('ServiceWorker registered', reg)
		// wait for service installation and activation, sw.controller could be null at this stage
		// var ctrl=sw.controller||reg.installing||reg.waiting||reg.active
		// ctrl.addEventListener('statechange', onStateChange)
		// ctrl.addEventListener('error', console.error)
		return sw.ready
	}).then(function(reg){
		// TODO should have a delay here, it fails on first time due to service worker on yet activated
		var deps=specMgr.spec2Obj(spec)
		self.deps=deps
		if (deps.enablePushMgr){
			reg.pushManager.subscribe({
				userVisibleOnly: true
			}).then(function(sub) {
				console.log('endpoint:', sub.endpoint)
				self.trigger(['endpoint',sub.endpoint])
			})
		}
	}).catch(function(err) {
		console.error('ServiceWorker registration error', err)
	})
} 

_.extend(ServiceProxy.prototype, Backbone.Events, {
	postMessage:postMessage,
	showNotification:function(title,body,icon,tag){
		postMessage('showNoti',{
			title:title,
			body:body,
			icon:icon,
			tag:tag
		})
	}
})

return ServiceProxy
