var
HID='hidden',
tpl=require('header.asp'),
BUTTON='<button class="mdl-button mdl-js-button mdl-button--icon"><i class=material-icons>ICON</i></button>',
addAction=function(self, container, action){
    if ('search'===action.icon){
        self.search.classList.remove(HID)
        self.searchBtn.classList.remove(HID)
        self.spacer.classList.add('mdl-cell--hide-tablet')
        self.spacer.classList.add('mdl-cell--hide-desktop')
        return
    }
    var badge=document.createElement('div')
    badge.classList.add('mdl-badge')
    if (action.count)badge.setAttribute('data-badge',action.count)
    badge.innerHTML=BUTTON.replace('ICON',action.icon)
    container.appendChild(badge)
},
addActions=function(self, container, actions){
    while (container.lastChild) container.removeChild(container.lastChild);
    if (!actions || !actions.length) return
    for(var i=0,a; a=actions[i]; i++){
        addAction(self, container,a)
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

        if (deps.title) el.classList.remove(HID)

        el.innerHTML=tpl({title:deps.title||''})
        this.header=el.querySelector('.mdl-layout__header-row'),
        this.search=el.querySelector('.mdh-expandable-search')
        this.spacer=el.querySelector('.mdl-layout-spacer')
        this.searchBtn=el.querySelector('.mdh-toggle-search')
        this.searchIcon=this.searchBtn.querySelector('i.material-icons')

        addActions(this, el.querySelector('.ldm-right-actions'), deps.right)
        addActions(this, el.querySelector('.ldm-left-actions'), deps.left)

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
                    e.classList.add(HID)
                }

                this.header.style.paddingLeft='16px' // Remove margin that used to hold the menu button
                this.search.classList.remove('mdl-cell--hide-phone')
                this.search.style.margin='0 16px 0 0'
            } else {
            // Search bar is currently showing
                icon.textContent='search'

                for(var i=0; e=elements[i]; i++){
                    e.classList.remove(HID)
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

            if (!title) return el.classList.add(HID)
            el.classList.remove(HID)
            el.querySelector('.mdl-layout-title').textContent=title

            this.search.classList.add(HID)
            this.searchBtn.classList.add(HID)
            this.spacer.classList.remove('mdl-cell--hide-tablet')
            this.spacer.classList.remove('mdl-cell--hide-desktop')

            addActions(this, el.querySelector('.ldm-right-actions'), right)
            addActions(this, el.querySelector('.ldm-left-actions'), left)
        }
    }
}
