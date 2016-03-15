var
specMgr=require('js/specMgr'),
picoTime=require('pico/time')

return{
	tagName:'li',
	className:'card simple',
	signals:['scrollTo','unlock'],
	deps:{
		data:'map',
		tpl:'file'
	},
	create: function(deps){
		this.animating = false;

		var
		self=this,
		data=deps.data,
		dt=new Date(data.datetime),
		t=dt.toLocaleTimeString()

		t=t.substring(0, t.indexOf('M')+1)

		this.el.classList.add('theme-'+data.themeColor)
		this.el.dataset.color=data.themeColorHex

		this.el.innerHTML = deps.tpl({
			card:data,
			delivDateNoun:picoTime.day(dt),
			delivTime:t})
	},
	slots:{
	},
	events:{
		'click button':function(e){
			this.signals.unlock().send(this.host)
		}
	}
}
