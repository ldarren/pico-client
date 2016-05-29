return {
    deps:{
        ping:'models'
    },
    connect:function(stream, user, seen){
        stream.reconnect('lead','/stream?t='+seen,['poll'],false)
    },
	disconnect:function(count){
        if (count < 10) return // health check only if disconnected more than 10 times in a row
        this.deps.ping.reset()
        this.deps.ping.create()
	}
}
