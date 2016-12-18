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
		client.request('remote/connect',{token:Buffer.from(codec(config.secret,config.key)).toString('base64')},{app:config.key},cb)
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
			credential=data
		})
		cb()
	},
	reset(cred,input,next){
		if (app.key!==codec(app.secret,Buffer.from(input.token,'base64').toString())) return next(this.error(403))
		connect(app,(err,data)=>{
			if (err) return next(this.error(500))
			credential=data
			next()
		})
	},
	trigger(next){
		next()
	}
}
