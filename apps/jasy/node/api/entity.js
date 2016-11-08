const
picoStr=require('pico/str'),
picoObj=require('pico/obj'),
sqlEntity=require('sql/entity'),
sqlDir=require('sql/directory')

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
			next()
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
	last(input,poll,output,next){
		sqlEntity.last(pObj.pluck(poll,'entityId'),input.t,(err,entities,lastseen)=>{
			if (err) return next(this.error(500,err.message))
			console.log(entities,lastseen)
			for(let i=0,e,j,d; e=entities[i]; i++){
				for(j=0; p=poll[i]; i++){
					if (p.entityId !== e.id) continue
					switch(p.role){
					case 'root':
					case 'admin':
						entities[i]=sqlEntity.cleanSecret(e)
						break
					default:
						entities[i]=sqlEntity.clean(e)
						break
					}
					break
				}
			}
			output['t']=lastseen
			output['entities']=entities
			next()
		})
	}
}
