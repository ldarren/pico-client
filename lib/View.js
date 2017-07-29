var
ID=0,TYPE=1,VALUE=2,EXTRA=3,
Ctrl=inherit('p/Ctrl'),
specMgr = require('p/specMgr')

function View(prop, spec){
	Ctrl.apply(this, arguments)
	this.super=View.prototype
	this.start(specMgr.getViewOptions(spec)||{})
}

View.prototype={
	initialize: function(){
		this.style(specMgr.findAllById('css',this.spec))
		Ctrl.prototype.initialize.apply(this,arguments)
	},
    create: function(deps, params, hidden, cb){
        var el=this._el

		if (deps.html) el.innerHTML=deps.html
		else for(var i=0,spec=this.spec,s; s=spec[i]; i++) if('html'===s[ID]){ el.innerHTML=s[VALUE]; break }

		Ctrl.prototype.create.apply(this,arguments)
    },
	remove: function(){
		this._show = void 0
		Ctrl.prototype.remove.call(this)
	},
    // view can spawn ctrl and view
    spawn: function(Mod, params, spec, hidden, chains){
        if (!Mod || !Mod.spec) return

        if ('ctrl'===Mod.type) return Ctrl.prototype.spawn.call(this, Mod, params, spec, hidden, chains)

        try{
			var
			s=spec && spec.length ? Mod.spec.concat(spec) : Mod.spec,
			m=new (View.extend(Mod.Class))(
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
    show: function(mod, host, first){
        if (!mod) return
        host = host || this.el
        mod._show=[host, first]

        if (!mod.spec) return mod.el

        var
        el = mod.render(),
		_el = mod._el

		if (!_el) return el

		_el.dataset.viewName=mod.name

		if (host !== _el){
			if (first) host.insertBefore(_el, host.firstChild)
			else host.appendChild(_el)
		}

		mod.rendered()

        return el
    },
    hide: function(mod, host){
		if (!mod) return
        mod._show=void 0
		var el = mod.el
		el && host.contains(el) && host.removeChild(el)

		return el
    },
    render: function(){
        return this.el
    },
	rendered: function(){
    }
}

return View
