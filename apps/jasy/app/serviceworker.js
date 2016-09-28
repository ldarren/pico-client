var
dummyPort={postMessage:function(){}},
pushOpt,
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
	evt.waitUntil(self.skipWaiting()) // skip waiting old client to close, skip directly to activation
})
self.addEventListener('activate', function(evt){
	// The primary use of onactivate is for cleanup of resources used in previous versions of a Service worker script.
	evt.waitUntil(self.clients.claim()) // capture client without restart them, without this sw.controller is null?
})
self.addEventListener('message',function(evt){
	// evt.data and evt.ports[0].postMessage()
	console.log('sw onMessage',arguments)
	var
	params=evt.data,
	port=evt.ports[0]||dummyPort

	switch(params[0]){
	case 'showNoti':
		pushOpt=params[1]
		evt.waitUntil(
			self.registration.showNotification(pushOpt.title||'', {
				body: pushOpt.body,
				icon: pushOpt.icon,
				tag: pushOpt.tag // notification grouping
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
				if (-1!==c.url.indexOf(pushOpt.url) && 'focus' in c)  
				return c.focus()  
			}  
			if (clients.openWindow) {
				return clients.openWindow(pushOpt.url)  
			}
		})
	)
})
