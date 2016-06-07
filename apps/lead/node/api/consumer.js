var
sqlDevice=require('sql/device'),
picoObj=require('pico/obj'),
notifier

module.exports= {
    setup: function(context, next){
        notifier=context.pdl_consumer_notifier
        next()
    },
    requestUpdated:function(output){
        output['title']='Your Request Update'
        output['content']='Your job has been updated!'
    },
    send: function(devices, data, next){
        notifier.broadcast(devices.tokens, devices.ids, data.title, data.content)
        next()
    }
}
