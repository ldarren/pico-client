var
INDEX=                  ['un','sess'],
PRIVATE=                ['un','pwd','sess'],
PRIVATE_SELF=           ['un','pwd'],
ENUM=                   ['os','role'],

GET =                   'SELECT * FROM `user` WHERE `id`=? AND `s`=1;',
GET_LIST =              'SELECT * FROM `user` WHERE `id` IN (?) AND `s`=1;',
FIND_BY_TIME =          'SELECT * FROM `user` WHERE `uat` > ?;',
FIND_BY_TIMES =         'SELECT * FROM `user` WHERE `uat` > ? AND `uat` < ?;',
FIND_BY_UN =            'SELECT * FROM `user` WHERE `un` = ? AND s=1;',
FIND_BY_SESS =          'SELECT * FROM `user` WHERE `sess` = ? AND s=1;',
SET =                   'INSERT INTO `user` (`un`, `sess`, `cby`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `sess`=VALUES(`sess`), s=1;',
TOUCH =                 'UPDATE `user` SET `uby`=?, `uat`=NOW() WHERE `id`=? AND `s`=1;',
UNSET =                 'UPDATE `user` SET `s`=0, `uby`=? WHERE `id`=?;',

MAP_GET =               'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId`=?;',
MAP_GET_BY_KEY =        'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId`=? AND `k`=?;',
MAP_GET_BY_KEYS =       'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId`=? AND `k` IN (?);',
MAP_GET_MAT_BY_KEY =    'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId` IN (?) AND `k`=?;',
MAP_GET_MAT_BY_KEYS =   'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId` IN (?);',
MAP_FIND_BY_TIME =      'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId`=? AND `uat` > ?;',
MAP_SET =               'INSERT INTO userMap (`userId`, `k`, `v1`, `v2`, `cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',
MAP_UNSET =             'UPDATE userMap SET `s`=0, `uby`=? WHERE `id`=?;',

LIST_GET =              'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId`=?;',
LIST_GET_BY_KEY =       'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId`=? AND `k`=?;',
LIST_GET_BY_KEYS =      'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId`=? AND `k` IN (?);',
LIST_GET_MAT_BY_KEY =   'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId` IN (?) AND `k`=?;',
LIST_GET_MAT_BY_KEYS =  'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId` IN (?);',
LIST_FIND_BY_TIME =     'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId`=? AND `uat` > ?;',
LIST_SET =              'INSERT INTO userList (`userId`, `k`, `v1`, `v2`, `cby`) VALUES ?;',
LIST_UNSET =            'UPDATE userList SET `s`=0, `uby`=? WHERE `id`=?;',
LIST_UPDATE=            'UPDATE userList SET `v1`=?, `v2`=?, `s`=1, `uby`=? WHERE `id`=?;',

REF1_GET=               'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `s`=1;',
REF1_GET_REF1S =        'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `k`=? AND `s`=1;',
REF1_GET_ALL =          'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `s`=1;',
REF1_GET_BY_REF =       'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `ref1Id`=? AND `k`=? AND `s`=1;',
REF1_FIND_BY_TIME =     'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `uat` > ? AND `s`=1;',
REF1_SET =              'INSERT INTO `userRef1` (`userId`, `ref1Id`, `k`, `v1`, `v2`, `cby`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`),`uby`=VALUES(`cby`),`s`=1;',
REF1_TOUCH =            'UPDATE `userRef1` SET `uby`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `s`=1;',
REF1_UPDATE=            'UPDATE `userRef1` SET `v1`=?, `v2`=?,`uby`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `s`=1;',
REF1_UNSET=             'UPDATE `userRef1` SET `s`=0, `uby`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=?;',
REF1_UNSETS=            'UPDATE `userRef1` SET `s`=0, `uby`=? WHERE `userId`=? AND `ref1Id`=?;',
REF1_UNSETSS=           'UPDATE `userRef1` SET `s`=0, `uby`=? WHERE `userId` IN (?);',
REF1_UNSET_BY_REF1 =    'UPDATE `userRef1` SET `s`=0, `uby`=? WHERE `ref1Id` IN (?);'

