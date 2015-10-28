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
loadTemplate = function(path, cb){
    if (!path) return cb(null, '<div id=container_1 class="__book __slider"></div><div id=container_2></div>')
    require(path, cb)
},
transited = function(){
    var el=this.el
    this.signals.mainTransited(el.offsetLeft, el.offsetTop).send()
},
removeOldPage = function(){
    if (this.oldPage) this.dump(this.oldPage)
    this.oldPage = undefined
    var el=this.el
    this.signals.mainTransited(el.offsetLeft, el.offsetTop).send()
},
changeRoute = function(path, params){
    var p = this.pages[path]

    if (!p) return Router.instance.home()

    if (this.oldPage) removeOldPage.call(this)
    this.oldPage = this.currPage
    this.currPage = this.spawn({
        name:path,
        spec:p[PSPEC],
        style:p[PSTYLE],
        Class:{},
        }, params, null, true)
    this.render()
    this.signals.changeRoute(path, params).send()
}

return Module.View.extend({
    el: 'body',
    signals:['changeRoute', 'mainTransited'],
    deps:{
        html:'file',
        els:['map', {main:'#container_1',secondary:'#container_2'}]
    },
    initialize: function(p, e){
        var self = this
        
        this.pages = p[PAGES]

        network.create(e.channels, function(err){
            if (err) return console.error(err)

            var r = new Router.Class(Object.keys(self.pages))
            r.on('route', changeRoute, self)

            attachStyles(p[STYLES], function(){
                attachDeps(p[DEPS], function(){
                    Module.View.prototype.initialize.call(self, null, {name:'Frame'}, p[SPEC].concat([['env','map',e]]))
                })
            })
        })
    },

    create: function(deps, params){
        var el=this.el

        el.innerHTML = deps.html

        var
        els=deps.els,
        map={}

        for(var k in els){
            map[k] = el.querySelector(els[k])
        }
        this.setElement(map['main'])
        this.els=map

        this.el.addEventListener('flipped', removeOldPage.bind(self), false)
        this.el.addEventListener('transited', transited.bind(self), false)

        for(var i=0,spec=this.spec,s; s=spec[i]; i++){
            switch(s[TYPE]){
            case 'ctrl':
            case 'view': this.spawn(s[VALUE], params, null, true); break
                break
            }
        }
    },

    render: function(){
        var el = this.el
        el.style.cssText = ''
        el.dispatchEvent(__.createEvent('flip', {page:this.currPage.render(),from:Router.instance.isBack() ? 'right' : 'left'}))
    },

    slots: {
        invalidate: function(from, sender, where, first){
            if (!sender || -1 === this.modules.indexOf(sender)) return

            var c=this.els[where||'main']
            this.show(sender, c, first)

            document.dispatchEvent(__.createEvent('__reset'))
        },
        slide: function(from, sender, options){
            this.el.dispatchEvent(__.createEvent('transit', options))
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
