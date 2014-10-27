var
Model = require('Model'),
find = function(name, list){ for(var i=0,o; o=list[i]; i++){ if (name === o.i) return o } },
findAll = function(type, list){
    var arr = []
    for(var i=0,o; o=list[i]; i++){ if (type === o.t) arr.push(o) }
    return arr
},
load = function(host, params, spec, deps, cb){
    if (!spec.length) return cb(null, deps)

    var
    context = host ? host.spec : [],
    s = spec.shift(),
    t = s.t,
    f

    switch(t){
    case 'ref':
        f = find(s.v, context)
        if (!f) return cb('ref of '+s.v+' not found')
        deps.push({name:s.i, type:f.t, value:f.v})
        break
    case 'refs':
        Array.prototype.push.apply(deps, findAll(s.v, context))
        break
    case 'model':
        f = find(s.v, context)
        if (!f) return cb('model of '+s.v+' not found')
        var m = f.v.get(params[s.param])
        if (!m) return cb('record '+s.param+' of model of '+s.v+' not found')
        deps.push({name:s.i, type:t, value:m})
        break
    case 'models':
        deps.push({name:s.i, type:t, value:new Model.Class(null, s.v)})
        break
    case 'module':
        require(s.i, function(err, mod){
            if (err) return cb(err)
            deps.push({name:s.i, type:t, Class:mod.Class, spec:s.v, style:s.s})
            load(host, params, spec, deps, cb)
        })
        return
    case 'param':
        deps.push({name:s.i, type:t, value:params[s.v]})
        break
    case 'time':
    case 'date':
    case 'datetime':
        deps.push({name:s.i, type:t, value:new Date(s.v)})
        break
    default:
        deps.push({name:s.i, type:t, value:s.v})
        break
    }
    load(host, params, spec, deps, cb)
},
// need to get original spec, the one before spec.load, no way to diff ref and models
unload = function(rawSpec, spec){
    if (!spec || !spec.length) return
    for(var i=0,r; r=rawSpec[i]; i++){
        switch(r.t){
        case 'models':
        case 'date':
            for(var j=0,s; s=spec[i]; i++){
                if (r.i === s.name) {
                    if ('models' === s.type) s.value.reset()
                    delete s.value
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
