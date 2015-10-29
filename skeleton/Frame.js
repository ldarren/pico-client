var
DEPS=0,STYLES=1,SPEC=2,PAGES=3,
PSPEC=0,PSTYLE=1,
ID=0,TYPE=1,VALUE=2,EXTRA=3,
Router = require('js/Router'),
Module = require('js/Module'),
network = require('js/network'),
attachDeps = function(deps, cb){
    if (!deps || !deps.length) return cb()
    __.attachFile(deps.shift(), 'js', function(){ attachDeps(deps, cb) })
},
attachStyles = function(styles, cb){
    if (!styles || !styles.length) return cb()
    var s = styles.shift()
    if ('string' === typeof s) {
        __.attachFile(s, 'css', function(){ attachStyles(styles, cb) })
    }else{
        restyle(s, ['webkit'])
        attachStyles(styles, cb)
    }
},
removeOldPage=function(){
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = undefined
    var el=this.el
},
changeRoute = function(path, params){
    var p = this.pages[path]

    if (!p) return Router.instance.home()

    if (this.oldPage) removeOldPage.call(this)
    this.oldPage = this.currPage
    this.currPage = this.spawn({
        name:path,
        spec:p[PSPEC],
        style:p[PSTYLE],
        Class:{},
        }, params, null, true)
    this.render()
    this.signals.changeRoute(path, params).send()
}

return Module.View.extend({
    el: 'body',
    signals:['changeRoute','pageAdd','moduleAdd'],
    deps:{
        html:'file',
        els:['map', {main:'#container_1',secondary:'#container_2'}]
    },
    initialize: function(p, e){
        var self = this
        
        this.pages = p[PAGES]

        network.create(e.channels, function(err){
            if (err) return console.error(err)

            var r = new Router.Class(Object.keys(self.pages))
            r.on('route', changeRoute, self)

            attachStyles(p[STYLES], function(){
                attachDeps(p[DEPS], function(){
                    Module.View.prototype.initialize.call(self, null, {name:'Frame'}, p[SPEC].concat([['env','map',e]]))
                })
            })
        })
    },

    create: function(deps, params){
        var el=this.el

        el.innerHTML = deps.html || '<div id=container_1 class="__book __slider"></div><div id=container_2></div>'

        var
        els=deps.els,
        map={}

        for(var k in els){
            map[k] = el.querySelector(els[k])
        }
        this.setElement(map['main'])
        this.els=map

        for(var i=0,spec=this.spec,s; s=spec[i]; i++){
            switch(s[TYPE]){
            case 'ctrl':
            case 'view': this.spawn(s[VALUE], params, null, true); break
                break
            }
        }
    },

    render: function(){
        this.el.style.cssText = ''
        this.signals.pageAdd(this.currPage.render(), Router.instance.isBack()).send()
    },

    slots: {
        invalidate: function(from, sender, where, first){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.els[where||'secondary']
            this.show(sender, c, first)

            this.signals.moduleAdd(sender).send()
        },
        pageAdded:removeOldPage,
        modelReady: function(from, sender){
            if (!Backbone.History.started){
                this.signals.moduleAdd().send()
                Backbone.history.start()
                return true //  continue propagate
            }
            return false
        }
    }
})
