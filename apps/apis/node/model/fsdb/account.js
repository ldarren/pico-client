var client

return {
    setup: function(context, cb){
        client=context.mainFS
        cb()
    },
    domain:function(name){
        return client.domain(name)
    },
    create: function(url, data, cb){
        client.create(url, data, client.TYPE.DIR, null, cb)
    },
    read: function(url, cb){
        client.read(url, cb)
    }
}
