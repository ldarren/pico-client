var
DEPS=0,STYLE=1,SPEC=2,PAGES=3,FLYERS=4,
ID=0,TYPE=1,VALUE=2,EXTRA=3,
EVT_RESIZE='frameresize',
EVT_RESIZE_LEN=EVT_RESIZE.length,
Floor=Math.floor,Random=Math.random,
Router = require('js/Router'),
Module = require('js/Module'),
network = require('js/network'),
attachJS = function(deps, cb){
    if (!deps || !deps.length) return cb()
    __.attachFile(deps.shift(), 'js', function(){ attachJS(deps, cb) })
},
attachCSS = function(styles, cb){
    if (!styles || !styles.length) return cb()
    __.attachFile(styles.shift(), 'css', function(){ attachCSS(styles, cb) })
},
resized=function(self, paneCount){
    if (paneCount === self.paneCountSpec[VALUE]) return
    self.paneCountSpec[VALUE]=paneCount
    if (Backbone.History.started && self.currPath) changeRoute.call(self, self.currPath, self.currParams)
	self.signals.paneCount(paneCount).send()
},
changeRoute = function(path, params){
    var f = this.flyers[path]

    if (!f) {
        console.warn('path not found',path,params)
        return Router.home()
    }

    var
    pages=this.pages,
    pc=this.paneCountSpec[VALUE] || 1,
    i=f.length < pc ? 0 : f.length-pc

    for(var j=0,p; i<pc; i++,j++){
        p=f[i]
        if (p) this.signals.paneUpdate(j, path+'.'+p, pages[p], params).send()
        else this.signals.paneUpdate(j, '', pages[''], params).send()
    }

    this.signals.changeRoute(path, params).send()
    this.currPath=path
    this.currParams=params
},
netstat=function(self){
	window.addEventListener('online',function(){
		self.signals.online().send()
	})
	window.addEventListener('offline',function(){
		self.signals.offline().send()
	})
}

return Module.View.extend({
    el: 'body',
    signals:['online','offline','changeRoute','frameAdded','paneAdded','paneUpdate','paneCount'],
    deps:{
        html:   ['file','<div class=frame><div class=layer></div><div class=layer></div></div>'],
        layers: ['list', ['.frame>div:nth-child(1)','.frame>div:nth-child(2)']]
    },
    initialize: function(p, e){
        var self = this
        
        this.pages= p[PAGES]
        this.flyers= p[FLYERS]
		this.paneCountSpec=['paneCount','int',1]

        document.addEventListener('animationstart', function(e){
            console.log(e.animationName)
            if (-1 === e.animationName.indexOf(EVT_RESIZE)) return
            resized(self, parseInt(e.animationName.substr(EVT_RESIZE_LEN)))
        })

        network.create(e.domains, function(err){
            if (err) return console.error(err)

            var r = new Router(Object.keys(self.flyers))
            r.on('route', changeRoute, self)

            attachCSS(p[STYLE], function(){
                attachJS(p[DEPS], function(){
                    Module.View.prototype.initialize.call(self, null, {name:'Frame'}, 
						p[SPEC].concat([
							['env','map',e],
							self.paneCountSpec
						]))
                })
            })
        })
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
        this.setElement(list[0])
        this.layers=list
        
        var 
        self=this,
        panes=[],
        mods=[]

        for(var i=0,spec=this.spec,s; s=spec[i]; i++){
            switch(s[TYPE]){
            case 'ctrl': mods.push(s); break
            case 'view':
                if ('pane'===s[ID]) panes.push(s)
                else mods.push(s)
                break
            }
        }

        this.spawnAsync(panes, params, null, false, function(){
            self.spawnAsync(mods, params, null, true, function(){
                self.signals.frameAdded().send()
            })
        })
    },

    slots: {
        paneAdd: function(from, sender, paneId){
//            this.el.appendChild(sender.el)
            this.signals.paneAdded(paneId).send()
        },
        show: function(from, sender, where, first){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.layers[where]||this.layers[0]
            // force reflow for safari bug, which not show new content
            c.style.zIndex=(where||0)*(1000+Floor(100*Random()))
            this.show(sender, c, first)
        },
        hide: function(from, sender, where){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.layers[where||1]
            this.hide(sender, c)
        },
        frameResized:resized,
        modelReady: function(from, sender){
            if (!Backbone.History.started){
                Backbone.history.start()
				netstat(this)
                return true //  continue propagation
            }
            return false
        }
    }
})
