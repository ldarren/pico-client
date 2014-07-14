var
route = require('route'),
Panel = require('views/Panel'),
tplSubitem = require('@html/subItem.html'),
tplItem = require('@html/item.html'),
tplControl = require('@html/control.html'),
Page = Backbone.View.extend({
    title: null,
    page:null,
    initialize: function(args){
        this.title = args.title
        this.page = args.page
    },
    render: function($container){
        var 
        t = this.title,
        modules = this.page.modules,
        module

        $container.append(_.template(tplItem.text, {id:t, name:t}))

        for(var i=0,l=modules.length; i<l; i++){
            module = modules[i]
            $container.append(_.template(tplSubitem.text, {id:t+'.'+module.id, name:module.name}))
        }
    }
}),
indexOfModule = function(id, pages){
    var
    pm = id.split('.'),
    pageId = pm[0],
    moduleId = parseInt(pm[1]),
    modules = pages[pageId].modules,
    index = -1,
    module

    modules.every(function(mod, i){
        if (mod.id === moduleId) {
            index = i 
            module = mod
            return false
        }
        return true
    })
    return [module, pageId, moduleId, index]
}

me.Class = Panel.Class.extend({
    controls: [
        {id:'createPage', name:'[Create Page]'},
        {id:'closeProject', name:'[Close Project]'},
        {id:'saveProject', name:'[Save Project]'},
    ],
    pageList:{},
    pages: null,
    routes: null,
    models: null,
    selectedItem: null,
    initialize: function(args){
        Panel.Class.prototype.initialize(args)

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
        case 'imodels': this.showModels(); break
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
        this.models = p.models

        var
        pageList = {},
        pages = p.pages,
        pageIds = Object.keys(pages),
        pageId
            
        $el.append(_.template(tplItem.text, {id:'routes', name:'Routes'}))
        $el.append(_.template(tplItem.text, {id:'models', name:'Models'}))

        
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
                models: this.models,
                routes: this.routes,
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
        case 'models': this.models = changes; break
        default:
            if (-1 === item.indexOf('.')){
                this.pages[item] = changes
            } else {
                var result = indexOfModule(item, this.pages)
                if (!result[0]) return
                this.pages[result[1]].modules.splice(result[3], 1, changes)
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
        pages[pageId] = {modules:[]}
        pageList[pageId] = new Page({title:pageId,page:pages[pageId],collection:this.collection})
        pageList[pageId].render(this.$el)
        this.showPage(pageId)
    },
    showRoutes: function(){
        this.selectedItem = 'routes'
        this.editor.write(JSON.stringify(this.routes, null, 4), 'json')
    },
    showModels: function(){
        this.selectedItem = 'models'
        this.editor.write(JSON.stringify(this.models, null, 4), 'json')
    },
    showPage: function(id){
        this.selectedItem = id
        this.editor.write(JSON.stringify(this.pages[id], null, 4), 'json')
    },
    showModule: function(id){
        this.selectedItem = id

        var result = indexOfModule(id, this.pages)
        if (!result[0]) return

        this.editor.write(JSON.stringify(result[0], null, 4), 'json')
    }
})
