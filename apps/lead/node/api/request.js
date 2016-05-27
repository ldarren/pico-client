var
sqlRequest=require('sql/request'),
picoStr=require('pico/str'),
picoObj=require('pico/obj')

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
			Object.assign(output,request)
			this.setOutput(output,sqlRequest.clean,sqlRequest)
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
        switch(user.role){
        case 'consumer':
            sqlRequest.poll(user.id,t,(err, briefs)=>{
                if (err) return next(this.error(500))
                next()
            })
            break
        case 'agent':
            sqlRequest.list_poll('agentId',user.id,t,(err, list)=>{
                if (err) return next(this.error(500))
                sqlRequest.getList(picoObj.pluck(list,'requestId',(err,briefs)=>{
                    if (err) return next(this.error(500))
                    next()
                })
            })
            break
        case 'admin':
        default:
            next()
            break
        }
    },
    addAgent:function(request,output,next){
        sqlRequest.list_set(request,'agentId',output.list,0,(err)=>{
            if (err) return next(this.error(500,err))
            next()
        })
    }
}
