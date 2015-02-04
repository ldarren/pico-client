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
        'mod/UserMgr': 'ref',
        defaultPath: 'url',
        userPath: 'url'
    },
    create: function(deps){
        this.userId = 0
        this.apps = {UserMgr: this.spawn(deps['mod/UserMgr'], null, null, true)}
    },
    slots:{
        desktopReady: function(from, sender){
            var
            d = this.deps,
            user = d.owner.at(0)
            if (user){
                this.userId = user.id
                loadApps(this, null, d.defaultPath)
                loadApps(this, null, d.userPath.replace(USER_ID, this.userId))
            }
            return true
        },
        userReady: function(from, sender, user){
            this.userId = user.id
            var d = this.deps
            loadApps(this, null, d.defaultPath)
            loadApps(this, null, d.userPath.replace(USER_ID, this.userId))
            return true
        },
        signout: function(){
            if (!this.userId) return false
            var d = this.deps
            unloadApps(this, d.userPath.replace(USER_ID, this.userId))
            unloadApps(this, d.defaultPath)
            this.userId = 0
            return true
        }
    },
    render: function(){
    }
}
