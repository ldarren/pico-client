const
INDEX=				['dirId','topic'],
PRIVATE=			[],
SECRET=				[],
ENUM=				[],

GET=				'SELECT * FROM `chat` WHERE `id`=? AND `s`!=0;',
GETS=				'SELECT * FROM `chat` WHERE `id` IN (?) AND `s`!=0;',
SET=				'INSERT INTO `chat` (`cby`) VALUES (?);',
TOUCH=				'UPDATE `chat` SET `uat`=NOW() WHERE id=?;',
POLL=				'SELECT * FROM `chat` WHERE id IN (?) AND `uat`>? AND `s`!=0;',

ERR_INVALID_INPUT=	{message:'INVALID INPUT'},

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
	list(set,cb){
		client.query(GETS,[set],(err,chats)=>{
			if (err) return cb(err)
			set.length=0
			set.push(...chats)
			cb(err,set)
		})
	},
	get(chat,cb){
		if (!chat || !chat.id) return cb(ERR_INVALID_INPUT)
		client.query(GET,[chat.id],(err,chats)=>{
			if (err) return cb(err)
			cb(null,chats[0])
		})
	},
	gets(chats,cb){
		gets(this,chats,0,cb)
	},
	set(chat,by,cb){
		client.query(SET, [client.encode(chat,by,hash,INDEX,ENUM)], (err, result)=>{
			if (err) return cb(err)
			chat.id=result.insertId
			cb(err, chat)
		})
	},
	find(dirId,cb){
		if (!chat || !chat.id) return cb(ERR_INVALID_INPUT)
		client.query(FIND,[dirId,0],(err,chats)=>{
			if (err) return cb(err)
			cb(null,chats[0])
		})
	},
	findExternal(dirId,cby,cb){
		if (!chat || !chat.id) return cb(ERR_INVALID_INPUT)
		client.query(FIND_EXTERNAL,[dirId,1,cby],(err,chats)=>{
			if (err) return cb(err)
			cb(null,chats[0])
		})
	},
	touch(chat,cb){
		client.query(TOUCH, [chat.id], cb)
	},
	poll(ids,date,cb){
		client.query(POLL,[ids,date],cb)
	}
}
