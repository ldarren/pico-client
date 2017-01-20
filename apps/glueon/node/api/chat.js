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
	create(cred,input,output,next){
		sqlChat.set({dirId:input.id}, cred.id, (err, chat)=>{
			if (err) return next(this.error(500,err.message))
			Object.assign(output,chat)
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
	read(chat,output,next){
		sqlChat.get(chat,(err,chat)=>{
			if (err) return next(this.error(500,err.message))
			Object.assign(output,chat)
			next()
		})
	},
	$find(cred,input,$external,output,next){
		const cb=(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next(null,'glueon/chat/create')
			Object.assign(output,rows[0])
			next()
		}
		if (!cred.id) return next(null,'gluen/chat/create')
		if ($external) sqlChat.findExternal(input.id, cred.id, cb)
		else sqlChat.find(input.id, cb)
	},
	update(input,next){
		next()
	},
	poll(cred,input,output,next){
		next()
	}
}
