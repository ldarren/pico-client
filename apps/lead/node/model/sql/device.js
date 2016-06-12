var
INDEX=                  ['userId'],
PRIVATE=                [],
ENUM=                   [],

GET =                   'SELECT * FROM `device` WHERE `id`=? AND `s`=1;',
GETS =                  'SELECT * FROM `device` WHERE `id` IN (?) AND `s`=1;',
SET =                   'INSERT INTO `device` (`userId`, `cby`) VALUES (?);',
FIND_BY_USERID=         'SELECT * FROM `device` WHERE `userId`=? AND `s`=1;',
FIND_BY_USERIDS=        'SELECT * FROM `device` WHERE `userId` IN (?) AND `s`=1;',

MAP_GET =               'SELECT `deviceId`, `k`, `v1`, `v2` FROM deviceMap WHERE `deviceId`=?;',
MAP_GETS =              'SELECT `deviceId`, `k`, `v1`, `v2` FROM deviceMap WHERE `deviceId` IN (?);',
MAP_SET =               'INSERT INTO deviceMap (`deviceId`, `k`, `v1`, `v2`, `cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',

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
    get: function(device, cb){
        if (!device || !device.id) return cb(ERR_INVALID_INPUT)
        client.query(GET,[device.id],(err,rows)=>{
            if (err) return cb(err)
			this.map_get(client.decode(rows[0],hash,ENUM),cb)
        })      
    },
    gets:function(ids,cb){
        if (!ids || !ids.length) return cb(ERR_INVALID_INPUT)
        client.query(GETS,[ids],(err,rows)=>{
            if (err) return cb(err)
			this.map_get(client.decodes(rows,hash,ENUM),cb)
        })      
    },
	map_get: function(device, cb){
		client.query(MAP_GET, [device.id], (err, rows)=>{
			if (err) return cb(err)
			cb(null, client.mapDecode(rows, device, hash, ENUM))
		})
	},
    map_gets:function(devices,cb){
		client.query(MAP_GETS, [picoObj.pluck(devices,'id')], (err, rows)=>{
			if (err) return cb(err)
			cb(null, client.mapDecodes(picoObj.group(rows,'deviceId'), devices, hash, ENUM))
		})
    },
	set: function(device,by,cb){
        client.query(SET, [client.encode(device,by,hash,INDEX,ENUM)], (err, result)=>{
            if (err) return cb(err)
            device.id=result.insertId
			this.map_set(device,by,(err)=>{
                cb(err, device)
            })
        })
	},
	map_set:function(device,by,cb){
console.log(device,by)
console.log(client.format(MAP_SET, [client.mapEncode(device, by, hash, INDEX, ENUM)]))
		client.query(MAP_SET, [client.mapEncode(device, by, hash, INDEX, ENUM)], cb)
    },
	findByUserId: function(userId,cb){
		client.query(FIND_BY_USERID,[userId],cb)
    }
}
