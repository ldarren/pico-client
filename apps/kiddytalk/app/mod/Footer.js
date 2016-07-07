var Router=require('js/Router')
return {
	signals:[],
    deps:{
        paneId:'int',
		tpl:'file',	
		list:'list'
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl(deps.list)
    },
	slots:{
		pageAdd:function(from,sender){
			var arr=sender.name.split('.')
			if (!arr || arr.length < 2) return
			var
			id=arr[1],
			ul=this.el.querySelectorAll('li'),
			hide=true
			for(var i=0,li; li=ul[i]; i++){
				if(id===li.id){
					li.classList.add('selected')
					hide=false
				}else{
					li.classList.remove('selected')
				}
			}
			if (hide) this.el.classList.add('hidden')
			else this.el.classList.remove('hidden')
		}
	},

    events: {
		'tap li':function(e){
			var use='use'===e.target.tagName?e.target:e.target.querySelector('use')
			Router.go(use.getAttributeNS('http://www.w3.org/1999/xlink', 'role'))
        }
    }
}
