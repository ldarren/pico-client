return {
    signals:['pageAdded','pageSlided'],
    deps:{
        el:'text'
    },
    create:function(deps){
        this.setElement(deps.el)
        var
        self=this,
        el=this.el
        el.addEventListener('flipped', function(){
            self.signals.pageAdded().send(self.host) 
            self.signals.pageSlided(el.offsetLeft, el.offsetTop).send()
        }, false)
        el.addEventListener('transited', function(){
            self.signals.pageSlided(el.offsetLeft, el.offsetTop).send()
        }, false)
    },
    slots:{
        pageAdd: function(from, sender, page, isBack){
            this.el.dispatchEvent(__.createEvent('flip', {page:page, from:isBack ? 'right' : 'left'}))
        },
        pageSlide: function(from, sender, options){
            this.el.dispatchEvent(__.createEvent('transit', options))
        },
        moduleAdd: function(from, sender){
            document.dispatchEvent(__.createEvent('__reset'))
        }
    }
}
