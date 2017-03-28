const
INDEX=				['dirId','topic','external'],
PRIVATE=			[],
SECRET=				[],
ENUM=				[],

GET=				'SELECT * FROM `chat` WHERE `id`=? AND `s`!=0;',
GETS=				'SELECT * FROM `chat` WHERE `id` IN (?) AND `s`!=0;',
SET=				'INSERT INTO `chat` (`dirId`,`topic`,`external`,`cby`) VALUES (?);',
FIND=				'SELECT * FROM `chat` WHERE `dirId`=? AND `external`=0 AND `s`!=0;',
FIND_EXTERNAL=		'SELECT * FROM `chat` WHERE `dirId`=? AND `external`=1 AND cby=? AND `s`!=0;',
TOUCH=				'UPDATE `chat` SET `uat`=NOW() WHERE id=?;',
POLL=				'SELECT * FROM `chat` WHERE id IN (?) AND `uat`>? AND `s`!=0;',

ERR_INVALID_INPUT=	{message:'INVALID INPUT'},

pObj=require('pico/obj'),
hash=require('sql/hash')

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
		client.query(GETS,[set],(err,rows)=>{
			if (err) return cb(err)
			set.length=0
			set.push(...rows)
			cb(err,set)
		})
	},
	get(chat,cb){
		if (!chat || !chat.id) return cb(ERR_INVALID_INPUT)
		client.query(GET,[chat.id],(err,rows)=>{
			if (err) return cb(err)
			const c=rows[0]
			Object.assign(chat,c)
			cb(null,c)
		})
	},
	set(chat,by,cb){
		client.query(SET, [client.encode(chat,by,hash,INDEX,ENUM)], (err, result)=>{
			if (err) return cb(err)
			chat.id=result.insertId
			cb(err, chat)
		})
	},
	find(dirId,cb){
		if (!dirId) return cb(ERR_INVALID_INPUT)
		client.query(FIND,[dirId],cb)
	},
	findExternal(dirId,cby,cb){
		if (!dirId) return cb(ERR_INVALID_INPUT)
		client.query(FIND_EXTERNAL,[dirId,cby],cb)
	},
	touch(chat,cb){
		client.query(TOUCH, [chat.id], cb)
	},
	poll(ids,date,cb){
		client.query(POLL,[ids,date],cb)
	}
}
