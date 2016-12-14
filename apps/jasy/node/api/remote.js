const
MIN1=60*1000,
Floor=Math.floor,
sqlEntity=require('sql/entity'),
redisRemote=require('redis/remote'),
pStr=require('pico/str'),
pWeb=require('pico/web'),
codec=function(secret,token){
	return pStr.codec(Floor(Date.now()/MIN1)+pStr.hash(secret),token)
},
channels={},
credentials={},
createChannels=function(list){
	if (!list.length) return
	const ent=list.pop()
	pWeb.create({url:ent.webhook,delimiter:['&']},(err,client)=>{
		if (err) return console.error('failed to create channel for entity',ent.id,'error',err)
		client.request('remote/reset',null,{token:codec(ent.secret,ent.key)},(err,data)=>{
			if (err) return console.error('failed to reset entity',ent.id,'error',err)
		})
	})
	createChannels(list)
}

let
running=false,
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
		// set reset to all entities
		sqlEntity.map_getList('webhook',(err,list)=>{
			if (err) return cb(err)
			sqlEntity.gets(list,(err,ents)=>{
				if (err) return cb(err)
				createChannels(ents)
				cb()
			})
		})
	},
	connect(cred,input,next){
		const app=cred.app
		sqlEntity.findId(app,(err,ent)=>{
			if (err || !ent.id) return next(this.error(400))
			sqlEntity.map_getAll(ent,(err,ent)=>{
				if (err || !ent.secret) return next(this.error(400))
				if (app !== codec(ent.secret,input.token)) return next(this.error(400))
				pWeb.create({url:ent.webhook,delimiter:['&']},(err,client)=>{
					if (err) return console.error(err)
					channels[ent.id]=client
					console.log('added channel',ent.name)
					const sess=pStr.rand()
					credentials[ent.id]={sess}
					this.setOutput({key:sess})
					next()
				})
			})
		})
	},
	getSession(user,entId,$sessKey,next){
		const
		c=channels[entId],
		s=credentials[entId]

		if (!c||!s) return next(this.error(400))
		c.request('remote/user/getSession',user,s,(err,data)=>{
			if (err) return next(this.error(500,err))
			this.set($sessKey,data.sess)
			next()
		})
	},
	trigger(next){
		next()
	}
}
