var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/header.html'),
addToolbar = function($bar, icons){
    var icon, a
    for(var i=0,l=icons.length;i<l;i++){
        icon = icons[i]

        a = document.createElement('a')
        a.id = icon
        a.className = 'icon icon-'+icon
        $bar.append(a)
    }
}

exports.Class = Module.Class.extend({
    tagName: 'header',
    className: 'hidden bar bar-nav',
    initialize: function(options){
        this.$el.html(tpl.text)
        this.$popover = this.$('#popOptions ul.table-view')

        this.$search = this.$('input[type=search]')
        this.$leftBar = this.$('.pull-left')
        this.$rightBar = this.$('.pull-right')
        this.$titleOptions = this.$('h1#options.title')
        this.$title = this.$('h1#simple.title')

        this.lastConfig = null

        var self = this
        this.init(options, function(err, spec){
            self.triggerHost('invalidate', 'content')
        })
    },
    // search === invalid bar
    reinit: function(config){
        var
        $popover = this.$popover,
        $search = this.$search,
        $leftBar = this.$leftBar,
        $rightBar = this.$rightBar,
        $titleOptions = this.$titleOptions,
        $title = this.$title

        $leftBar.empty()
        $rightBar.empty()
        this.lastConfig = config

        if (!config || !Object.keys(config).length){
            this.$el.addClass('hidden')
            return
        }
        this.$el.removeClass('hidden')

        if (config.search){
            this.showSearch()
            return
        }
        $search.addClass('hidden').blur()

        var optionKeys = config.options
        if (optionKeys && optionKeys.length){
            $titleOptions[0].firstChild.firstChild.textContent = config.title
            $titleOptions.removeClass('hidden')
            $popover.empty()
            _.each(optionKeys, function(key){
                $popover.append($(OPTION_TPL.replace('KEY', key).replace('VALUE', router.links[key])))
            })
        }else if (config.title){
            $title.text(config.title)
            $title.removeClass('hidden')
        }
        if (config.left){
            addToolbar($leftBar, config.left)
        }
        if (config.right){
            addToolbar($rightBar, config.right)
        }
    },

    events: {
        'touchstart header .pull-left a': function(e){this.onToolbar(e, true)},
        'touchstart header .pull-right a': function(e){this.onToolbar(e, false)},
        'touchstart #popOptions li': 'onMenu',
        'keyup header input[type=search]': 'onFind'
    },

    showSearch: function(){
        this.$el.removeClass('hidden')
        this.$leftBar.empty()
        this.$rightBar.empty()
        this.$title.addClass('hidden')
        this.$titleOptions.addClass('hidden')
        this.$search.removeClass('hidden').focus()
    },

    onToolbar: function(e, isLeft){
        var
        ele = e.srcElement,
        id = ele.id

        switch(id){
        case 'left-nav': window.history.back(); break
        case 'menu': snapper.open(isLeft ? 'left' : 'right'); break
        case 'search': this.showSearch(); break
        default: this.triggerHost(id)
        }

        ele.classList.add('hidden')
    },

    onFind: function(e){
        this.triggerHost('find', [this.$search.val()])
        if (13 === e.keyCode){
            this.$search.val('')
            this.reinit(this.lastConfig)
        }
    },

    onMenu: function(e){
        var id = e.srcElement.id
        if ('#' === id.charAt(0)) return this.triggerHost(id.substr(1))
        Router.instance().nav(e.srcElement.id)
    }
})
