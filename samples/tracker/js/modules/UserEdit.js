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
        user = this.require('user').value,
        owner = this.require('owner').value,
        data = this.require('data').value,
        mi = data.get(owner.models[0].id),
        detail = user.get('json'),
        fields = []

        if(mi.get('user') > 39){
            fields.push({label:'Name', name:'name', value:detail.name, type:'text'}) 
            fields.push({label:'Phone', name:'tel', value:detail.tel, type:'tel'}) 
            fields.push({label:'Email', name:'email', value:detail.email, type:'email'}) 
            fields.push({label:'Role', name:'user', value:user.get('user'), type:'select', options:common.getRole()}) 
        }else{
            if (mi.id === user.id){
                fields.push({label:'Name', name:'name', value:detail.name, type:'text'}) 
                fields.push({label:'Phone', name:'tel', value:detail.tel, type:'tel'}) 
                fields.push({label:'Email', name:'email', value:detail.email, type:'email'}) 
            }else{
                return Router.instance().home(true)
            }
            fields.push({label:'Role', name:'user', value:common.getRoleDesc(user.get('user')), type:'static'}) 
        }

        this.triggerHost('changeHeader', {title:detail.name})

        this.user = user
        this.$el.html(_.template(tpl.text, {dataId:user.id, fields:fields}))
        this.triggerHost('invalidate')
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': window.history.back(); break
        case 'ok':
            this.user.save(null, {
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
