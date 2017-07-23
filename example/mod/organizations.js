var router=require('po/router')
return {
	create:function(){
//		setTimeout(function(){router.go('users/u156')}, 1000)
	},
	slots:{
		click:function(from,sender,name){
			switch(name){
			case 'next':
				router.go('users/u156')
				break
			}
		},
		select:function(from,sender){
		}
	}
}
