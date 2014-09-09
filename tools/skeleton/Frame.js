var
specMgr = require('specMgr'),
Router = require('Router'),
Page = require('Page'),
Model = require('Model'),
Module = require('Module'),
changeRoute = function(path, params){
    var pageConfig = this.pages[path]

    if (!pageConfig) return Router.instance().home()

    if (this.currPage) this.currPage.remove()
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
        
        this.el.innerHTML = '<div class=lnBook></div><div></div>'
        document.dispatchEvent(pico.createEvent('lnReset'))

        this.content = this.el.firstChild
        this.$container = $(this.content.nextElementSibling)
        this.pages = p.pages
        this.modules = []

        specMgr.load(null, [], p.spec, function(err, spec){
            if (err) return console.error(err)
            self.spec = spec
            spec.forEach(function(s){
                if ('module' === s.type) {
                    self.modules.push(new s.Class({name:s.name, host:self, spec:s.spec}))
                }
            })
            Backbone.history.start()
        })
    },

    render: function(){
        this.content.dispatchEvent(pico.createEvent('flip', {ref:this.currPage.render(),from:'left'})
    },

    frameEvents: function(){
        var params = Array.prototype.slice.call(arguments)

        switch(params[0]){
        case 'invalidate': this.drawModule.apply(this, params.slice(1)); break
        case 'reinit':
            var reinits = params[1]
            for(var i=0,ms=this.modules,m; m=ms[i]; i++){
                if (m) m.reinit(reinits[m.name])
            }
            break
        case 'slide':
            this.content.dispatchEvent(pico.createEvent('transit', {ref:params[1],from:params[2]})
            break
        default:
            this.triggerAll(params, [params[1]])
            break
        }
    },
    drawModule: function(mod, cont){
        if (!mod) return

        $container.append(mod.render())
    }
}, Module.Events))
