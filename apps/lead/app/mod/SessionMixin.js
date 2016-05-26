return {
    deps:{
        domain:'text'
    },
    credential:function(att){
        return {id:att.id, sess:att.sess, domain:this.deps.domain}
    }
}
