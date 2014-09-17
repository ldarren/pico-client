var
Model = require('Model'),
find = function(name, list){ for(var i=0,o; o=list[i]; i++){ if (name === o.name) return o } },
findAll = function(type, list){
    var arr = []
    for(var i=0,o; o=list[i]; i++){ if (type === o.type) arr.push(o) }
    return arr
},
load = function(host, params, spec, deps, cb){
    if (!spec.length) return cb(null, deps)

    var
    context = host ? host.spec : [],
    s = spec.shift(),
    t = s.type,
    f

    switch(t){
    case 'ref':
        f = find(s.value, context)
        if (!f) return cb('ref of '+s.value+' not found')
        deps.push({name:s.name, type:f.type, value:f.value})
        break
    case 'refs':
        Array.prototype.push.apply(deps, findAll(s.value, context))
        break
    case 'model':
        f = find(s.value, context)
        if (!f) return cb('model of '+s.value+' not found')
        var m = f.value.get(params[s.param])
        if (!m) return cb('record '+s.param+' of model of '+s.value+' not found')
        deps.push({name:s.name, type:t, value:m})
        break
    case 'models':
        deps.push({name:s.name, type:t, value:new Model.Class(null, s.value)})
        break
    case 'module':
        require('modules/'+s.name, function(err, mod){
            if (err) return cb(err)
            deps.push({name:s.name, type:t, Class:mod.Class, spec:s.value})
            load(host, params, spec, deps, cb)
        })
        return
    case 'param':
        deps.push({name:s.name, type:t, value:params[s.value]})
        break
    case 'datetime':
        deps.push({name:s.name, type:t, value:new Date(s.value)})
        break
    default:
        deps.push(s)
        break
    }
    load(host, params, spec, deps, cb)
},
// need to get original spec, the one before spec.load, no way to diff ref and models
unload = function(spec){
    if (!spec || !spec.length) return
    var
    s = spec.pop(),
    t = s.type,
    m

    switch(t){
    case 'models':
        m = s.value
        //m.reset()
        delete s.value
        break
    }
}

exports.load = function(host, params, spec, cb){
    load(host, params, spec.slice(), [], cb)
}
exports.unload = unload
exports.find = find
exports.findAll = findAll
