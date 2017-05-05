var router=require('po/router')
return {
	slots:{
		deps:{
			html:'file'
		},
		create:function(deps){
			this.el.innerHTML=deps.html
		},
		click:function(from,sender,name){
			switch(name){
			case 'next':
				router.go('users/u156')
				break
			}
		},
		select:function(from,sender){
		}
	}
}
