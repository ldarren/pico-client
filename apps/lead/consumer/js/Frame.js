var
DEPS=0,STYLES=1,SPEC=2,PAGES=3,FLYERS=4,
ID=0,TYPE=1,VALUE=2,EXTRA=3,
EVT_RESIZE='frameresize',
EVT_RESIZE_LEN=EVT_RESIZE.length,
Router = require('js/Router'),
Module = require('js/Module'),
network = require('js/network'),
attachDeps = function(deps, cb){
    if (!deps || !deps.length) return cb()
    __.attachFile(deps.shift(), 'js', function(){ attachDeps(deps, cb) })
},
attachStyles = function(styles, cb){
    if (!styles || !styles.length) return cb()
    __.attachFile(styles.shift(), 'css', function(){ attachStyles(styles, cb) })
},
resized=function(self, paneCount){
    if (paneCount === self.paneCount) return
    self.paneCount=paneCount
    if (Backbone.History.started && self.currPath) changeRoute.call(self, self.currPath, self.currParams)
},
changeRoute = function(path, params){
    var f = this.flyers[path]

    if (!f) {
        console.warn('path not found',path,params)
        return Router.home()
    }

    var
    pages=this.pages,
    pc=this.paneCount || 1,
    i=f.length < pc ? 0 : f.length-pc

    for(var j=0,p; p=f[i]; i++,j++){
        this.signals.paneUpdate(j, path+'.'+p, pages[p], params).send()
    }

    this.signals.changeRoute(path, params).send()
    this.currPath=path
    this.currParams=params
}

return Module.View.extend({
    el: 'body',
    signals:['changeRoute','frameAdded','paneAdded','paneUpdate'],
    deps:{
        html:   ['file','<div class=frame><div class=layer></div><div class=layer></div></div>'],
        layers: ['map', {main:'.frame>div:nth-child(1)',secondary:'.frame>div:nth-child(2)'}]
    },
    initialize: function(p, e){
        window.location.hash='#'
        var self = this
        
        this.pages= p[PAGES]
        this.flyers= p[FLYERS]

        document.addEventListener('animationstart', function(e){
            console.log(e.animationName)
            if (-1 === e.animationName.indexOf(EVT_RESIZE)) return
            resized(self, parseInt(e.animationName.substr(EVT_RESIZE_LEN)))
        })

        network.create(e.domains, function(err){
            if (err) return console.error(err)

            var r = new Router(Object.keys(self.flyers))
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

        el.innerHTML = deps.html

        var
        layers=deps.layers,
        map={}

        for(var k in layers){
            map[k] = el.querySelector(layers[k])
        }
        this.setElement(map['main'])
        this.layers=map

        var 
        panes=[],
        list=[]
        for(var i=0,spec=this.spec,s; s=spec[i]; i++){
            switch(s[TYPE]){
            case 'ctrl': list.push(s[VALUE]); break
            case 'view':
                if ('pane'===s[ID]) panes.push(s[VALUE])
                else list.push(s[VALUE])
                break
            }
        }

        var self=this
        this.spawnAsync(panes, params, false, function(){
            self.spawnAsync(list, params, true, function(){self.signals.frameAdded().send()})
        })
    },

    slots: {
        paneAdd: function(from, sender, paneId){
//            this.el.appendChild(sender.el)
            this.signals.paneAdded(paneId).send()
        },
        invalidate: function(from, sender, where, first){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.layers[where||'secondary']
            this.show(sender, c, first)
        },
        frameResized:resized,
        modelReady: function(from, sender){
            if (!Backbone.History.started){
                Backbone.history.start()
                return true //  continue propagation
            }
            return false
        }
    }
})
