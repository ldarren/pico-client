var
INDEX=                  ['un','sess','role'],
PRIVATE=                ['un','pwd','sess'],
PRIVATE_SELF=           ['un','pwd'],
ENUM=                   ['os','role'],

GET =                   'SELECT * FROM `user` WHERE `id`=? AND `s`!=0;',
GETS =                  'SELECT * FROM `user` WHERE `id` IN (?) AND `s`!=0;',
FIND_BY_TIME =          'SELECT * FROM `user` WHERE `uat` > ?;',
FIND_BY_TIMES =         'SELECT * FROM `user` WHERE `uat` > ? AND `uat` < ?;',
FIND_BY_UN =            'SELECT * FROM `user` WHERE `un` = ? AND `s`!=0;',
FIND_BY_SESS =          'SELECT * FROM `user` WHERE `sess` = ? AND `s`!=0;',
FIND_BY_ROLE =          'SELECT * FROM `user` WHERE `role` = ? AND `s`!=0;',
SET =                   'INSERT INTO `user` (`un`, `sess`, `role`, `cby`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `sess`=VALUES(`sess`), `s`=1;',
TOUCH =                 'UPDATE `user` SET `uby`=?, `uat`=NOW() WHERE `id`=? AND `s`!=0;',
UNSET =                 'UPDATE `user` SET `s`=0, `uby`=? WHERE `id`=?;',

MAP_GET =               'SELECT `userId`, `k`, `v1`, `v2` FROM `userMap` WHERE `userId`=?;',
MAP_GETS =              'SELECT `userId`, `k`, `v1`, `v2` FROM `userMap` WHERE `userId` IN (?);',
MAP_GET_BY_KEY =        'SELECT `userId`, `k`, `v1`, `v2` FROM `userMap` WHERE `userId`=? AND `k`=?;',
MAP_GET_BY_KEYS =       'SELECT `userId`, `k`, `v1`, `v2` FROM `userMap` WHERE `userId`=? AND `k` IN (?);',
MAP_GET_MAT_BY_KEY =    'SELECT `userId`, `k`, `v1`, `v2` FROM `userMap` WHERE `userId` IN (?) AND `k`=?;',
MAP_GET_MAT_BY_KEYS =   'SELECT `userId`, `k`, `v1`, `v2` FROM `userMap` WHERE `userId` IN (?);',
MAP_FIND_BY_TIME =      'SELECT `userId`, `k`, `v1`, `v2` FROM `userMap` WHERE `userId`=? AND `uat` > ?;',
MAP_SET =               'INSERT INTO `userMap` (`userId`, `k`, `v1`, `v2`, `cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',
MAP_UNSET =             'UPDATE userMap SET `s`=0, `uby`=? WHERE `id`=?;',

LIST_GET_BY_ID =        'SELECT * FROM userList WHERE `id`=?;',
LIST_GET =              'SELECT * FROM userList WHERE `userId`=?;',
LIST_GET_BY_KEY =       'SELECT * FROM userList WHERE `userId`=? AND `k`=?;',
LIST_GET_BY_KEYS =      'SELECT * FROM userList WHERE `userId`=? AND `k` IN (?);',
LIST_GET_MAT_BY_KEY =   'SELECT * FROM userList WHERE `userId` IN (?) AND `k`=?;',
LIST_GET_MAT_BY_KEYS =  'SELECT * FROM userList WHERE `userId` IN (?);',
LIST_FIND_BY_TIME =     'SELECT * FROM userList WHERE `userId`=? AND `k`=? AND `uat` > ?;',
LIST_SET =              'INSERT INTO userList (`userId`, `k`, `v1`, `v2`, `cby`) VALUES ?;',
LIST_UNSET =            'UPDATE userList SET `s`=0, `uby`=? WHERE `id`=?;',
LIST_UPDATE=            'UPDATE userList SET `v1`=?, `v2`=?, `s`!=0, `uby`=? WHERE `id`=?;',

REF1_GET=               'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `s`!=0;',
REF1_GET_REF1S =        'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `k`=? AND `s`!=0;',
REF1_GET_ALL =          'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `s`!=0;',
REF1_GET_BY_REF =       'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `ref1Id`=? AND `k`=? AND `s`!=0;',
REF1_FIND_BY_TIME =     'SELECT `userId`, `ref1Id`, `k`, `v1`, `v2` FROM `userRef1` WHERE `userId`=? AND `uat` > ? AND `s`!=0;',
REF1_SET =              'INSERT INTO `userRef1` (`userId`, `ref1Id`, `k`, `v1`, `v2`, `cby`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`),`uby`=VALUES(`cby`),`s`!=0;',
REF1_TOUCH =            'UPDATE `userRef1` SET `uby`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `s`!=0;',
REF1_UPDATE=            'UPDATE `userRef1` SET `v1`=?, `v2`=?,`uby`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `s`!=0;',
REF1_UNSET=             'UPDATE `userRef1` SET `s`=0, `uby`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=?;',
REF1_UNSETS=            'UPDATE `userRef1` SET `s`=0, `uby`=? WHERE `userId`=? AND `ref1Id`=?;',
REF1_UNSETSS=           'UPDATE `userRef1` SET `s`=0, `uby`=? WHERE `userId` IN (?);',
REF1_UNSET_BY_REF1 =    'UPDATE `userRef1` SET `s`=0, `uby`=? WHERE `ref1Id` IN (?);',

