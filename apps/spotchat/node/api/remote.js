const
MIN2=2*60*1000,
Floor=Math.floor,
pStr=require('pico/str'),
pWeb=require('pico/web'),
getChannel=function(cb){
	if (channel) return cb(null, channel)
	pWeb.create({url:appConfig.parent,delimiter:['&']},(err,client)=>{
		if (err) return cb(err)
		channel=client
		cb(err,client)
	})
},
checkCredential=function(key,secret,token){
	const
	t=Floor(Date.now()/MIN2),
	hash=pStr.hash(secret)
console.log('glueon.checkCredential',t,hash,key)
	return key===pStr.codec(t+hash,token) || key===pStr.codec(t-1+hash,token) || key===pStr.codec(t+1+hash,token)
},
getCredential=function(cred){
	const
	t=Floor(Date.now()/MIN2),
	hash=pStr.hash(appConfig.secret)
console.log('glueon.getCredential',t,hash,appConfig.key)
	return {
		id:cred.id,
		cwd:cred.cwd,
		app:appConfig.key,
		sess:Buffer.from(pStr.codec(t+hash,appConfig.key)).toString('base64')
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
		console.log('glueon.verify',cred.sess)
		if (!checkCredential(appConfig.key,appConfig.secret,Buffer.from(cred.sess,'base64').toString())) return next(this.error(403))
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
	trigger(next){
		next()
	}
}
