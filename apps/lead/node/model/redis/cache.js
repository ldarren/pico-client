var client

module.exports= {
    setup: (context, cb)=>{
        client=context.mainCache
        cb()
	},
	publish: (channel, message)=>{
		client.publish(channel,message)
	}
}
