const
SUBJECT='Confirmation',
tmplTxt=require('tmpl/email_confirmation.txt'),
tmplHtml=require('tmpl/email_confirmation.html')

var
picoStr=require('pico/str'),
sqlUser=require('sql/user'),
redisUser=require('redis/user'),
ses,
createKey=function(){
	return picoStr.rand().substr(0,20)
},
createSecret=function(){
	return (picoStr.rand()+picoStr.rand()).substr(0,40)
}

return {
	setup(context,cb){
		ses=context.email.ses
		cb()
	},
    reply(output,next){
        this.setOutput(output,sqlUser.clean,sqlUser)
        next()
    },
    replyToSelf(output,next){
        this.setOutput(output,sqlUser.cleanSelf,sqlUser)
        next()
    },
    replyList(list,next){
        this.setOutput(list,sqlUser.cleanList,sqlUser)
        next()
    },
	// TODO: ses email verification
	signup(input,output,next){
		var email=input.email
		if (!email || !input.pwd) return next(this.error(400))
		var verifyId=createKey()
		ses.send(
		[email],
		SUBJECT,
		tmplTxt.replace('VERIFYID',verifyId),
		{html:tmplHtml.replace('VERIFYID',verifyId)},
		(err,data)=>{
			if (err) return next(this.error(400, err))
			Object.assign(output,input,{pwd:0})
			redisUser.setRegisterCache(email,verifyId,input)
			next()
		})
	},
	signin(input,next){
	},
	signout(input,next){
	},
	read(input,next){
	},
	update(input,next){
	},
	remove(input,next){
	},
	verify(input,next){
	},
	confirmEmail(input,output,next){
		var
		email=input.email,
		verifyId=input.verifyId
		if (!email || !verifyId) return next(this.error(400))
		redisUser.getRegisterCache(email,verifyId,(err,user)=>{
			if (err) return next(this.error(403))
			user.role='user'
			sqlUser.set(user,0,(err, userId)=>{
				if (err) return next(this.error(401, err))
				Object.assign(output,user,{id:userId})
				redisUser.removeRegisterCache(email,verifyId,next)
			})
		})
	}
}
