var
DEPS=0,STYLES=1,SPEC=2,PAGES=3,
PSPEC=0,PSTYLE=1,
ID=0,TYPE=1,VALUE=2,EXTRA=3,
Router = require('js/Router'),
Module = require('js/Module'),
network = require('js/network'),
attachDeps = function(deps, cb){
    if (!deps || !deps.length) return cb()
    __.attachFile(deps.shift(), 'js', function(){ attachDeps(deps, cb) })
},
attachStyles = function(styles, cb){
    if (!styles || !styles.length) return cb()
    var s = styles.shift()
    if ('string' === typeof s) {
        __.attachFile(s, 'css', function(){ attachStyles(styles, cb) })
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
    var p = this.pages[path]

    if (!p) return Router.instance.home()

    if (this.oldPage) removeOldPage.call(this)
    this.oldPage = this.currPage
    this.currPage = this.spawn({name:path, spec:p[PSPEC], style:p[PSTYLE], Class:{}, className:this.pageClass}, params, null, true)
    this.render()
    this.signals.changeRoute(path, params).send()
}

return Module.View.extend({
    el: 'body',
    signals:['changeRoute', 'mainTransited'],
    initialize: function(p, e){
        var self = this
        
        this.pages = p[PAGES]

        network.create(e.channels, function(err){
            if (err) return console.error(err)

            var r = new Router.Class(Object.keys(self.pages))
            r.on('route', changeRoute, self)

            attachStyles(p[STYLES], function(){
                self.el.innerHTML = '<div class="__book __slider"></div><div></div><div></div>'
                attachDeps(p[DEPS], function(){

                    var
                    m = self.el.firstChild,
                    s = m.nextElementSibling

                    self.modal = s.nextElementSibling
                    self.main = m
                    self.secondary = s

                    m.addEventListener('flipped', removeOldPage.bind(self), false)
                    m.addEventListener('transited', transited.bind(self), false)

                    Module.View.prototype.initialize.call(self, {name:'Frame'}, p[SPEC].concat([['env','map',e]]))
                })
            })
        })
    },

    create: function(deps, params){
        var spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            switch(s[TYPE]){
            case 'ctrl':
            case 'view': this.spawn(s[VALUE], params, null, true); break
                break
            case 'class': this.pageClass=s[VALUE]; break
            }
        }
    },

    render: function(){
        var m = this.main
        m.style.cssText = ''
        m.dispatchEvent(__.createEvent('flip', {page:this.currPage.render(),from:Router.instance.isBack() ? 'right' : 'left'}))
    },

    slots: {
        invalidate: function(from, sender, where){
            if (!sender || -1 === this.modules.indexOf(sender)) return
            switch(where){
            case 'main': this.show(sender, this.main, true); break
            case 'modal': this.show(sender, this.modal); break
            default: this.show(sender, this.secondary); break
            }

            document.dispatchEvent(__.createEvent('__reset'))
        },
        slide: function(from, sender, options){
            this.main.dispatchEvent(__.createEvent('transit', options))
        },
        modelReady: function(from, sender){
            if (!Backbone.History.started){
                document.dispatchEvent(__.createEvent('__reset'))
                Backbone.history.start()
                return true //  continue propagate
            }
            return false
        }
    }
})
