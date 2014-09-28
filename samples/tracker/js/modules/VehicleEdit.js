var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/Edit.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'form',
    className: 'input-group card',
    attributes:{ 'action': 'tr/data/update' },
    create: function(spec){
        var
        vehicle = this.require('vehicle').value,
        owner = this.require('owner').value,
        data = this.require('data').value,
        mi = data.get(owner.models[0].id),
        detail = vehicle.get('json'),
        hiddens=[{name:'dataId', value:vehicle.id, type:'hidden'}],
        fields = []

        if(common.isAdminAbove(mi.get('user'))){
            fields.push({label:'Plate #', name:'tag', value:detail.tag, type:'text'}) 
            fields.push({label:'Seater', name:'seater', value:detail.seater, type:'text'}) 
            fields.push({label:'Model', name:'model', value:detail.model, type:'text'}) 
        }else{
            return Router.instance().home(true)
        }

        this.triggerHost('changeHeader', {title:detail.tag})

        this.vehicle = vehicle
        this.$el.html(_.template(tpl.text, {hiddens:hiddens, fields:fields}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': window.history.back(); break
        case 'ok':
            this.vehicle.save(null, {
                data: this.el,
                success: function(model, data){
                    window.history.back();
                }
            })
            break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
