const
pStr=require('pico/str'),
pObj=require('pico/obj'),
redisDir=require('redis/dir')

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
	remove(input,next){
		next()
	},
	list(input,output,next){
		redisDir.get(input,(err,dir)=>{
			if (err) return next(this.error(500))
			if (!dir) return next(null,'to/remote/directory/list')
			Object.assign(output,dir)
			next()
		})
	},
	read(cred,input,output,next){
		next()
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
