var
INDEX=                  ['userId'],
PRIVATE=                [],
ENUM=                   [],

GET =                   'SELECT * FROM `case` WHERE `id`=? AND `s`=1;',
SET =                   'INSERT INTO `case` (`userId`, `name`, `cby`) VALUES (?);',
FIND_BY_NAME =          'SELECT * FROM `case` WHERE `userId`=? AND `name`=? AND `s`=1;',

MAP_GET =               'SELECT `caseId`, `k`, `v1`, `v2` FROM caseMap WHERE `caseId`=?;',
MAP_SET =               'INSERT INTO caseMap (`caseId`, `k`, `v1`, `v2`, `cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',

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
    get: function(lock, cb){
        if (!lock || !lock.id) return cb(ERR_INVALID_INPUT)
        client.query(GET,[lock.id],(err,rows)=>{
            if (err) return cb(err)
            Object.assign(lock,client.decode(rows[0],hash,ENUM))
            client.query(MAP_GET, [lock.id], (err, rows)=>{
                if (err) return cb(err)
                cb(null, client.mapDecode(rows, lock, hash, ENUM))
            })
        })      
    },
	getMap: function(lock, cb){
		client.query(MAP_GET, [lock.id], (err, rows)=>{
			if (err) return cb(err)
			cb(null, client.mapDecode(rows, lock, hash, ENUM))
		})
	},
	set: function(lock,by,cb){
        client.query(SET, [client.encode(lock,by,hash,INDEX,ENUM)], (err, result)=>{
            if (err) return cb(err)
            lock.id=result.insertId
			client.query(MAP_SET, [client.mapEncode(lock, by, hash, INDEX, ENUM)], (err,result)=>{
                if (err) return cb(err)
                return cb(null, lock)
            })
        })
	},
	findByName: function(userId,name,cb){
		client.query(FIND_BY_NAME,[userId,name],cb)
	}
}
