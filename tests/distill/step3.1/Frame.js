var Module=inherit('po/Module')
var router=require('po/router')
var Page = require('Page')

function pageChanged(evt, state, params){
	var p = this.page
	var c = this.count
	p.update(c++)
	if (c > 1) c=0
	this.count = c
}

return {
	start:function(opt){
		Module.prototype.start.call(this,opt)

		this.page = new Page
		this.count = 0
		this.page.start({el:document.body})

		router.on('change',pageChanged,this).start()
	}
}
