var
Module = require('Module'),
Router = require('Router'),
common = require('modules/common'),
addRow = function(model){
    if ('job' !== model.get('type')) return
    if (1 !== model.get('status')) return

    var
    m = model.attributes,
    id = m.id,
    d = m.json || {}

    if (-1 === this.filter.indexOf(m.job)) return

    if (-1 !== [m.createdBy, parseInt(d.driver)].indexOf(this.myId) || common.isAdminAbove(this.role)) this.grid[id] = this.proxy(this.Row, [id])
},
removeRow = function(model){
    var id = model.id
    this.grid[id].remove()
    delete this.grid[id]
},
checkRight = function(mi){
    if (!mi || this.role) return
    var role = this.role = mi.get('user')

    if (common.isCustomer(role) || common.isAdminAbove(role)) this.triggerHost('changeHeader', {right:['plus']})

    this.data.forEach(function(model){
        addRow.call(this, model)
    }, this)
}

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'table-view',
    create: function(spec){
        var
        data = this.require('data').value,
        owner = this.require('owner').value
        
        this.myId = owner.models[0].id
        this.Row = this.requireType('module')
        this.filter = this.require('filter').value || []
        this.data = data
        this.grid = {}

        checkRight.call(this, data.get(this.myId))

        this.listenTo(data, 'add', addRow)
        this.listenTo(data, 'remove', removeRow)
    },

    moduleEvents: function(evt, sender){
        switch(evt){
        case 'plus': Router.instance.go('job/new'); break 
        default: Module.Class.prototype.moduleEvents.apply(this, arguments); break
        }
    }
})
