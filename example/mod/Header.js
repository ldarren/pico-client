var router=require('po/router')
return {
	signals:['click'],
	deps:{
		tpl:'file',
		data:'map'
	},
	create:function(deps,params){
		this.el.innerHTML=deps.tpl(deps.data)
	},
	events:{
		'click button':function(e, target){
			//this.signals.click(target.textContent).send() // dom leak here
			switch(target.textContent){
			case 'next':
				return router.go('users/11')
			case 'back':
				return router.go('organizations')
			}
		}
	}
}
