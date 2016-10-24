const
Max=Math.max,
picoStr=require('pico/str'),
picoObj=require('pico/obj'),
sqlEntity=require('sql/entity'),
fsGroup=require('fs/group'),
createKey=function(){
	return picoStr.rand().substr(0,20)
},
createSecret=function(){
	return (picoStr.rand()+picoStr.rand()).substr(0,40)
}

return {
	setup(context,cb){
		cb()
	},
    reply(output,next){
        this.setOutput(output,sqlEntity.clean,sqlEntity)
        next()
    },
    replyPrivate(output,next){
        this.setOutput(output,sqlEntity.cleanSecret,sqlEntity)
        next()
    },
    replyList(list,next){
        this.setOutput(list,sqlEntity.cleanList,sqlEntity)
        next()
    },
	// TODO: ses email verification
	create(cred,input,key,secret,output,next){
		sqlEntity.set(Object.assign({},input,{key:key,secret:secret}), cred.id, (err, entity)=>{
			if (err) return next(this.error(500,err.message))
			Object.assign(output,{id:entity.id})
			this.addJob([output], sqlEntity.get, sqlEntity)
			fsGroup.createGroup([cred.id.toString()],input.name,cred.id,(err)=>{
				if (err) return next(this.error(500,err.message))
				next()
			})
		})
	},
	remove(input,next){
		next()
	},
	list(input,next){
		next()
	},
	read(input,output,next){
		next()
	},
	update(input,next){
		next()
	},
	poll(input,output,next){
		sqlEntity.usermap_findEntityId(input,'role',(err,entities)=>{
			if (err) return cb(this.error(500,err.message))
			if (!entities.length) return next()
			sqlEntity.gets(entities,(err,list)=>{
				if (err) return cb(this.error(500,err.message))
				for(let i=0,e; e=entities[i]; i++){
					switch(e.role){
					case 'root':
					case 'admin':
						entities[i]=sqlEntity.cleanSecret(e)
						break
					default:
						entities[i]=sqlEntity.clean(e)
						break
					}
				}
				output['t']=Max(...picoObj.pluck(entities,'uat'),output.t)
				output['entities']=entities
				next()
			})
		})
	}
}
