var
ID=0,TYPE=1,VALUE=2,EXTRA=3,
Router = require('js/Router'),
removeOldPage=function(from, sender, paneId){
    if (paneId !== this.deps.paneId) return
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = undefined
    var el=this.el
}

return {
    className:'pane',
    signals:['paneAdd','pageAdd'],
    deps:{
        html:   ['file','<div class=layer></div><div class=layer></div>'],
        layers: ['map', {main:'.pane>div:nth-child(1)',secondary:'.pane>div:nth-child(2)'}],
        paneId: 'int'
    },
    create: function(deps, params){
        var el=this.el

        el.innerHTML = deps.html

        var
        layers=deps.layers,
        map={}

        for(var k in layers){
            map[k] = el.querySelector(layers[k])
        }
        this.layers=map

        var list=[]
        for(var i=0,spec=this.spec,s; s=spec[i]; i++){
            switch(s[TYPE]){
            case 'ctrl':
            case 'view': list.push(s[VALUE]); break
            }
        }
        this.spec=this.spec.concat(this.host.spec)
        var self=this
        this.spawnAsync(list, params, null, true, function(){self.signals.paneAdd(self.deps.paneId).send()})
    },

    slots: {
        invalidate: function(from, sender, where, first){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.layers[where||'secondary']
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
        pageAdded:removeOldPage
    }
}