var
picoObj=require('pico/obj'),
hash=require('sql/hash'),
getMap=(id, user, cb)=>{
    if (!id) return cb()
    client.query(MAP_GET, [id], (err, rows)=>{
        if (err) return cb(err)
        for(var i=0,r,k; r=rows[i]; i++) {
			k=hash.key(r.k)
			if (-1===ENUM.indexOf(k)) user[k]=r.v1 || r.v2
			else user[k]=hash.key(r.v2)
		}
		cb(null, user)
    })
},
setMap=(id, obj, by, index, cb)=>{
    var arr=[]

    for(var i=0,keys=Object.keys(obj),key,k,v; key=keys[i]; i++){
        if(index.indexOf(key)>-1)continue
		k=hash.val(key)
        v=obj[key]
        if (!k || undefined===v) continue
		if (-1===ENUM.indexOf(key)){
			if(v.charAt) arr.push([id,k,v,null,by])
			else arr.push([id,k,null,v,by])
		}else{
			arr.push([id,k,null,hash.val(v),by])
        }
    }
	if (!arr.length) return cb()
    client.query(MAP_SET, [arr], cb)
},
getList=(id, user, cb)=>{
	if (!id) return cb()
    client.query(LIST_GET, [id], (err, rows)=>{
        if (err) return cb(err)
        for(var i=0,r,k,arr; r=rows[i]; i++) {
			k=hash.key(r.k)
			arr=user[k]||[]
			if (-1===ENUM.indexOf(k)) arr.push(r.v1 || r.v2)
			else arr.push(hash.key(r.v2))
			user[k]=arr
		}
		cb(null, user)
    })
},
setList=(id, key, list, by, index, cb)=>{
	if (!key || !list || !list.length) return cb()
    var
	arr=[],
	k=hash.val(key)	

    if(!k || index.indexOf(key)>-1) return cb()
    for(var i=0,v; v=list[i]; i++){
		if (undefined===v)continue
		if (-1===ENUM.indexOf(key)){
			if(v.charAt) arr.push([id,k,v,null,by])
			else arr.push([id,k,null,v,by])
		}else{
			arr.push([id,k,null,hash.val(v),by])
        }
    }
	if (!arr.length) return cb()
    client.query(LIST_SET, [arr], cb)
},
client

module.exports= {
    setup: (context, cb)=>{
        client=context.mainDB
        cb()
    },
    clean:(model)=>{
        for(var i=0,k; k=PRIVATE[i]; i++) delete model[k];
        return model
    },
    cleanForSelf:(model)=>{
        for(var i=0,k; k=PRIVATE_SELF[i]; i++) delete model[k];
        return model
    },
    verify: (user)=>{
        return hash.verify(Object.keys(user), INDEX)
    },
    get: (user, cb)=>{
        client.query(GET,[user.id],(err,users)=>{
            if (err) return cb(err)
			Object.assign(user,users[0])
            getMap(user.id, user, cb)
        })
    },
    set: (user, cb)=>{
        var
        params=[],
        by=user.cby
        for(var i=0,k; k=INDEX[i]; i++){ params.push(user[k]) }
        params.push(by)
        client.query(SET, [params], (err, result)=>{
            if (err) return cb(err)
            var id=result.insertId
            setMap(id, user, by, INDEX, (err)=>{
                if (err) return cb(err)
                user.id=id
                return cb(null, user)
            })
        })
    },
    findByUn: (un, cb)=>{
        client.query(FIND_BY_UN, [un], cb)
    },
    findBySess: (sess, cb)=>{
        client.query(FIND_BY_SESS, [sess], cb)
    },
    getMap: (userId, cb)=>{
        getMap(userId, {}, cb)
    },
	setMap: (userId,obj,cb)=>{
		setMap(userId,obj,userId,INDEX,cb)
	},
	getList: (userId,cb)=>{
		getList(userId,cb)
	},
	setList: (userId,key,list,by,cb)=>{
		setList(userId,key,list,by,INDEX,cb)
	}
}
