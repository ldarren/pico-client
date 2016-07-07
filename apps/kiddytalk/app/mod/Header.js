var
Router=require('js/Router'),
DUMMY_BTN={icon:'',url:''},
setBtn=function(ele, btn){
    if (!ele || !btn) return
    ele.setAttributeNS('http://www.w3.org/1999/xlink', 'href','#'+btn.icon)
    if(btn.url)ele.setAttributeNS('http://www.w3.org/1999/xlink', 'role',btn.url)
}   
    
return{
    signals:['menu','headerButtonClicked'],
    deps:{
        paneId:'int',
        tpl:'file'
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl({title:''})
		this.title=this.el.querySelector('h1')
		this.btnLeft=this.el.querySelector('svg.icon.left use')
		this.btnRight=this.el.querySelector('svg.icon.right use')
		this.el.classList.add('hidden')
    },
    events: {
        'tap svg': function(e){
            var
            use='svg'===e.target.tagName?e.target.querySelector('use'):e.target,
            hash=use.getAttributeNS('http://www.w3.org/1999/xlink', 'href')
            if (!hash) return
            hash=hash.substr(6)
            switch(hash){
            case 'menu':
                this.signals.menu('left').sendNow(this.host)
                this.el.dispatchEvent(__.createEvent('transit', params[2])); break
                break
            case 'back':
                Router.back()
                break
            case 'search':
                break
            default:
                var url=use.getAttributeNS('http://www.w3.org/1999/xlink', 'role')
                if(url) Router.go(url)
                else this.signals.headerButtonClicked(hash).sendNow(this.host)
                break
            }
        } 
    },
    slots: {
        header: function(from, sender, title, left, right){
			if (!title) return this.el.classList.add('hidden')
            this.el.classList.remove('hidden')

            this.title.textContent=title
  
            setBtn(this.btnLeft,left||DUMMY_BTN)
            setBtn(this.btnRight,right||DUMMY_BTN)
        }
    }
}
