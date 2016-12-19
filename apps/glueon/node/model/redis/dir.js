const
DAY1=60*60*24

let client

module.exports={
	setup(context,cb){
		client=context.dirCache
		cb()
	},
	get(cred,dir,cb){
		client.get(`d:${cred.id}:${dir.grp}`,(err,res)=>{
			if (err) return cb(err)
			try{cb(null,JSON.parse(res))}
			catch(ex){return cb(ex)}
		})
	},
	set(cred,dir,cb){
		client.setex(`u:${user.id}:${dir.grp}`,DAY1,JSON.stringify(dir),cb)
	},
	del(cred,dir,cb){
		client.del(`u:${cred.id}:${dir.grp}`,cb)
	}
}
