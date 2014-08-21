var
PageSlider = require('pageslider'),
specMgr = require('specMgr'),
Router = require('Router'),
Page = require('Page'),
Model = require('Model'),
Module = require('Module'),
tpl = '<div class="snap-drawers"></div><div id="content" class="snap-content"></div>',
start = function(){
    if (!pico.detectEvent('touchstart')){
        document.addEventListener('mousedown', function(e){
            var touches = []

            touches[0] = {}
            touches[0].pageX = e.pageX
            touches[0].pageY = e.pageY
            touches[0].target = e.target

            var evt = new Event('touchstart', {
                bubbles: true,
                cancelable: true,
                details:{
                    target: e.target,
                    srcElement: e.srcElement,
                    touches: touches,
                    changedTouches: touches,
                    targetTouches: touches,
                    mouseToTouch: true
                }   
            }) 

            e.target.dispatchEvent(evt)
        }, true)
    }
    
    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start()
},
changeRoute = function(path, params){
    var pageConfig = this.pages[path]

    if (!pageConfig) return Router.instance().home()

    if (this.currPage) this.currPage.remove()
    var reinits = pageConfig.reinits
    for(var i=0,keys=Object.keys(reinits),k,m; k=keys[i]; i++){
        m = this.moduleMap[k]
        if (m) m.reinit(reinits[k])
    }
    this.currPage = new Page.Class(pageConfig, params, this)
    this.render()
    this.triggerModules('changeRoute', path, params)
}

exports.Class = Backbone.View.extend(_.extend({
    el: 'body',
    initialize: function(args){
        var 
        self = this,
        p = args.project,
        r = new Router.Class({routes: p.routes})

        r.on('route', changeRoute, this)
        this.on('all', this.frameEvents, this)

        this.pages = p.pages
        this.modules = []
        this.moduleMap = {}

        this.el.innerHTML = tpl
        this.slider = new PageSlider.Class(this.$('#content'))

        specMgr.load(null, [], p.spec, function(err, spec){
            if (err) return console.error(err)
            self.spec = spec
            spec.forEach(function(s){
                if ('module' === s.type) {
                    self.modules.push(self.moduleMap[s.name] = new s.Class({name:s.name, host:self, spec:s.spec}))
                }
            })
            start()
        })
    },

    render: function(){
        this.slider.slidePage(this.currPage.render())
    },

    frameEvents: function(){
        var params = Array.prototype.slice.call(arguments)

        switch(params[0]){
        case 'invalidate': this.drawModule.apply(this, params.slice(1)); break
        default:
            this.triggerAll(params, [params[1]])
            break
        }
    },
    drawModule: function(mod, cont){
        if (!mod) return

        var $el = (cont && 'drawer' === cont) ? this.$('.drawers') : this.$('#content')
        $el.prepend(mod.render())
    }
}, Module.Events))
