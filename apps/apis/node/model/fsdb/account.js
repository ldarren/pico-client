var
client

return {
    setup: function(context, cb){
        client=context.fsdb
        cb()
    }
}
