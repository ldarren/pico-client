var notifier

module.exports= {
    setup: function(context, next){
        notifier=context.pdl_agent_notifier
        next()
    },
    newJobMsg:function(output, next){
        output['title']='New Job'
        output['content']='New Job!'
        next()
    },
    send: function(devices, data, next){
        notifier.broadcast(devices.tokens, devices.ids, data.title, data.content)
        next()
    }
}
