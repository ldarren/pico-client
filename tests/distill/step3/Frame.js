var Module=inherit('po/Module')
var router=require('po/router')
var Page = require('Page')

function pageChanged(evt, state, params){
	var p = this.page
	var c = this.count
	p && p.stop()
	p = new Page
	p.start({el:document.body},{count:c++})
	if (c > 1) c=0
	this.page = p
	this.count = c
}

return {
	start:function(opt){
		Module.prototype.start.call(this,opt)

		this.page = null
		this.count = 0

		router.on('change',pageChanged,this).start()
	}
}
