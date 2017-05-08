var router=require('po/router')
return {
	slots:{
		click:function(from,sender,name){
			switch(name){
			case 'back':
				router.back()
				break
			}
		}
	}
}
