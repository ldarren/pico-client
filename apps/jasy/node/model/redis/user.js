const DAY1=60*60*24

var client

module.exports={
	setup(context,cb){
		client=context.userCache
		cb()
	},
	getRegisterCache(cred,email,cb){
		var key=`${cred.grp}:${email}`
		client.multi()
		.get(`vid:${key}`)
		.get(`rgc:${key}`)
		.exec((err,res)=>{
			if (err) return cb(err)
			try{var user=JSON.parse(res[1])}
			catch(e){return cb(e)}
			cb(null, res[0], user)
		})
	},
	setRegisterCache(cred,email,verifyId,user,cb){
		var key=`${cred.grp}:${email}`
		client.multi()
		.setex(`vid:${key}`,DAY1,verifyId)
		.setex(`rgc:${key}`,DAY1,JSON.stringify(user))
		.exec(cb)
	},
	removeRegisterCache(cred,email,cb){
		var key=`${cred.grp}:${email}`
		client.multi()
		.del(`vid:${key}`)
		.del(`rgc:${key}`)
		.exec(cb)
	},
	getSession(cred,cb){
		client.get(`sess:${cred.app}:${cred.id}:${cred.sess}`,cb)
	},
	setSession(cred,grp,cb){
		client.setex(`sess:${cred.app}:${cred.id}:${cred.sess}`,DAY1,grp,cb)
	},
	removeSession(cred,cb){
		client.del(`sess:${cred.grp}:${cred.id}`,cb)
	}
}
