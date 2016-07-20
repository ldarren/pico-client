var
DEPS=0,STYLE=1,SPEC=2,PAGES=3,FLYERS=4,
ID=0,TYPE=1,VALUE=2,EXTRA=3,
EVT_RESIZE='frameresize',
EVT_RESIZE_LEN=EVT_RESIZE.length,
Floor=Math.floor,Random=Math.random,
Router = require('js/Router'),
Module = require('js/Module'),
network = require('js/network'),
includeAll= function(urls, func, type, cb){
    if (!urls || !urls.length) return cb()
    func(urls.shift(), type, function(){ includeAll(urls, func, type, cb) })
},
resized=function(self, paneCount){
    if (paneCount === self.deps.paneCount) return
    self.deps.paneCount=paneCount
    if (Backbone.History.started && self.currPath) changeRoute.call(self, self.currPath, self.currParams)
	self.signals.paneCount(paneCount).send()
},
parseFlyers=function(list, cb){
	var flyers={}, routes=[]

	for(var i=0,f,k; f=list[i]; i++){
		k=f.shift()
		flyers[k]=f
		routes.push(k)
	}
	cb(flyers,routes)
},
changeRoute = function(path, params){
    var f = this.flyers[path]

    if (!f) {
        console.warn('path not found',path,params)
        return Router.home()
    }

    var
    pages=this.pages,
    pc=this.deps.paneCount || 1,
    i=f.length < pc ? 0 : f.length-pc

    for(var j=0,p; i<pc; i++,j++){
        p=f[i]
        if (p) this.signals.paneUpdate(j, path+'.'+p, pages[p], params).sendNow()
        else this.signals.paneUpdate(j, '', pages[''], params).sendNow()
    }

    this.signals.changeRoute(path, params).sendNow()
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
},
Body=Module.View.extend({
    signals:['online','offline','changeRoute','frameAdded','paneAdded','paneUpdate','paneCount'],
    deps:{
        html:   ['file','<div class=frame><div class=layer></div><div class=layer></div></div>'],
        layers: ['list', ['.frame>div:nth-child(1)','.frame>div:nth-child(2)']],
		paneCount:['int',1]
    },
    initialize: function(options, p, e){
        var self=this

        network.create(e.domains, function(err){
            if (err) return console.error(err)
        
			self.pages= p[PAGES]
			parseFlyers(p[FLYERS],function(flyers,routes){
				self.flyers=flyers;
				(new Router(routes)).on('route', changeRoute, self)
			})

			document.addEventListener('animationstart', function(e){
				console.log(e.animationName)
				if (-1 === e.animationName.indexOf(EVT_RESIZE)) return
				resized(self, parseInt(e.animationName.substr(EVT_RESIZE_LEN)))
			})

            includeAll(p[STYLE], __.dom.link, 'css', function(){
                includeAll(p[DEPS], __.dom.link, 'js', function(){
                    Module.View.prototype.initialize.call(self, null, {name:'Frame'}, 
						p[SPEC].concat([
							['env','map',e]
						]))
                })
            })
        })
    },

    create: function(deps, params){
        var self=this
		this.ancestor.create.call(this, deps, params, true, function(){
			var
			el=self.el,
			layers=deps.layers,
			list=[]

			for(var i=0,l; l=layers[i]; i++){
				list.push(el.querySelector(l))
			}
			self.layers=list

			self.signals.frameAdded().send()
		})
    },

    slots: {
        paneAdd: function(from, sender, paneId){
            this.signals.paneAdded(paneId).send()
        },
        layerShow: function(from, sender, where, first){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.layers[where]||this.layers[0]
            // force reflow for safari bug, which not show new content
            c.style.zIndex=(where||0)*(1000+Floor(100*Random()))
            this.show(sender, c, first)
        },
        layerHide: function(from, sender, where){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.layers[where||1]
            this.hide(sender, c)
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

return {
	start:function(project,env){
        var body=new Body(Module.getViewOptions(project[SPEC]), project, env)
		netstat(body)
        return body
	}
}
