var
Floor=Math.floor,Random=Math.random,Max=Math.max,
sqlLocker=require('sql/locker'),
picoObj=require('pico/obj')

module.exports= {
    setup: function(context, next){
        next()
    },
	verify:function(input,output,next){
        Object.assign(output,input)
		next()
	},
	add:function(input,output,next){
this.log('add lock',input)
		if (!input.name) return next(this.error(400))
		sqlLocker.findByName(input.id, input.name, (err, rows)=>{
			if (err) return next(this.error(500,err))
			if (rows.length) return next(this.error(400,'name not available'))

			Object.assign(output,input,{
				userId:input.id,
				passcode:65535,//Floor(0xffffffff*Random()),
				salt:456//Floor(0xffff*Random()))
			})
			sqlLocker.set(output,input.id,(err)=>{
				if (err) return next(this.error(500))
				next()
			})
		})
	},
	read:function(input,next){
        next()
	},
	readById:function(input,output,next){
		sqlLocker.get(input,(err,lock)=>{
			if (err) return next(this.error(500))
			Object.assign(output,lock)
			this.setOutput(output,sqlLocker.clean,sqlLocker)
			next()
		})
	},
	update:function(input,next){
        next()
	},
	remove:function(input,next){
        next()
	},
	list:function(input,next){
        next()
	},
    poll:function(input,user,output,next){
        var t=input.t
        sqlLocker.poll(user.id,t,(err, briefs)=>{
            if (err) return next(this.error(500))
            sqlLocker.map_getList(briefs, (err, lockers)=>{
                if (err) return next(this.error(500))
                if (lockers.length){
                    var lastSeen=Max(...(picoObj.pluck(lockers,'uat')))
                    output['seen']=Max(lastSeen,output['seen']||t) 
                    output['lockers']=lockers
                }
                next()
            })
        })
    },
	unlock:function(lock,output,next){
		sqlLocker.map_get(lock,(err,map)=>{
			if (err) return next(this.error(500))
			if (!map || !map.passcode || !map.salt) return next(this.error(400))

			var key=Floor(Random()*0xffffffff)
			
			output.cred=[map.passcode^key, key+map.salt]

			this.setOutput(output, sqlLocker.clean, sqlLocker)
			next()
		})
	}
}