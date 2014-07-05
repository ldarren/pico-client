var
PageSlider = require('pageslider'),
route = require('route'),
Home = require('views/Home'),
Job = require('views/Job'),
Jobs = require('views/Jobs'),
JobNew = require('views/JobNew'),
Report = require('views/Report'),
Invoice = require('views/Invoice'),
Download = require('views/Download'),
ModelJobs = require('models/Jobs'),
OPTION_TPL = '<li id=KEY class=table-view-cell>VALUE</li>',
spawnPoint = window.history.length,
user, collection, router, slider, page, $popover,
$topBar, $search, $leftBar, $titleOptions, $title, $rightBar,
start = function(frame){
    pico.embed(frame.el, 'html/frame.html', function(){
        slider = new PageSlider.Class(frame.$el)

        $popover = frame.$('#popOptions ul.table-view')

        $topBar = frame.$('header.bar')
        $search = $topBar.find('input[type=search]')
        $leftBar = $topBar.find('.pull-left')
        $titleOptions = $topBar.find('h1#options.title')
        $title = $topBar.find('h1#simple.title')
        $rightBar = $topBar.find('.pull-right')
        
        router.on('route', frame.changePage, frame)

        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start()
    })

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
        router.navigate('', {trigger: true})
    }
}

me.Class = Backbone.View.extend({
    el: 'body',

    initialize: function(options){
        user = options.user
        collection = new ModelJobs.Class()

        router = route.instance
        
        start(this)
    },

    render: function(){
        drawHeader(page.header())
        slider.slidePage(page.render().$el)
    },

    changePage: function(route, params){
        switch(route){
        case 'job':         page = new Job.Class({model: collection.get(params[0])}); break
        case 'jobs':        page = new Jobs.Class(collection); break
        case 'jobNew':      page = new JobNew.Class({collection: collection}); break
        case 'report':      page = new Report.Class(); break
        case 'invoice':     page = new Invoice.Class({collection: new ModelJobs.Class(), start:params[0], end:params[1]}); break
        case 'download':    page = new Download.Class({model:new ModelJobs.Class(), start:params[0], end:params[1]}); break
        default:            if (page && 'popOptions' === params[0]) return; page = new Home.Class(); break
        }

        this.render()
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
        default: page.$el.trigger(id)
        }

        ele.classList.add('hide')
    },

    onFind: function(e){
        page.$el.trigger('find', [$search.val()])
        if (13 === e.keyCode){
            $search.val('')
            drawHeader(page.header())
        }
    },

    onMenu: function(e){
        var id = e.srcElement.id
        if ('#' === id.charAt(0)) return page.$el.trigger(id.substr(1))
        router.navigate(e.srcElement.id, {trigger:true})
    }
})
