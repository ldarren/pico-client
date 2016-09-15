const
DAY1=60*60*24

var client

module.exports={
	setup(context,cb){
		client=context.mainCache
		cb()
	},
	getRegisterCache(email,verifyId,cb){
		client.get(`${email}:${verifyId}`,cb)
	},
	setRegisterCache(email,verifyId,user,cb){
		client.setex(`${email}:${verifyId}`,DAY1,JSON.stringify(user),cb)
	},
	removeRegisterCache(email,verifyId,cb){
		client.del(`${email}:${verifyId}`,cb)
	}
}
