const
DAY1=60*60*24

let client

module.exports={
	setup(context,cb){
		client=context.dirCache
		cb()
	},
	get(cred,input,type,cb){
		client.get(`${type}:${cred.id}:${input.grp||''}:${input.name||''}`,(err,res)=>{
			if (err) return cb(err)
			try{var dir=JSON.parse(res)}
			catch(ex){return cb(ex)}
			cb(null,dir)
		})
	},
	set(cred,input,type,dir,cb){
		client.setex(`${type}:${cred.id}:${input.grp||''}:${input.name||''}`,DAY1,JSON.stringify(dir),cb)
	},
	del(cred,input,type,cb){
		client.del(`${type}:${cred.id}:${input.grp||''}:${input.name||''}`,cb)
	},
	publicGet(input,type,cb){
		client.get(`${type}:${input.grp||''}:${input.name||''}:`,(err,res)=>{
			if (err) return cb(err)
			try{var dir=JSON.parse(res)}
			catch(ex){return cb(ex)}
			cb(null,dir)
		})
	},
	publicSet(input,type,dir,cb){
		client.setex(`${type}:${input.grp||''}:${input.name||''}`,DAY1,JSON.stringify(dir),cb)
	},
	publicDel(input,type,cb){
		client.del(`${type}:${input.grp||''}:${input.name||''}`,cb)
	}
}
