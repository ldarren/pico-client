const
SEP=				'/',
MOD_DIR=			0x4000,
MOD_LINK=			0x2000,
MOD_FREE=			0x0200,	// free seating?
MOD_G_R=			0x0040,
MOD_G_W=			0x0020,
MOD_G_X=			0x0010,
MOD_G_RX=			MOD_G_R  | MOD_G_X,
MOD_G_RWX=			MOD_G_RX | MOD_G_W,
MOD_O_R=			0x0044,
MOD_O_W=			0x0022,
MOD_O_X=			0x0011,
MOD_O_RX=			MOD_O_R  | MOD_O_X,
MOD_O_RWX=			MOD_O_RX | MOD_O_W,

INDEX=				['grp','name'],
PRIVATE=			['$private','log','applicant','banned'],
SECRET=				[],
ENUM=				['role'],

SET=				'INSERT INTO `dir` (`grp`,`name`,`s`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `s`=VALUES(`s`), `uby`=VALUES(`cby`);',
GET=				'SELECT * FROM `dir` WHERE `id`=? AND `s` != 0;',
FIND_ID=			'SELECT `id`, `s` FROM `dir` WHERE `grp`=? AND `name`=? AND `s` != 0;',
FIND_NAMES=			'SELECT * FROM `dir` WHERE `grp`=? AND `s` != 0;',
FILTER=				'SELECT `id`, `s` FROM `dir` WHERE `id` IN (?) AND ((`grp`=? AND `name`=?) OR `grp` LIKE ?);',
LAST=				'SELECT * FROM `dir` WHERE `id` IN (?) AND `uat`>?;',

MAP_SET=			'INSERT INTO `dirMap` (`id`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',
MAP_GET=			'SELECT `id`,`k`,`v1`,`v2` FROM `dirMap` WHERE `id`=? AND `k`=?;',
MAP_GET_ALL=		'SELECT `id`,`k`,`v1`,`v2` FROM `dirMap` WHERE `id`=?;',
MAP_GET_LIST=		'SELECT `id`,`k`,`v1`,`v2` FROM `dirMap` WHERE `id` IN (?) AND `k`=?;',
MAP_GETS_LIST=		'SELECT `id`,`k`,`v1`,`v2` FROM `dirMap` WHERE `id` IN (?);',
MAP_LAST=			'SELECT `id`,`k`,`v1`,`v2`,`uat` FROM `dirMap` WHERE `id` IN (?) AND `uat`>?;',

USERMAP_SET=		'INSERT INTO `dirUserMap` (`id`,`userId`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',
USERMAP_GET=		'SELECT `id`,`userId`,`k`,`v1`,`v2` FROM `dirUserMap` WHERE `id`=? AND `userId`=? AND `k`=?;',
USERMAP_GETS=		'SELECT `id`,`userId`,`k`,`v1`,`v2` FROM `dirUserMap` WHERE `id`=? AND `k`=?;',
USERMAP_FIND_ID=	'SELECT `id`,`userId`,`k`,`v1`,`v2` FROM `dirUserMap` WHERE `userId`=? AND `k`=?;',
USERMAP_TOUCH=		'UPDATE `dirUserMap` SET `uat`=NOW() WHERE `id`=? AND `k`=?;',
USERMAP_POLL=		'SELECT `id`,`uat` FROM `dirUserMap` WHERE `userId`=? AND `k`=? AND `uat`>?;',
USERMAP_LAST=		'SELECT `id`,`userId`,`k`,`v1`,`v2`,`uat` FROM `dirUserMap` WHERE `id` IN (?) AND `userId`=? AND `uat`>?;',

USERLIST_LAST=		'SELECT `id`,`userId`,`k`,`v1`,`v2`,`uat` FROM `dirUserList` WHERE `id` IN (?) `userId`=? AND `uat`>?;',

ENTITYMAP_SET=		'INSERT INTO `dirEntityMap` (`id`,`entityId`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',
ENTITYMAP_FIND_ID=	'SELECT `id`,`entityId`,`k`,`v1`,`v2` FROM `dirEntityMap` WHERE `entityId`=? AND `k`=?;',
ENTITYMAP_FIND_EID=	'SELECT `id`,`entityId`,`k`,`v1`,`v2` FROM `dirEntityMap` WHERE `id` IN (?) AND `k`=?;',

ERR_INVALID_INPUT=	{message:'INVALID INPUT'},

