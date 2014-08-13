var
PageSlider = require('pageslider'),
specMgr = require('specMgr'),
Router = require('Router'),
Page = require('Page'),
Model = require('Model'),
Module = require('Module'),
tpl = require('@html/frame.html'),
snapper,
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

    if (!pageConfig) return Router.instance().home()

    if (this.currPage) this.currPage.remove()
    self.currPage = new Page.Class(pageConfig, params, this)
    self.render()
},
UpdateDrawers = function(){
    var
    $ = function(id){return document.getElementById(id)},
    state = snapper.state(),
    towards = state.info.towards,
    opening = state.info.opening;

    if(opening=='right' && towards=='left'){
        $('right-drawer').classList.add('active-drawer');
        $('left-drawer').classList.remove('active-drawer');
    } else if(opening=='left' && towards=='right') {
        $('right-drawer').classList.remove('active-drawer');
        $('left-drawer').classList.add('active-drawer');
    }
}

exports.Class = Backbone.View.extend(_.extend({
    el: 'body',
    initialize: function(args){
        var 
        self = this,
        p = args.project,
        r = new Router.Class({routes: p.routes})

        r.on('route', changeRoute, this)
        this.on('all', this.frameEvents, this)

        self.pages = p.pages
        self.modules = []

        self.el.innerHTML = tpl.text
        var $content = self.$('#content')
        self.slider = new PageSlider.Class($content)
        snapper = new Snap({element: $content[0]})
        snapper.on('drag', UpdateDrawers);
        snapper.on('animate', UpdateDrawers);
        snapper.on('animated', UpdateDrawers);

        specMgr.load(null, [], p.spec, function(err, spec){
            if (err) return console.error(err)
            self.spec = spec
            self.initHeader()
            spec.forEach(function(s){
                if ('module' === s.type) {
                    self.modules.push(new s.Class({name:s.name, host:self, spec:s.spec}))
                }
            })
        })
    },

    render: function(){
        this.drawHeader(this.currPage.header)
        this.slider.slidePage(this.currPage.render())
    },

    events: {
        'touchstart header .pull-left a': function(e){this.onToolbar(e, true)},
        'touchstart header .pull-right a': function(e){this.onToolbar(e, false)},
        'touchstart #popOptions li': 'onMenu',
        'keyup header input[type=search]': 'onFind'
    },

    frameEvents: function(){
        console.log(arguments)
    },

    onToolbar: function(e, isLeft){
        var
        ele = e.srcElement,
        id = ele.id

        switch(id){
        case 'left-nav': window.history.back(); break
        case 'menu': snapper.open(isLeft ? 'left' : 'right'); break
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
        Router.instance().nav(e.srcElement.id)
    },
    initHeader: function(){
        this.$popover = this.$('#popOptions ul.table-view')

        var $topBar = this.$('header.bar')
        this.$search = $topBar.find('input[type=search]')
        this.$leftBar = $topBar.find('.pull-left')
        this.$rightBar = $topBar.find('.pull-right')
        this.$titleOptions = $topBar.find('h1#options.title')
        this.$title = $topBar.find('h1#simple.title')
        this.$topBar = $topBar

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
    // search === invalid bar
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
            this.$topBar.removeClass('hidden')
            $title.addClass('hidden')
            $titleOptions.addClass('hidden')
            $search.removeClass('hidden').focus()
            return
        }
        $search.addClass('hidden').blur()

        if (!Object.keys(bar).length){
            this.$topBar.addClass('hidden')
            return
        }
        this.$topBar.removeClass('hidden')

        var optionKeys = bar.options
        if (optionKeys && optionKeys.length){
            $titleOptions[0].firstChild.firstChild.textContent = bar.title
            $titleOptions.removeClass('hidden')
            $popover.empty()
            _.each(optionKeys, function(key){
                $popover.append($(OPTION_TPL.replace('KEY', key).replace('VALUE', router.links[key])))
            })
        }else if (bar.title){
            $title.text(bar.title)
            $title.removeClass('hidden')
        }
        if (bar.left){
            addToolbar($leftBar, bar.left)
        }
        if (bar.right){
            addToolbar($rightBar, bar.right)
        }
    }
}, Module.Events))
