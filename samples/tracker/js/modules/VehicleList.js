var
Module = require('Module'),
Router = require('Router'),
common = require('modules/common'),
voidTpl = require('@html/Void.html'),
addRow = function(model){
    if ('vehicle' !== model.get('type')) return
    var
    s = model.get('status'),
    id = model.id
    if (1 !== s) return

    if (this.$el.hasClass('voidPage')){
        this.$el.removeClass('voidPage').addClass('table-view')
        this.$el.empty()
    }

    this.grid[id] = this.spawn(this.Row, [id])
},
removeRow = function(model){
    var id = model.id
    this.grid[id].remove()
    delete this.grid[id]

    if (!Object.keys(this.grid).length && !this.$el.hasClass('voidPage')){
        this.$el.removeClass('table-view').addClass('voidPage')
        this.$el.html(_.template(voidTpl.text, {icon:'folder-open-empty', message:'Empty'}))
    }
},
searchLoc = function(model){
    var m = model.get('json')
    return m.tag && -1 !== m.tag.toLowerCase().indexOf(this)
},
reload = function(keywords){
    this.empty()
    var models = keywords && keywords.length ? this.data.filter(searchLoc, keywords.toLowerCase()) : this.data.models

    for(var i=0,m; m=models[i]; i++){
        addRow.call(this, m)
    }
}

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'voidPage',
    create: function(spec){
        var
        data = this.require('data').value,
        owner = this.require('owner').value    

        this.myId = owner.models[0].id
        this.data = data

        var
        mi = data.get(this.myId),
        role = mi.get('user')

        if (!common.isDriverAbove(role)) return Router.instance.home()
        if (common.isAdminAbove(role)) this.triggerHost('changeHeader', {right:['plus']})

        this.Row = this.requireType('module')
        this.grid = {}

        this.$el.html(_.template(voidTpl.text, {icon:'folder-open-empty', message:'Empty'}))

        reload.call(this)

        this.listenTo(data, 'add', addRow)
        this.listenTo(data, 'remove', removeRow)
    },

    moduleEvents: function(evt, sender){
        switch(evt){
        case 'plus': return Router.instance.go('vehicle/new')
        case 'find': return reload.call(this, arguments[2])
        default: return Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
