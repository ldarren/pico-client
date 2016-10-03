const
SUBJECT='Confirmation',
TEXT_CONFIRM=require('tmpl/email_confirmation.txt'),
HTML_CONFIRM=require('tmpl/email_confirmation.html'),
URL_CONFIRM_DEV='https://st.jasaws.com/jasy/app/#email/confirm/EMAIL/VID',
URL_CONFIRM_PRO='https://console.jasaws.com/jasy/app/#email/confirm/EMAIL/VID',
URL_DOC_DEV='https://st.jasaws.com/jasy/app/#doc',
URL_DOC_PRO='https://console.jasaws.com/jasy/app/#doc'

var
picoStr=require('pico/str'),
sqlUser=require('sql/user'),
redisUser=require('redis/user'),
ses,apiUser,
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
		apiUser=this
		cb()
	},
    reply(output,next){
        this.setOutput(output,sqlUser.clean,sqlUser)
        next()
    },
    replyPrivate(output,next){
        this.setOutput(output,sqlUser.cleanSecret,sqlUser)
        next()
    },
    replyList(list,next){
        this.setOutput(list,sqlUser.cleanList,sqlUser)
        next()
    },
	// TODO: ses email verification
	signup(cred,input,output,next){
		var email=input.email
		if (!email || !input.pwd) return next(this.error(401))
		sqlUser.findByEmail(email, (err, users)=>{
			if (err) return next(this.error(500))
			if (users.length) return next(this.error(401))

			var
			verifyId=createKey(),
			urlConfirm=(isPro?URL_CONFIRM_PRO:URL_CONFIRM_DEV).replace('EMAIL',email).replace('VID',verifyId),
			urlDoc=isPro?URL_DOC_PRO:URL_DOC_DEV

			ses.send([email],SUBJECT,
				TEXT_CONFIRM.replace('URL_EMAIL_CONFIRM',urlConfirm).replace('URL_DOC',urlDoc),
				{html:HTML_CONFIRM.replace('URL_EMAIL_CONFIRM',urlConfirm).replace('URL_DOC',urlDoc)},
				(err,data)=>
				{
					if (err) return next(this.error(400, err))
					Object.assign(output,cred,{id:0})
					redisUser.setRegisterCache(cred,email,verifyId,input)
					next()
				})
		})
	},
	confirmEmail(cred,input,output,next){
		var
		email=input.email,
		verifyId=input.verifyId
		if (!email || !verifyId) return next(this.error(400))
		sqlUser.findByEmail(email, (err, users)=>{
			if (err) return next(this.error(500))
			if (users.length) return next(this.error(401))

			redisUser.getRegisterCache(cred,email,(err,vid,user)=>{
				if (err) return next(this.error(403))
				if (vid!==verifyId) return next(this.error(403))
				user.role='user'
				Object.assign(output,cred)
				this.addJob([user,0],sqlUser.set,sqlUser)
				this.addJob([cred,email],redisUser.removeRegisterCache,redisUser)
				this.addJob([input,output],apiUser.addCredential,apiUser)
				this.addJob([output],redisUser.setSession,redisUser)
				next()
			})
		})
	},
	addCredential(input,output,cb){
		sqlUser.findByEmail(input.email, (err, users)=>{
			if (err) return cb(this.error(500))
			if (!users || !users.length) return cb(this.error(401))

			Object.assign(output,{id:users[0].id,sess:createKey()})

			cb()
		})
	},
	signin(cred,input,output,next){
		var email=input.email
		if (!email || !input.pwd) return next(this.error(401))
		sqlUser.findByEmail(email, (err, users)=>{
			if (err) return next(this.error(500))
			if (!users || !users.length) return next(this.error(401))

			var user=users[0]

			sqlUser.map_getByKey(user, 'pwd', (err, map)=>{
				if (err) return next(this.error(500))
				if (input.pwd !== map.pwd) return next(this.error(401))

				Object.assign(output,cred,{id:user.id,sess:createKey()})
				this.addJob([output],redisUser.setSession,redisUser)
				next()
			})
		})
	},
	signout(cred,next){
		next()
	},
	update(cred,input,next){
		next()
	},
	list(input,output,next){
		output.push(...input.set)
		this.addJob([output],sqlUser.list,sqlUser)
		next()
	},
	read(input,output,next){
		Object.assign(output,{id:input.id})
		this.addJob([output],sqlUser.get,sqlUser)
		next()
	},
	verify(cred,next){
		redisUser.getSession(cred,(err,sess)=>{
			if (err) return next(this.error(500))
			if (!sess || sess!==cred.sess) return next(this.error(403))
			next()
		})
	}
}
