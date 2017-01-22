const
MIN2=2*60*1000,
Floor=Math.floor,
sqlEntity=require('sql/entity'),
redisRemote=require('redis/remote'),
pStr=require('pico/str'),
pWeb=require('pico/web'),
channels={},
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
checkCredential=function(key,secret,token){
	const
	t=Floor(Date.now()/MIN2),
	hash=pStr.hash(secret)
console.log('jasy.checkCredential',t,hash,key)
	return key===pStr.codec(t+hash,token) || key===pStr.codec(t-1+hash,token) || key===pStr.codec(t+1+hash,token)
},
getCredential=function(ent){
	const
	t=Floor(Date.now()/MIN2),
	hash=pStr.hash(ent.secret)
console.log('jasy.getCredential',t,hash,ent.key,Buffer.from(pStr.codec(t+hash,ent.key)).toString('base64'))
	return {
		app:appConfig.key,
		sess:Buffer.from(pStr.codec(t+hash,ent.key)).toString('base64')
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
		if (!ent || !ent.secret || !ent.url) {
			this.log('remote.verify missing',ent)
			return next(this.error(403))
		}
		console.log('jasy.verify',cred.sess)
		if (!checkCredential(cred.app,ent.secret,Buffer.from(cred.sess,'base64').toString())){
			this.log('remote.verify error',cred.app,ent.secret,cred.sess)
			return next(this.error(403))
		}
		next()
	},
	getSession(ent,user,$sessKey,next){
		getChannel(ent,(err,channel)=>{
			if (err) return next(this.error(500))
			channel.request('from/remote/user/getSession',user,getCredential(ent),(err,data)=>{
				if (err) return next(err)
				this.set($sessKey,data.sess)
				next()
			})
		})
	},
	trigger(next){
		next()
	}
}
