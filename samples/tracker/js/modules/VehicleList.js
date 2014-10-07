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
    this.grid[id] = this.proxy(this.Row, [id])
},
removeRow = function(model){
    var id = model.id
    this.grid[id].remove()
    delete this.grid[id]
}

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'table-view',
    create: function(spec){
        var
        self = this,
        data = this.require('data').value,
        owner = this.require('owner').value    

        this.myId = owner.models[0].id
        var
        mi = data.get(this.myId),
        role = mi.get('user')

        if (!common.isDriverAbove(role)) return Router.instance.home()
        if (common.isAdminAbove(role)) this.triggerHost('changeHeader', {right:['plus']})

        this.Row = this.requireType('module')
        this.grid = {}

        data.forEach(function(model){
            addRow.call(self, model)
        })
        this.listenTo(data, 'add', addRow)
        this.listenTo(data, 'remove', removeRow)
    },

    moduleEvents: function(evt, sender){
        switch(evt){
        case 'plus': Router.instance.nav('vehicle/new'); break 
        default: Module.Class.prototype.moduleEvents.apply(this, arguments); break
        }
    }
})
