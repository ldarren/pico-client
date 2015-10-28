var 
Router=require('js/Router'),
html= require('Header.html')

return{
    tagName: 'header',
    className: 'bar bar-nav hidden',
    signals:['invalidate','menu','selectedMenu'],
    deps:{
        title: 'text',
        left: 'text',
        right: 'text'
    },
    create: function(deps){
        this.el.innerHTML=html
        this.signals.invalidate('main').send(this.host)
    },
    events: {
        'tap a': function(e){
            switch(e.currentTarget.id){
            case 'icon-menu':
                this.signals.menu('left').send(this.host)
                break
            case 'icon-back':
                Router.instance.back()
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
