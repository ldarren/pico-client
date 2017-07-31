var Module=inherit('po/Module')
var router=require('po/router')
var pStr = require('pico/str')

return {
	start:function(opt,params){
		opt.content = [ {
			id:pStr.rand(),
			className:'page',
			content:[{
				tagName:'button',
				content:'Page'+params.count
			}]
		} ]
		Module.prototype.start.call(this,opt)
	},
	events:{
		'click button':function(e, target){
			router.go(this.el.querySelector('.page').id)
		}
	}
}
