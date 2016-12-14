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
			if (err) return next(this.error(500))
			Object.assign(output,user)
			next()
		})
	},
	poll(input,output,next){
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
	update(cred,input,output,next){
		next()
	},
	list(input,output,next){
		next()
	},
	read(input,output,next){
		next()
	},
	last(input,poll,output,next){
		next()
	}
}
