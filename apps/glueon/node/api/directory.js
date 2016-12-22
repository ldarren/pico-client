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
	list(cred,input,output,next){
		redisDir.get(cred,input,(err,dir)=>{
			if (err) return next(this.error(500))
			if (!dir) return next(null,'to/remote/directory/list')
			output.push(...dir)
			next()
		})
	},
	read(cred,input,output,next){
		next()
	},
	update(cred,input,dir,next){
		redisDir.set(cred,input,dir,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	poll(cred,input,poll,output,next){
		next()
	}
}
