return {
    connect:function(stream, user, seen){
        stream.reconnect('lead','/stream',['poll','ping'],false)
    },
	readOwnerUserInfo:function(userId, cb){
		var
		models=this.deps.models,
		u=models.owner.at(0)
		models.users.add(u)
		cb(null, u)
	}
}
