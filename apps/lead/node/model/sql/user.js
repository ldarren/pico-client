var
INDEX=                  ['un','sess'],
PRIVATE=                ['pwd'],
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
MAP_SET =               'INSERT INTO ?? (`userId`, `k`, `v`, `createdBy`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v`=VALUES(`v`), `updatedBy`=VALUES(`createdBy`);',
MAP_UNSET =             'UPDATE ?? SET `status`=0, `updatedBy`=? WHERE `id`=?;',

REF1_GET=               'SELECT `userId`, `ref1Id`, `k`, `v` FROM `userRef1` WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_GET_REF1S =        'SELECT `userId`, `ref1Id`, `k`, `v` FROM `userRef1` WHERE `userId`=? AND `k`=? AND `status`=1;',
REF1_GET_ALL =          'SELECT `userId`, `ref1Id`, `k`, `v` FROM `userRef1` WHERE `userId`=? AND `status`=1;',
REF1_GET_BY_REF =       'SELECT `userId`, `ref1Id`, `k`, `v` FROM `userRef1` WHERE `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_FIND_BY_TIME =     'SELECT `userId`, `ref1Id`, `k`, `v` FROM `userRef1` WHERE `userId`=? AND `updatedAt` > ? AND `status`=1;',
REF1_SET =              'INSERT INTO `userRef1` (`userId`, `ref1Id`, `k`, `v`, `createdBy`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v`=VALUES(`v`),`updatedBy`=VALUES(`createdBy`),`status`=1;',
REF1_TOUCH =            'UPDATE `userRef1` SET `updatedBy`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_UPDATE=            'UPDATE `userRef1` SET `v`=?,`updatedBy`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_UNSET=             'UPDATE `userRef1` SET `status`=0, `updatedBy`=? WHERE `userId`=? AND `ref1Id`=? AND `k`=?;',
REF1_UNSETS=            'UPDATE `userRef1` SET `status`=0, `updatedBy`=? WHERE `userId`=? AND `ref1Id`=?;',
REF1_UNSETSS=           'UPDATE `userRef1` SET `status`=0, `updatedBy`=? WHERE `userId` IN (?);',
REF1_UNSET_BY_REF1 =    'UPDATE `userRef1` SET `status`=0, `updatedBy`=? WHERE `ref1Id` IN (?);'

var
picoObj=require('pico/obj'),
hash=require('sql/hash'),
getMapTxt=function(id, cb){
    if (!id) return cb()
    client.query(MAP_GET, [MAP,id], cb)
},
getMapInt=function(id, cb){
    if (!id) return cb()
    client.query(MAP_GET, [MAP+'Int',id], cb)
},
getMap=function(id, user, cb){
console.log('getMap',id,user)
    var i,r
    getMapTxt(id, (err, txt)=>{
console.log('getMapTxt',err,txt)
        if (err) return cb(err)
        for(i=0; r=txt[i]; i++) user[hash.key(r.k)]=r.v
        getMapInt(id, (err, num)=>{
console.log('getMapInt',err,num)
            if (err) return cb(err)
            for(i=0; r=txt[i]; i++) user[hash.key(r.k)]=r.v
            cb(null, user)
        })
    })
},
setMapTxt=function(params, cb){
    if (!params.length) return cb()
    client.query(MAP_SET, [MAP,params], cb)
},
setMapInt=function(params, cb){
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
        if (!v) continue
        switch(typeof v){
        case 'number': arr=num; break
        default: arr=txt; break
        }
        arr.push([id,hash.val(k),v,by])
    }
    setMapTxt(txt, (err)=>{
        if (err) return cb(err)
        setMapInt(num, cb)
    })
},
client

module.exports= {
    setup: function(context, cb){
        client=context.mainDB
        cb()
    },
    clean:function(model){
        for(var i=0,k; k=PRIVATE[i]; i++){
            delete model[k]
        }
        return model
    },
    verify: function(user){
        return hash.verify(Object.keys(user), INDEX)
    },
    get: function(userId, cb){
        client.query(GET,[userId],(err,user)=>{
            if (err) return cb(err)
            getMap(userId, user, cb)
        })
    },
    set: function(user, cb){
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
    findByUn: function(un, cb){
        client.query(FIND_BY_UN, [un], cb)
    },
    getMap: function(userId, cb){
        client.query(MAP_GET,[MAP, userId], (err, user)=>{
            if (err) return cb(err)
            client.query(MAP_GET, [MAP+'Int', userId], (err, num)=>{
                if (err) return cb(err)
                cb(null, hash.replace(user, num))
            })
        })
    }
}
