var
route = require('route'),
tpl = require('@html/frame.html'),
ModelProjects = require('models/Projects'),
ModelWidgets = require('models/Widgets'),
ViewEditor = require('views/Editor'),
ViewDevice = require('views/Device'),
ViewList = require('views/List'),
ViewProject = require('views/Project'),
ViewWidget = require('views/Widget'),
ViewSpec = require('views/Spec')

exports.Class = Backbone.View.extend({
    el: 'body',
    initialize: function(options){
        this.projects = new ModelProjects.Class
        this.widgets = new ModelWidgets.Class

        this.el.innerHTML = tpl.text
        this.editor = new ViewEditor.Class({id:'editor', theme:'ace/theme/monokai'})
        this.device = new ViewDevice.Class()
        this.device.render()

        var r = route.instance
        r.on('route', this.changePanel, this)
        Backbone.history.start()
    },

    changePanel: function(path, params){
        if (('project' === path && !this.projects.length) || ('widget' === path && !this.widgets.length)){
            route.instance.navigate('#', {trigger:true})
            return
        }

        this.editor.clear()

        var
        t = this.panelTop,
        b = this.panelBtm,
        changes = [],
        tc,bc,ta,ba

        switch(path){
        case 'widget':
            var m = this.widgets.get(params[0])
            tc = ViewWidget.Class
            ta = {id:'panelTop', model:m, editor:this.editor}
            bc = ViewSpec.Class
            ba = {id:'panelBtm', collection:this.widgets, model:m, editor:this.editor}
            break
        case 'project':
            tc = ViewProject.Class
            ta = {id:'panelTop', model:this.projects.get(params[0]), collection:this.widgets, editor:this.editor}
            bc = ViewSpec.Class
            ba = {id:'panelBtm', collection:this.widgets, editor:this.editor}
            break
        default:
            tc = ViewList.Class
            ta = {id:'panelTop', itemType:'project', collection:this.projects, editor:this.editor}
            bc = ViewList.Class
            ba = {id:'panelBtm', itemType:'widget', collection:this.widgets, editor:this.editor}
            break
        }

        if (!(t instanceof tc)){
            if (t) t.remove()
            t = new tc(ta)
            changes.push(t)
        }else{
            t.$el.trigger('reinit', ta)
        }
        if (!(b instanceof bc)){
            if (b) b.remove()
            b = new bc(ba)
            changes.push(b)
        }else{
            b.$el.trigger('reinit', ba)
        }

        this.panelTop = t
        this.panelBtm = b

        this.render(changes)
    },

    render: function(views){
        var $el = this.$el
        views.forEach(function(view){
            $el.append(view.render())
        })
    }
})
