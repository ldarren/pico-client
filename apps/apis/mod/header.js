var
tpl=require('header.asp'),
BUTTON='<button class="mdl-button mdl-js-button mdl-button--icon"><i class=material-icons>ICON</i></button>',
addAction=function(container, action){
    var badge=document.createElement('div')
    badge.classList.add('mdl-badge')
    if (action.count)badge.setAttribute('data-badge',action.count)
    badge.innerHTML=BUTTON.replace('ICON',action.icon)
    container.appendChild(badge)
},
addActions=function(container, actions){
    while (container.lastChild) container.removeChild(container.lastChild);
    if (!actions || !actions.length) return
    for(var i=0,a; a=actions[i]; i++){
        addAction(container,a)
    }
}

return {
    signals:['invalidate','headerAction'],
    deps:{
        title:'text',
        left:'list',
        right:'list'
    },
    create:function(deps){
        var el=this.el

        if (deps.title) el.classList.remove('hidden')

        el.innerHTML=tpl({title:deps.title||''})
        this.header=el.querySelector('.mdl-layout__header-row'),
        this.search=el.querySelector('.mdh-expandable-search')
        this.searchIcon=el.querySelector('.mdh-toggle-search i.material-icons')

        addActions(el.querySelector('.ldm-right-actions'), deps.right)
        addActions(el.querySelector('.ldm-left-actions'), deps.left)

        this.signals.invalidate('frame',true).send(this.host)
    },
    events:{
        'click .mdl-badge':function(e){
            var icon=e.currentTarget.querySelector('i.material-icons')
            this.signals.headerAction(icon.textContent).send(this.host)
        },
        'click .mdh-toggle-search': function(e){
            var
            icon=this.searchIcon,
            elements=this.el.querySelectorAll('.mdl-layout__drawer-button, .mdl-layout-title, .ldm-left-actions, .ldm-right-actions, .mdl-layout-spacer')

            // No search bar is currently shown
            if ('search'===icon.textContent) {
                icon.textContent='cancel'

                for(var i=0; e=elements[i]; i++){
                    e.classList.add('hidden')
                }

                this.header.style.paddingLeft='16px' // Remove margin that used to hold the menu button
                this.search.classList.remove('mdl-cell--hide-phone')
                this.search.style.margin='0 16px 0 0'
            } else {
            // Search bar is currently showing
                icon.textContent='search'

                for(var i=0; e=elements[i]; i++){
                    e.classList.remove('hidden')
                }

                this.header.style.paddingLeft='' // Remove margin that used to hold the menu button
                this.search.classList.add('mdl-cell--hide-phone')
                this.search.style.margin='0 10px'
            }
        }
    },
    slots: {
        header: function(from, sender, title, right, left){
            var el=this.el

            if (!title) return el.classList.add('hidden')
            el.classList.remove('hidden')
            el.querySelector('.mdl-layout-title').textContent=title

            addActions(el.querySelector('.ldm-right-actions'), right)
            addActions(el.querySelector('.ldm-left-actions'), left)
        }
    }
}
