const
MIN1=60*1000,
Floor=Math.floor,
pStr=require('pico/str'),
pWeb=require('pico/web'),
codec=function(secret,token){
	return pStr.codec(Floor(Date.now()/MIN1)+pStr.hash(secret),token)
},
connect=function(config,cb){
	pWeb.create({url:config.parent,delimiter:['&']},(err,client)=>{
		channel=client
		if (err) return cb(`failed to create channel for parent ${err}`)
		client.request('from/remote/connect',{token:Buffer.from(codec(config.secret,config.key)).toString('base64')},{app:config.key},cb)
	})
}

let
app,
channel,
credential,
running=false,
count=30

this.update=function(){
	if (!channel || count--) return
	count=30
	channel.beat()
}

return {
	setup(context,cb){
		app=context.config.app
		setTimeout(connect,1000,app,(err,data)=>{
			if (err) return console.error(`failed to connect parent ${err}`)
			credential={app:app.key,sess:data}
		})
		cb()
	},
	verify(input,next){
		if (app.key===codec(app.secret,Buffer.from(input.token,'base64').toString())) return next()
		next(this.error(403))
	},
	isConnected(next){
		if (!app || !channel || !credential) return next(this.error(500))
		next()
	},
	reset(next){
		connect(app,(err,data)=>{
			if (err) return next(this.error(500))
			credential={app:app.key,sess:data}
			next()
		})
	},
	readUser(input,output,next){
		client.request('from/remote/getUser',{id:input.id},credential,(err,data)=>{
			if (err) return next(this.error(500))
			Object.assign(output,data)
			next()
		})
	},
	readDirectory(input,output,next){
		client.request('from/remote/getDir',{id:input.id},credential,(err,data)=>{
			if (err) return next(this.error(500))
			Object.assign(output,data)
			next()
		})
	},
	trigger(next){
		next()
	}
}
