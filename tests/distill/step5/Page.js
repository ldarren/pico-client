var router=require('po/router')

return {
	create: function(deps, params){
		this.count = params ? params.id || 0 : 0
		this.el.appendChild( __.dom.get({
			tagName:'button',
			content:'Page'+this.count
		}))
		//'<button>Page'+this.count+'</button>'
	},
	events:{
		'click button':function(e, target){
			var c = this.count
			if (++c > 1) c = 0
			router.go('page/'+c)
		}
	}
}
