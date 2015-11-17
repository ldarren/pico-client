var
picoObj=require('pico/obj'),
Model= require('js/Model'),
Stream= require('js/Stream'),
ID=0,TYPE=1,VALUE=2,EXTRA=3,
ERR1='ref of REF not found',ERR2='record RECORD of ref of REF not found',
create = function(id, type, value){ return [id, type, value] },
getId = function(spec){return spec[ID]},
getType = function(spec){return spec[TYPE]},
getValue = function(spec){return spec[VALUE]},
getExtra = function(spec,idx){return spec[EXTRA+(idx||0)]},
find = function(name, list){ for(var i=0,o; o=list[i]; i++){ if (name === o[ID]) return o } },
findAll = function(type, list){
    var arr = []
    for(var i=0,o; o=list[i]; i++){ if (type === o[TYPE]) arr.push(o) }
    return arr
},
loadDeps = function(links, idx, klass, cb){
    if (!links || links.length <= idx) return cb(null, klass)
    if ('string' === typeof links) return require(links, cb)
    require(links[idx++], function(err, mod){
        if (err) return cb(err)
        loadDeps(links, idx, picoObj.extend(klass, mod), cb)
    })
},
load = function(host, params, spec, idx, deps, cb, userData){
    if (spec.length <= idx) return cb(null, deps, userData)

    var
    context = host ? host.spec : [],
    s = spec[idx++],
    t = s[TYPE],
    f

    switch(t){
    case 'ref': //ID[id] TYPE[ref] VALUE[orgId]
        f = find(s[VALUE], context)
		if (!f) return cb(ERR1.replace('REF', s[VALUE]), deps, userData)
        deps.push(create(s[ID], f[TYPE], f[VALUE]))
        break
    case 'refs': // ID[id] TYPE[refs] VALUE[orgType]
        Array.prototype.push.apply(deps, findAll(s[VALUE], context))
        break
    case 'model': // ID[id] TYPE[model/field] VALUE[models] EXTRA[paramId] EXTRA1[field name]
		f = find(s[VALUE], context)
		if (!f) return cb(ERR1.replace('REF', s[VALUE]), deps, userData)
		var m = f[VALUE].get(params[s[EXTRA]])
		if (!m || !m.get) return cb(ERR2.replace('REF', s[VALUE]).replace('RECORD',params[s[EXTRA]]), deps, userData)
		'field' === t ? deps.push(create(s[ID], t, m.get(s[EXTRA+1]))) : deps.push(create(s[ID], t, m)) 
		break
    case 'models': // ID[id] TYPE[models] VALUE[options] EXTRA[default value]
        deps.push(create(s[ID], t, new Model(s[EXTRA], s[ID], s[VALUE])))
        break
	case 'fields': // ID[id] TYPE[fields] VALUE[models] EXTRA[filter] EXTRA1[field names]
		f = find(s[VALUE], context)
		if (!f) return cb(ERR1.replace('REF', s[VALUE]), deps, userData)
		var m = s[EXTRA] ? new Model(f[VALUE].where(s[EXTRA])) : f[VALUE]
		if (!m || !m.pluck) return cb(ERR2.replace('REF', s[VALUE]).replace('RECORD',s[EXTRA]), deps, userData)
		deps.push(create(s[ID], t, m.pluck(s[EXTRA+1])))
		break
    case 'ctrl':
    case 'view': // ID[id/path] TYPE[ctrl/view] VALUE[spec] EXTRA[path/path+mixins]
        loadDeps(s[EXTRA]||s[ID], 0, {}, function(err, klass){
            if (err) return cb(err, deps, userData)
            f=s[ID]
            deps.push(create(f, t, {name:f, type:t, spec:s[VALUE], Class:klass}))
            load(host, params, spec, idx, deps, cb, userData)
        })
        return
    case 'file': // ID[id] TYPE[file] VALUE[path]
        require(s[VALUE], function(err, mod){
            if (err) return cb(err, deps, userData)
            deps.push(create(s[ID], t, mod))
            load(host, params, spec, idx, deps, cb, userData)
        })
        return
    case 'stream': // ID[id] TYPE[stream] VALUE[config]
        deps.push(create(s[ID], t, new Stream(s[VALUE])))
        break
    case 'param': // ID[id] TYPE[param] VALUE[index]
        deps.push(create(s[ID], t, params[s[VALUE]]))
        break
    case 'time':
    case 'date':
    case 'datetime': // ID[id] TYPE[date/datetime] VALUE[unixtime/time in string]
        deps.push(create(s[ID], t, new Date(s[VALUE])))
        break
    default:
        deps.push(create(s[ID], t, s[VALUE]))
        break
    }
    load(host, params, spec, idx, deps, cb, userData)
},
// need to get original spec, the one before spec.load, no way to diff ref and models
unload = function(rawSpec, spec){
    if (!spec || !spec.length) return
    var j,s
    for(var i=0,r; r=rawSpec[i]; i++){
        switch(r[TYPE]){
        case 'models':
        case 'stream':
            for(j=0; s=spec[j]; j++){
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
    for(j=0; s=spec[j]; j++){
        delete s[VALUE]
    }
    spec.length = 0
}

return {
    load:function(host, params, spec, cb, userData){ load(host, params, spec, 0, [], cb, userData) },
    unload:unload,
    find:find,
    findAll:findAll,
    create:create,
    getId:getId,
    getType:getType,
    getValue:getValue,
    getExtra:getExtra
}
