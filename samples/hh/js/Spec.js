var
Model = require('Model'),
find = function(name, list){ for(var i=0,l=list.length,o; i<l,o=list[i]; i++){ if (name === o.name) return o } },
load = function(context, params, spec, deps, cb){
    if (!spec.length) return cb(null, deps)

    var
    s = spec.pop(),
    t = s.type,
    f

    switch(t){
    case 'ref':
        f = find(s.value, context)
        deps.push({name:s.name, type:f.type, value:f.value})
        break
    case 'model':
        f = find(s.value, context)
        deps.push({name:s.name, type:t, value:f.value.get(params[s.param])})
        break
    case 'models':
        deps.push({name:s.name, type:t, value:new Model.Class(s.value)})
        break
    case 'module':
        require('modules/'+s.value, function(err, mod){
            if (err) return cb(err)
            deps.push({name:s.name, type:t, value: mod})
            load(context, params, spec, deps, cb)
        })
        break
    case 'param':
        deps.push({name:s.name, type:t, value:params[s.value]})
        break
    default:
        deps.push(s)
        break
    }
    if ('module' !== t) load(context, params, spec, deps, cb)
}

me.load = function(context, params, spec, cb){
    load(context, params, spec.slice(), [], cb)
}
