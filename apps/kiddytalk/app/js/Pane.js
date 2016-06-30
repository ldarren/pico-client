var
ID=0,TYPE=1,VALUE=2,EXTRA=3,
Router = require('js/Router'),
specMgr= require('js/specMgr'),
removeOldPage=function(from, sender, paneId){
    if (paneId !== this.deps.paneId) return
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = undefined
    var el=this.el
}

return {
    className:'pane',
    signals:['paneAdd','pageAdd','moduleAdded'],
    deps:{
        html:   ['file','<div class=layer></div><div class=layer></div>'],
        paneId: 'int'
    },
    create: function(deps, params){
        this.el.innerHTML = deps.html

        var
        self=this,
        mods=this.spec.slice()

        this.spec=this.spec.concat(this.host.spec)
        this.spawnAsync(mods, params, null, true, function(){self.signals.paneAdd(self.deps.paneId).send()})
    },

    slots: {
        paneUpdate: function(from, sender, paneId, name, pageConfig, params){
            if (this.deps.paneId !== paneId) return
            if (name === this.name && this.params && params && _.isEqual(this.params,params)) return
            this.name=name
            this.params=params
            if (this.oldPage) removeOldPage.call(this, null, null, paneId)
            this.oldPage = this.currPage
            this.currPage = this.spawn({
                name:(name || '')+'@'+paneId,
                spec:pageConfig,
                Class:{},
                }, params, null, false)

            this.el.style.cssText = ''
            this.signals.pageAdd(paneId, this.currPage.render(), Router.isBack()).send()
        },
        pageAdded:removeOldPage,
		moduleAdded:function(from, sender){
			if (-1===this.modules.indexOf(from)) return // not child
			this.signals.moduleAdded(this.deps.paneId).send(this.host) // repropagate with paneId
		}
    }
}
