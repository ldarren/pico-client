const
Max=Math.max,
SUBJECT='Confirmation',
TEXT_CONFIRM=require('tmpl/email_confirmation.txt'),
HTML_CONFIRM=require('tmpl/email_confirmation.html'),
URL_CONFIRM_DEV='https://st.jasaws.com/jasy/app/#email/confirm/EMAIL/VID',
URL_CONFIRM_PRO='https://console.jasaws.com/jasy/app/#email/confirm/EMAIL/VID',
URL_DOC_DEV='https://st.jasaws.com/jasy/app/#doc',
URL_DOC_PRO='https://console.jasaws.com/jasy/app/#doc',

path=pico.import('path'),
sqlUser=require('sql/user'),
redisUser=require('redis/user'),
pObj=require('pico/obj')

let
ses,apiUser,
isPro=true

return {
	setup(context,cb){
		isPro='pro'===pico.env('env')
		ses=context.email.ses
		apiUser=this
		cb()
	},
	rotate(next){
		redisUser.rotate(next)
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
	create(cred,user,next){
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
		sqlUser.get({id:input.id},(err,user)=>{
			if (err) return next(this.error(500,err.message))
			if (!user) return next(this.error(400))
			Object.assign(output,user)
			next()
		})
	},
	createSession(cred,user,key,entId,grp,session,next){
		Object.assign(session,cred,{id:user.id,sess:key})
		redisUser.setSession(session,entId,grp,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	removeSession(cred,next){
		next()
	},
	leaveGroup(session,next){
		next()
	},
	verify(cred,next){
		redisUser.getSession(cred,(err,grp)=>{
			if (err) return next(this.error(500))
			if (null===grp) return next(this.error(403))
			cred.grp=grp
			cred.cwd=path.join(grp,cred.cwd)
			next()
		})
	},
	poll(input,output,next){
		let uid=input.id
		sqlUser.poll(uid,input.t,(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next()
			sqlUser.gets(rows,(err,list)=>{
				if (err) return next(this.error(500,err.message))
				let users=output['users']=[]
				for(let i=0,u; u=list[i]; i++){
					users.push(u.id===uid?sqlUser.cleanSecret(u):sqlUser.clean(u))
				}
				output['t']=Max(...pObj.pluck(users,'uat'),output.t)
				next()
			})
		})
	}
}
