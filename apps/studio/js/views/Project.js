var
route = require('route'),
Panel = require('views/Panel'),
tplSubitem = require('@html/subItem.html'),
tplItem = require('@html/item.html'),
tplControl = require('@html/control.html'),
tplIcon = require('@html/icon.html'),
Page = Backbone.View.extend({
    initialize: function(args){
        this.title = args.title
        this.page = args.page
    },
    render: function($container){
        var 
        t = this.title,
        spec = this.page.spec

        $container.append(_.template(tplItem.text, {id:t, name:t, className:'page'}))
        var $currRow = $container.children().last()
        $currRow.find('.leftBar').append(_.template(tplIcon.text, {icon:'folder'}))
        $currRow.find('.rightBar').prepend(_.template(tplIcon.text, {icon:'minus'})).prepend(_.template(tplIcon.text, {icon:'edit'}))

        for(var i=0,l=spec.length,s; i<l,s=spec[i]; i++){
            $container.append(_.template(tplSubitem.text, {id:t+'.'+s.name, name:s.name}))
        }
    }
}),
indexOfSpec = function(id, pages){
    var
    pm = id.split('.'),
    pageId = pm[0],
    name = pm[1],
    spec = pages[pageId].spec

    for(var i=0,l=spec.length,s; i<l,s=spec[i]; i++){
        if (s.name === name) return [s, pageId, i]
    }
    return []
}

exports.Class = Panel.Class.extend({
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
        'click .item': 'selectItem',
        'click .rightBar .icon': 'doOptions'
    },
    selectItem: function(e){
        this.saveItem()
        var
        item = e.target.id,
        id = item.substr(1)

        if (!e.target.classList.contains('control')){
            this.$('.row').removeClass('selected')

            if (this.selectedItem === id){
                this.selectedItem = null
                this.editor.clear()
                return
            }

            e.target.parentNode.classList.add('selected')
        }

        switch(item){
        case 'saveProject': this.saveProject(); break
        case 'closeProject': this.closeProject(); break
        case 'createPage': this.createPage(); break
        case 'iroutes': this.showRoutes(); break
        case 'ispec': this.showSpec(); break
        case 'ideps': this.showDeps(); break
        case 'istyles': this.showStyles(); break
        default:
            if (e.target.classList.contains('subItem')) this.showModule(id)
            else this.showPage(id)
            break
        }
    },
    showProject: function(){
        var
        $el = this.$el,
        p = this.model.get('json')

        this.routes = p.routes
        this.spec = p.spec
        this.deps = p.deps
        this.styles = p.styles

        var
        pageList = {},
        pages = p.pages,
        pageIds = Object.keys(pages),
        pageId
            
        $el.append(_.template(tplItem.text, {id:'routes', name:'Routes'}))
        $el.append(_.template(tplItem.text, {id:'spec', name:'Spec'}))
        $el.append(_.template(tplItem.text, {id:'deps', name:'Dependencies'}))
        $el.append(_.template(tplItem.text, {id:'styles', name:'Styles'}))

        
        for(var i=0,l=pageIds.length; i<l; i++){
            pageId = pageIds[i]
            pageList[pageId] = new Page({title:pageId,page:pages[pageId]})
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
                deps: this.deps,
                styles: this.styles,
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
        case 'deps': this.deps = changes; break
        case 'styles': this.styles = changes; break
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

        pages[pageId] = {style:{},spec:[]}
        pageList[pageId] = new Page({title:pageId,page:pages[pageId]})
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
    showDeps: function(){
        this.selectedItem = 'deps'
        this.editor.write(JSON.stringify(this.deps, null, 4), 'json')
    },
    showStyles: function(){
        this.selectedItem = 'styles'
        this.editor.write(JSON.stringify(this.styles, null, 4), 'json')
    },
    showPage: function(id){
        this.selectedItem = id
        this.$('.icon-folder-open').removeClass('icon-folder-open').addClass('icon-folder')
        var $item = this.$('.page#i'+id)
        $item.prev().find('.icon-folder').removeClass('icon-folder').addClass('icon-folder-open')
        this.$('.subItem').parent().addClass('hidden')
        var $nextRow = $item.parent().next()
        while($nextRow.children().first().hasClass('subItem')){
            $nextRow.removeClass('hidden')
            $nextRow = $nextRow.next()
        }
        this.editor.write(JSON.stringify(this.pages[id], null, 4), 'json')
    },
    showModule: function(id){
        this.selectedItem = id

        var result = indexOfSpec(id, this.pages)
        if (!result[0]) return

        this.editor.write(JSON.stringify(result[0], null, 4), 'json')
    },
    doOptions: function(e){
        var
        pageId = e.target.parentNode.parentNode.getElementsByTagName('span')[1].textContent,
        list = e.target.classList,
        pages = this.pages,
        pageList = this.pageList,
        page = pages[pageId]

        if (!page) return

        if (list.contains('icon-edit')){
            var name = prompt('Enter a new name', pageId)
            if (!name || name === pageId) return
            pages[name] = page
            delete pages[pageId]
            pageList[name] = pageList[pageId] 
            delete pageList[pageId]
            this.$('#i'+pageId).text(name)
        }else if (list.contains('icon-minus')){
            if (confirm('Remove page "'+pageId+'"?')){
                delete pages[pageId]
                delete pageList[pageId]
                this.$('#i'+pageId).parent().remove()
                if (this.selectedItem === pageId) this.editor.clear()
            }
        }
    }
})
