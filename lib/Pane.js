var
removeOldPage=function(from, sender, paneId){
    if (paneId !== this.deps.paneId) return
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = void 0 
}

return {
    signals:['paneAdd','pageAdd','moduleAdded'],
    deps:{
        html:   ['file',''],
        paneId: 'int'
    },
    create: function(deps, params){
        var self=this
		this.super.create.call(this, deps, params, false, function(){
			self.signals.paneAdd(deps.paneId).send()
		})
		this.paneIdSpec=[['paneId','int',deps.paneId]]
    },

    slots: {
        paneUpdate: function(from, sender, paneId, name, pageSpec, params){
            if (this.deps.paneId !== paneId) return

			if (name === this.pageName && JSON.stringify(this.pageParams)===JSON.stringify(params)) return
            this.pageName=name
            this.pageParams=params

            if (this.oldPage) removeOldPage.call(this, from, sender, paneId)
            this.oldPage = this.currPage
            this.currPage = this.spawn({
                name:(name||'VOID')+'_'+paneId,
                spec:pageSpec,
                Class:{},
                }, params, this.paneIdSpec, false)

            this.el.style.cssText = ''
            this.signals.pageAdd(paneId, this.currPage.render()).send()
        },
        pageAdded:removeOldPage,
		moduleAdded:function(from, sender){
			if (-1===this.modules.indexOf(from)) return // not child
			this.signals.moduleAdded(this.deps.paneId).send(this.host) // repropagate with paneId
		}
    }
}
