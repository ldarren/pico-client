const
SEP=				'/',
MOD_STAT=			0x8000,
MOD_DIR=			0xC000,
MOD_LINK=			0xA000,
MOD_SAFE=			0x8400,	// password protected?
MOD_FREE=			0x8200,	// free seating?
MOD_G_R=			0x8040,
MOD_G_W=			0x8020,
MOD_G_X=			0x8010,
MOD_G_RX=			MOD_G_R  | MOD_G_X,
MOD_G_RWX=			MOD_G_RX | MOD_G_W,
MOD_O_R=			0x8044,
MOD_O_W=			0x8022,
MOD_O_X=			0x8011,
MOD_O_RX=			MOD_O_R  | MOD_O_X,
MOD_O_RWX=			MOD_O_RX | MOD_O_W,

INDEX=				[],
PRIVATE=			[],
SECRET=				[],
ENUM=				[],

FIND_ID=			'SELECT `id` FROM `dir` WHERE `url`=? AND `name`=? AND `s` & 0x8000;',
GET=				'SELECT * FROM `dir` WHERE `id`=? AND `s` & 0x8000;',
SET=				'INSERT INTO `dir` (`url`,`name`,`s`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `id`=LAST_INSERT_ID(`id`), `s`=VALUES(`s`), `uby`=VALUES(`cby`);',

USERMAP_SET=		'INSERT INTO `dirUserMap` (`id`,`userId`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `_id`=LAST_INSERT_ID(`_id`), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',

ERR_INVALID_INPUT=	'INVALID INPUT',

picoObj=			require('pico/obj'),
hash=				require('sql/hash'),
modBuf=				Buffer.alloc(2)

let client

module.exports={
	MOD:{
		STAT:	MOD_STAT,
		DIR:	MOD_DIR,
		LINK:	MOD_LINK,
		G_R:	MOD_G_R,
		G_W:	MOD_G_W,
		G_X:	MOD_G_X,
		G_RX:	MOD_G_RX,
		G_RWX:	MOD_G_RWX,
		O_R:	MOD_O_R,
		O_W:	MOD_O_W,
		O_X:	MOD_O_X,
		O_RX:	MOD_O_RX,
		O_RWX:	MOD_O_RWX
	},
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

	newUser(userId,by,cb){
		modBuf.writeUInt16LE(MOD_DIR|MOD_G_RX)
		client.query(SET,[[[SEP,userId,modBuf,by]]],cb)
	},
	newGroup(url,name,by,cb){
		modBuf.writeUInt16LE(MOD_DIR|MOD_G_RX)
		client.query(SET,[[[url.join(SEP),name,modBuf,by]]],(err,meta)=>{
			if (err) return cb(err)
			client.query(USERMAP_SET,[[[meta.insertId,by,,null,hash.val(role),by]]],cb)
		})
	},
	userJoin(url,name,userId,role,by,cb){
		client.query(FIND_ID,[SEP+url.join(SEP),name],(err,rows)=>{
			if (err) return cb(err)
			if (!rows.length) return cb(ERR_INVALID_INPUT)
			client.query(USERMAP_SET,[[[rows[0].id,userId,hash.val('role'),null,hash.val(role),by]]],cb)
		})
	}
}
