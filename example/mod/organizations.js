var router=require('po/router')
return {
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
