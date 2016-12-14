const
DAY3=3*60*60*24

let client

module.exports={
	setup(context,cb){
		client=context.userCache
		cb()
	},
	getSession(cred,cb){
		client.get(`sess:${cred.id}:${cred.sess}`,(err,res)=>{
			if (err) return cb(err)
			try{cb(null,JSON.parse(res))}
			catch(ex){return cb(ex)}
		})
	},
	setSession(user,sessKey,cb){
		client.setex(`sess:${user.id}:${sessKey}`,DAY3,JSON.stringify(user),cb)
	},
	delSession(cred,cb){
		client.del(`sess:${cred.id}:${cred.sess}`,cb)
	}
}
