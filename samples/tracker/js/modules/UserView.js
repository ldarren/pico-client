var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/View.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'form',
    className: 'input-group card',
    create: function(spec){
        var
        user = this.require('user').value.attributes,
        owner = this.require('owner').value,
        data = this.require('data').value,
        mi = data.get(owner.models[0].id),
        detail = user.json,
        fields = []

        if (mi.id === user.id || mi.get('user') > 39) this.triggerHost('changeHeader', {title:detail.name, right:['edit']})

        this.user = user
        fields.push({label:'Name', value:detail.name}) 
        fields.push({label:'Phone', value:detail.tel, url:'tel:'+detail.tel}) 
        fields.push({label:'Email', value:detail.email, url:'mailto:'+detail.email}) 
        fields.push({label:'Role', value:common.getRoleDesc(user.user)}) 
        fields.push({label:'Join Date', value:(new Date(user.createdAt)).toLocaleDateString(common.getLang(), common.getDateFormat())})
        this.$el.html(_.template(tpl.text, {fields:fields}))
        this.triggerHost('invalidate')
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'edit': Router.instance().nav('user/edit/'+this.user.id); break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
