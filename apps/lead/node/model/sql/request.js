var
INDEX=                  ['userId','s'],
PRIVATE=                [],
ENUM=                   [],

GET =                   'SELECT * FROM `request` WHERE `id`=? AND `s`=1;',
GETS =                  'SELECT * FROM `request` WHERE `id` IN (?) AND `s`=1;',
SET =                   'INSERT INTO `request` (`userId`, `cby`) VALUES (?);',
POLL =                  'SELECT * FROM `request` WHERE `userId`=? AND `uat` > ?;',
FIND_BY_USERID=         'SELECT * FROM `request` WHERE `userId`=? AND `s`=1;',

MAP_GET =               'SELECT `requestId`, `k`, `v1`, `v2` FROM requestMap WHERE `requestId`=?;',
MAP_GETS =              'SELECT `requestId`, `k`, `v1`, `v2` FROM requestMap WHERE `requestId` IN (?);',
MAP_SET =               'INSERT INTO requestMap (`requestId`, `k`, `v1`, `v2`, `cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);',

LIST_SET =              'INSERT INTO requestList (`requestId`, `k`, `v1`, `v2`, `cby`) VALUES ?;',

UPDATE_STATE=           'UPDATE `request` SET `s`=? where `id`=?;',

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
    get: function(request, cb){
        if (!request || !request.id) return cb(ERR_INVALID_INPUT)
        client.query(GET,[request.id],(err,rows)=>{
            if (err) return cb(err)
			this.map_get(client.decode(rows[0],hash,ENUM),cb)
        })      
    },
    gets:function(ids,cb){
        if (!ids || !ids.length) return cb(ERR_INVALID_INPUT)
        client.query(GETS,[ids],(err,rows)=>{
            if (err) return cb(err)
			this.map_gets(client.decodes(rows,hash,ENUM),cb)
        })      
    },
	map_get: function(request, cb){
		client.query(MAP_GET, [request.id], (err, rows)=>{
			if (err) return cb(err)
			cb(null, client.mapDecode(rows, request, hash, ENUM))
		})
	},
    map_gets:function(requests,cb){
		client.query(MAP_GETS, [picoObj.pluck(requests,'id')], (err, rows)=>{
			if (err) return cb(err)
			cb(null, client.mapDecodes(picoObj.group(rows,'requestId'), requests, hash, ENUM))
		})
    },
	set: function(request,by,cb){
        client.query(SET, [client.encode(request,by,hash,INDEX,ENUM)], (err, result)=>{
            if (err) return cb(err)
            request.id=result.insertId
			this.map_set(request,by,(err)=>{
                cb(err, request)
            })
        })
	},
	map_set:function(request,by,cb){
		client.query(MAP_SET, [client.mapEncode(request, by, hash, INDEX, ENUM)], cb)
    },
    list_set:function(request,key,list,by,cb){
		client.query(LIST_SET, [client.listEncode(request.id, key, list, by, hash, INDEX, ENUM)], cb)
	},
	findByUserId: function(userId,cb){
		client.query(FIND_BY_USERID,[userId],cb)
    },
    poll:function(userId,time,cb){
		client.query(POLL,[userId,time],cb)
    },
    updateStatus:function(requestId,state,cb){
        client.query(UPDATE_STATE,[state,requestId],cb)
    }
}
