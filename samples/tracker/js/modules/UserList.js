var
Module = require('Module'),
common = require('modules/common'),
addRow = function(model){
    if ('user' !== model.get('type')) return
    if (model.id !== this.myId && -1 === this.viewableRoles.indexOf(parseInt(model.get('user')))) return
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
        this.viewableRoles = common.viewableRoles(data.get(this.myId).user)
        this.Row = this.requireType('module')
        this.grid = {}

        data.forEach(function(model){
            addRow.call(self, model)
        })
        this.listenTo(data, 'add', addRow)
        this.listenTo(data, 'remove', removeRow)

        this.triggerHost('invalidate')
    },

    moduleEvents: function(evt, sender){
        switch(evt){
        case 'invalidate': this.$el.append(sender.render()); break
        }
    }
})
