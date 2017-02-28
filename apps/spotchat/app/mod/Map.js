var
GEOLOC_OPTIONS={ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true },
addMarkers=function(map, data, callback) {
  var markers = [];
  function onMarkerAdded(marker) {
    markers.push(marker);
    if (markers.length === data.length) {
      callback(markers);
    }
  }
  data.forEach(function(markerOptions) {
    map.addMarker(markerOptions, onMarkerAdded);
  });
}

function events(self) {
	return [
		// onMapReady
		function(map){
		},
		// onMapClick
		function(latlng){
		},
		// onMapLongClick
		function(latlng){
		},
		// onMyLocationClick
		function(map){
		},
		// onCameraChange
		function(campos,map){
		},
	]
}

return {
	deps:{
		html:'file'
	},
	create:function(deps){
		// Initialize the map plugin
		var
		self=this,
		maps= __.refChain(window,['plugin','google','maps']),
		geoloc= __.refChain(window,['navigator','geolocation'])

		if (!maps || !geoloc){
			this.slots={}
			return console.error('Please install cordova-plugin-geolocation and cordova-plugin-googlemaps')
		}

		this.el.innerHTML=deps.html

		maps.Map.isAvailable(function(isAvailable, message){
			if (!isAvailable) return __.dialogs.alert(message,'Map Error')
			geoloc.getCurrentPosition(function(pos){
				var
				coor=pos.coords,
				latlng=new maps.LatLng(coor.latitude,coor.longitude),
				map = maps.Map.getMap(self.el,{
					backgroundColor: 'white',
					mapType: maps.MapTypeId.ROADMAP,
					controls: {
						compass: true,
						myLocationButton: true,
						indoorPicker: true,
						zoom: false
					},
					gestures: {
						scroll: true,
						tilt: false,
						rotate: true,
						zoom: true
					},
					camera: {
						latLng: latlng,
						tilt: 0,
						zoom: 18,
						bearing: 50
					}
				}),
				Event = maps.event,
				evts = events(self)

				self.map=map
				self.geoloc = geoloc

				// You have to wait the MAP_READY event.
				map.on(Event.MAP_READY,					evts[0])
				map.on(Event.MAP_CLICK,					evts[1])
				map.on(Event.MAP_LONG_CLICK,			evts[2])
				map.on(Event.MY_LOCATION_BUTTON_CLICK,	evts[3])
				map.on(Event.CAMERA_CHANGE,				evts[4])
			}, function(err){
				console.error(err)
				__.dialogs.alert('Location unavailable, please enable it','Map Error')
			}, GEOLOC_OPTIONS)
		})
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
	},
	events:{
		'tap svg':function(e){
			var m=this.map
			m.clear()
			m.getVisibleRegion(function(latLngBounds) {
				var data=[{
					position:latLngBounds.getCenter(),
					title:'You Click Here'
				}]
				plugin.google.maps.Geocoder.geocode({position:latLngBounds.getCenter()}, function(results) {
					for(var i=0,loc; loc=results[i]; i++){
						data.push({
							position:loc.position,
							title:loc.postalCode,
							snippet:[
								loc.subThoroughfare || "",
								loc.thoroughfare || "",
								loc.locality || "",
								loc.adminArea || "",
								loc.postalCode || "",
								loc.country || ""].join(", ")
						})
					}
					addMarkers(m, data, function(markers) {
						markers[0].showInfoWindow()
					})
				})
			})
		}
	}
}
