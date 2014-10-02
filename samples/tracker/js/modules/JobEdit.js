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
        job = this.require('job').value,
        owner = this.require('owner').value,
        data = this.require('data').value,
        mi = data.get(owner.models[0].id),
        role = mi.get('user'),
        state = parseInt(job.get('job')),
        detail = job.get('json'),
        hiddens=[{name:'dataId', value:job.id, type:'hidden'}],
        fields = []

        if(common.isAdminAbove(role)){
            switch(state){
            case 10:
                fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', value:detail.pickup, type:'text'}) 
                fields.push({label:'Date', name:'date', value:detail.date, type:'date'}) 
                fields.push({label:'Time', name:'time', value:detail.time, type:'time'}) 
                fields.push({label:'Reason', name:'reason', value:detail.reason, type:'select', options:common.getJobType()}) 
                fields.push({label:'Dropoff', name:'dropoff', value:detail.dropoff, holder:'Dropoff place', type:'text'}) 
                fields.push({label:'Payment', name:'payment', value:detail.payment, type:'select', options:common.getPaymentType()}) 
                fields.push({label:'Charge', name:'charge', value:detail.charge, type:'number'}) 
                fields.push({label:'Vehicle', name:'vehicle', value:detail.vehicle, type:'select', options:common.getPaymentType()}) 
                fields.push({label:'driver', name:'driver', value:detail.driver, type:'select', options:common.getPaymentType()}) 
                fields.push({label:'Status', name:'job', value:state, type:'select', options:common.getJobState(state, true, false, false)}) 
                break
            case 20:
                break
            case 30:
                break
            default: return
            }
        }else if (job.get('createdBy') === mi.id){
            switch(state){
            case 10:
                fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', value:detail.pickup, type:'text'}) 
                fields.push({label:'Date', name:'date', value:detail.date, type:'date'}) 
                fields.push({label:'Time', name:'time', value:detail.time, type:'time'}) 
                fields.push({label:'Reason', name:'reason', value:detail.reason, type:'select', options:common.getJobType()}) 
                fields.push({label:'Dropoff', name:'dropoff', value:detail.dropoff, holder:'Dropoff place', type:'text'}) 
                fields.push({label:'Payment', name:'payment', value:detail.payment, type:'select', options:common.getPaymentType()}) 
                fields.push({label:'Charge', name:'charge', value:detail.charge, type:'static'}) 
                fields.push({label:'Vehicle', name:'vehicle', value:detail.vehicle, type:'static', url:'#vehicle/'}) 
                fields.push({label:'driver', name:'driver', value:detail.driver, type:'static', url:'#user/'}) 
                fields.push({label:'Status', name:'job', value:state, type:'select', options:common.getJobState(state, true, false, false)}) 
                break
            case 20:
                break
            case 30:
                break
            default: return
            }
        }else if (detail.driver === mi.id){
            switch(state){
            case 20:
                break
            case 30:
                break
            default: return
            }
        }else{
            return Router.instance().home(true)
        }

        this.job = job
        this.$el.html(_.template(tpl.text, {hiddens:hiddens, fields:fields}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': window.history.back(); break
        case 'ok':
            if(!this.el.checkValidity()) return alert('Missing Params')
            this.job.save(null, {
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
