const
pStr=require('pico/str'),
pObj=require('pico/obj'),
redisUser=require('redis/user')

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
	verify(cred,output,next){
		redisUser.getSession(cred,(err,user)=>{
			if (err) return next(this.error(500,err.message))
			if (!user) return next(this.error(403))
			Object.assign(output,user)
			next()
		})
	},
	// poll local cache for changes
	poll(cred,input,output,next){
		next()
	},
	createSession(input,sessKey,output,next){
		redisUser.setSession(input,sessKey,(err)=>{
			if (err) return next(this.error(500))
			Object.assign(output,{sess:sessKey})
			next()
		})
	},
	removeSession(cred,next){
		redisUser.delSession(cred,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	update(input,next){
		redisUser.set(input,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	list(input,output,next){
		next()
	},
	$read(cred,input,me,output,next){
		redisUser.get(cred,(err,user)=>{
			if (err) return next(this.error(500))
			if (!user) return next(null,'to/remote/user/read')
			Object.assign(output,user)
			next()
		})
	}
}
