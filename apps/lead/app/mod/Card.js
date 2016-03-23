var
LOCKID='AF131569',
specMgr=require('js/specMgr'),
picoTime=require('pico/time')

return{
	tagName:'li',
	className:'card simple',
	signals:['scrollTo','scan','unlock'],
	deps:{
		data:'map',
		tpl:'file'
	},
	create: function(deps){
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
		lockStatus:function(from, sender, id, state){
			if (id !== LOCKID) return
			var span=this.el.querySelector('span')
			span.removeAttribute('disabled')
			switch(state){
			case 'found':
				span.textContent='Connecting...'
				span.setAttribute('disabled',1)
				break
			case 'connected':
				span.textContent='Open'
				break
			case 'disconnected':
				span.textContent='Scan'
				break
			case 'locked':
				span.textContent='Open'
				break
			case 'unlocked':
				span.textContent='Openned'
				span.setAttribute('disabled',1)
				break
			}
		}
	},
	events:{
		'click button':function(e){
			var span=this.el.querySelector('span')
			switch(span.textContent){
			case 'Scan':
				this.signals.scan(LOCKID).send(this.host)
				span.textContent='Scanning...'
				span.setAttribute('disabled',1)
				break
			case 'Open':
				this.signals.unlock(LOCKID).send(this.host)
				span.textContent='Openning...'
				span.setAttribute('disabled',1)
				break
			}
		}
	}
}
