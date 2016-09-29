const
INDEX=						['name','parentId'],
PRIVATE=					['trigger','key','secret','setting','log'],
SECRET=						[],
ENUM=						['type'],

GET=						'SELECT * FROM `entity` WHERE `id`=? AND `s`!=0;',
FIND_BY_PARENTID_AND_NAME=	'SELECT * FROM `entity` WHERE `parentId`=? AND `name`=? AND `s`!=0;',
SET=						'INSERT INTO `entity` (`parentId`,`name`,`cby`) VALUES (?);',

MAP_GET=					'SELECT `entityId`,`k`,`v1`,`v2` FROM `entityMap` WHERE `entityId`=?;',
MAP_GET_BY_KEY=				'SELECT `entityId`,`k`,`v1`,`v2` FROM `entityMap` WHERE `entityId`=? AND `k`=?;',
MAP_SET=					'INSERT INTO `entityMap` (`entityId`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',

ERR_INVALID_INPUT=			'INVALID INPUT'

var
hash=require('sql/hash'),
client

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
	get(entity,cb){
		if (!entity || !entity.id) return cb(ERR_INVALID_INPUT)
		client.query(GET,[entity.id],(err,entities)=>{
			if (err) return cb(err)
			this.map_get(client.decode(entities[0],hash,ENUM),cb)
		})
	},
	findByEmail(email,cb){
		client.query(FIND_BY_EMAIL, [email], (err,rows)=>{
			if (err) return cb(err)
			cb(null,client.decodes(rows,hash,ENUM))
		})
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
	map_get(entity,cb){
		if (!entity||!entity.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GET,[entity.id],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecode(rows,entity,hash,ENUM))
		})
	},
	map_getByKey(entity,key,cb){
		if (!entity||!entity.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GET_BY_KEY,[entity.id,hash.val(key)],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecode(rows,entity,hash,ENUM))
		})
	},
	map_set(entity,by,cb){
		client.query(MAP_SET, [client.mapEncode(entity,by,hash,INDEX,ENUM)], cb)
	}
}
