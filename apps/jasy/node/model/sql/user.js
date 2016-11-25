const
INDEX=				[],
PRIVATE=			['email','pwd','$private','log'],
SECRET=				['pwd'],
ENUM=				[],

GET=				'SELECT * FROM `user` WHERE `id`=? AND `s`!=0;',
GETS=				'SELECT * FROM `user` WHERE `id` IN (?) AND `s`!=0;',
SET=				'INSERT INTO `user` (`cby`) VALUES (?);',
TOUCH=				'UPDATE `user` SET `uat`=NOW() WHERE id=?;',
POLL=				'SELECT * FROM `user` WHERE id IN (?) AND `uat`>? AND `s`!=0;',

MAP_GET=			'SELECT `id`,`k`,`v1`,`v2` FROM `userMap` WHERE `id`=?;',
MAP_GETS=			'SELECT `id`,`k`,`v1`,`v2` FROM `userMap` WHERE `id` IN (?);',
MAP_GET_BY_KEY=		'SELECT `id`,`k`,`v1`,`v2` FROM `userMap` WHERE `id`=? AND `k`=?;',
MAP_SET=			'INSERT INTO `userMap` (`id`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `_id`=LAST_INSERT_ID(`_id`), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',
MAP_FIND_TEXT=		'SELECT `id` FROM `userMap` WHERE `k`=? AND `v1`=?;',
MAP_FIND_INT=		'SELECT `id` FROM `userMap` WHERE `k`=? AND `v2`=?;',

ERR_INVALID_INPUT=	{message:'INVALID INPUT'}

let
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
	list(set,cb){
		client.query(GETS,[set],(err,users)=>{
			if (err) return cb(err)
			this.map_gets(client.decodes(users,hash,ENUM),(err,ret)=>{
				if (err) return cb(err)
				set.length=0
				set.push(...ret)
				cb(err,set)
			})
		})
	},
	get(user,cb){
		if (!user || !user.id) return cb(ERR_INVALID_INPUT)
		client.query(GET,[user.id],(err,users)=>{
			if (err) return cb(err)
			if (!users.length) return cb()
			this.map_get(client.decode(users[0],hash,ENUM),(err,ret)=>{
				if(err) return cb(err)
				Object.assign(user,ret)
				cb(null,user)
			})
		})
	},
	gets(users,cb){
		gets(this,users,0,cb)
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
	touch(user,cb){
		client.query(TOUCH, [user.id], cb)
	},
	poll(ids,date,cb){
		client.query(POLL,[ids,date],cb)
	},

	map_gets(users,cb){
		if (!users || !Array.isArray(users)) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GETS,[picoObj.pluck(users,'id')],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecodes(picoObj.group(rows,'id'),users,hash,ENUM))
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
	},
	map_findText(key,value,cb){
		client.query(MAP_FIND_TEXT, [hash.val(key),value], cb)
	}
}
