var
Module = require('Module'),
addRow = function(model){
    if (-1 === this.types.indexOf(model.get('type'))) return
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
        data = this.require('data').value

        this.types = this.require('types').value
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
