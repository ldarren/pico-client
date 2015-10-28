return {
    tagName:'svg',
    attributes:{
        version:'1.1',
        xmlns:'http://www.w3.org/2000/svg',
        'xmlns:xlink':'http://www.w3.org/1999/xlink',
        viewBox:'0 0 500 250',
        style:'position: fixed; left: -1000px; height: -1000px;'
    },
    signals:['invalidate'],
    deps:{
        defs:'file'
    },
    create:function(deps){
        this.el.innerHTML=deps.defs
        this.signals.invalidate('main', true).send(this.host)
    }
}
