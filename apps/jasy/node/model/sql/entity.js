const
INDEX=						['name','parentId','type'],
PRIVATE=					['webhook','key','secret','$private','log'],
SECRET=						[],
ENUM=						['type','role'],

FIND_ID=					'SELECT * FROM `entity` WHERE `name`=? AND `parentId`=? AND `s`!=0;',
GET=						'SELECT * FROM `entity` WHERE `id`=? AND `s`!=0;',
SET=						'INSERT INTO `entity` (`name`,`parentId`,`type`,`cby`) VALUES (?);',

POLL=						'SELECT * FROM `entity` WHERE `id` IN (?) AND `uat`>?;', // should return s==0 entities
TOUCH=						'UPDATE `entity` SET `uat`=NOW() WHERE `id`=?;',

MAP_GET_ALL=				'SELECT `entityId`,`k`,`v1`,`v2` FROM `entityMap` WHERE `entityId`=?;',
MAP_GET=					'SELECT `entityId`,`k`,`v1`,`v2` FROM `entityMap` WHERE `entityId`=? AND `k`=?;',
MAP_SET=					'INSERT INTO `entityMap` (`entityId`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',

USERMAP_SET=				'INSERT INTO `entityUserMap` (`entityId`,`userId`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',
USERMAP_FIND_ENTITYID=		'SELECT `entityId`,`userId`,`k`,`v1`,`v2` FROM `entityUserMap` WHERE `userId`=? AND `k`=?;',

ERR_INVALID_INPUT=			'INVALID INPUT'

var
picoObj=require('pico/obj'),
hash=require('sql/hash'),
client,
gets=function(ctx,items,idx,cb){
	if (items.length <= idx) return cb(null,items)
	ctx.get(items[idx++],(err)=>{
		if(err) return cb(err)
		gets(ctx,items,idx,cb)
	})
}

module.exports={
	setup(context,cb){
		client=context.mainDB
		cb()
	},
	clean(model){
        for(var i=0,k; k=PRIVATE[i]; i++) delete model[k];
		return model
	},
	cleanList(list){
        for(var i=0,l; l=list[i]; i++) list[i]=this.clean(l)
		return list
	},
	cleanSecret(model){
        for(var i=0,k; k=SECRET[i]; i++) delete model[k];
		return model
	},

	findId(name,parentId,cb){
		client.query(FIND_ID, [name,parentId], (err,rows)=>{
			if (err) return cb(err)
			cb(null,client.decodes(rows,hash,ENUM))
		})
	},
	get(entity,cb){
		if (!entity || !entity.id) return cb(ERR_INVALID_INPUT)
		client.query(GET,[entity.id],(err,entities)=>{
			if (err) return cb(err)
			this.map_getAll(client.decode(entities[0],hash,ENUM),(err,ret)=>{
				if(err) return cb(err)
				Object.assign(entity,ret)
				cb(null,entity)
			})
		})
	},
	gets(entities,cb){
		gets(this,entities,0,cb)
	},
	set(entity,by,cb){
		client.query(SET, [client.encode(entity,by,hash,INDEX,ENUM)], (err, result)=>{
			if (err) return cb(err)
			entity.id=result.insertId
			this.map_set(entity,by,(err)=>{
				cb(err, entity)
			})
		})
	},
	poll(ids,uat,cb){
		client.query(POLL, [ids,uat], cb)
	},
	touch(entity,cb){
		client.query(TOUCH, [entity.id], cb)
	},

	map_getAll(entity,cb){
		if (!entity||!entity.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GET_ALL,[entity.id],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecode(rows,entity,hash,ENUM))
		})
	},
	map_get(entity,key,cb){
		if (!entity||!entity.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GET,[entity.id,hash.val(key)],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecode(rows,entity,hash,ENUM))
		})
	},
	map_set(entity,by,cb){
		if (!entity||!entity.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_SET, [client.mapEncode(entity,by,hash,INDEX,ENUM)], cb)
	},

	usermap_set(entity,user,map,by,cb){
		if (!entity||!entity.id||!user||!user.id) return cb(ERR_INVALID_INPUT)
		client.query(USERMAP_SET, [client.map2Encode(entity,user,map,by,hash,INDEX,ENUM)], cb)
	},
	usermap_findEntityId(user,key,cb){
		client.query(USERMAP_FIND_ENTITYID,[user.id,hash.val(key)],(err,rows)=>{
			if (err) return cb(err)
			let entities=[]
			for(let i=0,r; r=rows[i]; i++){
				entities.push({id:r.entityId})
			}
			cb(null,client.mapDecodes(rows,entities,'entityId',hash,ENUM))
		})
	}
}
