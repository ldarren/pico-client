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
		session=pStr.rand()
		client.request('from/remote/connect',{
				token:Buffer.from(codec(config.secret,config.key)).toString('base64'),
				sess:session
			},{
				app:config.key
			},cb)
	})
}

let
app,
channel,
credential,
session,
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
			credential={app:app.key,sess:data.sess}
		})
		cb()
	},
	verify(cred,next){
		if (session !== cred.sess) return next(this.error(403))
		next()
	},
	isConnected(next){
		if (!channel || !credential) return next(this.error(500))
		next()
	},
	reset(input,next){
		if (app.key!==codec(app.secret,Buffer.from(input.token,'base64').toString())) return next(this.error(403))
		connect(app,(err,data)=>{
			if (err) return next(this.error(500))
			credential={app:app.key,sess:data.sess}
			next()
		})
	},
	readUser(input,output,next){
		client.request('from/remote/user/read',{id:input.id},credential,(err,data)=>{
			if (err) return next(this.error(500))
			Object.assign(output,data)
			next()
		})
	},
	readDirectory(cred,output,next){
		client.request('from/remote/directory/list',{id:cred.id,cwd:cred.cwd},credential,(err,data)=>{
			if (err) return next(this.error(500))
			Object.assign(output,data)
			next()
		})
	},
	trigger(next){
		next()
	}
}
