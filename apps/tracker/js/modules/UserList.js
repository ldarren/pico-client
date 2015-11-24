var
Module = require('Module'),
Router = require('Router'),
common = require('modules/common'),
voidTpl = require('@html/Void.html'),
addRow = function(model){
    if ('user' !== model.get('type')) return
    var role = parseInt(model.get('user'))
    if (model.id !== this.myId && -1 === this.viewableRoles.indexOf(role)) return

    var id = model.id

    if (this.whitelist && -1 === this.whitelist.indexOf(role)) return

    if (1 !== model.get('status')) return

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
searchName = function(model){
    if ('user' !== model.get('type')) return
    var m = model.get('json')
    return m.name && -1 !== m.name.toLowerCase().indexOf(this)
},
reload = function(keywords){
    this.empty()
    var models = keywords && keywords.length ? this.data.filter(searchName, keywords.toLowerCase()) : this.data.models

    for(var i=0,m; m=models[i]; i++){
        addRow.call(this, m)
    }
},
ok = function(){
    Router.instance.go('report/5/FROM/TO/ID'.replace('FROM', this.params[0]).replace('TO', this.params[1]).replace('ID',this.selectedId), true)
}

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'voidPage',
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
        this.data = data
        this.grid = {}

        this.$el.html(_.template(voidTpl.text, {icon:'folder-open-empty', message:'Empty'}))

        reload.call(this)

        this.listenTo(data, 'add', addRow)
        this.listenTo(data, 'remove', removeRow)
    },
    events:{
        'touchstart li': function(e){
            var selected = e.currentTarget
            this.$('li').removeAttr('style')
            $(selected).css('background','#f0ffff')
            this.selectedId = selected.getAttribute('userData')

            if (1 === Object.keys(this.grid).length) ok.call(this)
        }
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'ok': return ok.call(this)
        case 'cancel': return Router.instance.back()
        case 'find': return reload.call(this, arguments[2])
        }
    }
})
