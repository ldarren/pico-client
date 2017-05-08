var
Ctrl=inherit('p/Ctrl'),
specMgr = require('p/specMgr'),
// dun remove mod here, mod may be removed
hideByIndex= function(self, i, host){
    host = host || self.el

    var oldEl = self._elements[i]

    if (oldEl && host.contains(oldEl)){
        host.removeChild(oldEl)
    }
    return oldEl
}

function View(options, prop, spec, params, host, show, chains){
	Ctrl.call(this, prop, spec, params, host, show, chains)
	this.super=View.prototype
	this._elements = []
	this.start.call(this,options)
}

View.prototype={
    remove: function(){
		this.stop.call(this)
        Ctrl.prototype.remove.call(this, arguments)
    },
    // view can spawn ctrl and view
    spawn: function(Mod, params, spec, hidden, chains){
        if (!Mod || !Mod.spec) return

        if ('ctrl'===Mod.type) return Ctrl.prototype.spawn.call(this, Mod, params, spec, hidden, chains)

        try{
			var
			s=spec && spec.length ? Mod.spec.concat(spec) : Mod.spec,
			m=new (View.extend(Mod.Class))(
				specMgr.getViewOptions(s),
				Mod,
				s,
				params,
				this,
				!hidden,
				chains instanceof Function ? [chains,spec]:chains)
		}catch(exp){
			return console.error(Mod.name,'failed to spawn:',exp)
		}
        this.modules.push(m)
        return m
    },
    dump: function(mod){
        var i=Ctrl.prototype.dump.call(this,mod)
        if (i<0) return i
        hideByIndex(this, i)
        this._elements.splice(i, 1)
        return i
    },
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
            el.dataset.viewName=mod.name
			mod.rendered()
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
	rendered: function(){
	},
    slots:{
        // seldom use, useful only after BB's setElement
        invalidate: this.show
    }
}

return View
