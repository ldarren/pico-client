var
Router = require('Router'),
Module = require('Module'),
attachDeps = function(deps, cb){
    if (!deps || !deps.length) return cb()
    pico.attachFile(deps.shift(), 'js', function(){ attachDeps(deps, cb) })
},
attachStyles = function(styles, cb){
    if (!styles || !styles.length) return cb()
    var s = styles.shift()
    if ('string' === typeof s) {
        pico.attachFile(s, 'css', function(){ attachStyles(styles, cb) })
    }else{
        restyle(s, ['webkit'])
        attachStyles(styles, cb)
    }
},
transited = function(){
    this.signals.mainTransited(this.main.offsetLeft, this.main.offsetTop).send()
},
removeOldPage = function(){
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = undefined
    this.signals.mainTransited(this.main.offsetLeft, this.main.offsetTop).send()
},
changeRoute = function(path, params){
    var pageConfig = this.pages[path]

    if (!pageConfig) return Router.instance.home()

    if (this.oldPage) removeOldPage.call(this)
    this.oldPage = this.currPage
    this.currPage = this.spawn({name:path, type:'module', spec:pageConfig, Class:Module.Class}, params, null, true)
    this.render()
    this.signals.changeRoute(path, params).send()
}

exports.Class = Module.Class.extend({
    el: 'body',
    signals:['modelReady', 'changeRoute', 'mainTransited'],
    initialize: function(p){
        var
        self = this,
        r = new Router.Class(Object.keys(p.pages))

        r.on('route', changeRoute, this)
        
        this.pages = p.pages

        attachStyles(p.styles, function(){
            attachDeps(p.deps, function(){
                self.el.innerHTML = '<div class="lnBook lnSlider"></div><div></div><div></div>'

                var
                m = self.el.firstChild,
                s = m.nextElementSibling

                self.modal = s.nextElementSibling
                self.main = m
                self.secondary = s

                m.addEventListener('flipped', removeOldPage.bind(self), false)
                m.addEventListener('transited', transited.bind(self), false)

                Module.Class.prototype.initialize.call(self, p)
            })
        })
    },

    create: function(requires, params){
        var spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            if ('module' === s.type) {
                this.spawn(s, params, null, true)
            }
        }
    },

    render: function(){
        var m = this.main
        m.style.cssText = ''
        m.dispatchEvent(pico.createEvent('flip', {page:this.currPage.render(),from:Router.instance.isBack() ? 'right' : 'left'}))
    },

    slots: {
        invalidate: function(sender, container){
            if (!mod || -1 === this.modules.indexOf(mod)) return
            switch(where){
            case 'main': this.show(mod, this.main, true); break
            case 'modal': this.show(mod, this.modal); break
            default: this.show(mod, this.secondary); break
            }

            document.dispatchEvent(pico.createEvent('lnReset'))
        },
        slide: function(sender){
            this.main.dispatchEvent(pico.createEvent('transit', params[2]))
        },
        modelReady: function(sender){
            if (!Backbone.History.started){
                document.dispatchEvent(pico.createEvent('lnReset'))
                Backbone.history.start()
            }
            this.signals.modelReady().send([sender])
        }
    }
})
