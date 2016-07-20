return {
    deps:{
        ping:'models'
    },
    connect:function(stream, user, seen, count){
        stream.reconnect('lead','/stream?t='+seen,this.sseEvts,false)
    },
	retry:function(count){
        if (count % 3) return
        this.deps.ping.reset()
        this.deps.ping.create()
	}
}
