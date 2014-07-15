var
PageSlider = require('pageslider'),
Router = require('Router'),
Page = require('Page'),
Model = require('Model'),
tpl = require('@html/frame.html'),
changeRoute = function(path, params){
    var pageConfig = this.pages[path]

    if (!pageConfig) return

    if (!pageConfig.data){
        var
        data = {},
        k,v

        for(var init=pageConfig.init,i=0,l=init.length; i<l; i++){
            k = init[i]
            v = k.value
            data[k.name] = ('@' === v[0]) ? (k.param ? this.models[v.substr(1)].get(params[k.param]) : this.models[v.substr(1)]) : v
        }
        pageConfig.data = data
    }

    if (this.currPage) this.currPage.remove()
    this.currPage = new Page.Class(pageConfig)

    this.render()
}

me.Class = Backbone.View.extend({
    el: 'body',
    slider: null,
    pages: null,
    models: null,
    currPage: null,
    initialize: function(args){
        this.el.innerHTML = tpl.text
        this.slider = new PageSlider.Class(this.$el)

        var 
        p = args.project,
        ms = p.models,
        models = this.models = {},
        r = Router.instance = new Router.Class({routes: p.routes})

        this.pages = p.pages
        r.on('route', changeRoute, this)

        for (var m in ms){ 
            models[m] = new Model.Class(null, ms[m])
        }
        Backbone.history.start()
    },

    render: function(){
        this.slider.slidePage(this.currPage.render())
    }
})
