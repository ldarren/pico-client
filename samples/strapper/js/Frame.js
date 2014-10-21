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
removeOldPage = function(){
    if (this.oldPage) this.oldPage.remove()
    this.oldPage = undefined
    this.triggerAll('mainTransited', this.main.offsetLeft, this.main.offsetTop)
},
transited = function(){
    this.triggerAll('mainTransited', this.main.offsetLeft, this.main.offsetTop)
},
changeRoute = function(path, params){
    var pageConfig = this.pages[path]

    if (!pageConfig) return Router.instance.home()

    if (this.oldPage) removeOldPage.call(this)
    if (this.currPage) this.oldPage = this.currPage
    this.currPage = new Module.Class(pageConfig, params, this)
    this.render()
    this.triggerModules('changeRoute', path, params)
}

exports.Class = Module.Class.extend({
    el: 'body',
    initialize: function(p){
        var
        self = this,
        r = new Router.Class({routes: p.routes})

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

    create: function(spec){
        for(var i=0,s; s=spec[i]; i++){
            if ('module' === s.type) {
                // not using Module.spawn, because render immediately is not desired
                this.modules.push(new s.Class(s, [], this))
            }
        }
    },

    render: function(){
        var m = this.main
        m.style.cssText = ''
        m.dispatchEvent(pico.createEvent('flip', {page:this.currPage.render(),from:Router.instance.isBack() ? 'right' : 'left'}))
    },

    moduleEvents: function(){
        var params = Array.prototype.slice.call(arguments)

        switch(params[0]){
        case 'invalidate': this.drawModule.apply(this, params.slice(1)); break
        case 'slide': this.main.dispatchEvent(pico.createEvent('transit', params[2])); break
        case 'modelReady':
            if (!Backbone.History.started){
                document.dispatchEvent(pico.createEvent('lnReset'))
                Backbone.history.start()
            }
            /* through */
        default:
            this.triggerAll(params, params.splice(1, 1))
            break
        }
    },

    drawModule: function(mod, where){
        if (!mod || -1 === this.modules.indexOf(mod)) return
        switch(where){
        case 'main': this.main.insertBefore(mod.render(), this.main.firstChild); break
        case 'modal': this.modal.appendChild(mod.render()); break
        default: this.secondary.appendChild(mod.render()); break
        }

        document.dispatchEvent(pico.createEvent('lnReset'))
    }
})
