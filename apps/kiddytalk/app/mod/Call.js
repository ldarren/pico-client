var
Rand=Math.random,Ceil=Math.ceil,
update=function(self){
	self.el.querySelector('.profile').classList.add('invisible')
	self.el.style.backgroundImage='url('+self.deps.contact.get('img')+')'
	self.deps.recents.get(self.recentId).state=0
	self.talkId=setTimeout(talk,1000,self,self.deps.contact.get('snd'))
},
talk=function(self,snd){
	self.signals.WebAudio_start(snd).send(self.host)
	self.talkId=setTimeout(talk,1000+Ceil(8000*Rand()),self,snd)
},
connected=function(self){
	self.el.querySelector('.profile .state').textContent='connected'
	setTimeout(update,1000,self)
}

return {
	className:'callscr',
	signals:['WebAudio_start','WebAudio_stop'],
	deps:{
		tpl:'file',
		maxDelay:['int',10000],
		contact:'model',
		recents:'models',
		Keypad:'view'
	},
	create:function(deps,params){
		var el=this.el
		el.innerHTML=deps.tpl(deps.contact.attributes)
		if (deps.maxDelay){
			var delay=1000+Ceil(deps.maxDelay*Rand())
			setTimeout(connected,delay,this)
			this.signals.WebAudio_start('callout',1,delay/1000).send(this.host)
		}else{
			this.signals.WebAudio_start('callin',1).send(this.host)
		}
		this.spawn(deps.Keypad,params)
		this.recentId=Date.now()
		deps.recents.add({contactId:params[0],id:this.recentId,period:0,state:0})
	},
	remove:function(){
		clearTimeout(this.talkId)
		this.ancestor.remove.call(this)
	},
	slots:{
		callAccepted:function(){
			this.signals.WebAudio_stop().send(this.host)
			talk(this)
		}
	}
}
