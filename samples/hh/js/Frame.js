var
PageSlider = require('pageslider'),
spec = require('spec'),
Router = require('Router'),
Page = require('Page'),
Model = require('Model'),
tpl = require('@html/frame.html'),
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
changeRoute = function(path, params){
    var
    self = this,
    pageConfig = this.pages[path]

    if (!pageConfig) return Router.instance.home()

    if (this.currPage) this.currPage.remove()
    spec.load(this, params, pageConfig.spec, function(err, s){
        if (err) {
            console.warn(err)
            return Router.instance.home()
        }
        self.currPage = new Page.Class({header: pageConfig.header, spec: s, theme: pageConfig.theme})
        self.render()
    })
}

me.Class = Backbone.View.extend({
    el: 'body',
    initialize: function(args){
        this.el.innerHTML = tpl.text
        this.slider = new PageSlider.Class(this.$el)

        var 
        self = this,
        p = args.project,
        r = Router.instance = new Router.Class({routes: p.routes})

        r.on('route', changeRoute, this)
        this.pages = p.pages

        this.theme = restyle(p.theme, ['webikit'])

        spec.load(null, [], p.spec, function(err, s){
            if (err) return console.error(err)
            self.spec = s
            self.initHeader()
        })
    },

    render: function(){
        this.drawHeader(this.currPage.header)
        this.slider.slidePage(this.currPage.render())
    },

    events: {
        'touchstart header .pull-left a': 'onToolbar',
        'touchstart header .pull-right a': 'onToolbar',
        'touchstart #popOptions li': 'onMenu',
        'keyup header input[type=search]': 'onFind'
    },

    onToolbar: function(e){
        var
        ele = e.srcElement,
        id = ele.id

        switch(id){
        case 'left-nav': window.history.back(); break
        case 'search': this.drawHeader(); break
        default: this.currPage.$el.trigger(id)
        }

        ele.classList.add('hide')
    },

    onFind: function(e){
        this.currPage.$el.trigger('find', [this.$search.val()])
        if (13 === e.keyCode){
            this.$search.val('')
            this.drawHeader(this.currPage.header)
        }
    },

    onMenu: function(e){
        var id = e.srcElement.id
        if ('#' === id.charAt(0)) return this.currPage.$el.trigger(id.substr(1))
        Router.instance.nav(e.srcElement.id)
    },
    initHeader: function(){
        this.$popover = this.$('#popOptions ul.table-view')

        var $topBar = this.$('header.bar')
        this.$search = $topBar.find('input[type=search]')
        this.$leftBar = $topBar.find('.pull-left')
        this.$rightBar = $topBar.find('.pull-right')
        this.$titleOptions = $topBar.find('h1#options.title')
        this.$title = $topBar.find('h1#simple.title')

        if (!pico.detectEvent('touchstart')){
            document.addEventListener('mousedown', function(e){
                var touches = []

                touches[0] = {}
                touches[0].pageX = e.pageX
                touches[0].pageY = e.pageY
                touches[0].target = e.target

                var evt = new Event('touchstart', {
                    bubbles: true,
                    cancelable: true,
                    details:{
                        target: e.target,
                        srcElement: e.srcElement,
                        touches: touches,
                        changedTouches: touches,
                        targetTouches: touches,
                        mouseToTouch: true
                    }   
                }) 

                e.target.dispatchEvent(evt)
            }, true)
        }
        
        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start()
    },
    drawHeader: function(bar){
        var
        $popover = this.$popover,
        $search = this.$search,
        $leftBar = this.$leftBar,
        $rightBar = this.$rightBar,
        $titleOptions = this.$titleOptions,
        $title = this.$title

        $leftBar.empty()
        $rightBar.empty()
        if (!bar){
            $title.addClass('hidden')
            $titleOptions.addClass('hidden')
            $search.removeClass('hidden').focus()
            return
        }
        $search.addClass('hidden').blur()
        var optionKeys = bar.options
        if (optionKeys && optionKeys.length){
            $titleOptions[0].firstChild.firstChild.textContent = bar.title
            $title.addClass('hidden')
            $titleOptions.removeClass('hidden')
            $popover.empty()
            _.each(optionKeys, function(key){
                $popover.append($(OPTION_TPL.replace('KEY', key).replace('VALUE', router.links[key])))
            })
        }else{
            $title.text(bar.title)
            $title.removeClass('hidden')
            $titleOptions.addClass('hidden')
        }
        if (bar.left){
            addToolbar($leftBar, bar.left)
        }
        if (bar.right){
            addToolbar($rightBar, bar.right)
        }
    }
})
