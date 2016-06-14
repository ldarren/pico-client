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
	},
	slots:{
		lockStatus:function(from, sender, id, state){
			var lock=this.deps.data
			if (id !== lock.$detail.lockerId) return
			var btn=this.el.querySelector('button')
			btn.removeAttribute('disabled')
			switch(state){
			case 'found':
				btn.textContent='Connecting...'
				btn.setAttribute('disabled',1)
				break
			case 'connected':
				btn.textContent='Open'
				break
			case 'disconnected':
				btn.textContent='Scan'
				break
			case 'locked':
				btn.textContent='Open'
				break
			case 'unlocked':
				btn.textContent='Openned'
				btn.setAttribute('disabled',1)
				break
			}
		}
	},
	events:{
		'click button':function(e){
			var lock=this.deps.data

			if (!lock || !lock.$detail || !lock.$detail.lockerId) return __.dialogs.alert('Missing locker information',lock.name)

			var btn=e.srcElement
			switch(btn.textContent){
			case 'Scan':
				this.signals.scan(lock.$detail.lockerId).send(this.host)
				btn.textContent='Scanning...'
				btn.setAttribute('disabled',1)
				break
			case 'Open':
				this.signals.unlock(lock.$detail.lockerId,lock.id).send(this.host)
				btn.textContent='Openning...'
				btn.setAttribute('disabled',1)
				break
			}
		}
	}
}
