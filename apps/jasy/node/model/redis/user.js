const
Floor=Math.floor,
DAY1=60*60*24,
DAY3=3*DAY1

let client,days

module.exports={
	setup(context,cb){
		client=context.userCache
		this.rotate(cb)
	},
	rotate(cb){
		const now=Floor(Date.now()/DAY1)
		days=[now,now-1,now-2]
		cb()
	},
	getRegisterCache(cred,email,verifyId,cb){
		client.get(`rgc:${cred.app}:${email}:${verifyId}`,(err,res)=>{
			if (err||!res) return cb(err||'not found')
			try{cb(null,JSON.parse(res))}
			catch(e){return cb(e)}
		})
	},
	setRegisterCache(cred,email,verifyId,user,cb){
		client.setex(`rgc:${cred.app}:${email}:${verifyId}`,DAY1,JSON.stringify(user),cb)
	},
	removeRegisterCache(cred,email,verifyId,cb){
		client.del(`rgc:${cred.app}:${email}:${verifyId}`,cb)
	},
	getSession(cred,cb){
		client.get(`sess:${cred.app}:${cred.id}:${cred.sess}`,cb)
	},
	setSession(cred,entId,grp,cb){
		const
		uid=cred.id,
		key=`ent:${uid}:${days[0]}`

		client.multi()
		.setex(`sess:${cred.app}:${uid}:${cred.sess}`,DAY3,grp)
		.sadd(key,entId)
		.expire(key,DAY3)
		.exec(cb)
	},
	removeSession(cred,cb){
		client.del(`sess:${cred.app}:${cred.id}:${cred.sess}`,cb)
	},
	getEntities(userId,cb){
		const key=`ent:${userId}`
		client.sunion(`${key}:${days[0]}`,`${key}:${days[1]}`,`${key}:${days[2]}`,cb)
	}
}
