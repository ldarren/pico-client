var
PageSlider = require('pageslider'),
Router = require('Router'),
Page = require('Page'),
Model = require('Model'),
tpl = require('@html/frame.html'),
spawnPoint = window.history.length,
$popover,$topBar, $search, $leftBar, $titleOptions, $title, $rightBar,
initHeader = function(frame){
    $popover = frame.$('#popOptions ul.table-view')

    $topBar = frame.$('header.bar')
    $search = $topBar.find('input[type=search]')
    $leftBar = $topBar.find('.pull-left')
    $titleOptions = $topBar.find('h1#options.title')
    $title = $topBar.find('h1#simple.title')
    $rightBar = $topBar.find('.pull-right')

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
drawHeader = function(bar){
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
},
back = function(e){
    if (window.history.length > spawnPoint){
        window.history.back()
    }else{
        Router.instance.navigate('', {trigger: true})
    }
},
changeRoute = function(path, params){
    var pageConfig = this.pages[path]

    if (!pageConfig) return

    var
    data = {},
    d,k,v

    for(var init=pageConfig.init,i=0,l=init.length; i<l; i++){
        k = init[i]
        v = k.value
        d = ('@' === v[0]) ? (k.param > -1 ? this.models[v.substr(1)].get(params[k.param]) : this.models[v.substr(1)]) : v
        if (!d){
            console.warn(path+' missing: '+k.name)
            return Router.instance.navigate('', {trigger: true})
        }
        data[k.name] = d
    }
    pageConfig.data = data

    if (this.currPage) this.currPage.remove()
    this.currPage = new Page.Class(pageConfig)

    this.render()
}

me.Class = Backbone.View.extend({
    el: 'body',
    slider: null,
    pages: null,
    models: null,
    currPage: null,
    initialize: function(args){
        this.el.innerHTML = tpl.text
        this.slider = new PageSlider.Class(this.$el)

        var 
        p = args.project,
        ms = p.models,
        models = this.models = {},
        r = Router.instance = new Router.Class({routes: p.routes})

        r.on('route', changeRoute, this)
        this.pages = p.pages

        for (var m in ms){ 
            models[m] = new Model.Class(null, ms[m])
        }
        initHeader(this)
    },

    render: function(){
        drawHeader(this.currPage.header())
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
        case 'left-nav': back(); break
        case 'search': drawHeader(); break
        default: this.currPage.$el.trigger(id)
        }

        ele.classList.add('hide')
    },

    onFind: function(e){
        this.currPage.$el.trigger('find', [$search.val()])
        if (13 === e.keyCode){
            $search.val('')
            drawHeader(this.currPage.header())
        }
    },

    onMenu: function(e){
        var id = e.srcElement.id
        if ('#' === id.charAt(0)) return this.currPage.$el.trigger(id.substr(1))
        Router.instance.navigate(e.srcElement.id, {trigger:true})
    }
})
