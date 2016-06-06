var
Router=require('js/Router'),
setBtn=function(ele, btn){
	if (!ele || !btn) return
	ele.setAttributeNS('http://www.w3.org/1999/xlink', 'href','#'+btn.icon)
	if(btn.url)ele.setAttributeNS('http://www.w3.org/1999/xlink', 'role',btn.url)
}

return{
    tagName: 'header',
    className: 'header',
    signals:['menu','headerButtonClicked'],
    deps:{
		tpl:'file',
		title:'text',
		btnLeft:'map',
		btnRight:'map'
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl({title:deps.title})
		setBtn(this.el.querySelector('svg.icon.left use'),deps.btnLeft)
		setBtn(this.el.querySelector('svg.icon.right use'),deps.btnRight)
		this.spawnAsync(this.spec)
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
                this.signals.menu('left').send(this.host)
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
				else this.signals.headerButtonClicked(hash).send(this.host)
                break
            }
        }
    },
    slots: {
        header: function(from, sender, title, left, right){
            var
			el=this.el,
			deps=this.deps

            el.classList.remove('hidden')
            el.querySelector('h1').textContent=title || deps.title

			setBtn(this.el.querySelector('svg.icon.left use'),left||deps.btnLeft)
			setBtn(this.el.querySelector('svg.icon.right use'),right||deps.btnRight)
        },
        noHeader: function(from, sender){
            this.el.classList.add('hidden')
        }
    }
}
