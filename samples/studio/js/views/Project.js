var
route = require('route'),
Panel = require('views/Panel'),
tplSubitem = require('@html/subItem.html'),
tplControl = require('@html/control.html'),
Page = Backbone.View.extend({
    tagName:'div',
    title: null,
    initialize: function(args){
        this.title = args.title
    },
    render: function(){
        var el = this.el
        el.textContent = this.title

        var 
        div = document.createElement('div')
        $div = $(div),
        modules = model.module,
        id

        for(var i=0,l=modules.length; i<l; i++){
            id = modules[i].id
            $div.append(_.template(tplSubitem, {id:id, name:c.get(id).get('name')}))
        }
        return el
    }
})

me.Class = Panel.Class.extend({
    controls: [
        {id:'createPage', name:'[Create Page]'},
        {id:'closeProject', name:'[Close Project]'},
        {id:'saveProject', name:'[Save Project]'},
    ],
    project: null,
    pages: {},
    initialize: function(args){
        Panel.Class.prototype.initialize(args)
        var
        self = this,
        m = this.model

        if (m.get('json')){
            this.showPage()
        }else{
            m.fetch({
                data:{ id: m.id },
                success:function(){
                    self.showPage()
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
        'click #saveProject': 'saveProject',
        'click #closeProject': 'closeProject',
        'click #createPage': 'createPage'
    },
    showPage: function(){
        var
        c = this.collection,
        pages = this.pages,
        $el = this.$el,
        p = JSON.parse(this.model.get('json')),
        pageIds = Object.keys(p),
        pageId

        for(var i=0,l=pageIds.length; i<l; i++){
            pageId = pageIds[i]
            pages[pageId] = new Page({title:pageId,model:p[pageId],collection:c})
            $el.append(pages[pageId].render())
        }

        this.project = p
    },
    saveProject: function(){
        var m = this.model
        m.save(null, {
            data:{
                id: m.id,
                json: this.editor.read()
            },
            success:function(){
                alert(m.get('name')+' saved')
            }
        })
    },
    closeProject: function(){
        var e = this.editor

        if (confirm('Are you sure?')){
            route.instance.navigate('#', {trigger: true})
        }
    },
    createPage: function(){
    }
})
