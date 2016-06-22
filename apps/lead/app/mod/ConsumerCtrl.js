var 
Router=require('js/Router'),
picoStr=require('pico/str'),
datetime=function(unixtime){
    var d=new Date(unixtime)
    return d.getFullYear()+'-'+
        picoStr.pad(d.getMonth()+1,2)+'-'+
        picoStr.pad(d.getDate(),2)+'T'+
        picoStr.pad(d.getHours(),2)+':'+
        picoStr.pad(d.getMinutes(),2)
},
prepareDelivery=function(collect,surcharges,o){
    var c=(new Date(collect)).getTime()
    o.length=0
    for(var j=0,s;s=surcharges.at(j); j++){
        o.push([s.id,s.get('name')+'\t['+(new Date(c+(s.get('lead')*86400000))).toLocaleDateString()+'] Fee: '+s.get('percent')+'%'])
    }
    return o
},
prepareForm0=function(self,result,form){
    var lockers=self.deps.lockers
    for(var i=0,f,o,v; f=form[i]; i++){
        switch(f.name){
        case 'lockerId':
            o=f.options
            o.length=0
            for(var j=0,l;l=lockers.at(j); j++){
                o.push([l.id,l.get('name')])
            }
            break
        }
        v=result[f.name]
        if (undefined!==v) f.value=v
    }
    return form
},
prepareForm1=function(self,result,form){
    var deps=self.deps

    for(var i=0,f,o,v; f=form[i]; i++){
        switch(f.name){
        case 'collect':
            f.min=f.value=datetime(Date.now()+deps.leadTime)
            f.max=datetime(Date.now()+(deps.leadTime*21))
            break
        case 'delivery':
            prepareDelivery(datetime(Date.now()+deps.leadTime),deps.surcharges,f.options)
            break
        case 'process':
            var
            laundryOpt=deps.laundryOpt,
            o=f.options
            o.length=0
            for(var j=0,l;l=laundryOpt.at(j); j++){
                o.push([l.id,l.get('name')])
            }
            break
        }
        v=result[f.name]
        if (undefined!==v) f.value=v
    }
    return form
},
prepareForm=function(self,index,result,form){
    switch(index){
    case 0: return prepareForm0(self,result,form)
    case 1: return prepareForm1(self,result,form)
    }
}
return {
	signals:['modalShow'],
	deps:{
		requests:'models',
		lockers:'models',
		laundryOpt:'models',
		surcharges:'models',
		addRequest:'list',
        leadTime:['int',28800000]
	},
	create:function(deps){
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			if (!this.deps.lockers.length) 
				return __.dialogs.alert(
					'You need a locker to add request',
					'No locker',
					'Add locker',
					function(){ 
						Router.go('locker')
					}
			)
            this.result={}
			this.signals.modalShow(this.deps.addRequest).sendNow(this.host)
		},
        pageCreate:function(from,sender,index,total,form,cb){
			cb('Add Request, Step '+(index+1),prepareForm(this,index,this.result,form))
        },
        pageResult:function(from,sender,result,cb){
            this.result=result
            cb()
        },
        pageChange:function(from,sender,name,value,cb){
            this.result[name]=value
            switch(name){
            case 'collect':
                var deps=this.deps
                return cb('delivery',this.result['delivery']||1,prepareDelivery(value,deps.surcharges,[]))
            }
        },
		modalResult:function(from,sender,result){
			this.deps.requests.create(null,{
				data:{
					$detail:result,
					lockerId:parseInt(result.lockerId)
				},
				wait:true,
				success:function(){
					debugger
				},
				error:function(){
					debugger
				}
			})
		}
	}
}
