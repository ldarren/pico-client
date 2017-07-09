var
removePage=function(){
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = void 0 
}

return{
    deps:{
    },
    slots:{
        frameAdded: function(){},
        pageAdd: function(from, sender, name, pageSpec, params){
			this.oldPage = this.currPage
			this.oldPage && removePage.call(this)
			var self = this
			this.currPage = this.spawn({
				name:name||'VOID',
				spec:pageSpec,
				Class:{},
			}, params, null, false, function(){
				self.oldPage && self.hide(self.oldPage)
			})
        },
        moduleAdded: function(from, sender){
			if (-1===this.modules.indexOf(from)) return // not child
            document.dispatchEvent(__.createEvent('__reset'))
        }
    }
}
