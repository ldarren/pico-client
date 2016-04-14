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
        layers: ['list', ['.pane>div:nth-child(1)','.pane>div:nth-child(2)']],
        paneId: 'int'
    },
    create: function(deps, params){
        var
        el=this.el,
        layers=deps.layers,
        list=[]

        el.innerHTML = deps.html

        for(var i=0,l; l=layers[i]; i++){
            list.push(el.querySelector(l))
        }
        this.layers=list

        var
		self=this,
		mods=specMgr.findAllByType('ctrl',this.spec).concat(specMgr.findAllByType('view',this.spec))

        this.spec=this.spec.concat(this.host.spec)
        this.spawnAsync(mods, params, null, true, function(){self.signals.paneAdd(self.deps.paneId).send()})
    },

    slots: {
        invalidate: function(from, sender, where, first){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.layers[where||1]
            this.show(sender, c, first)
        },
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
                }, params, null, true)

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
