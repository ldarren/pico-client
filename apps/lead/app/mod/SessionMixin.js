return {
    deps:{
        org:'text'
    },
    credential:function(att){
        return {id:att.id, sess:att.sess, org:this.deps.org}
    }
}
