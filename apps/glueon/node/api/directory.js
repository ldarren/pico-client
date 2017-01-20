const
pStr=require('pico/str'),
pObj=require('pico/obj'),
redisDir=require('redis/dir'),
stripGrp=function(grp,len){
	return grp.substr(len)
},
workingGrp=function(grp,name){
	return path.join(grp,name)
}

return {
	setup(context,cb){
		cb()
	},
    reply(output,next){
        this.setOutput(output)
        next()
    },
    replyPrivate(output,next){
        this.setOutput(output)
        next()
    },
    replyList(list,next){
        this.setOutput(list)
        next()
    },
	replyStream(output,next){
        next()
	},
	$list(cred,input,output,next){
		redisDir.get(cred,input,(err,dirs)=>{
			if (err) return next(this.error(500))
			if (!dirs) return next(null,'to/remote/directory/list')
			output.push(...dirs)
			next()
		})
	},
	$search(input,output,next){
		redisDir.getPublic(input,(err,dirs)=>{
			if (err) return next(this.error(500))
			if (!dirs) return next(null,'to/remote/directory/search')
			output.push(...dirs)
			next()
		})
	},
	$group(input,output,$remote,next){
		redisDir.getGroup(input.id,(err,group)=>{
			if (err) return next(this.error(500))
			if (!group) return next(null,$remote)
			Object.assign(output,group)
			next()
		})
	},
	update(cred,input,dir,next){
		redisDir.set(cred,input,dir,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	updatePublic(input,dir,next){
		redisDir.setPublic(input,dir,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	updateGroup(input,group,next){
		redisDir.setGroup(input,group,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	isExternal(cred,group,$external,next){
		this.set($external,~group.users.indexOf(cred.id))
		next()
	},
	// poll local cache for changes
	poll(cred,input,output,next){
		next()
	}
}
