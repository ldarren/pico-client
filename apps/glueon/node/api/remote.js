const
MIN5=5*60*1000,
Floor=Math.floor,
pStr=require('pico/str'),
pWeb=require('pico/web'),
codec=function(secret,token){
	return pStr.codec(Floor(Date.now()/MIN5)+pStr.hash(secret),token)
},
getChannel=function(cb){
	if (channel) return cb(null, channel)
	pWeb.create({url:appConfig.parent,delimiter:['&']},(err,client)=>{
		if (err) return cb(err)
		channel=client
		cb(err,client)
	})
},
getCredential=function(cred){
	return {
		id:cred.id,
		cwd:cred.cwd,
		app:appConfig.key,
		sess:Buffer.from(codec(appConfig.secret,appConfig.key)).toString('base64')
	}
}

let
appConfig,
channel,
count=30

this.update=function(){
	if (!channel || count--) return
	count=30
	channel.beat()
}

return {
	setup(context,cb){
		appConfig=context.config.app
		cb()
	},
	verify(cred,next){
		if (appConfig.key!==codec(appConfig.secret,Buffer.from(cred.sess,'base64').toString())) return next(this.error(403))
		next()
	},
	request(cred,input,api,output,next){
		getChannel((err,channel)=>{
			if (err) return next(this.error(500))
			channel.request(api,input,getCredential(cred),(err,data)=>{
				if (err) return next(err)
				if (data.length) output.push(...data)
				else Object.assign(output,data)
				next()
			})
		})
	},
	createDirectory(cred,input,output,next){
		getChannel((err,channel)=>{
			if (err) return next(this.error(500))
			channel.request('from/remote/directory/create',input,getCredential(cred),(err,data)=>{
				if (err) return next(this.error(500))
				Object.assign(output,data)
				next()
			})
		})
	},
	trigger(next){
		next()
	}
}
