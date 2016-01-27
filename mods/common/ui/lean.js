return {
    signals:['paneAdded','paneTransited'],
    deps:{
        el:'text'
    },
    create:function(deps){
        this.setElement(deps.el)
        var
        self=this,
        el=this.el
        el.addEventListener('flipped', function(){
            self.signals.paneAdded().send(self.host) 
            self.signals.paneTransited(el.offsetLeft, el.offsetTop).send()
        }, false)
        el.addEventListener('transited', function(){
            self.signals.paneTransited(el.offsetLeft, el.offsetTop).send()
        }, false)
    },
    slots:{
        flyerAdded: function(){
        },
        paneAdd: function(from, sender, pane, isBack){
            this.el.dispatchEvent(__.createEvent('flip', {pane:pane, from:isBack ? 'right' : 'left'}))
        },
        moduleAdded: function(from, sender){
            document.dispatchEvent(__.createEvent('__reset'))
        },
        paneTransit: function(from, sender, options){
            this.el.dispatchEvent(__.createEvent('transit', options))
        }
    }
}
