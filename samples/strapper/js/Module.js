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
    if (!func) return send.apply({evt:evt, sender:this, args:Array.prototype.slice.call(arguments, 2)}, [sender])
    func.apply(this, Array.prototype.slice.call(arguments, 1))
}

exports.Class = Backbone.View.extend({
    initialize: function(options, params, host){
        this._id = id++
        this.name = options.name
        this.host = host
        this.modules = []
        this._elements = []
        this._rawSpec = options.spec
        this._removed = false 

        var
        ss = this.signals,
        signals = {},
        x

        for(var i=0,s; s=ss[i]; i++){
            x = function(){
                arguments.callee.args = Array.prototype.slice.call(arguments) 
                return arguments.callee
            }
            x.sender = this
            x.evt = s
            x.send = send
            signals[s] = x
        }
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
            r = {},
            requires = this.requires,
            item

            for(var i=0,s; s=spec[i]; i++){
                item = requires[s.name] 
                if (item) r[s.name] = item
            }

            self.create(r, params)
        })
    },
    create: function(requires, params){
        var spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            if ('module' === s.type) {
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
    spawn: function(mod, params, spec, hidden){
        if ('module' !== mod.type) return
        mod.spec = spec && spec.length ? mod.spec.concat(spec) : mod.spec
        var
        m = new mod.Class(mod, params, this),
        i = this.modules.push(m)-1,
        el = m.render()
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
            host.removeChild(oldEL)
        }
        return oldEl
    },
    render: function(){
        return this.el
    },
    slots:{
        // seldom use, useful only after BB setElement
        invalidate: this.show
    }
})