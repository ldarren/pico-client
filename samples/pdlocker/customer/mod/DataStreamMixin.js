return {
    connect:function(stream, user, seen){
        stream.reconnect('pdl',`/stream?id=${user.id}&sess=${user.sess}&seen=${seen}`)
    }
}
