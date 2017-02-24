var
GEOLOC_OPTIONS={ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }

function events(self) {
	return [
		// onMapReady
		function(map){
		},
		// onMapClose
		function(map){
		},
		// onMapClick
		function(map){
		},
		// onMapLongClick
		function(latlng){
		},
		// onMyLocationClick
		function(map){
		},
		// onCameraChange
		function(pos){
		},
	]
}

return {
	create:function(){
		// Initialize the map plugin
		var
		self=this,
		maps= __.refChain(window,['plugin','google','maps']),
		geoloc= __.refChain(window,['navigator','geolocation'])

		if (!maps || !geoloc){
			this.slots={}
			return console.error('Please install cordova-plugin-geolocation and cordova-plugin-googlemaps')
		}

		geoloc.getCurrentPosition(function(pos){
			var
			coor=pos.coords,
			latlng=new maps.LatLng(coor.latitude,coor.longitude),
			map = maps.Map.getMap(self.el,{
				'backgroundColor': 'white',
				'mapType': maps.MapTypeId.ROADMAP,
				'controls': {
					'compass': true,
					'myLocationButton': true,
					'indoorPicker': true,
					'zoom': false
				},
				'gestures': {
					'scroll': true,
					'tilt': true,
					'rotate': true,
					'zoom': true
				},
				'camera': {
					'latLng': latlng,
					'tilt': 0,
					'zoom': 18,
					'bearing': coor.heading
				}
			}),
			Event = maps.event,
			evts = events(self)

			self.map=map
			self.geoloc = geoloc

			// You have to wait the MAP_READY event.
			map.on(Event.MAP_READY,					evts[0])
			map.on(Event.MAP_CLOSE,					evts[1])
			map.on(Event.MAP_CLICK,					evts[2])
			map.on(Event.MAP_LONG_CLICK,			evts[3])
			map.on(Event.MY_LOCATION_BUTTON_CLICK,	evts[4])
			map.on(Event.CAMERA_CHANGE,				evts[5])
		}, function(err){
			__.dialogs.alert(JSON.stringify(err,null,'\t'),'Google Maps Error')
			console.error(err)
		}, GEOLOC_OPTIONS)
	},
	remove:function(){
		this.host.remove()
	},
	slots:{
		mapMoveCamera:function(from,sender,pos,options,cb){
			var map=this.map
			map.getCameraPosition(function(oldCam) {
				var camera = Object.assign(oldCam,options)
				camera.target=Object.assign(camera.target,pos)
				if (options.duration) map.animateCamera(camera,cb)
				else map.moveCamera(camera,cb)
			})
		}
	}
}
