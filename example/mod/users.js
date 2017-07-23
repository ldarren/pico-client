var router=require('po/router')
return {
	create:function(){
//		setTimeout(function(){router.go('organizations')}, 1000)
	},
	slots:{
		click:function(from,sender,name){
			switch(name){
			case 'back':
				router.go('organizations')
				break
			}
		}
	}
}
