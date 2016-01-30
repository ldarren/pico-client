var
EVT_RESIZE='frameresize',
EVT_RESIZE_LEN=EVT_RESIZE.length,
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
    signals:['pageAdded','frameResized'],
    className: 'ripple hidden',
    deps:{
        info:'map',
        pageClass:'text',
        timeout:['int',1100]
    },
    create: function(deps){
        var self=this
        document.addEventListener('click', function(e){
            if (e.target.classList.contains(EVT_TRANSIT)) transit(self, e.target)
        }, true)
    },
    events:{
        'animationstart': function(e){
            if (-1 === e.animationName.indexOf(EVT_RESIZE)) return
            this.signals.frameResized(parseInt(e.animationName.substr(EVT_RESIZE_LEN))).send(this.host)
        }
    },
    slots:{
        frameAdded: function(){},
        pageAdd: function(from, sender, paneId, page, isBack){
            this.el.appendChild(page)
            this.signals.pageAdded(paneId).send(this.host)
        },
        moduleAdded: function(from, sender){},
        pageTransit: function(from, sender, options){}
    }
}
