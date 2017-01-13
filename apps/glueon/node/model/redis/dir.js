const
DAY1=60*60*24

let client

module.exports={
	setup(context,cb){
		client=context.dirCache
		cb()
	},
	get(cred,input,type,cb){
		client.get(`${type}:${cred.id}:${input.d}`,(err,res)=>{
			if (err) return cb(err)
			try{var dir=JSON.parse(res)}
			catch(ex){return cb(ex)}
			cb(null,dir)
		})
	},
	set(cred,input,type,dir,cb){
		client.setex(`${type}:${cred.id}:${input.d}`,DAY1,JSON.stringify(dir),cb)
	},
	del(cred,input,type,cb){
		client.del(`${type}:${cred.id}:${input.d}`,cb)
	}
}
