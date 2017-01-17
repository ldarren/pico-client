const
ABS=Math.abs,
path=pico.import('path'),
pStr=require('pico/str'),
pObj=require('pico/obj'),
sqlDir=require('sql/directory'),
sqlEntity=require('sql/entity'),
posTrim=function(val,n){
	return pStr.pad(ABS(val).toString(36).substr(0,n),n)
}

return {
	setup(context,cb){
		cb()
/*
		const output={}
		this.last({id:1},{t:new Date('1947')},output,(err)=>{
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
			posTrim(pStr.hash(Date.now().toString()),8) +
			posTrim(pStr.hash(input.type),6) +
			posTrim(pStr.hash(input.name),10) +
			posTrim(pStr.hash((529+cred.id).toString()),8))
		next()
	},
	// TODO: ses email verification
	create(cred,input,cwd,key,secret,output,next){
		const home=input.home?path.join(cwd,input.home):undefined
		sqlEntity.set(Object.assign({},input,{key,secret,home}), cred.id, (err, entity)=>{
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
	read(entId,output,next){
		sqlEntity.get({id:entId}, (err, ent)=>{
			if (err) return next(this.error(500,err.message))
			Object.assign(output,ent)
			next()
		})
	},
	update(input,next){
		next()
	},
	findId(cred,$entId,next){
		sqlEntity.findId(cred.app,(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next(this.error(401))
			this.set($entId,rows[0].id)
			next()
		})
	},
	findAPIId(cred,$entId,next){
		sqlEntity.findId(cred.app,(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next(this.error(401))
			sqlEntity.map_get(rows[0],'api',(err,ent)=>{
				if (err) return next(this.error(500,err.message))
				if (!ent.api){
					this.set($entId,ent.id)
					return next()
				}
				sqlEntity.findId(ent.api,(err,rows)=>{
					if (err) return next(this.error(500,err.message))
					if (!rows.length) return next(this.error(401))
					this.set($entId,rows[0].id)
					next()
				})
			})
		})
	},
	getMapAll(entId,output,next){
		sqlEntity.map_getAll({id:entId},(err,ent)=>{
			if (err) return next(this.error(500,err.message))
			Object.assign(output,ent)
			next()
		})
	},
	getMap(entId,$field,$output,next){
		sqlEntity.map_get({id:entId},$field,(err,ent)=>{
			if (err) return next(this.error(500,err.message))
			this.set($output,ent[$field])
			next()
		})
	},
	last(cred,input,poll,output,next){
		if (!poll.length) return next()
		sqlDir.entityMap_findEntityIds(pObj.pluck(poll,'id'),'entity',(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next()
			sqlEntity.last(pObj.pluck(rows,'entityId'),cred.id,input.t,(err,entities)=>{
				if (err) return next(this.error(500,err.message))
				output['entities']=sqlEntity.cleanList(entities)
				next()
			})
		})
	},
	branch(entId,key,next){
		next(null,`${key}.${1===entId?'local':'remote'}`)
	}
}
