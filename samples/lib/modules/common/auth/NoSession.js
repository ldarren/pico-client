return{
    signals: ['modelReady'],
    create: function(deps){
    },
    slots:{
        frameAdded:function(){
            this.signals.modelReady().send()
        }
    }
}
