var
Module = require('Module'),
Router = require('Router'),
common = require('modules/common'),
addRow = function(model){
    if ('user' !== model.get('type')) return
    var role = parseInt(model.get('user'))
    if (model.id !== this.myId && -1 === this.viewableRoles.indexOf(role)) return

    var id = model.id

    if (this.whitelist && -1 === this.whitelist.indexOf(role)) return

    if (1 !== model.get('status')) return
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
    create: function(spec, params){
        var
        self = this,
        data = this.require('data').value,
        owner = this.require('owner').value    

        this.params = params
        this.myId = owner.models[0].id
        this.viewableRoles = common.viewableRoles(data.get(this.myId).get('user'))
        this.Row = this.requireType('module')
        this.whitelist = this.require('whitelist').value,
        this.grid = {}

        data.forEach(function(model){
            addRow.call(self, model)
        })
        this.listenTo(data, 'add', addRow)
        this.listenTo(data, 'remove', removeRow)
    },
    events:{
        'touchstart li': function(e){
            var selected = e.currentTarget
            this.$('li').removeAttr('style')
            $(selected).css('background','#f0ffff')
            this.selectedId = selected.getAttribute('userData')
        }
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'ok': return Router.instance.nav('invoice/2/FROM/TO/ID'.replace('FROM', this.params[0]).replace('TO', this.params[1]).replace('ID',this.selectedId), true)
        case 'cancel': return window.history.back()
        }
    }
})
