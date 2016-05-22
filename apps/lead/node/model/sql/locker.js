var
INDEX=                  ['userId','name'],
PRIVATE=                ['passcode','salt'],
ENUM=                   [],

GET =                   'SELECT * FROM `locker` WHERE `id`=? AND `s`=1;',
SET =                   'INSERT INTO `locker` (`userId`, `name`, `cby`) VALUES (?);',
FIND_BY_NAME =          'SELECT * FROM `locker` WHERE `userId`=? AND `name`=? AND `s`=1;',

MAP_GET =               'SELECT `lockerId`, `k`, `v1`, `v2` FROM lockerMap WHERE `lockerId`=?;',
MAP_SET =               'INSERT INTO lockerMap (`lockerId`, `k`, `v1`, `v2`, `cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',

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
    get: function(locker, cb){
        if (!locker || !locker.id) return cb(ERR_INVALID_INPUT)
        client.query(GET,[locker.id],(err,rows)=>{
            if (err) return cb(err)
            Object.assign(locker,client.decode(rows[0],hash,ENUM))
			this.getMap(locker,cb)
        })      
    },
	getMap: function(locker, cb){
		client.query(MAP_GET, [locker.id], (err, rows)=>{
			if (err) return cb(err)
			cb(null, client.mapDecode(rows, locker, hash, ENUM))
		})
	},
	set: function(locker,by,cb){
        client.query(SET, [client.encode(locker,by,hash,INDEX,ENUM)], (err, result)=>{
            if (err) return cb(err)
            locker.id=result.insertId
			this.setMap(locker, by, (err)=>{
                cb(err, locker)
            })
        })
	},
	setMap:function(locker,by,cb){
		client.query(MAP_SET, [client.mapEncode(locker, by, hash, INDEX, ENUM)], cb)
	},
	findByName: function(userId,name,cb){
		client.query(FIND_BY_NAME,[userId,name],cb)
	}
}
