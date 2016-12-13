let client

module.exports= {
    setup(context, cb){
        client=context.pusherCache
        cb()
	},
	publish(cb){
	},
	poll(cb){
	}
}
