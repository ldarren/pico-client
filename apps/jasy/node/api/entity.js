const
ABS=Math.abs,
pStr=require('pico/str'),
pObj=require('pico/obj'),
sqlEntity=require('sql/entity'),
posTrim=function(val,n){
	return pStr.pad(ABS(val).toString(36).substr(0,n),n)
}

return {
	setup(context,cb){
		cb()
/*
		let
		output={},
		this.poll({t:new Date('1947')},output,(err)=>{
			if (err) return console.error(err)
			console.log('output',output)
		})
*/
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
	uuid(cred,input,$key,next){
		this.set($key,
		posTrim(str.hash(Date.now().toString()),8) +
		posTrim(str.hash(input.type),6) +
		posTrim(str.hash(input.name),10) +
		posTrim(str.hash((529+cred.id).toString()),8))
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
	getId(cred,$entId,next){
		sqlEntity.findId(cred.app,(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next(this.error(401))
			this.set($entId,rows[0].id)
			next()
		})
	},
	getName(entId,$appName,next){
		sqlEntity.map_get({id:entId},'name',(err,ent)=>{
			if (err) return next(this.error(500,err.message))
			this.set($appName,ent.name)
			next()
		})
	},
	poll(cred,input,output,next){
		sqlEntity.poll(cred.id,input.t,(err,poll,lastseen)=>{
			if (err) return next(this.error(500,err.message))
			if (!poll.length) return next()
			sqlEntity.last(pObj.pluck(poll,'id'),input.t,(err,entities)=>{
				if (err) return next(this.error(500,err.message))
console.log(entities,lastseen)
				for(let i=0,e,j,p; e=entities[i]; i++){
					for(j=0; p=poll[j]; j++){
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
		})
	}
}
