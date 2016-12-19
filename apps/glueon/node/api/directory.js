const
pStr=require('pico/str'),
pObj=require('pico/obj'),
redisDir=require('redis/dir')

return {
	setup(context,cb){
		cb()
	},
    reply(output,next){
        this.setOutput(output,sqlEntity.clean,sqlEntity)
        next()
    },
    replyPrivate(output,next){
        this.setOutput(output,sqlEntity.cleanSecret,sqlEntity)
        next()
    },
    replyList(list,next){
        this.setOutput(list,sqlEntity.cleanList,sqlEntity)
        next()
    },
	remove(input,next){
		next()
	},
	list(input,next){
		next()
	},
	read(cred,input,output,next){
		redisDir.get(cred,(err,dir)=>{
			if (err) return next(this.error(500))
			if (!dir) return next(null,'to/remote/directory/read')
			Object.assign(output,dir)
			next()
		})
	},
	update(input,next){
		redisDir.set(input,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	poll(cred,input,poll,output,next){
		next()
	}
}
