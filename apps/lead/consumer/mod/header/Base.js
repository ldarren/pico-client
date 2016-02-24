var Router=require('js/Router')

return{
    tagName: 'header',
    signals:['menu','selectedMenu'],
    deps:{
		tpl:'file',
		title:'text',
		user:'view',
		month:'view',
		tabs:'view'
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl({title:deps.title})
		if (deps.user) this.spawn(deps.user)
		if (deps.month) this.spawn(deps.month)
		if (deps.tabs) this.spawn(deps.tabs)
    },
    events: {
        'tap a': function(e){
            switch(e.currentTarget.id){
            case 'icon-menu':
                this.signals.menu('left').send(this.host)
                break
            case 'icon-back':
                Router.back()
                break
            default:
                this.signals.selectedMenu(e.currentTarget.id).send(this.host)
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
