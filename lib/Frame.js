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
    if (router.started() && self.currPaths) changeRoute.call(self, 'change', self.currPaths, self.currParams)
	self.signals.paneCount(paneCount).send()
},
parseFlyers=function(list, cb){
	var flyers={}

	for(var i=0,f,k; f=list[i]; i++){
		k=f.shift()
		flyers[k]=f
	}
	cb(flyers)
},
changeRoute = function(evt, paths, params){
    if (!paths) {
        console.warn('invalid changeRoute',paths,params)
        return router.go()
    }

    var
    pages=this.pages,
    pc=this.paneCount || 1,
    i=paths.length <= pc ? 0 : paths.length-pc

    for(var j=0,p; j<pc; i++,j++){
        p=paths[i]||''
        this.signals.paneUpdate(j, p, pages[p], params).sendNow()
    }

    this.currPaths=paths
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
	this.paneCount=1

	var self=this
	network.create(env.domains, function(err){
		if (err) return __.dialogs.alert('Code['+err.code+'] msg['+err.error+'], restart?','Network Error','ok',function(){
			location.reload(false)
		})
	
		self.pages= project[PAGES]
		parseFlyers(project[FLYERS],function(flyers){
			router.routes(flyers).on('change', changeRoute, self)
		})

		document.addEventListener('animationstart', function(e){
			console.log(e.animationName)
			if (-1 === e.animationName.indexOf(EVT_RESIZE)) return
			resized(self, parseInt(e.animationName.substr(EVT_RESIZE_LEN)))
		})

		includeAll(project[STYLE], __.dom.link, 'css', function(){
			includeAll(project[DEPS], __.dom.link, 'js', function(){
				specMgr.load(self.host, self.params, project[MIDDLEWARES], function(err, config){
					if (err) return console.error('middleware err:',err)
					sigslot.addMiddleware(config)
					View.call(self, {name:'Frame'}, 
						project[SPEC].concat([
							['env','map',env]
						]))
				})
			})
		})
	})

	netstat(this)
}

Frame.prototype={
    signals:['online','offline','frameAdded','paneAdded','paneUpdate','paneCount'],
    deps:{
        html:   ['file','']
    },

    create: function(deps, params){
        var self=this
		View.prototype.create.call(this, deps, params, true, function(){
			self.signals.frameAdded().send()
		})
    },

    slots: {
        paneAdd: function(from, sender, paneId){
            this.signals.paneAdded(paneId).send()
        },
        frameResized:resized,
        modelReady: function(from, sender){
            if (!router.started()){
                router.start()
                return true //  continue propagation
            }
            return false
        }
    }
}

return Frame
