var
Module = require('Module'),
Router = require('Router'),
common = require('modules/common'),
addRow = function(model){
    if ('vehicle' !== model.get('type')) return
    var
    s = model.get('status'),
    id = model.id
    if (1 !== s) return
    this.grid[id] = this.spawn(this.Row, [id])
},
removeRow = function(model){
    var id = model.id
    this.grid[id].remove()
    delete this.grid[id]
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
    className: 'table-view',
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
