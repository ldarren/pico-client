var
ID=0,TYPE=1,VALUE=2,EXTRA=3,
Router = require('js/Router'),
removeOldPage=function(from, sender, paneId){
    if (paneId !== this.deps.paneId) return
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = undefined
    var el=this.el
},
changeRoute = function(name, pageConfig, params){
    var paneId=this.deps.paneId
    if (this.oldPage) removeOldPage.call(this, null, null, paneId)
    this.oldPage = this.currPage
    this.currPage = this.spawn({
        name:(name || '')+'@'+paneId,
        spec:pageConfig, // TODO: support multiple pages
        Class:{},
        }, params, null, true)

    this.el.style.cssText = ''
    this.signals.pageAdd(paneId, this.currPage.render(), Router.isBack()).send()
}

return {
    className:'pane',
    signals:['paneAdd','pageAdd'],
    deps:{
        html:   ['file','<div id=layer1></div><div id=layer2></div>'],
        layers: ['map', {main:'div#layer1',secondary:'div#layer2'}],
        design: ['list', [568]],
        paneId: 'int'
    },
    create: function(deps, params){
        this.el.innerHTML = deps.html

        var list=[]
        for(var i=0,spec=this.spec,s; s=spec[i]; i++){
            switch(s[TYPE]){
            case 'ctrl': this.spawn(s[VALUE], params); break
            case 'view': list.push(s[VALUE]); break
            }
        }
        this.spec=this.spec.concat(this.host.spec)
        var self=this
        this.spawnAsync(list, params, true, function(){self.signals.paneAdd(self.deps.paneId).send()})
    },

    slots: {
        invalidate: function(from, sender, where, first){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.els[where||'secondary']
            this.show(sender, c, first)
        },
        paneUpdate: function(from, sender, paneId, name, pageConfig, params){
            if (this.deps.paneId !== paneId) return
            changeRoute.call(this, name, pageConfig, params)
        },
        pageAdded:removeOldPage
    }
}
