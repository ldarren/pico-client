var View=require('po/View')
var view
var Collection=require('po/Collection')
var CollOrganizations=require('CollOrganizations')
var coll
var router=require('po/router')
var html=require('organizations.html')
var css=require('organizations.css')
var Header=require('Header')
var List=require('List')
var Row=require('Row')
var onHeaderClick=function(name){
	switch(name){
	case 'next':
		router.go('users/u156')
		break
	}
}
var onListSelect=function(){
}

this.load=function(){
	view=new View
	// should use inherit in CollOrganizations, this is to test extend only
	coll=new (Collection.extend(CollOrganizations))
}

return {
	start:function(opt,params){
		opt.css=css
		opt.childs=html
		view.start(opt)

		var header=this.header=new Header
		header.callback.on('click',onHeaderClick,this)
		header.start({el:view.el.getElementsByTagName('header')[0]},{
			leftText:'',
			rightText:'next',
			title:'Organizations',
			subtitle:'subtitle'
		})

		var list=this.list=new List
		list.callback.on('select',onListSelect,this)
		list.start({el:view.el.getElementsByTagName('content')[0]},{
			collection:coll,
			Row:Row
		})
	},
	stop:function(){
		this.list.stop()
		this.header.stop()
		this.header=this.list=undefined

		view.stop()
	}
}
