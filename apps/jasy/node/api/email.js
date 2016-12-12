const
SUBJECT='Confirmation',
TEXT_CONFIRM=require('tmpl/email_confirmation.txt'),
HTML_CONFIRM=require('tmpl/email_confirmation.html'),
URL_CONFIRM_DEV='https://st.jasaws.com/APP/app/#email/confirm/EMAIL/VID',
URL_CONFIRM_PRO='https://console.jasaws.com/APP/app/#email/confirm/EMAIL/VID',
URL_DOC_DEV='https://st.jasaws.com/APP/app/#doc',
URL_DOC_PRO='https://console.jasaws.com/APP/app/#doc',

sqlUser=require('sql/user'),
redisUser=require('redis/user')

let
isPro=true,
ses

return {
	setup(context,cb){
		isPro='pro'===pico.env('env')
		ses=context.email.ses
		cb()
	},
	verifyEmail(input,output,next){
		sqlUser.map_findText('email',input.email, (err, users)=>{
			if (err) return next(this.error(500))
			if (output){
				if (!users.length) return next(this.error(401))
				Object.assign(output,{id:users[0].id})
			}else if (users.length) return next(this.error(401))
			next()
		})
	},
	verifyPwd(input,user,next){
		sqlUser.map_getByKey(user, 'pwd', (err, map)=>{
			if (err) return next(this.error(500,err.message))
			if (input.pwd !== map.pwd) return next(this.error(401))
			next()
		})
	},
	sendConfirmation(cred,input,app,verifyId,output,next){
		const
		email=input.email,
		urlConfirm=(isPro?URL_CONFIRM_PRO:URL_CONFIRM_DEV).replace('APP',app).replace('EMAIL',email).replace('VID',verifyId),
		urlDoc=(isPro?URL_DOC_PRO:URL_DOC_DEV).replace('APP',app)

		ses.send([email],SUBJECT,
			TEXT_CONFIRM.replace('URL_EMAIL_CONFIRM',urlConfirm).replace('URL_DOC',urlDoc),
			{html:HTML_CONFIRM.replace('URL_EMAIL_CONFIRM',urlConfirm).replace('URL_DOC',urlDoc)},
			(err,data)=>
			{
				if (err) return next(this.error(500, err))
				Object.assign(output,cred,{id:0})
				redisUser.setRegisterCache(cred,email,verifyId,input)
				next()
			})
	},
	confirmation(cred,input,output,next){
		const
		email=input.email,
		vid=input.verifyId

		redisUser.getRegisterCache(cred,email,vid,(err,user)=>{
			if (err) return next(this.error(403))
			Object.assign(output,user)
			this.addJob([cred,email,vid],redisUser.removeRegisterCache,redisUser)
			next()
		})
	},
	update(cred,input,next){
		next()
	}
}
