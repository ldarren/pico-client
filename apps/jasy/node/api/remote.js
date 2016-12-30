const
MIN1=60*1000,
Floor=Math.floor,
sqlEntity=require('sql/entity'),
redisRemote=require('redis/remote'),
pStr=require('pico/str'),
pWeb=require('pico/web'),
channels={},
codec=function(secret,token){
	return pStr.codec(Floor(Date.now()/MIN1)+pStr.hash(secret),token)
},
getChannel=function(ent,cb){
	const c=channels[ent.id]
	if (c) return cb(null, c)
	pWeb.create({url:ent.url,delimiter:['&']},(err,client)=>{
		if (err) return cb(err)
		channels[ent.id]=client
		console.log('added channel',ent.name)
		cb(err,client)
	})
},
getCredential=function(ent){
	return {
		app:appConfig.key,
		sess:Buffer.from(codec(ent.secret,ent.key)).toString('base64')
	}
}

let
appConfig,
count=30

this.update=function(){
	if (count--) return
	count=30
	for(let i=0,keys=Object.keys(channels),c; c=channels[keys[i]]; i++){
		c.beat()
	}
}

return {
	setup(context,cb){
		appConfig=context.config.app
		cb()
	},
	verify(cred,ent,next){
		if (!ent || !ent.secret || !ent.url) return next(this.error(403))
		if (cred.app !== codec(ent.secret,Buffer.from(cred.sess,'base64').toString())) return next(this.error(403))
		next()
	},
	getSession(ent,user,$sessKey,next){
		getChannel(ent,(err,channel)=>{
			if (err) return next(this.error(500))
			channel.request('from/remote/user/getSession',user,getCredential(ent),(err,data)=>{
				if (err) return next(this.error(500,err))
				this.set($sessKey,data.sess)
				next()
			})
		})
	},
	trigger(next){
		next()
	}
}
