var notifier

module.exports= {
    setup: function(context, next){
        notifier=context.pdl_consumer_notifier
        next()
    },
    requestUpdated:function(output,next){
        output['title']='Your Request Update'
        output['content']='Your job has been updated!'
        next()
    },
    send: function(devices, data, next){
        notifier.broadcast(devices.tokens, devices.ids, data.title, data.content)
        next()
    }
}
