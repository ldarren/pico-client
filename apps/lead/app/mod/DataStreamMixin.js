return {
    deps:{
        ping:'models'
    },
    connect:function(stream, user, seen, count){
        stream.reconnect('lead','/stream?t='+seen,['poll'],false)
    },
	retry:function(count){
        if (count < 10) return
        this.deps.ping.reset()
        this.deps.ping.create()
	}
}
