var
Module = require('Module'),
Router = require('Router'),
common = require('modules/common'),
addRow = function(model){
    if ('job' !== model.get('type')) return
    var
    s = model.get('status'),
    id = model.id
    if (1 !== s) return

    if(this.dataUsers.findWhere({dataId:this.myId, refId:id})) this.grid[id] = this.proxy(this.Row, [id])
},
removeRow = function(model){
    var id = model.id
    this.grid[id].remove()
    delete this.grid[id]
},
checkRight = function(mi){
    if (!mi) return
    var role = mi.get('user')

    if (common.isCustomer(role) || common.isAdminAbove(role)) this.triggerHost('changeHeader', {right:['plus']})
}

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'table-view',
    create: function(spec){
        var
        data = this.require('data').value,
        owner = this.require('owner').value
        
        this.dataUsers = this.require('dataUsers').value
        this.myId = owner.models[0].id

        var self = this

        checkRight.call(this, data.get(this.myId))

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
        case 'plus': Router.instance().nav('job/new'); break 
        case 'userReady': checkRight.call(this, arguments[2]); break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments); break
        }
    }
})
