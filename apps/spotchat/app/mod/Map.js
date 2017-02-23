function onMapInit(map) {
}

return {
	create:function(){
		// Initialize the map plugin
		var map = plugin.google.maps.Map.getMap(this.el)

		// You have to wait the MAP_READY event.
		map.on(plugin.google.maps.event.MAP_READY, onMapInit)
	}
}
