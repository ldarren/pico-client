var
route = require('route'),
tpl = require('@html/frame.html'),
ModelProjects = require('models/Projects'),
ModelWidgets = require('models/Widgets'),
ModelPage = require('models/Page'),
ModelFields = require('models/Fields'),
ViewEditor = require('views/Editor'),
ViewProjects = require('views/Projects'),
ViewProject = require('views/Project'),
ViewWidgets = require('views/Widgets'),
ViewWidget = require('views/Widget'),
ViewFields = require('views/Fields')

me.Class = Backbone.View.extend({
    el: 'body',
    projects: null,
    widgets: null,
    page: null,
    fields: null,
    panelTop: null,
    panelBtm: null,
    editor: null,
    initialize: function(options){
        this.projects = new ModelProjects.Class
        this.widgets = new ModelWidgets.Class
        this.page = new ModelPage.Class
        this.fields = new ModelFields.Class

        this.el.innerHTML = tpl.text
        this.editor = new ViewEditor.Class({id:'editor', theme:'ace/theme/monokai'})

        var r = route.instance
        r.on('route', this.changePanel, this)
        Backbone.history.start()
    },

    changePanel: function(path, params){
        if (('project' === path && !this.projects.length)||('widget' === path && !this.widgets.length)){
            route.instance.navigate('#', {trigger:true})
            return
        }

        switch(path){
        case 'widget':
            this.panelTop = new ViewWidget.Class({el:'#panelTop', model:this.widgets.get(params[0]), editor:this.editor})
            this.panelBtm = new ViewFields.Class({el:'#panelBtm', collection:this.fields, editor:this.editor})
            break
        case 'project':
            this.panelTop = new ViewProject.Class({el:'#panelTop', model:this.projects.get(params[0]), collection:this.widgets, editor:this.editor})
            this.panelBtm = new ViewWidgets.Class({el:'#panelBtm', collection:this.widgets, editor:this.editor})
            break
        default:
            this.panelTop = new ViewProjects.Class({el:'#panelTop', collection:this.projects, editor:this.editor})
            this.panelBtm = new ViewWidgets.Class({el:'#panelBtm', collection:this.widgets, editor:this.editor})
            break
        }

        this.render()
    },

    render: function(){
        this.panelTop.render()
        this.panelBtm.render()
    }
})
