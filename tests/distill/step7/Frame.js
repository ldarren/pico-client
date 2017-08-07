var router=require('po/router')

function pageChanged(evt, state, params){
	var p = this.modules[0]
	var c = this.count
	p.update(c++)
	if (c > 1) c=0
	this.count = c
}

return {
	create: function(deps, params){
		this.super.create.call(this, deps, params)
		this.count = 0

		router.on('change',pageChanged,this).start()
	}
}
