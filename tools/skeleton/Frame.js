var
PageSlider = require('pageslider'),
specMgr = require('specMgr'),
Router = require('Router'),
Page = require('Page'),
Model = require('Model'),
Module = require('Module'),
tpl = require('@html/frame.html'),
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

        self.pages = p.pages
        self.modules = []

        self.el.innerHTML = tpl.text
        var $content = self.$('#content')
        self.slider = new PageSlider.Class($content)

        specMgr.load(null, [], p.spec, function(err, spec){
            if (err) return console.error(err)
            self.spec = spec
            self.initHeader()
            spec.forEach(function(s){
                if ('module' === s.type) {
                    self.modules.push(new s.Class({name:s.name, host:self, spec:s.spec}))
                }
            })
        })
    },

    render: function(){
        this.drawHeader(this.currPage.header)
        this.slider.slidePage(this.currPage.render())
    },

    frameEvents: function(){
        console.log(arguments)
    }
}, Module.Events))
