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

    if (-1 !== [m.createdBy, parseInt(d.driver)].indexOf(this.myId) || common.isAdminAbove(this.role)) this.grid[id] = this.spawn(this.Row, [id])
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
},
searchLoc = function(model){
    var m = model.get('json')
    return (m.pickup && -1 !== m.pickup.toLowerCase().indexOf(this)) || (m.dropoff && -1 !== m.dropoff.toLowerCase().indexOf(this))
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
        this.Row = this.requireType('module')
        this.filter = this.require('filter').value || []
        this.data = data
        this.grid = {}

        checkRight.call(this, data.get(this.myId))
        reload.call(this)

        this.listenTo(data, 'add', addRow)
        this.listenTo(data, 'remove', removeRow)
    },

    moduleEvents: function(evt, sender){
        switch(evt){
        case 'plus': return Router.instance.go('job/new')
        case 'find': return reload.call(this, arguments[2])
        default: return Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
