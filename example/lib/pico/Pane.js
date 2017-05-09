var
router = require('po/router'),
removeOldPage=function(from, sender, paneId){
    if (paneId !== this.deps.paneId) return
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = undefined
}

return {
    signals:['paneAdd','pageAdd','moduleAdded'],
    deps:{
        html:   ['file','<div id=header></div><div id=page></div><div id=footer></div>'],
        paneId: 'int'
    },
    create: function(deps, params){
        var self=this
		this.super.create.call(this, deps, params, true, function(){
			self.signals.paneAdd(deps.paneId).send()
		})
		this.paneIdSpec=[['paneId','int',deps.paneId]]
    },

    slots: {
        paneUpdate: function(from, sender, paneId, paneCount, name, pageConfig, params){
            if (this.deps.paneId !== paneId) return
			if (paneId+1===paneCount){
				if (name === this.name && JSON.stringify(this.params)===JSON.stringify(params)) return
			}else{
				if (name === this.name) return
			}
            this.name=name
            this.params=params
            if (this.oldPage) removeOldPage.call(this, from, sender, paneId)
            this.oldPage = this.currPage
            this.currPage = this.spawn({
                name:name+'@'+paneId,
                spec:pageConfig,
                Class:{},
                }, params, this.paneIdSpec, true)

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
