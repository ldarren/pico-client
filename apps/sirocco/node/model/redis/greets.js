const 
MONTH1 = 2592000

var client

module.exports= {
    setup: function(context, cb){
        client = context.mainCache
        cb()
    },
    create: function(key, value, cb){
        client.setex(key, MONTH1, value, cb)
    },
    read: function(key, cb){
        client.get(key, cb)
    }
}
