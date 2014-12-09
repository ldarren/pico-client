var
ID=0,TYPE=1,VALUE=2,EXTRA=3,
Model = require('Model'),
create = function(id, type, value){ return [id, type, value] },
find = function(name, list){ for(var i=0,o; o=list[i]; i++){ if (name === o[ID]) return o } },
findAll = function(type, list){
    var arr = []
    for(var i=0,o; o=list[i]; i++){ if (type === o[TYPE]) arr.push(o) }
    return arr
},
load = function(host, params, spec, deps, cb){
    if (!spec.length) return cb(null, deps)

    var
    context = host ? host.spec : [],
    s = spec.shift(),
    t = s[TYPE],
    f

    switch(t){
    case 'ref':
        f = find(s[VALUE], context)
        if (!f) return cb('ref of '+s[VALUE]+' not found')
        deps.push(create(s[ID], f[TYPE], f[VALUE]))
        break
    case 'refs':
        Array.prototype.push.apply(deps, findAll(s[VALUE], context))
        break
    case 'model':
        f = find(s[VALUE], context)
        if (!f) return cb('model of '+s[VALUE]+' not found')
        var m = f[VALUE].get(params[s.param])
        if (!m) return cb('record '+s.param+' of model of '+s[VALUE]+' not found')
        deps.push(create(s[ID], t, m))
        break
    case 'models':
        deps.push(create(s[ID], t, new Model.Class(null, s[VALUE])))
        break
    case 'module':
        require(s[ID], function(err, mod){
            if (err) return cb(err)
            deps.push(create(s[ID], t, {name:s[ID], spec:s[VALUE], style:s[EXTRA], Class:mod.Class, Mixin:mod.Mixin}))
            load(host, params, spec, deps, cb)
        })
        return
    case 'param':
        deps.push(create(s[ID], t, params[s[VALUE]]))
        break
    case 'time':
    case 'date':
    case 'datetime':
        deps.push(create(s[ID], t, new Date(s[VALUE])))
        break
    default:
        deps.push(create(s[ID], t, s[VALUE]))
        break
    }
    load(host, params, spec, deps, cb)
},
// need to get original spec, the one before spec.load, no way to diff ref and models
unload = function(rawSpec, spec){
    if (!spec || !spec.length) return
    for(var i=0,r; r=rawSpec[i]; i++){
        switch(r[TYPE]){
        case 'models':
        case 'date':
            for(var j=0,s; s=spec[i]; i++){
                if (r[ID] === s[ID]) {
                    if ('models' === s[TYPE]) s[VALUE].reset()
                    delete s[VALUE]
                }
            }
            break
        }
    }
    spec.length = 0
}

exports.load = function(host, params, spec, cb){
    load(host, params, spec.slice(), [], cb)
}
exports.unload = unload
exports.find = find
exports.findAll = findAll
exports.create = create
