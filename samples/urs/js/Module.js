var
ID=0,TYPE=1,VALUE=2,EXTRA=3,
specMgr = require('js/specMgr'),
Router = require('js/Router'),
sigslot= require('js/sigslot'),
specLoaded = function(err, spec, self){
    if (self._removed) return self.remove()
    if (err){
        console.warn(err)
        return Router.instance.home()
    }

    self.spec = spec

    var
    d = {},
    deps = self.deps || {}

    for(var i=0,s,k; s=spec[i]; i++){
        k = s[ID]
        if (deps[k]) d[k] = s[VALUE]
    }

    self.deps = d
    self.create(d)
}

function Ctrl(options, spec, params, host){
    this.name = options.name
    this.host = host
    this.ancestor = Ctrl.prototype
    this.modules = []
    this._rawSpec = spec
    this._removed = false 

    this.signals = sigslot.attach(this)

    specMgr.load(host, params || [], spec, specLoaded, this)
}

Ctrl.extend = Backbone.View.extend

_.extend(Ctrl.prototype, Backbone.Events, {
    create: function(deps, params){
        var spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            if ('module' === s[TYPE]) {
                this.spawn(s[VALUE], null, params, this)
            }
        }
    },
    remove: function(){
        this._removed = true 
        this.off()
        this.stopListening()
        this.dumpAll()
        specMgr.unload(this._rawSpec, this.spec)
    },
    spawn: function(Mod, params, spec){
        if (!Mod || !Mod.spec) return

        var
        Class='ctrl'===Mod.type?Ctrl:View,
        m = new (Class.extend(Mod.Class))(Mod, spec && spec.length ? Mod.spec.concat(spec) : Mod.spec, params, this)

        this.modules.push(m)

        return m
    },
    dump: function(mod){
        if (!mod) return -1
        var i = this.modules.indexOf(mod)
        mod.remove()
        this.modules.splice(i, 1)
        return i
    },
    dumpAll:function(){
        var ms=this.modules
        while(ms.length){
            this.dump(ms[0])
        }
    },
    slots:{}
})

var View = Backbone.View.extend({
    initialize: function(options, spec, params, host){
        Ctrl.call(this, options, spec, params, host)

        this.ancestor = View.prototype
        this._elements = []

        if (options.style) this.style = restyle(options.style, ['webkit'])
    },
    create: Ctrl.prototype.create,
    remove: function(){
        if (this.__proto__.el){
            // dun remove things not urs
            this.$el.empty()
            this.stopListening()
            this.undelegateEvents()
        }else{
            Backbone.View.prototype.remove.apply(this, arguments)
        }
        if (this.style) this.style.remove()
        Ctrl.prototype.remove.call(this)
    },
    spawn: function(Mod, params, spec, hidden){
        var m = Ctrl.prototype.spawn.call(this, Mod, params, spec)

        if (!m) return
        if (hidden || !m.render) return m

        var
        el = m.render(),
        i=this.modules.indexOf(m)

        if (el) {
            this.el.appendChild(el)
            this._elements[i] = el
        }
        return m
    },
    dump: function(mod){
        var i=Ctrl.prototype.dump(mod)
        if (i<0) return i
        this.hideByIndex(i)
        this._elements.splice(i, 1)
        return i
    },
    dumpAll:Ctrl.prototype.dumpAll,
    show: function(mod, host, first){
        host = host || this.el

        var
        i = this.modules.indexOf(mod),
        oldEl = this._elements[i],
        el = mod.render()
        if (el){
            if (host.contains(oldEl)){
                host.replaceChild(el, oldEl)
            }else{
                if (first) host.insertBefore(el, host.firstChild)
                else host.appendChild(el)
            }
            this._elements[i] = el
        }
        return el
    },
    hide: function(mod, host){
        return this.hideByIndex(this.modules.indexOf(mod),host)
    },
    hideByIndex: function(i, host){
        host = host || this.el

        var
        oldEl = this._elements[i]
        if (oldEl && host.contains(oldEl)){
            host.removeChild(oldEl)
        }
        return oldEl
    },
    render: function(){
        return this.el
    },
    slots:{
        // seldom use, useful only after BB's setElement
        invalidate: this.show
    }
})

module.exports={
    Ctrl:Ctrl,
    View:View
}
