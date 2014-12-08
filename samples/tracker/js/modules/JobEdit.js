var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/Edit.html'),
common = require('modules/common'),
show = function(data, job, detail){
    var
    owner = this.require('owner').value,
    mi = data.get(owner.models[0].id),
    role = mi.get('user'),
    state = parseInt(job.get('job')),
    hiddens=[{name:'dataId', value:job.id, type:'hidden'}],
    fields = [], left=[], right=[]

    fields.push({label:'Customer', name:'customer', value:common.userDesc(data,job.get('createdBy')), type:'static'}) 
    if(common.isAdminAbove(role)){
        switch(state){
        case 10:
        case 20:
            fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', value:detail.pickup, type:'text', required:true}) 
            fields.push({label:'Date', name:'date', value:detail.date, type:'date', required:true}) 
            fields.push({label:'Time', name:'time', value:detail.time, type:'time', required:true}) 
            fields.push({label:'Reason', name:'reason', value:detail.reason, type:'select', options:common.getJobType(), required:true}) 
            fields.push({label:'Dropoff', name:'dropoff', value:detail.dropoff, holder:'Dropoff place', type:'text', required:true}) 
            fields.push({label:'Payment', name:'payment', value:detail.payment, type:'select', options:common.getPaymentType(), required:true}) 
            fields.push({label:'Charge', name:'charge', value:detail.charge, type:'number', required:true}) 
            fields.push({label:'Vehicle', name:'vehicle', value:detail.vehicle, type:'select', options:common.getVehicles(data), required:true}) 
            fields.push({label:'driver', name:'driver', value:detail.driver, type:'select', options:common.getDrivers(data), required:true}) 
            fields.push({label:'Status', name:'job', value:state, type:'select', options:common.getJobState(state, role), required:true})
            break
        default:
            fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', value:detail.pickup, type:'text', readonly:true}) 
            fields.push({label:'Date', name:'date', value:detail.date, type:'date', readonly:true}) 
            fields.push({label:'Time', name:'time', value:detail.time, type:'time', readonly:true}) 
            fields.push({label:'Reason', name:'reason', value:common.jobTypeDesc(detail.reason), type:'static'}) 
            fields.push({label:'Dropoff', name:'dropoff', value:detail.dropoff, holder:'Dropoff place', type:'text', readonly:true}) 
            fields.push({label:'Payment', name:'payment', value:common.paymentTypeDesc(detail.payment), type:'static'}) 
            fields.push({label:'Charge', name:'charge', value:detail.charge, type:'number', readonly:true}) 
            fields.push({label:'Vehicle', name:'vehicle', value:common.vehicleDesc(data, detail.vehicle), type:'static'}) 
            fields.push({label:'driver', name:'driver', value:common.userDesc(data,detail.driver), type:'static'}) 
            fields.push({label:'Status', name:'job', value:state, type:'select', options:common.getJobState(state, role), required:true}) 
            hiddens.push({name:'reason', value:detail.reason})
            hiddens.push({name:'payment', value:detail.payment})
            hiddens.push({name:'vehicle', value:detail.vehicle})
            hiddens.push({name:'driver', value:detail.driver})
            break
        }
        left.push('cancel'), right.push('ok')
    }else if (job.get('createdBy') === mi.id){
        switch(state){
        case 10:
            fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', value:detail.pickup, type:'text', required:true}) 
            fields.push({label:'Date', name:'date', value:detail.date, type:'date', required:true}) 
            fields.push({label:'Time', name:'time', value:detail.time, type:'time', required:true}) 
            fields.push({label:'Reason', name:'reason', value:detail.reason, type:'select', options:common.getJobType(), required:true}) 
            fields.push({label:'Dropoff', name:'dropoff', value:detail.dropoff, holder:'Dropoff place', type:'text', required:true}) 
            fields.push({label:'Payment', name:'payment', value:detail.payment, type:'select', options:common.getPaymentType(), required:true}) 
            fields.push({label:'Charge', name:'charge', value:detail.charge, type:'static'}) 
            fields.push({label:'Vehicle', name:'vehicle', value:detail.vehicle, type:'static', url:'#vehicle/'}) 
            fields.push({label:'driver', name:'driver', value:detail.driver, type:'static', url:'#user/'}) 
            fields.push({label:'Status', name:'job', value:state, type:'select', options:common.getJobState(state, role), required:true}) 
            left.push('cancel'), right.push('ok')
            break
        case 20:
            fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', value:detail.pickup, type:'text', readonly:true}) 
            fields.push({label:'Date', name:'date', value:detail.date, type:'date', readonly:true}) 
            fields.push({label:'Time', name:'time', value:detail.time, type:'time', readonly:true}) 
            fields.push({label:'Reason', name:'reason', value:common.jobTypeDesc(detail.reason), type:'static'}) 
            fields.push({label:'Dropoff', name:'dropoff', value:detail.dropoff, holder:'Dropoff place', type:'text', readonly:true}) 
            fields.push({label:'Payment', name:'payment', value:common.paymentTypeDesc(detail.payment), type:'static'}) 
            fields.push({label:'Charge', name:'charge', value:detail.charge, type:'number', readonly:true}) 
            fields.push({label:'Vehicle', name:'vehicle', value:common.vehicleDesc(data, detail.vehicle), type:'static'}) 
            fields.push({label:'driver', name:'driver', value:common.userDesc(data,detail.driver), type:'static'}) 
            fields.push({label:'Status', name:'job', value:state, type:'select', options:common.getJobState(state, role), required:true}) 
            hiddens.push({name:'reason', value:detail.reason})
            hiddens.push({name:'payment', value:detail.payment})
            hiddens.push({name:'vehicle', value:detail.vehicle})
            hiddens.push({name:'driver', value:detail.driver})
            left.push('cancel'), right.push('ok')
            break
        default:
            fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', value:detail.pickup, type:'text', readonly:true}) 
            fields.push({label:'Date', name:'date', value:detail.date, type:'date', readonly:true}) 
            fields.push({label:'Time', name:'time', value:detail.time, type:'time', readonly:true}) 
            fields.push({label:'Reason', name:'reason', value:common.jobTypeDesc(detail.reason), type:'static'}) 
            fields.push({label:'Dropoff', name:'dropoff', value:detail.dropoff, holder:'Dropoff place', type:'text', readonly:true}) 
            fields.push({label:'Payment', name:'payment', value:common.paymentTypeDesc(detail.payment), type:'static'}) 
            fields.push({label:'Charge', name:'charge', value:detail.charge, type:'number', readonly:true}) 
            fields.push({label:'Vehicle', name:'vehicle', value:common.vehicleDesc(data, detail.vehicle), type:'static'}) 
            fields.push({label:'driver', name:'driver', value:common.userDesc(data,detail.driver), type:'static'}) 
            fields.push({label:'Status', name:'job', value:common.jobStateDesc(state), type:'static'}) 
            fields.push({label:'Code', name:'code', value:job.get('code'), type:'number', readonly:true}) 
            hiddens.push({name:'reason', value:detail.reason})
            hiddens.push({name:'payment', value:detail.payment})
            hiddens.push({name:'vehicle', value:detail.vehicle})
            hiddens.push({name:'driver', value:detail.driver})
            hiddens.push({name:'job', value:state})
            left.push('left-nav')
            break
        }
    }else if (detail.driver == mi.id){
        switch(state){
        case 20:
            fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', value:detail.pickup, type:'text', readonly:true}) 
            fields.push({label:'Date', name:'date', value:detail.date, type:'date', readonly:true}) 
            fields.push({label:'Time', name:'time', value:detail.time, type:'time', readonly:true}) 
            fields.push({label:'Reason', name:'reason', value:common.jobTypeDesc(detail.reason), type:'static'}) 
            fields.push({label:'Dropoff', name:'dropoff', value:detail.dropoff, holder:'Dropoff place', type:'text', readonly:true}) 
            fields.push({label:'Payment', name:'payment', value:common.paymentTypeDesc(detail.payment), type:'static'}) 
            fields.push({label:'Charge', name:'charge', value:detail.charge, type:'number', readonly:true}) 
            fields.push({label:'Vehicle', name:'vehicle', value:common.vehicleDesc(data, detail.vehicle), type:'static'}) 
            fields.push({label:'driver', name:'driver', value:common.userDesc(data,detail.driver), type:'static'}) 
            fields.push({label:'Status', name:'job', value:state, type:'select', options:common.getJobState(state, role), required:true}) 
            hiddens.push({name:'reason', value:detail.reason})
            hiddens.push({name:'payment', value:detail.payment})
            hiddens.push({name:'vehicle', value:detail.vehicle})
            hiddens.push({name:'driver', value:detail.driver})
            left.push('cancel'), right.push('ok')
            break
        case 30:
            fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', value:detail.pickup, type:'text', readonly:true}) 
            fields.push({label:'Date', name:'date', value:detail.date, type:'date', readonly:true}) 
            fields.push({label:'Time', name:'time', value:detail.time, type:'time', readonly:true}) 
            fields.push({label:'Reason', name:'reason', value:common.jobTypeDesc(detail.reason), type:'static'}) 
            fields.push({label:'Dropoff', name:'dropoff', value:detail.dropoff, holder:'Dropoff place', type:'text', readonly:true}) 
            fields.push({label:'Payment', name:'payment', value:common.paymentTypeDesc(detail.payment), type:'static'}) 
            fields.push({label:'Charge', name:'charge', value:detail.charge, type:'number', readonly:true}) 
            fields.push({label:'Vehicle', name:'vehicle', value:common.vehicleDesc(data, detail.vehicle), type:'static'}) 
            fields.push({label:'driver', name:'driver', value:common.userDesc(data,detail.driver), type:'static'}) 
            fields.push({label:'Status', name:'job', value:state, type:'select', options:common.getJobState(state, role), required:true}) 
            fields.push({label:'Code', name:'verify', value:'', type:'number', required:true}) 
            hiddens.push({name:'reason', value:detail.reason})
            hiddens.push({name:'payment', value:detail.payment})
            hiddens.push({name:'vehicle', value:detail.vehicle})
            hiddens.push({name:'driver', value:detail.driver})
            left.push('cancel'), right.push('ok')
            break
        default:
            fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', value:detail.pickup, type:'text', readonly:true}) 
            fields.push({label:'Date', name:'date', value:detail.date, type:'date', readonly:true}) 
            fields.push({label:'Time', name:'time', value:detail.time, type:'time', readonly:true}) 
            fields.push({label:'Reason', name:'reason', value:common.jobTypeDesc(detail.reason), type:'static'}) 
            fields.push({label:'Dropoff', name:'dropoff', value:detail.dropoff, holder:'Dropoff place', type:'text', readonly:true}) 
            fields.push({label:'Payment', name:'payment', value:common.paymentTypeDesc(detail.payment), type:'static'}) 
            fields.push({label:'Charge', name:'charge', value:detail.charge, type:'number', readonly:true}) 
            fields.push({label:'Vehicle', name:'vehicle', value:common.vehicleDesc(data, detail.vehicle), type:'static'}) 
            fields.push({label:'driver', name:'driver', value:common.userDesc(data,detail.driver), type:'static'}) 
            fields.push({label:'Status', name:'job', value:common.jobStateDesc(state), type:'static'}) 
            hiddens.push({name:'reason', value:detail.reason})
            hiddens.push({name:'payment', value:detail.payment})
            hiddens.push({name:'vehicle', value:detail.vehicle})
            hiddens.push({name:'driver', value:detail.driver})
            hiddens.push({name:'job', value:state})
            hiddens.push({name:'verify', value:detail.verify}) 
            left.push('left-nav')
            break
        }
    }else{
        return Router.instance.home(true)
    }

    this.$el.html(_.template(tpl.text, {hiddens:hiddens, fields:fields}))
    this.triggerHost('changeHeader', {left:left, right:right})
},
getData = function(data, customerId, driverId, vehicleId, cb){
    var dataIds = []
    if (customerId && !data.get(customerId)) dataIds.push(customerId)
    if (driverId && !data.get(driverId)) dataIds.push(driverId)
    if (vehicleId && !data.get(vehicleId)) dataIds.push(vehicleId)
    if (!dataIds.length) return cb()
    data.fetch({
        data:{dataIds:dataIds},
        remove: false,
        success:function(){ cb() },
        error: function(){ cb() }
    })
}

exports.Class = Module.Class.extend({
    tagName: 'form',
    className: 'input-group card',
    attributes:{ 'action': 'tr/data/update' },
    create: function(spec){
        var
        self = this,
        job = this.require('job').value,
        data = this.require('data').value,
        detail = job.get('json')

        this.job = job

        getData(data, job.get('createdBy'), detail.driver, detail.vehicle, function(){
            show.call(self, data, job, detail)
        })
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': Router.instance.back(); break
        case 'ok':
            if(!this.el.checkValidity()) return alert('Missing Params')
            this.job.save(null, {
                data: this.el,
                success: function(model, data){
                    Router.instance.back()
                }
            })
            break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
