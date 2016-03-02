var
specMgr=require('js/specMgr'),
picoTime=require('pico/time')

return{
	tagName:'li',
	className:'card',
	deps:{
		data:'map'
	},
	create: function(deps){
		var
		data=deps.data,
		dt=new Date(data.datetime),
		spec=['data','map',{data:data,delivDateNoun:picoTime.day(dt),delivTime:dt.toLocaleTimeString()}]

		this.spawnAsync(specMgr.findAllByType('view',this.spec), null, spec)
	},
	slots:{
	},
	events:{
	}
}
