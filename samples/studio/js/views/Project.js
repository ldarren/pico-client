var
Panel = require('views/Panel'),
tplModule = require('@html/module.html'),
tplProject = require('@html/project.html'),
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
            $div.append(_.template(tplModule, {id:id, name:c.get(id).get('name')}))
        }
        return el
    }
})

me.Class = Panel.Class.extend({
    project: null,
    pages: {},
    initialize: function(args){
        Panel.Class.prototype.initialize(args)
        var
        self = this,
        m = this.model

        this.el.innerHTML = tplProject.text

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
        return this.el
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
    }
})
