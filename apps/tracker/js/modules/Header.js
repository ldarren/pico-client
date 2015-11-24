var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/Header.html'),
addToolbar = function($bar, icons){
    var icon, a
    for(var i=0,l=icons.length;i<l;i++){
        icon = icons[i]

        a = document.createElement('a')
        a.id = icon
        a.className = 'icon icon-'+icon
        $bar.append(a)
    }
},
hideHeader = function(e){
    if (1 > e.target.offsetTop) e.target.classList.add('hidden')
}

exports.Class = Module.Class.extend({
    tagName: 'header',
    className: 'lnSlider bar bar-nav',
    create: function(spec){
        this.$el.html(tpl.text)
        this.autoHide = this.require('hide').value

        this.$search = this.$('input[type=search]')
        this.$leftBar = this.$('.pull-left')
        this.$rightBar = this.$('.pull-right')
        this.$title = this.$('h1.title')
        this.$sub = this.$('span.sub')
        this.active = false

        this.lastConfig = null
        var self = this
        document.addEventListener('tap', function(e){ self.toggle(e) }, true)
        this.el.addEventListener('transited', hideHeader, false)
        this.triggerHost('invalidate', 'main')
    },
    // search === invalid bar
    moduleEvents: function(evt, sender, config){
        if ('header' !== evt) return
        this.show(config)
    },

    events: {
        'touchstart header .pull-left a': function(e){this.onToolbar(e, true)},
        'touchstart header .pull-right a': function(e){this.onToolbar(e, false)},
        'keyup header input[type=search]': 'onFind'
    },

    toggle: function(e){
        if (!this.autoHide) return
        if (!this.active) return
        var
        $target = $(e.target),
        el = this.el,
        detail = el.style.cssText ? null : { from:'bottom', ref:el }

        if (!$target.closest('.lnBook').length) return
        if ($target.closest('a, .bar-nav').length) return
        if ($target.closest('input, button, textarea, select').length && detail) return // disable header when click input

        el.classList.remove('hidden')
        el.dispatchEvent(pico.createEvent('transit', detail))
    },

    show: function(c, title){
        var
        $search = this.$search,
        $leftBar = this.$leftBar,
        $rightBar = this.$rightBar,
        $title = this.$title,
        $sub = this.$sub

        $leftBar.empty()
        $rightBar.empty()

        if (!c || !Object.keys(c).length || (!c.title && (!c.left || !c.left.length) && (!c.right || !c.right.length) && !c.search)){
            this.$el.addClass('hidden')
            this.active = false
            this.lastConfig = c
            return
        }
        this.$el.removeClass('hidden')
        this.active = true

        if (c.search){
            this.$el.removeClass('hidden')
            this.$title.addClass('hidden')
            this.$sub.addClass('hidden')
            this.$search.removeClass('hidden').focus()
            return
        }
        this.lastConfig = c
        $search.addClass('hidden').blur()

        if (title || c.title){
            $title.text(title || c.title)
            $title.removeClass('hidden')
        }
        if (c.subTitle){
            $sub.text(c.subTitle)
            $sub.removeClass('hidden')
        }
        if (c.left){
            addToolbar($leftBar, c.left)
        }
        if (c.right){
            addToolbar($rightBar, c.right)
        }

        this.delegateEvents()
    },

    onToolbar: function(e, isLeft){
        this.undelegateEvents()
        window.setTimeout(function(self){ self.delegateEvents() }, 100, this)
        var
        ele = e.currentTarget,
        id = ele.id

        switch(id){
        case 'left-nav': Router.instance.back(); break
        case 'search': this.show({search:true}); break
        default: this.triggerHost(id, isLeft)
        }
    },

    onFind: function(e){
        var val = this.$search.val().trim()
        this.triggerHost('find', val)
        if (13 === e.keyCode){
            this.triggerHost('search', val)
            this.show(this.lastConfig, val)
        }
    }
})