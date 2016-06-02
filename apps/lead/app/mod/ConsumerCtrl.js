var 
Router=require('js/Router'),
prepareForm0=function(self,result,form){
    var lockers=self.deps.lockers
    for(var i=0,f,o; f=form[i]; i++){
        switch(f.name){
        case 'lockerId':
            o=f.options
            o.length=0
            for(var j=0,l;l=lockers.at(j); j++){
                o.push([l.id,l.get('name')])
            }
            break
        case 'collection':
            var d=new Date(Date.now()+self.deps.leadTime)
            f.value=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()
            break
        }
    }
    return form
},
prepareForm1=function(self,result,form){
    for(var i=0,f,o; f=form[i]; i++){
        switch(f.name){
        case 'return':
            var c=result.collection
            o=f.options
            o.length=0
            for(var j=1;l<5; j++){
                o.push([j,(new Date((new Date(c)).getTime()+(j*86400000))).toLocaleDate()+' +'+surcharge[j]])
            }
            break
        }
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
		addRequest:'list',
        leadTime:['int',10800],
        surcharge:['list',[0,100,50,25,0]]
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
			this.signals.modalShow(this.deps.addRequest).send(this.host)
		},
        pageCreate:function(from,sender,index,total,form,cb){
			cb('Add Request, Step '+(index+1),prepareForm(this,index,this.result,form))
        },
        pageResult:function(from,sender,result,cb){
            this.result=result
            cb()
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
