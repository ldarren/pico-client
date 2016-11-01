const
Max=Math.max,
picoStr=require('pico/str'),
picoObj=require('pico/obj'),
sqlDir=require('sql/directory')

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
	newUser(cred,user,next){
		sqlDir.newUser(user.id,cred.id,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	newGroup(cred,input,next){
		sqlDir.newGroup([cred.id],input.name,cred.id,(err)=>{
			if(err) return next(this.error(500))
			next()
		})
	},
	userJoin(cred,user,next){
		sqlDir.userJoin([cred.grpp],cred.grp,user.id,'root',cred.id,(err)=>{
			if (err) return next(this.error(500,err.message))
			next()
		})
	},
	read(input,output,next){
		next()
	},
	poll(input,output,next){
		next()
	}
}
