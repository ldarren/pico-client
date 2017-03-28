return {
	deps:{
		devices:'models'
	},
	create:function(deps){
		var
		ds=deps.devices,
		d=__.device
		ds.load('',function(){
			if (ds.length) return
			ds.create(null,{
				data:{
					uuid:d.uuid,
					platform:d.platform.toLowerCase(),
					model:d.model.toLowerCase(),
					$desc:{
						cordova:d.cordova,
						version:d.version,
						vendor:d.manufacturer,
					}
				},
				success:function(){
					ds.save()
				}
			})
		})
	}
}
