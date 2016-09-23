const
INDEX=				['email'],
PRIVATE=			['pwd'],
PRIVATE_SELF=		['pwd'],
ENUM=				['role'],

GET=				'SELECT * FROM `user` WHERE `id`=? AND `s`!=0;',
FIND_BY_EMAIL=		'SELECT * FROM `user` WHERE `email`=? AND `s`!=0;',
SET=				'INSERT INTO `user` (`email`,`cby`) VALUES (?);',

MAP_GET=			'SELECT `userId`,`k`,`v1`,`v2` FROM `userMap` WHERE `userId`=?;',
MAP_GET_BY_KEY=		'SELECT `userId`,`k`,`v1`,`v2` FROM `userMap` WHERE `userId`=? AND `k`=?;',
MAP_SET=			'INSERT INTO `userMap` (`userId`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',

ERR_INVALID_INPUT=	'INVALID INPUT'

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
	cleanSelf(model){
        for(var i=0,k; k=PRIVATE_SELF[i]; i++) delete model[k];
		return model
	},
	get(user,cb){
		if (!user || !user.id) return cb(ERR_INVALID_INPUT)
		client.query(GET,[user.id],(err,users)=>{
			if (err) return cb(err)
			this.map_get(client.decode(users[0],hash,ENUM),cb)
		})
	},
	findByEmail(email,cb){
		client.query(FIND_BY_EMAIL, [email], (err,rows)=>{
			if (err) return cb(err)
			cb(null,client.decodes(rows,hash,ENUM))
		})
	},
	set(user,by,cb){
		client.query(SET, [client.encode(user,by,hash,INDEX,ENUM)], (err, result)=>{
			if (err) return cb(err)
			user.id=result.insertId
			this.map_set(user,by,(err)=>{
				cb(err, user)
			})
		})
	},
	map_get(user,cb){
		if (!user||!user.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GET,[user.id],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecode(rows,user,hash,ENUM))
		})
	},
	map_getByKey(user,key,cb){
		if (!user||!user.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GET_BY_KEY,[user.id,hash.val(key)],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecode(rows,user,hash,ENUM))
		})
	},
	map_set(user,by,cb){
		client.query(MAP_SET, [client.mapEncode(user,by,hash,INDEX,ENUM)], cb)
	}
}
