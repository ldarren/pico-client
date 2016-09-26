var
pushMgrOpt,
broadcast=function(options){
	var params=Array.prototype.slice.call(arguments,1)
	self.clients.matchAll(options).then(function(clients) {
		clients.forEach(function(client) {
			client.postMessage(params)
		})
	})
}

self.addEventListener('install', function(evt){
	// this can be used to start the process of populating an IndexedDB, and caching site assets
	self.skipWaiting() // skip waiting old client to close, skip directly to activation
	console.log('Installed', evt)
})
self.addEventListener('activate', function(evt){
	// The primary use of onactivate is for cleanup of resources used in previous versions of a Service worker script.
	self.clients.claim() // capture client without restart them, without this sw.controller maybe null
	broadcast(null,'activated')
	console.log('Activated', evt)
})
self.addEventListener('message',function(evt){
	// evt.data and evt.ports[0].postMessage()
	console.log('sw onMessage',arguments)
	var
	params=evt.data[0],
	port=evt.ports[0]

	switch(params[0]){
	case 'pushMgrOpt': pushMgrOpt=params[1]; break
	case 'showNoti':
		evt.waitUntil(
			self.registration.showNotification('PushNoti Title', {
				body: 'The Message',
				icon: 'images/icon.png',
				tag: 'my-tag' // notification grouping
			})
		)
		break
	}
})

/* Push Related Events*/
self.addEventListener('push', function(evt){
	console.log('Push message received', evt)
	broadcast(null,'pushed')
})
self.addEventListener('pushsubscriptionchange',function(evt){
	// TODO: update endpoint to backend
	console.log('pushsubscriptionchange', evt)
})
self.addEventListener('notificationclick', function(evt){  
	console.log('On notification click: ', evt.notification.tag)  
	// Android doesn't close the notification when you click on it  
	// See: http://crbug.com/463146  
	evt.notification.close()

	// This looks to see if the current is already open and  
	// focuses if it is  
	evt.waitUntil(
		clients.matchAll({  
			type: 'window'  
		}).then(function(clientList) {  
			for (var i=0,c; c=clientList[i]; i++) {  
				console.log(c.url)
				if (-1!==c.url.indexOf(pushMgrOpt.url) && 'focus' in c)  
				return c.focus()  
			}  
			if (clients.openWindow) {
				return clients.openWindow(pushMgrOpt.url)  
			}
		})
	)
})
