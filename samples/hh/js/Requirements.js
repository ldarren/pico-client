var
Model = require('Model'),
find = function(name, list){ for(var i=0,l=list.length,o; i<l,o=list[i]; i++){ if (name === o.name) return o } },
load = function(context, params, requirements, deps, cb){
    if (!requirements.length) return cb(null, deps)

    var
    r = requirements.pop(),
    t = r.type,
    f

    switch(t){
    case 'ref':
        f = find(r.value, context)
        deps.push({name:r.name, type:f.type, value:f.value})
        break
    case 'model':
        f = find(r.value, context)
        deps.push({name:r.name, type:t, value:f.value.get(params[r.param])})
        break
    case 'models':
        deps.push({name:r.name, type:t, value:new Model.Class(r.value)})
        break
    case 'module':
        require('modules/'+r.value, function(err, mod){
            if (err) return cb(err)
            deps.push({name:r.name, type:t, value: mod})
            load(context, params, requirements, deps, cb)
        })
        break
    case 'param':
        deps.push({name:r.name, type:t, value:params[r.value]})
        break
    }
    if ('module' !== t) load(context, params, requirements, deps, cb)
}

me.load = function(context, params, requirements, cb){
    load(context, params, requirements.slice(), [], cb)
}
