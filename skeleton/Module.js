var
ID=0,TYPE=1,VALUE=2,EXTRA=3,
specMgr = require('specMgr'),
Router = require('Router'),
index=0,
trigger = Backbone.Events.trigger,
evts=[],
schedule= (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     ||
            function(callback){ return window.setTimeout(callback, 50) }
})(),   
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
        if (!deps[k]) continue
        d[k] = s[VALUE]
    }

    self.deps = d
    self.create(d)
},
sigslot = function(){
    var
    ss = this.signals || [],
    signals = {}

    ss.forEach(function(evt){
        var sender = this
        signals[evt] = function(){
            return {
                args: Array.prototype.slice.call(arguments),
                sender: sender,
                from: sender,
                evt: evt,
                send: send
            }
        }
    }, this)

    return signals
},
send = function(a){
    evts.push([this.evt, this.from, this.sender, a, this.args])
},
recv = function(evt, from, sender){
    var
    func = this.slots[evt],
    forward = true 

    if (func) forward = func.apply(this, Array.prototype.slice.call(arguments, 1))
    if (forward) send.call({evt:evt, sender:sender, from:this, args:Array.prototype.slice.call(arguments, 3)}, [from])
},
tick = function(){
    if (evts.length){
        var
        e=evts.shift(),
        from=e[1],
        a=e[3],
        params = [e[0], from, e[2]].concat(e[4]),
        modules = from.modules

        modules = from.host ? modules.concat([from.host]) : modules

        switch(typeof a){
        case 'object':
            if (a.length){
                for(var i=0,m; m=modules[i]; i++) if (-1 === a.indexOf(m)) trigger.apply(m, params);
            }else{
                trigger.apply(a, params)
            }
            break
        default:
            for(var i=0,m; m=modules[i]; i++) trigger.apply(m, params);
            break
        }
    }
    schedule(tick)
}

schedule(tick)

exports.Class = Backbone.View.extend({
    initialize: function(options, spec, params, host){
        this._id = index++
        this.name = options.name
        this.host = host
        this.ancestor = exports.Class.prototype
        this.modules = []
        this._elements = []
        this._rawSpec = spec
        this._removed = false 

        this.signals = sigslot.call(this)

        this.on('all', recv, this)

        if (options.style) this.style = restyle(options.style, ['webkit'])

        specMgr.load(host, params || [], spec, specLoaded, this)
    },
    create: function(deps, params){
        var spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            if ('module' === s[TYPE]) {
                this.spawn(s[VALUE], params)
            }
        }
    },
    remove: function(){
        this._removed = true 
        this.off()
        if (this.__proto__.el){
            // dun remove things not urs
            this.$el.empty()
            this.stopListening()
            this.undelegateEvents()
        }else{
            Backbone.View.prototype.remove.apply(this, arguments)
        }
        this.dumpAll()
        if (this.style) this.style.remove()
        specMgr.unload(this._rawSpec, this.spec)
    },
    spawn: function(Mod, params, spec, hidden){
        if (!Mod || !Mod.spec) return

        var
        m = new (exports.Class.extend(Mod.Class))(Mod, spec && spec.length ? Mod.spec.concat(spec) : Mod.spec, params, this),
        i = this.modules.push(m)-1

        if (hidden) return m

        var el = m.render()
        if (el) {
            this.el.appendChild(el)
            this._elements[i] = el
        }
        return m
    },
    dump: function(mod){
        if (!mod) return
        mod.remove()
        this.hide(mod)
        var i = this.modules.indexOf(mod)
        this.modules.splice(i, 1)
        this._elements.splice(i, 1)
    },
    dumpAll:function(){
        for(var i=0,ms=this.modules,m; m=ms[i]; i++){
            m.remove()
            this.hide(m)
        }
        ms.length = 0
        this._elements.length = 0
    },
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
        host = host || this.el

        var
        i = this.modules.indexOf(mod),
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
