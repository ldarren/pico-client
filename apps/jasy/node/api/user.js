const
SUBJECT='Confirmation',
TEXT_CONFIRM=require('tmpl/email_confirmation.txt'),
HTML_CONFIRM=require('tmpl/email_confirmation.html'),
URL_CONFIRM_DEV='https://st.jasaws.com/jasy/app/#/email/confirm/VID',
URL_CONFIRM_PRO='https://console.jasaws.com/jasy/app/#email/confirm/VID',
URL_DOC_DEV='https://st.jasaws.com/jasy/app/#doc',
URL_DOC_PRO='https://console.jasaws.com/jasy/app/#doc'

var
picoStr=require('pico/str'),
sqlUser=require('sql/user'),
redisUser=require('redis/user'),
ses,
isPro=true,
createKey=function(){
	return picoStr.rand().substr(0,20)
},
createSecret=function(){
	return (picoStr.rand()+picoStr.rand()).substr(0,40)
}

return {
	setup(context,cb){
		isPro='pro'===pico.env('env')
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
		var
		verifyId=createKey(),
		urlConfirm=(isPro?URL_CONFIRM_PRO:URL_CONFIRM_DEV).replace('VID',verifyId),
		urlDoc=isPro?URL_DOC_PRO:URL_DOC_DEV

		ses.send([email],SUBJECT,
			TEXT_CONFIRM.replace('URL_EMAIL_CONFIRM',urlConfirm).replace('URL_DOC',urlDoc),
			{html:HTML_CONFIRM.replace('URL_EMAIL_CONFIRM',urlConfirm).replace('URL_DOC',urlDoc)},
			(err,data)=>
			{
				if (err) return next(this.error(400, err))
				Object.assign(output,input,{pwd:0})
				redisUser.setRegisterCache(email,verifyId,input)
				next()
			})
	},
	signin(input,next){
		next()
	},
	signout(input,next){
		next()
	},
	read(input,next){
		next()
	},
	update(input,next){
		next()
	},
	remove(input,next){
		next()
	},
	verify(input,next){
		next()
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
