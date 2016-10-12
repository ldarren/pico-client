const
SUBJECT='Confirmation',
TEXT_CONFIRM=require('tmpl/email_confirmation.txt'),
HTML_CONFIRM=require('tmpl/email_confirmation.html'),
URL_CONFIRM_DEV='https://st.jasaws.com/jasy/app/#email/confirm/EMAIL/VID',
URL_CONFIRM_PRO='https://console.jasaws.com/jasy/app/#email/confirm/EMAIL/VID',
URL_DOC_DEV='https://st.jasaws.com/jasy/app/#doc',
URL_DOC_PRO='https://console.jasaws.com/jasy/app/#doc'

let
sqlUser=require('sql/user'),
redisUser=require('redis/user'),
ses,apiUser,
isPro=true

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
	create(cred,user,role,next){
		user.role=role
		sqlUser.set(user,cred.id||0,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
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
	createSession(cred,user,key,session,next){
		Object.assign(session,cred,{id:user.id,sess:key})
		redisUser.setSession(session,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	removeSession(cred,next){
		redisUser.removeSession(cred,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	verify(cred,next){
		redisUser.getSession(cred,(err,sess)=>{
			if (err) return next(this.error(500))
			if (!sess || sess!==cred.sess) return next(this.error(403))
			next()
		})
	},
	poll(input,output,next){
		sqlUser.poll([input.id],input.t,(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next()
			sqlUser.gets(rows,(err,map)=>{
				if (err) return next(this.error(500,err.message))
				output['users']=map
				next()
			})
		})
	}
}
