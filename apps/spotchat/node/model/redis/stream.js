let client

module.exports= {
    setup(context, cb){
        client=context.streamCache
        cb()
	},
	publish(channel, message){
		client.publish(channel,message)
	}
}
