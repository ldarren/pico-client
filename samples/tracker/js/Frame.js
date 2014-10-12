var
Router = require('Router'),
Page = require('Page'),
Module = require('Module'),
changeRoute = function(path, params){
    var pageConfig = this.pages[path]

    if (!pageConfig) return Router.instance.home()

    if (this.oldPage) this.removeOldPage()
    if (this.currPage) this.oldPage = this.currPage
    this.currPage = new Page.Class(pageConfig, params, this)
    this.render()
    this.triggerModules('changeRoute', path, params)
}

exports.Class = Module.Class.extend({
    el: 'body',
    initialize: function(p){
        var r = new Router.Class({routes: p.routes})

        r.on('route', changeRoute, this)
        
        this.el.innerHTML = '<div class="lnBook lnSlider"></div><div></div><div></div>'

        this.main = this.el.firstChild
        this.secondary = this.main.nextElementSibling
        this.modal = this.secondary.nextElementSibling
        this.pages = p.pages

        this.main.addEventListener('flipped', this.removeOldPage.bind(this), false)
        this.main.addEventListener('transited', this.transited.bind(this), false)

        Module.Class.prototype.initialize.call(this, p)
    },

    create: function(spec){
        for(var i=0,s; s=spec[i]; i++){
            if ('module' === s.type) {
                // not using Module.proxy, because render immediately is not desired
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
    },

    removeOldPage: function(){
        if (this.oldPage) this.oldPage.remove()
        this.oldPage = undefined
        this.triggerAll('mainTransited', this.main.offsetLeft, this.main.offsetTop)
    },

    transited: function(){
        this.triggerAll('mainTransited', this.main.offsetLeft, this.main.offsetTop)
    }
})
