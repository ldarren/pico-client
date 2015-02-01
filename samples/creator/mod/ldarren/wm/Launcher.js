var
USER_ID = 'USER_ID',
specMgr = require('specMgr'),
loadApps = function(host, params, path){
    var apps = host.apps
    require(path, function(err, apps){
        specMgr.load(host, params, apps.json, function(err, spec){
            for(var i=0,s; s=spec[i]; i++){
                if ('module' !== specMgr.getType(s)) continue
                apps[specMgr.getId(s)] = host.spawn(specMgr.getValue(s), params, null, true)
            }
        })
    })
},
unloadApps = function(host, path){
    var apps = host.apps
    require(path, function(err, apps){
        specMgr.load(host, [], apps.json, function(err, spec){
            for(var i=0,s; s=spec[i]; i++){
                host.dump(apps[specMgr.getId(s)])
            }
        })
    })
}

exports.Class = {
    signals: [],
    deps:{
        owner: 'ref',
        defaultPath: 'url',
        userPath: 'url'
    },
    create: function(deps, params){
        this.apps = {}
        this.userId = 0
        loadApps(this, params, deps.defaultPath)
        var user = deps.owner.at(0)
        if (user) loadApps(this, [], deps.userPath.replace(USER_ID, user.id))
    },
    slots:{
        userReady: function(from, sender, user){
            this.userId = user.id
            loadApps(this, [], this.deps.userPath.replace(USER_ID, user.id))
            return true
        },
        signout: function(){
            if (!this.userId) return false
            unloadApps(this, this.deps.userPath.replace(USER_ID, this.userId))
            this.userId = 0
            return true
        }
    },
    render: function(){
    }
}
