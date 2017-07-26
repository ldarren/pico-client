var removePage=function(){
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = void 0 
}

return {
	slots:{
		pageAdd: function(from, sender, name, spec, params){
			this.oldPage = this.currPage
			this.oldPage && removePage.call(this)
			var self = this
			this.currPage = this.spawn({
				name:name||'VOID',
				spec:spec,
				Class:{},
			}, params, null, false, function(){
				self.oldPage && removePage.call(self)
			})
		}
	}
}
