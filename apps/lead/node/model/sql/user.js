var
INDEX=                  ['un','sess'],
PRIVATE=                ['un','pwd','sess'],
PRIVATE_SELF=           ['un','pwd'],
ENUM=                   ['os'],

GET =                   'SELECT * FROM `user` WHERE `id`=? AND `status`=1;',
GET_LIST =              'SELECT * FROM `user` WHERE `id` IN (?) AND `status`=1;',
FIND_BY_TIME =          'SELECT * FROM `user` WHERE `updatedAt` > ?;',
FIND_BY_TIMES =         'SELECT * FROM `user` WHERE `updatedAt` > ? AND `updatedAt` < ?;',
FIND_BY_UN =            'SELECT * FROM `user` WHERE `un` = ? AND status=1;',
FIND_BY_SESS =          'SELECT * FROM `user` WHERE `sess` = ? AND status=1;',
SET =                   'INSERT INTO `user` (`un`, `sess`, `createdBy`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `sess`=VALUES(`sess`), status=1;',
TOUCH =                 'UPDATE `user` SET `updatedBy`=?, `updatedAt`=NOW() WHERE `id`=? AND `status`=1;',
UNSET =                 'UPDATE `user` SET `status`=0, `updatedBy`=? WHERE `id`=?;',

MAP_GET =               'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId`=?;',
MAP_GET_BY_KEY =        'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId`=? AND `k`=?;',
MAP_GET_BY_KEYS =       'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId`=? AND `k` IN (?);',
MAP_GET_MAT_BY_KEY =    'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId` IN (?) AND `k`=?;',
MAP_GET_MAT_BY_KEYS =   'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId` IN (?);',
MAP_FIND_BY_TIME =      'SELECT `userId`, `k`, `v1`, `v2` FROM userMap WHERE `userId`=? AND `updatedAt` > ?;',
MAP_SET =               'INSERT INTO userMap (`userId`, `k`, `v1`, `v2`, `createdBy`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `updatedBy`=VALUES(`createdBy`);',
MAP_UNSET =             'UPDATE userMap SET `status`=0, `updatedBy`=? WHERE `id`=?;',

LIST_GET =              'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId`=?;',
LIST_GET_BY_KEY =       'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId`=? AND `k`=?;',
LIST_GET_BY_KEYS =      'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId`=? AND `k` IN (?);',
LIST_GET_MAT_BY_KEY =   'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId` IN (?) AND `k`=?;',
LIST_GET_MAT_BY_KEYS =  'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId` IN (?);',
LIST_FIND_BY_TIME =     'SELECT `userId`, `k`, `v1`, `v2` FROM userList WHERE `userId`=? AND `updatedAt` > ?;',
LIST_SET =              'INSERT INTO userList (`userId`, `k`, `v1`, `v2`, `createdBy`) VALUES ?;',
LIST_UNSET =            'UPDATE userList SET `status`=0, `updatedBy`=? WHERE `id`=?;',
LIST_UPDATE=            'UPDATE userList SET `v1`=?, `v2`=?, `status`=1, `updatedBy`=? WHERE `id`=?;',

REF1_GET=               'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_GET_REF1S =        'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `k`=? AND `status`=1;',
REF1_GET_ALL =          'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `status`=1;',
REF1_GET_BY_REF =       'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_FIND_BY_TIME =     'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `updatedAt` > ? AND `status`=1;',
REF1_SET =              'INSERT INTO `userRef1` (`userId`, `ref1Id`, `k`, `v1`, `v2`, `createdBy`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`),`updatedBy`=VALUES(`createdBy`),`status`=1;',
REF1_TOUCH =            'UPDATE `userRef1` SET `updatedBy`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_UPDATE=            'UPDATE `userRef1` SET `v1`=?, `v2`=?,`updatedBy`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_UNSET=             'UPDATE `userRef1` SET `status`=0, `updatedBy`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=?;',
REF1_UNSETS=            'UPDATE `userRef1` SET `status`=0, `updatedBy`=? WHERE `userId`=? AND `ref1Id`=?;',
REF1_UNSETSS=           'UPDATE `userRef1` SET `status`=0, `updatedBy`=? WHERE `userId` IN (?);',
REF1_UNSET_BY_REF1 =    'UPDATE `userRef1` SET `status`=0, `updatedBy`=? WHERE `ref1Id` IN (?);'

var
picoObj=require('pico/obj'),
hash=require('sql/hash'),
getMap=(id, user, cb)=>{
    if (!id) return cb()
    var i,r
    client.query(MAP_GET, [id], (err, rows)=>{
        if (err) return cb(err)
        for(i=0; r=rows[i]; i++) user[hash.key(r.k)]=r.v1 || r.v2
		cb(null, user)
    })
},
setMap=(id, obj, by, index, cb)=>{
    var
    keys=Object.keys(obj),
    arr=[],
    k,v

    for(var i=0,key; key=keys[i]; i++){
        if(index.indexOf(key)>-1)continue
		k=hash.val(key)
        v=obj[k]
        if (!k || undefined===v) continue
        switch(typeof v){
        case 'number': arr.push([id,k,null,v,by]); break
        default: arr.push([id,k,v,null,by]); break
        }
    }
	if (!arr.length) return cb()
    client.query(MAP_SET, [arr], (err,rows)=>{
		cb(err,rows)
	})
},
getList=(id, user, cb)=>{
	if (!id) return cb()
    var i,r
    client.query(LIST_GET, [id], (err, txt)=>{
        if (err) return cb(err)
        for(i=0; r=txt[i]; i++) user[hash.key(r.k)]=r.v1 || r.v2
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
        switch(typeof v){
        case 'number': arr.push([id,k,null,v,by]); break
        default: arr.push([id,k,v,null,by]); break
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
        by=user.createdBy
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
	setList: (userId,key,list,cb)=>{
		setList(userId,key,list,cb)
	}
}
