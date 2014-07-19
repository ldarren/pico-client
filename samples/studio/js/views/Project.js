var
route = require('route'),
Panel = require('views/Panel'),
tplSubitem = require('@html/subItem.html'),
tplItem = require('@html/item.html'),
tplControl = require('@html/control.html'),
Page = Backbone.View.extend({
    initialize: function(args){
        this.title = args.title
        this.page = args.page
    },
    render: function($container){
        var 
        t = this.title,
        spec = this.page.spec

        $container.append(_.template(tplItem.text, {id:t, name:t}))

        for(var i=0,l=spec.length,s; i<l,s=spec[i]; i++){
            $container.append(_.template(tplSubitem.text, {id:t+'.'+0, name:s.name}))
        }
    }
}),
indexOfSpec = function(id, pages){
    var
    pm = id.split('.'),
    pageId = pm[0],
    index = parseInt(pm[1]),
    spec = pages[pageId].spec,
    s = spec[index] 

    return [s, pageId, index]
}

me.Class = Panel.Class.extend({
    controls: [
        {id:'createPage', name:'[Create Page]'},
        {id:'closeProject', name:'[Close Project]'},
        {id:'saveProject', name:'[Save Project]'},
    ],
    initialize: function(args){
        Panel.Class.prototype.initialize.call(this, args)

        var m = this.model

        if (m.get('json')){
            this.showProject()
        }else{
            var self = this
            m.fetch({
                data:{ id: m.id },
                success:function(){
                    self.showProject()
                }
            })
        }
    },
    render: function(){
        var $el = this.$el
        this.controls.forEach(function(control){
            $el.prepend(_.template(tplControl.text, control))
        })
        return this.el
    },
    events: {
        'click .item': 'selectItem'
    },
    selectItem: function(e){
        this.saveItem()
        var
        item = e.target.id,
        id = item.substr(1)

        if (this.selectedItem === id){
            this.selectedItem = null
            this.editor.clear()
            return
        }

        switch(item){
        case 'saveProject': this.saveProject(); break
        case 'closeProject': this.closeProject(); break
        case 'createPage': this.createPage(); break
        case 'iroutes': this.showRoutes(); break
        case 'ispec': this.showSpec(); break
        case 'itheme': this.showTheme(); break
        default:
            if (e.target.classList.contains('subItem')) this.showModule(id)
            else this.showPage(id)
            break
        }
    },
    showProject: function(){
        var
        c = this.collection,
        $el = this.$el,
        p = this.model.get('json')

        this.routes = p.routes
        this.spec = p.spec
        this.theme = p.theme

        var
        pageList = {},
        pages = p.pages,
        pageIds = Object.keys(pages),
        pageId
            
        $el.append(_.template(tplItem.text, {id:'routes', name:'Routes'}))
        $el.append(_.template(tplItem.text, {id:'spec', name:'Spec'}))
        $el.append(_.template(tplItem.text, {id:'theme', name:'Theme'}))

        
        for(var i=0,l=pageIds.length; i<l; i++){
            pageId = pageIds[i]
            pageList[pageId] = new Page({title:pageId,page:pages[pageId],collection:c})
            pageList[pageId].render($el)
        }

        this.pages = pages
        this.pageList = pageList
    },
    saveProject: function(){
        var
        m = this.model,
        data = {
            id: m.id,
            json: {
                spec: this.spec,
                routes: this.routes,
                theme: this.theme,
                pages: this.pages
            }
        }
        m.save(data, {
            data:data,
            success:function(){
                alert(m.get('name')+' saved')
            }
        })
    },
    saveItem: function(){
        var item = this.selectedItem
        if (!item) return

        try{
            var changes = JSON.parse(this.editor.read())
        }catch(exp){
            return
        }

        switch(item){
        case 'routes': this.routes = changes; break
        case 'spec': this.spec = changes; break
        case 'theme': this.theme = changes; break
        default:
            if (-1 === item.indexOf('.')){
                this.pages[item] = changes
            } else {
                var result = indexOfSpec(item, this.pages)
                if (!result[0]) return
                this.pages[result[1]].spec.splice(result[2], 1, changes)
            }
            break
        }
    },
    closeProject: function(){
        var e = this.editor

        if (confirm('Are you sure?')){
            route.instance.navigate('#', {trigger: true})
        }
    },
    createPage: function(){
        var
        pages = this.pages,
        pageList = this.pageList,
        pageId = this.editor.read()

        if (!pageId) alert('please enter a name')

        pages[pageId] = {header:{},spec:[]}
        pageList[pageId] = new Page({title:pageId,page:pages[pageId],collection:this.collection})
        pageList[pageId].render(this.$el)
        this.showPage(pageId)
    },
    showRoutes: function(){
        this.selectedItem = 'routes'
        this.editor.write(JSON.stringify(this.routes, null, 4), 'json')
    },
    showSpec: function(){
        this.selectedItem = 'spec'
        this.editor.write(JSON.stringify(this.spec, null, 4), 'json')
    },
    showTheme: function(){
        this.selectedItem = 'theme'
        this.editor.write(JSON.stringify(this.theme, null, 4), 'json')
    },
    showPage: function(id){
        this.selectedItem = id
        this.editor.write(JSON.stringify(this.pages[id], null, 4), 'json')
    },
    showModule: function(id){
        this.selectedItem = id

        var result = indexOfSpec(id, this.pages)
        if (!result[0]) return

        this.editor.write(JSON.stringify(result[0], null, 4), 'json')
    }
})
