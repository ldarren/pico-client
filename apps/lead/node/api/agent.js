var
picoStr=require('pico/str'),
notifier

module.exports= {
    setup: function(context, next){
        notifier=context.pdl_agent_notifier
        next()
    },
    newJobMsg:function(request, output, next){
        output['title']='New Job'
        output['content']=`Job #${picoStr.pad(request.id,4)} has been assign to you!`
        next()
    },
    send: function(devices, data, next){
        notifier.broadcast(devices.tokens, devices.ids, data.title, data.content)
        next()
    }
}
