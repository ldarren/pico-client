console.log('Started', self)
self.addEventListener('install', function(evt){
	// this can be used to start the process of populating an IndexedDB, and caching site assets
	self.skipWaiting() // skip waiting old client to close, skip directly to activation
	console.log('Installed', evt)
})
self.addEventListener('activate', function(evt){
	// The primary use of onactivate is for cleanup of resources used in previous versions of a Service worker script.
	//self.clients.claim() // capture client without restart them
	console.log('Activated', evt)
})
self.addEventListener('message',function(evt){
	// evt.data and evt.ports
})

self.addEventListener('push', function(evt){
	console.log('Push message received', evt)
	var title = 'Push message'
	evt.waitUntil(
		self.registration.showNotification(title, {
			body: 'The Message',
			icon: 'images/icon.png',
			tag: 'my-tag' // notification grouping
		})
	)
})

self.addEventListener('pushsubscriptionchange',function(evt){
	// TODO: update endpoint to backend
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
				if (-1!==c.url.indexOf('/sandbox/chrome-push/') && 'focus' in c)  
				return c.focus()  
			}  
			if (clients.openWindow) {
				return clients.openWindow('/sandbox/chrome-push/')  
			}
		})
	)
})
