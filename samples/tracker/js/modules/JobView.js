var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/View.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    create: function(spec){
        var
        vehicle = this.require('vehicle').value,
        owner = this.require('owner').value,
        data = this.require('data').value,
        mi = data.get(owner.models[0].id),
        isAdmin = common.isAdminAbove(mi.get('user')),
        detail = vehicle.get('json'),
        fields = [], actions = []

        if (isAdmin) this.triggerHost('changeHeader', {title:detail.tag, right:['edit']})

        this.vehicle = vehicle
        this.owner = owner
        fields.push({label:'Plate #', value:detail.tag}) 
        fields.push({label:'Seater', value:detail.seater}) 
        fields.push({label:'Model', value:detail.model}) 
        fields.push({label:'Join Date', value:(new Date(vehicle.get('createdAt'))).toLocaleDateString(common.getLang(), common.getDateFormat())})

        if (isAdmin) actions.push({icon:'btn-negative', name:'delete', text:'Remove'})

        this.$el.html(_.template(tpl.text, {fields:fields, actions:actions}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'edit': Router.instance().nav('vehicle/edit/'+this.vehicle.id); break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    },
    events: {
        'click button[name=delete]': 'del'
    },
    del: function(e){
        this.vehicle.destroy()
    }
})
