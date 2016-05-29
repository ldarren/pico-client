var
Max=Math.max,
sqlRequest=require('sql/request'),
picoStr=require('pico/str'),
picoObj=require('pico/obj'),
poll=function(list,seen,output,next){
    if (!list.length) return next()
    sqlRequest.map_gets(list,(err,requests)=>{
        if (err) return next(this.error(500))
        output['requests']=requests
        output['seen']=Max(seen,Max(...(picoObj.pluck(requests,'uat'))))
        next()
    })
}

module.exports= {
    setup: function(context, next){
        next()
    },
	verify:function(input,output,next){
		next()
	},
	add:function(input,output,next){
		Object.assign(output,input,{
			userId:input.id
		})
		sqlRequest.set(output,input.id,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	read:function(input,next){
        next()
	},
	readById:function(input,output,next){
		sqlRequest.get(input,(err,request)=>{
			if (err) return next(this.error(500))
            output['requests']=[request]
			this.setOutput(request,sqlRequest.clean,sqlRequest)
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
        if ('consumer'!==user.role) return next()
        var t=input.t
        sqlRequest.poll(user.id,t,(err, briefs)=>{
            if (err) return next(this.error(500))
            poll.call(this,briefs,t,output,next)
        })
    }
}
