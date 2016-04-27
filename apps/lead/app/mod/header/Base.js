var
Router=require('js/Router'),
specMgr=require('js/specMgr')

return{
    tagName: 'header',
    className: 'header',
    signals:['menu','selectedMenu'],
    deps:{
		tpl:'file',
		title:'text',
		iconLeft:'text',
		iconRight:'text'
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl({title:deps.title})
		this.spawnAsync(specMgr.findAllByType('view',this.spec))
    },
    events: {
        'tap svg': function(e){
			var hash=e.target.getAttributeNS('http://www.w3.org/1999/xlink', 'href')
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
            default:
                this.signals.selectedMenu(hash).send(this.host)
                break
            }
        }
    },
    slots: {
        header: function(from, sender, title, left, right){
            var el=this.el

            el.classList.remove('hidden')
            el.querySelector('h1.title').textContent=title || this.deps.title

            var icon=el.querySelector('a.pull-left')
            left = left || this.deps.left
            if (left){
                icon.className='pull-left icon '+left
                icon.id=left
            }else{
                icon.className='pull-left'
                icon.id=''
            }
            icon=el.querySelector('a.pull-right')
            right = right || this.deps.right
            if (right){
                icon.className='pull-right icon '+right
                icon.id=right
            }else{
                icon.className='pull-right'
                icon.id=''
            }
        },
        noHeader: function(from, sender){
            this.el.classList.add('hidden')
        }
    }
}
