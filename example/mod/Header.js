var View=inherit('po/View')
var tmpl=require('Header.asp')
var css=require('Header.css')

return {
	start:function(opt,params){
		opt.css=css
		opt.childs=tmpl(params)
		View.prototype.start.call(this,opt)
	},
	events:{
		'click button':function(e){
			this.callback.trigger('click',e.target.textContent)
		}
	}
}
