const
DAY1=60*60*24

let client

module.exports={
	setup(context,cb){
		client=context.dirCache
		cb()
	},
	get(cred,input,cb){
		client.get(`d:${cred.id}:${input.d}`,(err,res)=>{
			if (err) return cb(err)
			try{var dir=JSON.parse(res)}
			catch(ex){return cb(ex)}
			cb(null,dir)
		})
	},
	set(cred,input,dir,cb){
		client.setex(`d:${cred.id}:${input.d}`,DAY1,JSON.stringify(dir),cb)
	},
	del(cred,input,cb){
		client.del(`d:${cred.id}:${input.d}`,cb)
	}
}
