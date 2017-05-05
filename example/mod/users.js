var router=require('po/router')
return {
	deps:{
		html:'file'
	},
	create:function(deps){
		this.el.innerHTML=deps.html
	},
	slots:{
		click:function(from,sender,name){
			switch(name){
			case 'back':
				router.back()
				break
			}
		}
	}
}