ERR_INVALID_INPUT = 'INVALID INPUT',

picoObj=require('pico/obj'),
hash=require('sql/hash'),
client

module.exports= {
    setup: function(context, cb){
        client=context.mainDB
        cb()
    },
    clean:function(model){
        for(var i=0,k; k=PRIVATE[i]; i++) delete model[k];
        return model
    },
    cleanList:function(list){
        for(var i=0,l; l=list[i]; i++) list[i]=this.clean(l)
        return list 
    },
    cleanForSelf:function(model){
        for(var i=0,k; k=PRIVATE_SELF[i]; i++) delete model[k];
        return model
    },
    verify: function(user){
        return hash.verify(Object.keys(user), INDEX)
    },
    get: function(user, cb){
		if (!user || !user.id) return cb(ERR_INVALID_INPUT)
        client.query(GET,[user.id],(err,users)=>{
            if (err) return cb(err)
			this.map_get(client.decode(users[0],hash,ENUM),cb)
        })
    },
    gets:function(ids,cb){
        if (!ids || !ids.length) return cb(ERR_INVALID_INPUT)
        client.query(GETS,[ids],(err,rows)=>{
            if (err) return cb(err)
			this.map_gets(client.decodes(rows,hash,ENUM),cb)
        })      
    },
    set: function(user, by, cb){
        client.query(SET, [client.encode(user,by,hash,INDEX,ENUM)], (err, result)=>{
            if (err) return cb(err)
            user.id=result.insertId
			this.map_set(user,by,(err)=>{
                cb(err, user)
            })
        })
    },
    findByUn: function(un, cb){
        client.query(FIND_BY_UN, [un], (err,rows)=>{
            if (err) return cb(err)
			cb(null,client.decodes(rows,hash,ENUM))
		})
    },
    findBySess: function(sess, cb){
        client.query(FIND_BY_SESS, [sess], (err,rows)=>{
            if (err) return cb(err)
			cb(null,client.decodes(rows,hash,ENUM))
		})
    },
    findByRole: function(role, cb){
        client.query(FIND_BY_ROLE, [hash.val(role)], (err,rows)=>{
            if (err) return cb(err)
			cb(null,client.decodes(rows,hash,ENUM))
		})
    },
    map_get: function(user, cb){
		if (!user.id) return cb(ERR_INVALID_INPUT)
		client.query(MAP_GET, [user.id], (err, rows)=>{
			if (err) return cb(err)
			cb(null, client.mapDecode(rows, user, hash, ENUM))
		})
    },
	map_gets: function(users, cb){
        if (!users.length) return cb(null, users)
		client.query(MAP_GETS, [picoObj.pluck(users,'id')], (err, rows)=>{
			if (err) return cb(err)
			cb(null, client.mapDecodes(picoObj.group(rows,'userId'),users,hash,ENUM))
		})
	},
	map_set: function(user,by,cb){
		client.query(MAP_SET, [client.mapEncode(user, by, hash, INDEX, ENUM)], cb)
	},
	list_getByKey: function(userId,key,cb){
		if (!userId) return cb(ERR_INVALID_INPUT)
		client.query(LIST_GET, [userId,hash.key(key)], (err, rows)=>{
			if (err) return cb(err)
			cb(null, client.listDecode(rows, key, hash, ENUM))
		})
	},
	list_getById: function(rowId,key,cb){
		if (!rowId) return cb(ERR_INVALID_INPUT)
		client.query(LIST_GET_BY_ID,[rowId], (err, rows)=>{
			if (err) return cb(err)
			cb(null, client.listDecode(rows, key, hash, ENUM))
		})
	},
	list_set: function(userId,key,list,by,cb){
		client.query(LIST_SET, [client.listEncode(userId,key,list,by,hash,INDEX,ENUM)], cb)
	},
    list_findByTime:function(userId,key,time,cb){
        client.query(LIST_FIND_BY_TIME, [userId,hash.val(key),time],(err,rows)=>{
            if (err) return cb(err)
			cb(null, client.listDecode(rows, key, hash, ENUM))
        })
    }
}
