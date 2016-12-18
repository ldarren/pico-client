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
broadcastReset=function(list){
	if (!list.length) return
	const ent=list.pop()
	pWeb.create({url:ent.webhook,delimiter:['&']},(err,client)=>{
		if (err) return console.error('failed to create channel for entity',ent.id,'error',err)
		channels[ent.id]=client
		client.request('remote/reset',{token:Buffer.from(codec(ent.secret,ent.key)).toString('base64')},{app:appConfig.key},(err,data)=>{
			if (err) return console.error('failed to reset entity',ent.id,'error',err)
		})
	})
	broadcastReset(list)
}

let
appConfig,
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
		appConfig=context.config.app
		// set reset to all entities
		sqlEntity.map_getList('webhook',(err,list)=>{
			if (err) return cb(err)
			sqlEntity.gets(list,(err,ents)=>{
				if (err) return cb(err)
				broadcastReset(ents)
			})
		})
		cb()
	},
	connect(cred,input,next){
		const app=cred.app
		sqlEntity.findId(app,(err,rows)=>{
			if (err || !rows || !rows.length) return next(this.error(400))
			sqlEntity.map_getAll(rows[0],(err,ent)=>{
				if (err || !ent.secret) return next(this.error(400))
				if (app !== codec(ent.secret,Buffer.from(input.token,'base64').toString())) return next(this.error(400))
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
