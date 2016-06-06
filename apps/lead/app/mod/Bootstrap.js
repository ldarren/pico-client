return{
    deps:{
    },
    create: function(deps){
        var self=this
        this.addSpec([['hello','text','world']],function(err, spec){
            if (err) return console.error(err)
            self.spawnAsync(spec, null, null, false, function(){
                for(var i=0,s; s=self.spec[i]; i++){
                    console.log(s)
                }
            })
        })
    }
}
