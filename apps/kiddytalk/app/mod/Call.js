var
Rand=Math.random,Ceil=Math.ceil,
talk=function(self){
	self.el.querySelector('.profile').classList.add('invisible')
	self.el.style.backgroundImage='url('+self.deps.contact.get('img')+')'
	self.deps.recents.get(self.recentId).state=0
},
connected=function(self){
	self.el.querySelector('.profile .state').textContent='connected'
	setTimeout(talk,1000,self)
}

return {
	className:'callscr',
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
		if (deps.maxDelay)setTimeout(connected,Ceil(deps.maxDelay*Rand()),this)
		this.spawn(deps.Keypad,params)
		this.recentId=Date.now()
		deps.recents.add({contactId:params[0],id:this.recentId,period:0,state:0})
	},
	slots:{
		callAccepted:function(){
			talk(this)
		}
	}
}
