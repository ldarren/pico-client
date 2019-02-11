var
	ID=0,TYPE=1,VALUE=2,EXTRA=3,
	ERR1='ref of REF not found',ERR2='record RECORD of ref of REF not found',
	extOpt={mergeArr:1},
	pObj=require('pico/obj'),
	make=require('p/make'),
	create = function(id, type, value, extra){
		return Array.prototype.slice.call(arguments)
	},
	getId = function(spec){
		return spec[ID]
	},
	getType = function(spec){
		return spec[TYPE]
	},
	getValue = function(spec){
		return spec[VALUE]
	},
	getExtra = function(spec,idx){
		return spec[EXTRA+(idx||0)]
	},
	find = function(id, list, all){
		for(var i=0,o; (o=list[i]); i++){
			if (id === o[ID]) return all?o:o[VALUE]
		}
	},
	findAll = function(cond, list, by, all){
		var arr = []
		for(var i=0,o; (o=list[i]); i++){
			if (cond === o[by]) arr.push(all?o:o[VALUE])
		}
		return arr
	},
	spec2Obj=function(spec){
		var obj={}
		for(var i=0,s; (s=spec[i]); i++){
			obj[s[ID]]=s[VALUE]
		}
		return obj
	},
	loadDeps = function(links, idx, cb, klass){
		if (!links || links.length <= idx) return cb(null, klass)
		if (links.charAt) return require(links, cb)
		require(links[idx++], function(err, mod){
			if (err) return cb(err)
			loadDeps(links, idx, cb, pObj.extend(klass || {}, mod, extOpt))
		})
	},
	load = function(ctx, params, spec, idx, deps, cb, userData){
		if (spec.length <= idx) return cb(null, deps, params, userData)

		var s = spec[idx++]
		var t = s[TYPE]
		var f

		switch(t){
		case 'ref': //ID[id] TYPE[ref] VALUE[orgId]
			f = find(s[VALUE], ctx, true)
			if (!f) return cb(ERR1.replace('REF', s[VALUE]), deps, params, userData)
			deps.push(create(s[ID], f[TYPE], f[VALUE]))
			break
		case 'refs': // ID[id] TYPE[refs] VALUE[orgType]
			Array.prototype.push.apply(deps, findAll(s[VALUE], ctx, TYPE, 1))
			break
		case 'type':
			return make.define(s[ID], s[VALUE], s[EXTRA], function(){
				load(ctx, params, spec, idx, deps, cb, userData)
			})
		case 'model':
			f = find(s[VALUE], ctx, true)
			if (!f) return cb(ERR1.replace('REF', s[VALUE]), deps, params, userData)
			var e = s[EXTRA]
			e = 'string' === typeof e ? e : params[e]
			var m = 'string' === typeof e ? f[VALUE].get(e) : f[VALUE].at(e)
			if (!m) return cb(ERR2.replace('REF', s[VALUE]).replace('RECORD',e), deps, params, userData)
			deps.push(create(s[ID], t, m))
			break
		case 'ctrl':
		case 'view': // ID[id/path] TYPE[ctrl/view] VALUE[spec] EXTRA[path/path+mixins]
			f=s[ID]
			return loadDeps(s[EXTRA]||f, 0, function(err, klass){
				if (err) return cb(err, deps, params, userData)
				deps.push(create(f, t, s[VALUE], klass))
				load(ctx, params, spec, idx, deps, cb, userData)
			})
		case 'file': // ID[id] TYPE[file] VALUE[path]
			return require(s[VALUE], function(err, mod){
				if (err) return cb(err, deps, params, userData)
				deps.push(create(s[ID], t, mod, s[VALUE]))
				load(ctx, params, spec, idx, deps, cb, userData)
			})
		case 'param': // ID[id] TYPE[param] VALUE[index]
			deps.push(create(s[ID], t, params[s[VALUE]]))
			break
		case 'time':
		case 'date':
		case 'datetime': // ID[id] TYPE[date/datetime] VALUE[unixtime/time in string]
			deps.push(create(s[ID], t, new Date(s[VALUE])))
			break
		case 'int': // ID[id] TYPE[int] VALUE[number or number in string]
			deps.push(create(s[ID], t, parseInt(s[VALUE])))
			break
		case 'list': // ID[id] TYPE[list] VALUE[array]
		case 'text': // ID[id] TYPE[text] VALUE[string]
			deps.push(create(s[ID], t, s[VALUE]))
			break
			// ID[id] TYPE[models|phttp|sse] VALUE[options] EXTRA[mixin]
		default: // s[ID], t, s[VALUE]
			return loadDeps(s[EXTRA],0,function(err,klass){
				f=s[ID]
				make.run(deps, f, t, params, s[VALUE], klass, function(err, instance){
					deps.push(create(f, t, instance))
					load(ctx, params, spec, idx, deps, cb, userData)
				})
			})
		}
		load(ctx, params, spec, idx, deps, cb, userData)
	},
	// need to get original spec, the one before spec.load, no way to diff ref and models
	unload = function(rawSpec, spec){
		if (!spec || !spec.length) return
		var j,s
		for(var i=0,r; (r=rawSpec[i]); i++){
			switch(r[TYPE]){
			case 'models':
			case 'stream':
				for(j=0; (s=spec[j]); j++){
					if (r[ID] === s[ID]) {
						switch(s[TYPE]){
						case 'models': s[VALUE].reset(); break
						case 'stream': s[VALUE].close(); break
						}
					}
				}
				break
			}
		}
		for(j=0; (s=spec[j]); j++){
			switch(s[TYPE]){
			case 'worker': s[VALUE].close(); break
			}
			delete s[VALUE]
		}
		spec.length = 0
	}

return {
	load:function(host, params, spec, cb, userData){
		if (!spec || !spec.length) return cb(null, spec, params, userData)
		load(host?host.spec||host:[], params, spec, 0, [], cb, userData)
	},
	unload:unload,
	find:find,
	findAllById: function(cond, list, all){
		return findAll(cond, list, ID, all)
	},
	findAllByType:function(cond, list, all){
		return findAll(cond, list, TYPE, all)
	},
	spec2Obj:spec2Obj,
	create:create,
	getId:getId,
	getType:getType,
	getValue:getValue,
	getExtra:getExtra,
	getViewOptions:function(spec){
		var opt=find('options',spec)
		if (!opt || !opt.els) return opt
		var paneId=find('paneId',spec)||0
		opt.el=opt.els[paneId]
		return opt
	}
}
