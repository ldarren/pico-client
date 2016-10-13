let
redis=require('redis/stream'),
web,
userIds=[],
pipes=[],
userPipeMap=new Map,
pingId=0,
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
	let uid=userIds.splice(idx,1)[0]
	userPipeMap.delete(uid)
	console.log(`removed stream[${uid}], count[${pipes.length}]`)
}

return {
	setup(context,next){
		web=context.webServer
		pingTick()
		next()
	},
	add(res,user,next){
		if (!user || !user.id) return next()
		let uid=user.id
		if (userPipeMap.has(uid)){
			let idx=userIds.indexOf(uid)
			pipes[idx]=res
			userIds[idx]=uid
			this.log(`replaced stream[${uid}]`)
		}else{
			pipes.push(res)
			userIds.push(uid)
			this.log(`added stream[${uid}], count[${pipes.length}]`)
		}
		userPipeMap.set(uid,res)
		next()
	},
	remove(res,next){
		res.finished=true
		next()
	},
	prepare(input,output,next){
		output['t']=parseInt(input.t)
		input.t=new Date(output.t)
		next()
	},
	render(evt,user,msg,next){
		if (!user || !user.id) return next(this.error(404))
		let res=userPipeMap.get(user.id)
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
		let users=input.list
		if (!users || !users.length) return next(this.error(400))

		let output=input.msg

		for(let i=users.length-1,uid,res; uid=users[i]; i--){
			res=userPipeMap.get(uid)
			if (!res || res.finish) continue
			web.SSE(res,output,evt)
		}
		next()
	}
}
