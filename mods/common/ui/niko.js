var
transit=function(self, ele){
    var 
    el=self.el,
    elTop = ele.offsetTop,
    elLeft = ele.offsetLeft,
    x = el.pageX - elLeft,
    y = el.pageY - elTop

    el.setAttribute('style', 'top:'+y+';left:'+x)
    el.classList.remove('hidden')
},
resize=function(self){
}

return{
    signals:['pageAdded'],
    className: 'ripple hidden',
    deps:{
        info:'map',
        pageClass:'text',
        timeout:['int',1100]
    },
    create: function(deps){
        var self=this
        document.addEventListener('click', function(e){
            if (e.target.classList.contains('niko_transit')) transit(self, e.target)
        }, true)
    },
    events:{
        'animationstart': function(e){
            if ('niko_resize'!==e.animationName) return
            resize(this)
        }
    },
    slots:{
        flyerAdded: function(){},
        pageAdd: function(from, sender, paneId, page, isBack){
            this.el.appendChild(page)
            this.signals.pageAdded(paneId).send(this.host)
        },
        moduleAdded: function(from, sender){},
        pageTransit: function(from, sender, options){}
    }
}
