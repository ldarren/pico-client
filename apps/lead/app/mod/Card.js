var
COLORS=['purple','green','orange','red'],
COLOR_HEX=['#BA68C8','#52A43A','#F7AA17','#EF5350'],
specMgr=require('js/specMgr'),
picoTime=require('pico/time')

return{
	tagName:'li',
	signals:['scrollTo','scan','unlock'],
	deps:{
		data:'map',
		tpl:'file'
	},
	create: function(deps){
		var
		self=this,
		el=this.el,
		data=deps.data,
		dt=new Date(data.uat),
		t=dt.toLocaleTimeString()

		t=t.substring(0, t.indexOf('M')+1)//remove time zone

		el.classList.add('theme-'+COLORS[data.s])
		el.dataset.color=COLOR_HEX[data.s]

		el.innerHTML = deps.tpl({
			card:data,
			delivDateNoun:picoTime.day(dt),
			delivTime:t})
	}
}
