var router=require('po/router')
var pStr = require('pico/str')

return {
	update: function(count){
		//this.undelegateEvents()
		this.el.innerHTML=''
		var opt = {}
		opt.content = [ {
			id:pStr.rand(),
			className:'page',
			content:[{
				tagName:'button',
				content:'Page'+count
			}]
		} ]
		this.el.appendChild(__.dom.get(opt))
		//this.delegateEvents()
	},
	events:{
		'click button':function(e, target){
			router.go(this.el.querySelector('.page').id)
		}
	}
}
