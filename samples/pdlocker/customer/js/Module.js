var ID=0,TYPE=1,VALUE=2,EXTRA=3,
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
    if (self._show) self.host.show(self, self._show[0], self._show[1])
},
// dun remove mod here, mod may be removed
hideByIndex= function(self, i, host){
    host = host || self.el

    var oldEl = self._elements[i]

    if (oldEl && host.contains(oldEl)){
        host.removeChild(oldEl)
    }
    return oldEl
}

function Ctrl(options, spec, params, host){
    this.name = options.name
    this.host = host
    this.ancestor = Ctrl.prototype
    this.modules = []
    this._rawSpec = spec
    this._removed = false 

    this.signals = sigslot(this)

    specMgr.load(host, params || [], spec, specLoaded, this)
}

Ctrl.extend = Backbone.View.extend

_.extend(Ctrl.prototype, Backbone.Events, {
    create: function(deps, params){
        var spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            switch(s[TYPE]){
            case 'ctrl':
            case 'view':
                this.spawn(s[VALUE], params)
                break
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
    spawn: function(Mod, params, spec, hidden){
        if (!Mod || !Mod.spec) return

        var
        Class='ctrl'===Mod.type?Ctrl:View,
        m = new (Class.extend(Mod.Class))(Mod, spec && spec.length ? Mod.spec.concat(spec) : Mod.spec, params, this, !hidden)

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
    initialize: function(options, spec, params, host, show){
        this._elements = []
        this._show=show?[host.el,false]:null

        Ctrl.call(this, options, spec, params, host)

        this.ancestor = View.prototype

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
    spawn: Ctrl.prototype.spawn,
    dump: function(mod){
        var i=Ctrl.prototype.dump.call(this,mod)
        if (i<0) return i
        hideByIndex(this, i)
        this._elements.splice(i, 1)
        return i
    },
    dumpAll:Ctrl.prototype.dumpAll,
    show: function(mod, container, first){
        if (!mod) return
        container = container || this.el
        mod._show=[container, first]

        if (!mod.spec) return mod.el

        var
        i = this.modules.indexOf(mod),
        oldEl = this._elements[i],
        el = mod.render()
        if (el){
            if (container.contains(oldEl)){
                container.replaceChild(el, oldEl)
            }else{
                if (first) container.insertBefore(el, container.firstChild)
                else container.appendChild(el)
            }
            this._elements[i] = el
        }
        return el
    },
    hide: function(mod, host){
        mod._show=null
        return hideByIndex(this,this.modules.indexOf(mod),host)
    },
    render: function(){
        return this.el
    },
    slots:{
        // seldom use, useful only after BB's setElement
        invalidate: this.show
    }
})

return {
    Ctrl:Ctrl,
    View:View
}
