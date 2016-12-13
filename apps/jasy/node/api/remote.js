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
credentials={}

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
	setup(context,cb){a
		// set reset to all entities
		cb()
	},
	connect(cred,input,output,next){
		const app=cred.app
		sqlEntity.findId(app,(err,ent)=>{
			if (err || !ent.id) return next(this.error(400))
			sqlEntity.map_getAll(ent,(err,ent)=>{
				if (err || !ent.secret) return next(this.error(400))
				if (app !== codec(ent.secret,input.token)) return next(this.error(400))
				pWeb.create({url:ent.webhook,delimiter:['&']},(err,client)=>{
					if (err) return next(this.error(400))
					channels[ent.id]=client
					const sess=pStr.rand()
					credentials[ent.id]={sess}
					this.setOutput({key:sess})
					next()
				})
			})
		})
	},
	getSession(cred,entId,$sessKey,next){
		const
		c=channels[entId],
		s=credentials[entId]

		if (!c||!s) return next(this.error(400))
		c.request('remote/user/getSession',{userId:cred.id},s,(err,data)=>{
			if (err) return next(this.error(500,err))
			this.set($sessKey,data.key)
			next()
		})
	},
	trigger(next){
		next()
	}
}
