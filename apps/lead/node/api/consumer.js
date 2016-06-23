var
picoStr=require('pico/str'),
notifier

module.exports= {
    setup: function(context, next){
        notifier=context.pdl_consumer_notifier
        next()
    },
    requestUpdated:function(request,output,next){
        output['title']='Request Updated'
        output['content']=`Your request #${picoStr.pad(request.id,4)} has been updated!`
        next()
    },
    send: function(devices, data, next){
        notifier.broadcast(devices.tokens, devices.ids, data.title, data.content)
        next()
    }
}
