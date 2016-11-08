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

INDEX=				['grp','name'],
PRIVATE=			['$private','log','applicant','banned'],
SECRET=				[],
ENUM=				['role'],

SET=				'INSERT INTO `dir` (`grp`,`name`,`s`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `id`=LAST_INSERT_ID(`id`), `s`=VALUES(`s`), `uby`=VALUES(`cby`);',
GET=				'SELECT * FROM `dir` WHERE `id`=? AND `s` & 0x8000;',
FIND_ID=			'SELECT `id`, `s` FROM `dir` WHERE `grp`=? AND `name`=? AND `s` & 0x8000;',
FILTER=				'SELECT `id`, `s` FROM `dir` WHERE `id` IN (?) AND ((`grp`=? AND `name`=?) OR `grp` LIKE ?);',
LAST=				'SELECT * FROM `dir` WHERE `id` IN (?) AND `uat`>?;',

MAP_SET=			'INSERT INTO `dirMap` (`id`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `_id`=LAST_INSERT_ID(`_id`), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',
MAP_GET=			'SELECT `id`,`k`,`v1`,`v2` FROM `dirMap` WHERE `id`=? AND `k`=?;',
MAP_GETS=			'SELECT `id`,`k`,`v1`,`v2` FROM `dirMap` WHERE `id`=?;',
MAP_GET_LIST=		'SELECT `id`,`k`,`v1`,`v2` FROM `dirMap` WHERE `id` IN (?) AND `k`=?;',
MAP_GETS_LIST=		'SELECT `id`,`k`,`v1`,`v2` FROM `dirMap` WHERE `id` IN (?);',
MAP_LAST=			'SELECT `id`,`k`,`v1`,`v2`,`uat` FROM `dirMap` WHERE `id` IN (?) AND `uat`>?;',

USERMAP_SET=		'INSERT INTO `dirUserMap` (`id`,`userId`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `_id`=LAST_INSERT_ID(`_id`), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',
USERMAP_GET=		'SELECT `id`,`userId`,`k`,`v1`,`v2` FROM `dirUserMap` WHERE `id`=? AND `userId`=? AND `k`=?;',
USERMAP_FIND_ID=	'SELECT `id`,`userId`,`k`,`v1`,`v2` FROM `dirUserMap` WHERE `userId`=? AND `k`=?;',
USERMAP_TOUCH=		'UPDATE `dirUserMap` SET `uat`=NOW() WHERE `id`=? AND `k`=?;',
USERMAP_POLL=		'SELECT `id`,`userId`,`k`,`v1`,`v2`,`uat` FROM `dirUserMap` WHERE `userId`=? AND `k`=? AND `uat`>?;',
USERMAP_LAST=		'SELECT `id`,`userId`,`k`,`v1`,`v2`,`uat` FROM `dirUserMap` WHERE `id` IN (?) `userId`=? AND `uat`>?;',

USERLIST_LAST=		'SELECT `id`,`userId`,`k`,`v1`,`v2`,`uat` FROM `dirUserList` WHERE `id` IN (?) `userId`=? AND `uat`>?;',

ERR_INVALID_INPUT=	{message:'INVALID INPUT'},

pObj=				require('pico/obj'),
hash=				require('sql/hash'),
modBuf=				Buffer.alloc(2),
value=function(val){
	let ret=[]
	if (Number.isFinite(val)){
		ret[1]=val
	}else{
		if (~ENUM.indexOf(val)) ret[0]=val.toString()
		else ret[1]=hash.val(val)
	}
	return ret
},
dirname=function(grp){
	if (Array.isArray(grp)) return grp.join(SEP)
	return grp
},
up=function(grp){
	grp=grp||SEP
	let i=grp.lastIndexOf(SEP)
	return [grp.substr(0,i),grp.substr(i+1)]
}

let client,ROLE

module.exports={
	MOD:{
		STAT:	MOD_STAT,
		DIR:	MOD_DIR,
		LINK:	MOD_LINK,
		SAFE:	MOD_SAFE,
		FREE:	MOD_FREE,
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
		ROLE=hash.val('role')
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

	set(grp,name,mod,by,cb){
		modBuf.writeUInt16LE(MOD_DIR|MOD_G_RX)
		client.query(SET,[[[dirname(grp),name,modBuf,by]]],cb)
	},
	findId(grp,cb){
		client.query(FIND_ID,[...up(dirname(grp))],cb)
	},
	filter(dirs,grp,cb){
		let g=dirname(grp)
		client.query(FILTER,[pObj.pluck(dirs,'id'),...up(g),g+'%'],(err,rows)=>{
			if (err) return cb(err)
			for(let i=dirs.length-1,d,j,r; d=dirs[i]; i--){
				for(j=0; r=rows[j]; j++){
					d.s=r.s;
					break
				}
				if (!d.s) dirs.splice(i,1)
			}
			cb(null,dirs)
		})
	},

	map_set(id,key,val,by,cb){
		const [v1,v2]=value(val)
		client.query(MAP_SET,[[[id,hash.val(key),v1,v2,by]]],cb)
	},
	map_getList(dirs,key,cb){
		client.query(MAP_GET_LIST,[pObj.pluck(dirs,'id'),hash.val(key)],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecodes(rows,dirs,hash,ENUM))
		})
	},

	usermap_set(id,userId,key,val,by,cb){
		const [v1,v2]=value(val)
		client.query(USERMAP_SET,[[[id,userId,hash.val(key),v1,v2,by]]],cb)
	},
	usermap_get(){
	},
	usermap_findId(userId,key,cb){
		client.query(USERMAP_FIND_ID,[userId,hash.val(key)],(err,rows)=>{
			if (err) return cb(err)
			let outputs=[]
			for(let i=0,r; r=rows[i]; i++) outputs.push({id:r.id});
			cb(null, client.mapDecodes(rows,outputs,hash,ENUM))
		})
	},

	touch(id,cb){
		client.query(USERMAP_TOUCH,[id,ROLE],cb)
	},
	poll(userId,uat,cb){
		client.query(USERMAP_POLL,[userId,ROLE,uat],(err,rows)=>{
			if (err) return cb(err)
			let outputs=[]
			for(let i=0,r; r=rows[i]; i++) outputs.push({id:r.id});
			cb(null, client.mapDecodes(rows,outputs,hash,ENUM))
		})
	}
}
