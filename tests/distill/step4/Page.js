var router=require('po/router')

return {
	slots:{
		pageAdd: function(from, sender, name, spec, params){
			this.count = params ? params.id || 0 : 0
			this.el.innerHTML= '<button>Page'+this.count+'</button>'
		}
	},
	events:{
		'click button':function(e, target){
			var c = this.count
			if (++c > 1) c = 0
			router.go('page/'+c)
		}
	}
}
