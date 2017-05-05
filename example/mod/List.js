var render=function(self,coll,Row){
	var ids=Object.keys(coll.models)
	for(var i=0,k; k=ids[i]; i++){
		// TODO: how to pass model directly wo params
		self.spawn(Row,[k],[['model','model','coll',0]])
	}
}

return {
	deps:{
		html:'file',
		coll:'models',
		Row:'view'
	},
	create:function(deps){
		this.el.innerHTML=deps.html
		deps.coll.callback.on('update',function(){console.log('Coll.update',arguments)},this)
		deps.coll.models[1].callback.on('field.update',function(){console.log('Model.update',arguments)},this)

		// TODO: setElement(this.el.getElementsByTagName('ul')[0])
		render(this,deps.coll,deps.Row)
	},
	remove:function(){
		this.coll.models[1].callback.off(null,null,this)
		this.coll.callback.off(null,null,this)
		this.__super__.remove.call(this)
	}
}
