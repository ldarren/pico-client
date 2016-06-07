var
sqlDevice=require('sql/device'),
picoObj=require('pico/obj'),
notifier

module.exports= {
    setup: function(context, next){
        notifier=context.pdl_agent_notifier
        next()
    },
    newjobMsg:function(output){
        output['title']='New Job'
        output['content']='New Job!'
    },
    send: function(devices, data, next){
        notifier.broadcast(devices.tokens, devices.ids, data.title, data.content)
        next()
    }
}
