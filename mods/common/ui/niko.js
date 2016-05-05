var
EVT_TRANSIT='panetransit',
transit=function(self, ele){
    var 
    el=self.el,
    elTop = ele.offsetTop,
    elLeft = ele.offsetLeft,
    x = el.pageX - elLeft,
    y = el.pageY - elTop

    el.setAttribute('style', 'top:'+y+';left:'+x)
    el.classList.remove('hidden')
}

return{
    signals:['pageAdded','pageTransited'],
    deps:{
        paneId:'int'
    },
    create: function(deps){
        var self=this
        document.addEventListener('click', function(e){
            if (e.target.classList.contains(EVT_TRANSIT)) transit(self, e.target)
        }, true)
        this.el.addEventListener('__transited', function(){
            self.signals.pageTransited(el.offsetLeft, el.offsetTop).send()
        }, false)
    },
    slots:{
        frameAdded: function(){},
        pageAdd: function(from, sender, paneId, page, isBack){
            if (this.deps.paneId !== paneId) return
            this.el.appendChild(page)
            this.signals.pageAdded(paneId).sendNow(this.host)
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
