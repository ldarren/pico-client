return {
    connect:function(stream, user, seen){
        stream.reconnect('pdl',`/stream?id=${user.id}&sess=${user.sess}&seen=${seen}`)
    },
	readOwnerUserInfo:function(userId, cb){
		var
		models=this.deps.models,
		u=models.owner.at(0)
		models.users.add(u)
		cb(null, u)
	}
}
