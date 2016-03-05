var specMgr=require('js/specMgr')
return{
    deps:{
    },
    create: function(deps){
        var self=this
        this.addSpec([['hello','text','world']],function(err, spec){
            var list=[]
            for(var i=0,s; s=spec[i]; i++){
                switch(specMgr.getId(s)){
                case 'ctrl':
                case 'view': list.push(specMgr.getValue(s)); break
                }
            }
            self.spawnAsync(list, null, null, false, function(){
                for(var i=0,s; s=self.spec[i]; i++){
                    console.log(s)
                }
            })
        })
    }
}
