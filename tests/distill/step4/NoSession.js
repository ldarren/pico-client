return{
    signals: ['modelReady'],
    slots:{
        frameAdded:function(){
            this.signals.modelReady().send()
        }
    }
}
