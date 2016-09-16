return {
	deps:{
		msg:'text',
		count:['int',2]
	},
	signals:['showSomething'],
	create:function(){
		signals.showSomething(deps.msg)
		for(var i=0,l=deps.count; i<l; i++){
			console.log(deps.msg)
		}
	},
	update:function(){
	},
	remove:function(){
	},
	slots:{
		dosomething:function(arg1,arg2){
		}
	}
}
