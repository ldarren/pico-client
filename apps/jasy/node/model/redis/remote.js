const
DAY1=24*60*60

let client

module.exports= {
    setup(context, cb){
        client=context.remoteCache
        cb()
	},
	publish(cb){
	},
	poll(cb){
	}
}
