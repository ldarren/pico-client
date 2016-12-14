const
MIN1=60*1000,
Floor=Math.floor,
pStr=require('pico/str'),
pWeb=require('pico/web'),
codec=function(secret,token){
	return pStr.codec(Floor(Date.now()/MIN1)+pStr.hash(secret),token)
},
connect=function(cb){
	pWeb.create({url:app.jasy,delimiter:['&']},(err,client)=>{
		if (err) return cb(`failed to create channel for jasy ${err}`)
		client.request('remote/connect',null,{token:codec(app.secret,app.key)},(err,data)=>{
			if (err) return cb(`failed to connect jasy ${err}`)
			channel=client
			credential=data
			cb()
		})
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
		connect((err)=>{
		})
		cb()
	},
	reset(next){
		connect((err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	trigger(next){
		next()
	}
}
