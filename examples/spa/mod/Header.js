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
			switch(target.textContent){
			case 'back':
				router.go('organizations')
				break
			case 'next':
				router.go('users/u156')
				break
			}
			//this.signals.click(target.textContent).sendNow(this.host) // dom leak here if used send
		}
	}
}
