const
pStr=require('pico/str'),
pObj=require('pico/obj'),
sqlChat=require('sql/chat'),
sqlData=require('sql/data')

return {
	setup(context,cb){
		cb()
	},
    reply(output,next){
        this.setOutput(output,sqlChat.clean,sqlChat)
        next()
    },
    replyPrivate(output,next){
        this.setOutput(output,sqlChat.cleanSecret,sqlChat)
        next()
    },
    replyList(list,next){
        this.setOutput(list,sqlChat.cleanList,sqlChat)
        next()
    },
	// TODO: ses email verification
	create(cred,input,key,secret,output,next){
		sqlChat.set(Object.assign({},input,{key:key,secret:secret}), cred.id, (err, entity)=>{
			if (err) return next(this.error(500,err.message))
			Object.assign(output,{id:entity.id})
			this.addJob([output], sqlChat.get, sqlChat)
			next()
		})
	},
	remove(input,next){
		next()
	},
	list(input,next){
		next()
	},
	read(input,output,next){
		next()
	},
	update(input,next){
		next()
	},
	poll(cred,input,output,next){
		next()
	}
}
