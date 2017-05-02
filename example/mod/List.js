var View=inherit('po/View')
var html=require('List.html')
var css=require('List.css')
var List=function(coll,Row){
	List.__super__.constructor.call(this)
	this.coll=coll
	this.Row=Row
	this.rows=[]
}
var render=function(container,models,Row){
	var output=[]
	var ids=Object.keys(models)
	for(var i=0,k,m,r,el; k=ids[i]; i++){
		m=models[k]
		r=new Row
		r.start({},m)
		container.appendChild(r.render())
		output.push(r)
	}
	return output
}

List.prototype={
	start:function(opt,params){
		opt.css=css
		opt.childs=html
		View.prototype.start.call(this,opt)
		this.coll=params.collection||this.coll
		this.Row=params.Row||this.Row

		this.coll.callback.on('update',function(){console.log('Coll.update',arguments)},this)
		this.coll.models[1].callback.on('field.update',function(){console.log('Model.update',arguments)},this)

		this.rows=render(this.el.getElementsByTagName('ul')[0],this.coll.models,this.Row)
	},
	stop:function(){
		this.coll.models[1].callback.off(null,null,this)
		this.coll.callback.off(null,null,this)
		for(var i=0,rs=this.rows,r; r=rs[i]; i++){
			r.stop()
		}
		this.rows.length=0
		View.prototype.stop.call(this)
	}
}

return List
