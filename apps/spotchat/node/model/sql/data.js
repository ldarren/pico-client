const
INDEX=						[],
PRIVATE=					[],
SECRET=						[],
ENUM=						['ext'],

FIND_ID=					'SELECT * FROM `data` WHERE `name`=? AND `userId`=? AND `s`!=0;',
GET=						'SELECT * FROM `data` WHERE `id`=? AND `s`!=0;',
SET=						'INSERT INTO `data` (`name`,`userId`,`type`,`cby`) VALUES (?);',

LAST=						'SELECT * FROM `data` WHERE `id` IN (?) AND `uat`>?;', // should return s==0 entities
TOUCH=						'UPDATE `data` SET `uat`=NOW() WHERE `id`=?;',

ERR_INVALID_INPUT=			{message:'INVALID INPUT'},

Max=Math.max,
pObj=require('pico/obj'),
hash=require('sql/hash'),
gets=function(ctx,items,idx,cb){
	if (items.length <= idx) return cb(null,items)
	ctx.get(items[idx++],(err)=>{
		if(err) return cb(err)
		gets(ctx,items,idx,cb)
	})
}

let client

module.exports={
	setup(context,cb){
		client=context.mainDB
		cb()
	},
	clean(model){
        for(let i=0,k; k=PRIVATE[i]; i++) delete model[k];
		return model
	},
	cleanList(list){
        for(let i=0,l; l=list[i]; i++) list[i]=this.clean(l)
		return list
	},
	cleanSecret(model){
        for(let i=0,k; k=SECRET[i]; i++) delete model[k];
		return model
	},

	findId(name,userId,cb){
		client.query(FIND_ID, [name,userId], (err,rows)=>{
			if (err) return cb(err)
			cb(null,client.decodes(rows,hash,ENUM))
		})
	},
	get(data,cb){
		if (!data || !data.id) return cb(ERR_INVALID_INPUT)
		client.query(GET,[data.id],(err,entities)=>{
			if (err) return cb(err)
			cb(null,data)
		})
	},
	gets(entities,cb){
		gets(this,entities,0,cb)
	},
	set(data,by,cb){
		client.query(SET, [client.encode(data,by,hash,INDEX,ENUM)], (err, result)=>{
			if (err) return cb(err)
			data.id=result.insertId
			cb(err, data)
		})
	},
	last(ids,uat,cb){
		client.query(LAST, [ids,uat], (err,rows)=>{
			if (err) return cb(err)
			const
			seen=Max(...pObj.pluck(rows,'uat'),uat),
			entities=client.decodes(rows,hash,ENUM)
			client.query(MAP_LAST, [ids,uat], (err,rows)=>{
				if (err) return cb(err)
				cb(null,client.mapDecodes(rows,entities,hash,ENUM),seen)
			})
		})
	},
	touch(data,cb){
		client.query(TOUCH, [data.id], cb)
	}
}
