const
MIN5=5*60*1000,
Floor=Math.floor,
sqlEntity=require('sql/entity'),
redisRemote=require('redis/remote'),
pStr=require('pico/str'),
ajax=pico.ajax

let running=false

return {
	setup(context,cb){
		cb()
	},
	getSession(cred,entId,$sessKey,next){
		//TODO: cache this info?
		sqlEntity.map_getAll({id:entId},(err,ent)=>{
			if (err || !ent.webhook) return next(this.error(400))
			ajax('post',ent.webhook,{
				act:'user/getSession',
				key:pStr.codec(Floor(Date.now()/MIN5)+pStr.hash(ent.secret),cred.app),
				userId:cred.id
			},null,(err,state,res)=>{
				if (4!==state) return
				if (err) return next(this.error(500,err))
				try{var sess=JSON.parse(res)}
				catch(ex){return next(this.error(500))}
				this.set($sessKey,sess.key)
				next()
			})
		})
	},
	trigger(next){
		next()
	}
}