pObj=				require('pico/obj'),
hash=				require('sql/hash'),
path=				pico.import('path'),
Max=				Math.max,
modBuf=				Buffer.alloc(2),
value=function(val){
	const ret=[]
	if (Number.isFinite(val)){
		ret[1]=val
	}else{
		if (~ENUM.indexOf(val)) ret[0]=val.toString()
		else ret[1]=hash.val(val)
	}
	return ret
},
join=function(grp){
	return Array.isArray(grp) ? path.join(...grp) : grp
},
up=function(grp){
	if (!grp || SEP === grp) return [SEP,'']
	const i=grp.lastIndexOf(SEP)
	return [grp.substr(0,i),grp.substr(i+1)]
}

let client,ROLE

module.exports={
	MOD:{
		DIR:	MOD_DIR,
		LINK:	MOD_LINK,
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
	join,
	up,
	setup(context,cb){
		client=context.mainDB
		ROLE=hash.val('role')
		cb()
	},
    clean(model){
		let s=model.s
		if (s) model.s=s.readUInt16LE()
        for(let i=0,k; k=PRIVATE[i]; i++) delete model[k];
        return model
    },
    cleanList(list){
        for(let i=0,l; l=list[i]; i++) list[i]=this.clean(l)
        return list
    },
    cleanSecret(model){
		let s=model.s
		if (s) model.s=s.readUInt16LE()
        for(let i=0,k; k=SECRET[i]; i++) delete model[k];
        return model
    },

	set(grp,name,mod,by,cb){
		modBuf.writeUInt16LE(mod)
		client.query(SET,[[[join(grp),name,modBuf,by]]],cb)
	},
	get(dir,cb){
		if (!dir || !dir.id) return cb(ERR_INVALID_INPUT)
		client.query(GET,[dir.id],(err,dirs)=>{
			if (err) return cb(err)
			this.map_getAll(client.decode(dirs[0],hash,ENUM),(err,ret)=>{
				if(err) return cb(err)
				Object.assign(dir,ret)
				cb(null,dir)
			})
		})
	},
	getOnly(dir,cb){
		client.query(GET,[dir.id],cb)
	},
	findId(grp,cb){
console.log(client.format(FIND_ID,[...up(join(grp))]))
		client.query(FIND_ID,[...up(join(grp))],cb)
	},
	findNames(grp,cb){
		client.query(FIND_NAMES,[join(grp)],cb)
	},
	filter(dirs,cwd,cb){
		let g=join(cwd)
		if (!g) return cb(null,dirs)
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
	last(ids,userId,uat,cb){
		client.query(LAST, [ids,uat], (err,rows)=>{
			if (err) return cb(err)
			const dirs=client.decodes(rows,hash,ENUM)
			client.query(MAP_LAST, [ids,uat], (err,rows)=>{
				if (err) return cb(err)
				client.mapDecodes(rows,dirs,hash,ENUM)
				client.query(USERMAP_LAST, [ids,userId,uat], (err,rows)=>{
					if (err) return cb(err)
					cb(null,client.mapDecodes(rows,dirs,hash,ENUM))
				})
			})
		})
	},

	map_set(id,key,val,by,cb){
		const [v1,v2]=value(val)
		client.query(MAP_SET,[[[id,hash.val(key),v1,v2,by]]],cb)
	},
	map_getAll(dir,cb){
		if (!dir||!dir.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GET_ALL,[dir.id],(err,rows)=>{
			if (err) return cb(err)
			cb(null,client.mapDecode(rows,dir,hash,ENUM))
		})
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
	usermap_gets(id,key,cb){
		client.query(USERMAP_GETS,[id,hash.val(key)],cb)
	},
	usermap_findId(userId,key,cb){
		client.query(USERMAP_FIND_ID,[userId,hash.val(key)],cb)
	},

	entitymap_set(id,entityId,key,val,by,cb){
		const [v1,v2]=value(val)
		client.query(ENTITYMAP_SET,[[[id,entityId,hash.val(key),v1,v2,by]]],cb)
	},
	entityMap_findId(entityId,key,cb){
		client.query(ENTITYMAP_FIND_ID,[entityId,hash.val(key)],cb)
	},
	entityMap_findEntityIds(ids,key,cb){
		client.query(ENTITYMAP_FIND_EID,[ids,hash.val(key)],cb)
	},

	touch(id,cb){
		client.query(USERMAP_TOUCH,[id,ROLE],cb)
	},
	poll(userId,uat,cb){
		client.query(USERMAP_POLL,[userId,ROLE,uat],(err,rows)=>{
			if (err) return cb(err)
			cb(err, rows, Max(...pObj.pluck(rows,'uat'),uat))
		})
	}
}
