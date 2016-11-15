const
INDEX=				['dirId'],
PRIVATE=			[],
SECRET=				[],
ENUM=				[],

GET=				'SELECT * FROM `chat` WHERE `id`=? AND `s`!=0;',
GETS=				'SELECT * FROM `chat` WHERE `id` IN (?) AND `s`!=0;',
SET=				'INSERT INTO `chat` (`cby`) VALUES (?);',
TOUCH=				'UPDATE `chat` SET `uat`=NOW() WHERE id=?;',
POLL=				'SELECT * FROM `chat` WHERE id IN (?) AND `uat`>? AND `s`!=0;',

MAP_GET=			'SELECT `id`,`k`,`v1`,`v2` FROM `chatMap` WHERE `id`=?;',
MAP_GETS=			'SELECT `id`,`k`,`v1`,`v2` FROM `chatMap` WHERE `id` IN (?);',
MAP_GET_BY_KEY=		'SELECT `id`,`k`,`v1`,`v2` FROM `chatMap` WHERE `id`=? AND `k`=?;',
MAP_SET=			'INSERT INTO `chatMap` (`id`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `_id`=LAST_INSERT_ID(`_id`), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',
MAP_FIND_TEXT=		'SELECT `id` FROM `chatMap` WHERE `k`=? AND `v1`=?;',
MAP_FIND_INT=		'SELECT `id` FROM `chatMap` WHERE `k`=? AND `v2`=?;',

ERR_INVALID_INPUT=	{message:'INVALID INPUT'},

picoObj=require('pico/obj'),
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
	list(set,cb){
		client.query(GETS,[set],(err,chats)=>{
			if (err) return cb(err)
			this.map_gets(client.decodes(chats,hash,ENUM),(err,ret)=>{
				if (err) return cb(err)
				set.length=0
				set.push(...ret)
				cb(err,set)
			})
		})
	},
	get(chat,cb){
		if (!chat || !chat.id) return cb(ERR_INVALID_INPUT)
		client.query(GET,[chat.id],(err,chats)=>{
			if (err) return cb(err)
			this.map_get(client.decode(chats[0],hash,ENUM),(err,ret)=>{
				if(err) return cb(err)
				Object.assign(chat,ret)
				cb(null,chat)
			})
		})
	},
	gets(chats,cb){
		gets(this,chats,0,cb)
	},
	set(chat,by,cb){
		client.query(SET, [client.encode(chat,by,hash,INDEX,ENUM)], (err, result)=>{
			if (err) return cb(err)
			chat.id=result.insertId
			this.map_set(chat,by,(err)=>{
				cb(err, chat)
			})
		})
	},
	touch(chat,cb){
		client.query(TOUCH, [chat.id], cb)
	},
	poll(ids,date,cb){
		client.query(POLL,[ids,date],cb)
	},

	map_gets(chats,cb){
		if (!chats || !Array.isArray(chats)) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GETS,[picoObj.pluck(chats,'id')],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecodes(picoObj.group(rows,'id'),chats,hash,ENUM))
		})
	},
	map_get(chat,cb){
		if (!chat||!chat.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GET,[chat.id],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecode(rows,chat,hash,ENUM))
		})
	},
	map_getByKey(chat,key,cb){
		if (!chat||!chat.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GET_BY_KEY,[chat.id,hash.val(key)],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecode(rows,chat,hash,ENUM))
		})
	},
	map_set(chat,by,cb){
		client.query(MAP_SET, [client.mapEncode(chat,by,hash,INDEX,ENUM)], cb)
	},
	map_findText(key,value,cb){
		client.query(MAP_FIND_TEXT, [hash.val(key),value], cb)
	}
}
