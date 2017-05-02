var
DEPS=0,STYLE=1,MIDDLEWARES=2,SPEC=3,PAGES=4,FLYERS=5,
ID=0,TYPE=1,VALUE=2,EXTRA=3,
EVT_RESIZE='frameresize',
EVT_RESIZE_LEN=EVT_RESIZE.length,
Floor=Math.floor,Random=Math.random,
View=inherit('p/View'),
router = require('po/router'),
specMgr= require('p/specMgr'),
network = require('p/network'),
sigslot= require('p/sigslot'),
includeAll= function(urls, func, type, cb){
    if (!urls || !urls.length) return cb()
    func(urls.shift(), type, function(){ includeAll(urls, func, type, cb) })
},
resized=function(self, paneCount){
    if (paneCount === self.paneCount) return
    self.paneCount=paneCount
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
        return router.go()
    }

    var
    pages=this.pages,
    pc=this.paneCount || 1,
    i=f.length <= pc ? 0 : f.length-pc

    for(var j=0,p; j<pc; i++,j++){
        p=f[i]||''
        this.signals.paneUpdate(j, pc, path, p, pages[p], params).sendNow()
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
}

function Frame(project,env){
	this.initialize(specMgr.find('options',project[SPEC]), project, env)
	netstat(this)
}

Frame.prototype={
    signals:['online','offline','changeRoute','frameAdded','paneAdded','paneUpdate','paneCount'],
    deps:{
        html:   ['file','<div class=frame><div class=layer></div><div class=layer></div></div>'],
        layers: ['list', ['.frame>div:nth-child(1)','.frame>div:nth-child(2)']]
    },
    initialize: function(options, p, e){
        var self=this
		this.paneCount=1

        network.create(e.domains, function(err){
            if (err) return __.dialogs.alert('Code['+err.code+'] msg['+err.error+'], restart?','Network Error','ok',function(){
				location.reload(false)
			})
        
			self.pages= p[PAGES]
			parseFlyers(p[FLYERS],function(flyers,routes){
				self.flyers=flyers;
				router.start(routes).on('change', changeRoute, self)
			})

			document.addEventListener('animationstart', function(e){
				console.log(e.animationName)
				if (-1 === e.animationName.indexOf(EVT_RESIZE)) return
				resized(self, parseInt(e.animationName.substr(EVT_RESIZE_LEN)))
			})

            includeAll(p[STYLE], __.dom.link, 'css', function(){
                includeAll(p[DEPS], __.dom.link, 'js', function(){
					specMgr.load(self.host, self.params, p[MIDDLEWARES], function(err, config){
						if (err) return console.error('middleware err:',err)
						sigslot.addMiddleware(config)
						View.call(self, null, {name:'Frame'}, 
							p[SPEC].concat([
								['env','map',e]
							]))
					})
                })
            })
        })
    },

    create: function(deps, params){
        var self=this
		View.prototype.create.call(this, deps, params, true, function(){
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
}

return Frame
