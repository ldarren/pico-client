var Module = require('Module')

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'table-view',
    create: function(spec){
        var
        self = this,
        index = this.require('index')

        this.Cell = this.requireType('module')
        this.grid = {}

        index.forEach(function(model){
            self.addRow(model)
        })
        this.listenTo(index, 'add', addRow)
        this.listenTo(index, 'remove', removeRow)

        this.triggerHost('invalidate')
    },

    moduleEvents: function(evt, sender){
        switch(evt){
        case 'invalidate': this.$el.append(sender.render()); break
        }
    },

    addRow: function(model){
        var
        s = model.get('status'),
        id = model.id
        if (1 !== s) return
        this.grid[id] = this.proxy(this.Cell, [id])
    },

    removeRow: function(model){
        var id = model.id
        this.grid[id].remove()
        delete this.grid[id]
    }
})
