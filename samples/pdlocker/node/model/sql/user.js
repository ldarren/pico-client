var
INDEX=                  ['un','sess'],
GET =                   'SELECT * FROM `user` WHERE `id`=? AND `status`=1;',
GET_LIST =              'SELECT * FROM `user` WHERE `id` IN (?) AND `status`=1;',
FIND_BY_TIME =          'SELECT * FROM `user` WHERE `updatedAt` > ?;',
FIND_BY_TIMES =         'SELECT * FROM `user` WHERE `updatedAt` > ? AND `updatedAt` < ?;',
FIND_BY_UN =            'SELECT * FROM `user` WHERE `un` = ? AND status=1;',
FIND_BY_SESS =          'SELECT * FROM `user` WHERE `sess` = ? AND status=1;',
SET =                   'INSERT INTO `user` (`un`, `sess`, `createdBy`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `sess`=VALUES(`sess`), status=1;',
TOUCH =                 'UPDATE `user` SET `updatedBy`=?, `updatedAt`=NOW() WHERE `id`=? AND `status`=1;',
UNSET =                 'UPDATE `user` SET `status`=0, `updatedBy`=? WHERE `id`=?;',

MAP=                    'userMap',
MAP_GET =               'SELECT `userId`, `k`, `v` FROM ?? WHERE `userId`=?;',
MAP_GET_BY_KEY =        'SELECT `userId`, `k`, `v` FROM ?? WHERE `userId`=? AND `k`=?;',
MAP_GET_BY_KEYS =       'SELECT `userId`, `k`, `v` FROM ?? WHERE `userId`=? AND `k` IN (?);',
MAP_GET_MAT_BY_KEY =    'SELECT `userId`, `k`, `v` FROM ?? WHERE `userId` IN (?) AND `k`=?;',
MAP_GET_MAT_BY_KEYS =   'SELECT `userId`, `k`, `v` FROM ?? WHERE `userId` IN (?);',
MAP_FIND_BY_TIME =      'SELECT `userId`, `k`, `v` FROM ?? WHERE `userId`=? AND `updatedAt` > ?;',
MAP_SET =               'INSERT INTO ?? (`userId`, `k`, `v`, `createdBy`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v`=VALUES(`v`), `updatedBy`=VALUES(`createdBy`);',
MAP_UNSET =             'UPDATE ?? SET `status`=0, `updatedBy`=? WHERE `id`=?;',

LOCK_GET=               'SELECT `userId`, `lockId`, `k`, `v` FROM `userLock` WHERE `userId`=? AND `lockId`=? AND `k`=? AND `status`=1;',
LOCK_GET_LOCKS =        'SELECT `userId`, `lockId`, `k`, `v` FROM `userLock` WHERE `userId`=? AND `k`=? AND `status`=1;',
LOCK_GET_ALL =          'SELECT `userId`, `lockId`, `k`, `v` FROM `userLock` WHERE `userId`=? AND `status`=1;',
LOCK_GET_BY_REF =       'SELECT `userId`, `lockId`, `k`, `v` FROM `userLock` WHERE `lockId`=? AND `k`=? AND `status`=1;',
LOCK_FIND_BY_TIME =     'SELECT `userId`, `lockId`, `k`, `v` FROM `userLock` WHERE `userId`=? AND `updatedAt` > ? AND `status`=1;',
LOCK_SET =              'INSERT INTO `userLock` (`userId`, `lockId`, `k`, `v`, `createdBy`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v`=VALUES(`v`),`updatedBy`=VALUES(`createdBy`),`status`=1;',
LOCK_TOUCH =            'UPDATE `userLock` SET `updatedBy`=? WHERE `userId`=? AND `lockId`=? AND `k`=? AND `status`=1;',
LOCK_UPDATE=            'UPDATE `userLock` SET `v`=?,`updatedBy`=? WHERE `userId`=? AND `lockId`=? AND `k`=? AND `status`=1;',
LOCK_UNSET=             'UPDATE `userLock` SET `status`=0, `updatedBy`=? WHERE `userId`=? AND `lockId`=? AND `k`=?;',
LOCK_UNSET_BY_USER =    'UPDATE `userLock` SET `status`=0, `updatedBy`=? WHERE `userId` IN (?);',
LOCK_UNSET_BY_LOCK =    'UPDATE `userLock` SET `status`=0, `updatedBy`=? WHERE `lockId` IN (?);'

var
sc=require('pico/obj'),
hash=require('sql/hash'),
setMapTxt=function(params, cb){
    if (!params.length) return cb()
    client.query(MAP_SET, [MAP,params], cb)
},
setMapInt=function(){
    if (!params.length) return cb()
    client.query(MAP_SET, [MAP+'Int',params], cb)
},
setMap=function(id, obj, by, index, cb){
    var
    keys=Object.keys(obj),
    txt=[],
    num=[],
    arr,v

    for(var i=0,k; k=keys[i]; i++){
        if(index.indexOf(k)>-1)continue
        v=obj[k]
        switch(typeof v){
        case 'number': arr=num; break
        default: arr=txt; break
        }
        arr.push([id,hash.val(k),v,by])
    }
    setMapTxt(txt, function(err){
        if (err) return cb(err)
        setMapInt(num, cb)
    })
},
client

module.exports= {
    setup: function(context, cb){
        client=context.mainDb
        cb()
    },
    verify: function(user){
        return hash.verify(Object.keys(user), INDEX)
    },
    set: function(user, by, cb){
        var params=[]
        for(var i=0,k; k=INDEX[i]; i++){ params.push(user[k]) }
        params.push(by)
        client.query(SET, params, function(err, result){
            if (err) return cb(err)
            var userId=result.insertId
            setMap(userId, user, by, INDEX, function(err){
                if (err) return cb(err)
                user.id=userId
                return cb(null, user)
            })
        })
    },
    touch: function(id, by, cb){
        client.query(TOUCH, [by, id], cb)
    },
    remove: function(id, by, cb){
        client.query(UNSET, [by, id], cb)
    },
    get: function(id, cb){
        client.query(GET, [id], function(err, result){
            if (err) return cb(err)
            return cb(null, sc.replace(result, hash.keys(), 'type'))
        })
    },
    getType: function(type, cb){
        client.query(GET_TYPE, [hash.toVal(type)], function(err, result){
            if (err) return cb(err)
            return cb(null, sc.replace(result, hash.keys(), 'type'))
        })
    },
    getList: function(vals, cb){
        client.query(GET_LIST, [vals], function(err, result){
            if (err) return cb(err)
            return cb(null, sc.replace(result, hash.keys(), 'type'))
        })
    },
    getNew: function(at, cb){
        client.query(GET_NEW, [at], function(err, result){
            if (err) return cb(err)
            return cb(null, sc.replace(result, hash.keys(), 'type'))
        })
    },
    getTypeRange: function(type, from, to, cb){
        client.query(GET_TYPE_RANGE, [hash.toVal(type), from, to], function(err, result){
            if (err) return cb(err)
            return cb(null, sc.replace(result, hash.keys(), 'type'))
        })
    },
    getValid: function(vals, cb){
        client.query(GET_VALID, [vals], cb)
    }
}
