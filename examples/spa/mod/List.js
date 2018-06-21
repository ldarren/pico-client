var populate=function(self,coll,Row){
	var ids=Object.keys(coll.models)
	for(var i=0,k; k=ids[i]; i++){
		// TODO: how to pass model directly wo params
		self.spawn(Row,{id: k},[['model','model','coll','id']])
	}
}

return {
	deps:{
		coll:'models',
		Row:'view'
	},
	create:function(deps){
		deps.coll.callback.on('update',function(){console.log('Coll.update',arguments)},this)
		deps.coll.models[1].callback.on('field.update',function(){console.log('Model.update',arguments)},this)

		this.setElement(this.el.getElementsByTagName('ul')[0])
		populate(this,deps.coll,deps.Row)
	},
	remove:function(){
		var coll=this.deps.coll
		coll.models[1].callback.off(null,null,this)
		coll.callback.off(null,null,this)
		this.super.remove.call(this)
	}
}
