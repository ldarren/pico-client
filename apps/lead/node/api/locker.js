var
Floor=Math.floor,Random=Math.random,
sqlLock=require('sql/lock'),
picoObj=require('pico/obj')

module.exports= {
    setup: function(context, next){
        next()
    },
	verify:function(input,output,next){
		next()
	},
	add:function(input,output,next){
this.log('add lock',input)
		if (!input.name) return next(this.error(400))
		sqlLock.findByName(input.id, input.name, (err, rows)=>{
			if (err) return next(this.error(500,err))
			if (rows.length) return next(this.error(400,'name not available'))

			Object.assign(output,input,{
				userId:input.id,
				passcode:65535,//Floor(0xffffffff*Random()),
				salt:456//Floor(0xffff*Random()))
			})
			sqlLock.set(output,input.id,(err,result)=>{
				if (err) return next(this.error(500))
				next()
			})
		})
	},
	read:function(input,next){
        next()
	},
	readById:function(input,output,next){
		sqlLock.get(input,(err,lock)=>{
			if (err) return next(this.error(500))
			Object.assign(output,lock)
			this.setOutput(output,sqlLock.clean,sqlLock)
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
    poll:function(input,next){
        this.setOutput('sse lock')
        next()
    },
	unlock:function(lock,output,next){
		sqlLock.getMap(lock,(err,map)=>{
			if (err) return next(this.error(500))
			if (!map || !map.passcode || !map.salt) return next(this.error(400))

			var key=Floor(Random()*0xffffffff)
			
			output.hash=map.passcode^key
			output.key=key+map.salt

			this.setOutput(output, sqlLock.clean, sqlLock)
			next()
		})
	}
}
