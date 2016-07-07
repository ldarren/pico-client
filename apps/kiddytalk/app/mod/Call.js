var
Rand=Math.random,Ceil=Math.ceil,
talk=function(self){
	self.el.querySelector('.profile').classList.add('invisible')
	self.el.style.backgroundImage='url('+self.deps.contact.get('img')+')'
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
		Keypad:'view'
	},
	create:function(deps,params){
		var el=this.el
		el.innerHTML=deps.tpl(deps.contact.attributes)
		if (deps.maxDelay)setTimeout(connected,Ceil(deps.maxDelay*Rand()),this)
		this.spawn(deps.Keypad,params)
	},
	slots:{
		callAccepted:function(){
			talk(this)
		}
	}
}
