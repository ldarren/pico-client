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
	list(cred,input,output,next){
		redisDir.get(cred,input,'d',(err,dirs)=>{
			if (err) return next(this.error(500))
			if (!dirs) return next(null,'to/remote/directory/list')
			output.push(...dirs)
			next()
		})
	},
	groupList(cred,input,output,next){
		redisDir.get(cred,input,'g',(err,group)=>{
			if (err) return next(this.error(500))
			if (!group) return next(null,'to/remote/group/list')
			Object.assign(output,group)
			next()
		})
	},
	update(cred,input,type,dir,next){
		redisDir.set(cred,input,type,dir,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	// poll local cache for changes
	poll(cred,input,output,next){
		next()
	}
}
