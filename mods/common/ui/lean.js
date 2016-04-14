return {
    signals:['pageAdded','pageTransited'],
    deps:{
        paneId:'int'
    },
    create:function(deps){
        var
        self=this,
        el=this.el
        el.addEventListener('__flipped', function(){
            self.signals.pageAdded().send(self.host) 
            self.signals.pageTransited(el.offsetLeft, el.offsetTop).send()
        }, false)
        el.addEventListener('__transited', function(){
            self.signals.pageTransited(el.offsetLeft, el.offsetTop).send()
        }, false)
    },
    slots:{
        frameAdded: function(){
        },
		pageAdd: function(from, sender, paneId, page, isBack){
            if (this.deps.paneId !== paneId) return
            this.el.dispatchEvent(__.createEvent('__flip', {page:page, from:isBack ? 'right' : 'left'}))
        },
        moduleAdded: function(from, sender, paneId){
            if (this.deps.paneId !== paneId) return
            document.dispatchEvent(__.createEvent('__reset'))
        },
        pageTransit: function(from, sender, paneId, options){
            if (this.deps.paneId !== paneId) return
            this.el.dispatchEvent(__.createEvent('__transit', options))
        }
    }
}
