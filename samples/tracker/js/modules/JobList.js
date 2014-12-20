var
Module = require('Module'),
Router = require('Router'),
common = require('modules/common'),
voidTpl = require('@html/Void.html'),
addRow = function(model){
    if ('job' !== model.get('type')) return
    if (1 !== model.get('status')) return

    var
    m = model.attributes,
    id = m.id,
    d = m.json || {}

    if (-1 === this.filter.indexOf(m.job)) return

    if (this.$el.hasClass('voidPage')){
        this.$el.removeClass('voidPage').addClass('table-view')
        this.$el.empty()
    }

    if (-1 !== [m.createdBy, parseInt(d.driver)].indexOf(this.myId) || common.isAdminAbove(this.role)) this.grid[id] = this.spawn(this.Row, [id])
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
checkRight = function(mi){
    if (!mi || this.role) return
    var
    actions = this.require('actions').value || [],
    allowAdd = actions[0],
    allowRemove = actions[1],
    role = this.role = mi.get('user'),
    right=[]

    if (allowRemove && common.isAdminAbove(role)){
        right.push('minus')
    }
    if (allowAdd && (common.isCustomer(role) || common.isAdminAbove(role))){
        right.push('plus')
    }
    this.triggerHost('changeHeader', {right:right})
},
searchLocName = function(model){
    if ('job' !== model.get('type')) return
    var m = model.get('json')
    if (-1 !== this.users.indexOf(model.get('createdBy')) || -1 !== this.users.indexOf(parseInt(m.driver))) return true
    return (m.pickup && -1 !== m.pickup.toLowerCase().indexOf(this.keyword)) || (m.dropoff && -1 !== m.dropoff.toLowerCase().indexOf(this.keyword))
},
searchName = function(model){
    if ('user' !== model.get('type')) return
    var m = model.get('json')

    if(m.name && -1 !== m.name.toLowerCase().indexOf(this.keyword)){
        this.users.push(model.id)
        return true
    }
    return
},
reload = function(keyword){
    this.empty()
    var models = this.data.models
    if (keyword && keyword.length){
        var
        kw = keyword.toLowerCase(),
        users = []

        this.data.filter(searchName, {keyword:kw, users: users})

        models = this.data.filter(searchLocName, {keyword:kw, users: users})
    }

    for(var i=0,m; m=models[i]; i++){
        addRow.call(this, m)
    }
},
remove = function(data, selectedIds, cb){
    if (!selectedIds.length) return cb()

    var job = data.get(selectedIds.pop())

    if (!job) return remove(data, selectedIds, cb)

    var json = job.get('json')
    json.dataId = job.id
    json.job = '100'

    job.save(null, {
        data: json,
        success: function(){
            remove(data, selectedIds, cb)
        }
    })
},
ok = function(){
    var selectedIds = []
    this.$('li').each(function(i){
        if (this.getAttribute('style')){
            selectedIds.push(this.getAttribute('userData'))
        }
    })
    if (!selectedIds.length) return

    var data = this.data

    if (this.require('canRemove').value){
        remove(data, selectedIds, function(){
            Router.instance.back()
        })
    }else{
        for(var i=0,s; s=selectedIds[i]; i++){
            data.remove(s)
        }
        Router.instance.back()
    }
}

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'voidPage',
    create: function(spec){
        var
        data = this.require('data').value,
        owner = this.require('owner').value
        
        this.myId = owner.models[0].id
        this.Row = this.requireType('module')
        this.filter = this.require('filter').value || []
        this.data = data
        this.grid = {}

        this.$el.html(_.template(voidTpl.text, {icon:'folder-open-empty', message:'Empty'}))

        checkRight.call(this, data.get(this.myId))
        reload.call(this)

        this.listenTo(data, 'add', addRow)
        this.listenTo(data, 'remove', removeRow)
    },
    events:{
        'touchstart li': function(e){
            var $selected = $(e.currentTarget)
            if ($selected.attr('style').length){
                $selected.removeAttr('style')
            }else{
                $selected.css('background','#f0ffff')
                if (1 === Object.keys(this.grid).length) ok.call(this)
            }
        }
    },

    moduleEvents: function(evt, sender){
        switch(evt){
        case 'plus': return Router.instance.go('job/new')
        case 'minus': return Router.instance.go('job/pick/'+(this.require('canRemove').value ? 'remove' : 'forget'))
        case 'find': return reload.call(this, arguments[2])
        case 'ok': return ok.call(this)
        case 'cancel': return Router.instance.back()
        default: return Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
