const
DAY1=60*60*24,
DAY3=3*DAY1

let client

module.exports={
	setup(context,cb){
		client=context.userCache
		cb()
	},
	get(cred,cb){
		client.get(`u:${cred.id}`,(err,res)=>{
			if (err) return cb(err)
			try{cb(null,JSON.parse(res))}
			catch(ex){return cb(ex)}
		})
	},
	set(user,cb){
		client.setex(`u:${user.id}`,DAY1,JSON.stringify(user),cb)
	},
	del(cred,cb){
		client.del(`u:${cred.id}`,cb)
	},
	getSession(cred,cb){
		client.get(`sess:${cred.id}:${cred.sess}`,(err,res)=>{
			if (err) return cb(err)
			try{var sess=JSON.parse(res)}
			catch(ex){return cb(ex)}
			cb(null,sess)
		})
	},
	setSession(user,sessKey,cb){
		client.setex(`sess:${user.id}:${sessKey}`,DAY3,JSON.stringify(user),cb)
	},
	delSession(cred,cb){
		client.del(`sess:${cred.id}:${cred.sess}`,cb)
	}
}
