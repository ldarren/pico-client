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
        frameAdded: function(){
        },
        pageAdd: function(from, sender, page, isBack){
            this.el.dispatchEvent(__.createEvent('flip', {page:page, from:isBack ? 'right' : 'left'}))
        },
        moduleAdd: function(from, sender){
            document.dispatchEvent(__.createEvent('__reset'))
        },
        pageSlide: function(from, sender, options){
            this.el.dispatchEvent(__.createEvent('transit', options))
        }
    }
}
