return {
	deps:{
		lockers:'models',
		users:'models'
	},
    loadDependencies:function(list, cb){
		var
        deps=this.deps,
        userIds=[],
        lockerIds=[]
        for(var i=0,l,data; l=list.at(i); i++){
            data=l.attributes
            userIds.push(data.cby)
            lockerIds.push(data.$detail.lockerId)
        }

        deps.lockers.retrieve(lockerIds,function(err, lockers){
            if (err) return cb(err)
            deps.users.retrieve(userIds,function(err, users){
                if (err) return cb(err)

                cb()
            })
        })
	}
}
