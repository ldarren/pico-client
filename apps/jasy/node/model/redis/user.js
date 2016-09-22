const
DAY1=60*60*24

var client

module.exports={
	setup(context,cb){
		client=context.mainCache
		cb()
	},
	getRegisterCache(email,cb){
		client.multi()
		.get(`vid:${email}`)
		.get(`rgc:${email}`)
		.exec((err,res)=>{
			if (err) return cb(err)
			try{var user=JSON.parse(res[1])}
			catch(e){return cb(e)}
			cb(null, res[0], user)
		})
	},
	setRegisterCache(email,verifyId,user,cb){
		client.multi()
		.setex(`vid:${email}`,DAY1,verifyId)
		.setex(`rgc:${email}`,DAY1,JSON.stringify(user))
		.exec(cb)
	},
	removeRegisterCache(email,cb){
		client.multi()
		.del(`vid:${email}`)
		.del(`rgc:${email}`)
		.exec(cb)
	}
}
