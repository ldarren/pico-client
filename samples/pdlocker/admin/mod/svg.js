return {
    el:'body',
    deps:{
        defs:'file'
    },
    create:function(deps){
        var svg=document.createElement('svg')
        svg.setAttribute('xmlns','http://www.w3.org/2000/svg')
        svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink')
        svg.setAttribute('version','1.1')
        svg.setAttribute('viewBox','0 0 500 250')
        svg.setAttribute('style','position: fixed; left: -1000px; height: -1000px;')
        svg.innerHTML=deps.defs
        this.el.appendChild(svg)
        console.log('svg',deps.defs)
    }
}
