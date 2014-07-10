var
route = require('route'),
tpl = require('@html/frame.html'),
ModelProjects = require('models/Projects'),
ModelWidgets = require('models/Widgets'),
ModelConstants = require('models/Constants'),
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
    constants: null,
    panelTop: null,
    panelBtm: null,
    editor: null,
    initialize: function(options){
        this.projects = new ModelProjects.Class
        this.widgets = new ModelWidgets.Class
        this.constants = new ModelConstants.Class

        this.el.innerHTML = tpl.text
        this.editor = new ViewEditor.Class({id:'editor', theme:'ace/theme/monokai'})

        var r = route.instance
        r.on('route', this.changePanel, this)
        Backbone.history.start()
    },

    changePanel: function(path, params){
        if (('project' === path && !this.projects.length) || ('widget' === path && !this.widgets.length)){
            route.instance.navigate('#', {trigger:true})
            return
        }

        var
        t = this.panelTop,
        b = this.panelBtm,
        tc,bc,ta,ba

        switch(path){
        case 'widget':
            tc = ViewWidget.Class
            ta = {id:'panelTop', model:this.widgets.get(params[0]), editor:this.editor}
            bc = ViewFields.Class
            ba = {id:'panelBtm', collection:this.constants, editor:this.editor}
            break
        case 'project':
            tc = ViewProject.Class
            ta = {id:'panelTop', model:this.projects.get(params[0]), collection:this.widgets, editor:this.editor}
            bc = ViewWidgets.Class
            ba = {id:'panelBtm', collection:this.widgets, editor:this.editor}
            break
        default:
            tc = ViewProjects.Class
            ta = {id:'panelTop', collection:this.projects, editor:this.editor}
            bc = ViewWidgets.Class
            ba = {id:'panelBtm', collection:this.widgets, editor:this.editor}
            break
        }

        if (!(t instanceof tc)){
            if (t) t.remove()
            t = new tc(ta)
        }
        if (!(b instanceof bc)){
            if (b) b.remove()
            b = new bc(ba)
        }

        this.panelTop = t
        this.panelBtm = b

        this.render()
    },

    render: function(){
        var $el = this.$el
        $el.append(this.panelTop.render())
        $el.append(this.panelBtm.render())
    }
})
