const
DAY1=60*60*24

let client

module.exports={
	setup(context,cb){
		client=context.dirCache
		cb()
	},
	get(cred,input,cb){
		client.get(`d:${cred.id}:${input.grp||''}:${input.name||''}`,(err,res)=>{
			if (err) return cb(err)
			try{var dir=JSON.parse(res)}
			catch(ex){return cb(ex)}
			cb(null,dir)
		})
	},
	set(cred,input,dir,cb){
		client.setex(`d:${cred.id}:${input.grp||''}:${input.name||''}`,DAY1,JSON.stringify(dir),cb)
	},
	del(cred,input,cb){
		client.del(`d:${cred.id}:${input.grp||''}:${input.name||''}`,cb)
	},
	getPublic(input,cb){
		client.get(`p:${input.grp||''}:${input.name||''}:`,(err,res)=>{
			if (err) return cb(err)
			try{var dir=JSON.parse(res)}
			catch(ex){return cb(ex)}
			cb(null,dir)
		})
	},
	setPublic(input,dir,cb){
		client.setex(`p:${input.grp||''}:${input.name||''}`,DAY1,JSON.stringify(dir),cb)
	},
	delPublic(input,cb){
		client.del(`p:${input.grp||''}:${input.name||''}`,cb)
	},
	getGroup(dirId,cb){
		client.get(`g:${dirId}`,(err,res)=>{
			if (err) return cb(err)
			try{var group=JSON.parse(res)}
			catch(ex){return cb(ex)}
			cb(null,group)
		})
	},
	setGroup(dirId,group,cb){
		client.setex(`g:${dirId}`,DAY1,JSON.stringify(group),cb)
	},
	delGroup(dirId,cb){
		client.del(`g:${dirId}}`,cb)
	}
}
