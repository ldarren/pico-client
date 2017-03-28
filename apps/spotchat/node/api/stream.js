const
redis=require('redis/stream'),
userPipeMap={},
userIds=[],
pipes=[],
pingTick=function(){
	clearTimeout(pingId)
	pingId=setTimeout(ping, 45000)
},
ping=function(){
	if (!pipes.length) return pingTick()
	for(let i=pipes.length-1,r; r=pipes[i]; i--){
		if (r.finished) remove(i)
		else web.SSE(r, '', 'ping')
	}
	pingTick()
},
remove=function(idx){
	if (-1===idx) return
	pipes.splice(idx,1)
	const uid=userIds.splice(idx,1)[0]
	delete userPipeMap[uid]
	console.log(`removed stream[${uid}], count[${pipes.length}]`)
}

let
web,
pingId=0

return {
	setup(context,next){
		web=context.webServer
		pingTick()
		next()
	},
	add(res,user,next){
		if (!user || !user.id) return next()
		const uid=user.id
		if (userPipeMap[uid]){
			const idx=userIds.indexOf(uid)
			pipes[idx]=res
			userIds[idx]=uid
			this.log(`replaced stream[${uid}]`)
		}else{
			pipes.push(res)
			userIds.push(uid)
			this.log(`added stream[${uid}], count[${pipes.length}]`)
		}
		userPipeMap[uid]=res
		next()
	},
	remove(res,next){
		res.finished=true
		next()
	},
	prepare(cred,input,output,next){
		output['t']=parseInt(cred.t)
		input.t=new Date(output.t)
		next()
	},
	render(res,evt,msg,next){
		if (!res || res.finished) return next()

		web.SSE(res,msg,evt)
		next()
	},
	publish(evt,msg,list,next){
		if (!msg || !list || !list.length) return next()
		redis.push(evt, JSON.stringify({msg:msg,list:list}))
		next()
	},
	broadcast(evt,input,next){
		const users=input.list
		if (!users || !users.length) return next(this.error(400))

		const output=input.msg

		for(let i=users.length-1,uid,res; uid=users[i]; i--){
			res=userPipeMap[uid]
			if (!res || res.finish) continue
			web.SSE(res,output,evt)
		}
		next()
	}
}
