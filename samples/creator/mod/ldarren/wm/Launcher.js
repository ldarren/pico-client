var
specMgr = require('specMgr'),
loadApps = function(host, params, path){
    require(path, function(err, apps){
        specMgr.load(host, params, apps.json, function(err, spec){
            for(var i=0,s; s=spec[i]; i++){
                host.spawn(specMgr.getValue(s), params, null, true)
            }
        })
    })
}

exports.Class = {
    signals: [],
    deps:{
        owner: 'ref',
        defaultPath: 'url'
    },
    create: function(deps, params){
        loadApps(this, params, deps.defaultPath)
        var user = deps.owner.at(0)
        if (user) loadApps(this, [], '@json/'+user.id+'.json')
    },
    slots:{
        userReady: function(from, sender, user){
            loadApps(this, [], '@json/'+user.id+'.json')
            return true
        },
        signout: function(){
        }
    },
    render: function(){
    }
}
