var
picoStr=require('pico/str'),
sqlUser,
createKey=function(){
	return picoStr.rand().substr(0,20)
},
createSecret=function(){
	return (picoStr.rand()+picoStr.rand()).substr(0,40)
}

return {
	setup:function(context,cb){
		sqlUser=context.mainDB
		cb()
	},
    reply:function(output,next){
        this.setOutput(output,sqlUser.clean,sqlUser)
        next()
    },
    replyToSelf:function(output,next){
        this.setOutput(output,sqlUser.cleanSelf,sqlUser)
        next()
    },
    replyList:function(list,next){
        this.setOutput(list,sqlUser.cleanList,sqlUser)
        next()
    },
	// TODO: ses email verification
	signup:function(input,output,next){
		var
		name=input.name,
		email=input.email
		if (!email || !input.pwd || !name) return next(this.error(401))
		sqlUser.add(name, email, input.pwd, (err, userId)=>{
			if (err) return next(this.error(401, err))
			Object.assign(output,{
				id:userId,
				name:name,
				email:email
			})
			next()
		})
	},
	signin:function(input,next){
	},
	update:function(input,next){
	},
	remove:function(input,next){
	},
	verify:function(input,next){
	}
}
