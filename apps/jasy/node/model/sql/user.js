const
INDEX=				['email'],
PRIVATE=			['pwd'],
PRIVATE_SELF=		['pwd'],
ENUM=				['role'],

SET=				'INSERT INTO `user` (`email`,`cby`) VALUES (?);',
MAP_SET=			'INSERT INTO `userMap` (`userId`,`k`,`v1`,`v2`,`cby`) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), `v1`=VALUES(`v1`), `v2`=VALUES(`v2`), `uby`=VALUES(`cby`);'

var
hash=require('sql/hash'),
client

module.exports={
	setup(context,cb){
		client=context.mainDB
		cb()
	},
	clean(model){
        for(var i=0,k; k=PRIVATE[i]; i++) delete model[k];
		return model
	},
	cleanList(list){
        for(var i=0,l; l=list[i]; i++) list[i]=this.clean(l)
		return list
	},
	cleanSelf(model){
        for(var i=0,k; k=PRIVATE_SELF[i]; i++) delete model[k];
		return model
	},
	set(user,by,cb){
		client.query(SET, [client.encode(user,by,hash,INDEX,ENUM)], (err, result)=>{
			if (err) return cb(err)
			user.id=result.insertId
			this.map_set(user,by,(err)=>{
				cb(err, user)
			})
		})
	},
	map_set: function(user,by,cb){
		client.query(MAP_SET, [client.mapEncode(user,by,hash,INDEX,ENUM)], cb)
	}
}
