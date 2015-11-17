return{
    deps:{
    },
    create: function(deps){
        var self=this
        this.addSpec([['hello','text','world']],function(){
            for(var i=0,s; s=self.spec[i]; i++){
                console.log(s)
            }
        })
    }
}
