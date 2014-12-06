var
specMgr = require('specMgr'),
Router = require('Router'),
id=0,
send = function(a){
    setTimeout(function(evt, sender, args){
        var
        trigger = Backbone.Events.trigger,
        params = [evt, sender].concat(args),
        modules = sender.modules

        modules = sender.host ? modules.concat([sender.host]) : modules

        switch(typeof a){
        case 'object':
            if (a.length){
                for(var i=0,m; m=modules[i]; i++){
                    if (-1 === a.indexOf(m)) trigger.apply(m, params)
                }
            }else{
                trigger.apply(a, params)
            }
            break
        default:
            for(var i=0,m; m=modules[i]; i++){
                trigger.apply(m, params)
            }
            break
        }
    }, 0, this.evt, this.sender, this.args)
},
recv = function(evt, sender){
    var func = this.slots[evt]
    if (!func) return send.call({evt:evt, sender:this, args:Array.prototype.slice.call(arguments, 2)}, [sender])
    func.apply(this, Array.prototype.slice.call(arguments, 1))
}

exports.Class = Backbone.View.extend({
    initialize: function(options, params, host){
        this._id = id++
        this.name = options.i
        this.host = host
        this.modules = []
        this._elements = []
        this._rawSpec = options.spec
        this._removed = false 

        var
        ss = this.signals || [],
        signals = {}

        ss.forEach(function(evt){
            var sender = this
            signals[evt] = function(){
                return {
                    args: Array.prototype.slice.call(arguments),
                    sender: sender,
                    evt: evt,
                    send: send
                }
            }
        }, this)

        this.signals = signals

        this.on('all', recv, this)

        if (options.style) this.style = restyle(options.style, ['webkit'])

        var self = this
        specMgr.load(host, params || [], options.spec, function(err, spec){
            if (self._removed) return self.remove()
            if (err){
                console.warn(err)
                return Router.instance.home()
            }

            self.spec = spec

            var
            d = {},
            deps = self.deps || {}

            for(var k in deps) d[k] = {} // init deps
            for(var i=0,s,k; s=spec[i]; i++){
                k = s.i
                if (!deps[k]) continue
                d[k] = s
            }

            self.deps = d
            self.create(d, params)
        })
    },
    create: function(deps, params){
        var spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            if ('module' === s.t) {
                this.spawn(s, params, this)
            }
        }
    },
    remove: function(){
        this._removed = true 
        this.off()
        Backbone.View.prototype.remove.apply(this, arguments)
        this.dumpAll()
        if (this.style) this.style.remove()
        specMgr.unload(this._rawSpec, this.spec)
    },
    spawn: function(Mod, params, spec, hidden){
        if ('module' !== Mod.t) return
        Mod.spec = spec && spec.length ? Mod.spec.concat(spec) : Mod.spec
        var
        m = new Mod.Class(Mod, params, this),
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
        var i = this.modules.indexOf(mod)
        this.modules.splice(i, 1)
        this._elements.splice(i, 1)
    },
    dumpAll:function(){
        for(var i=0,ms=this.modules,m; m=ms[i]; i++){
            m.remove()
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
