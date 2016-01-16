var
html= require('Loader.html'),
excluded = function(url, excludes){
    for(var e,i=0;e=excludes[i];i++)if(-1!==url.indexOf(e))return true;
    return false
},
onSend= function(err, api){
    if (excluded(api, this.deps.excludes)) return
    this.el.classList.remove('hidden')
},
onRecv= function(err, api, data){
    this.el.classList.add('hidden')
}

return{
    className: 'modal-widget hidden',
    signals: ['invalidate'],
    deps:{
        excludes:['list',[]]
    },
    create: function(deps){
        this.el.innerHTML=html

        this.listenTo(Backbone, 'networkSend', onSend)
        this.listenTo(Backbone, 'networkRecv', onRecv)
        this.listenTo(Backbone, 'networkErr', onRecv)

        this.signals.invalidate().send(this.host)
    }
}
