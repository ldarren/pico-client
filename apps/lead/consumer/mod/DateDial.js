var DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

return{
	tagName:'ul',
	className:'days',
	deps:{
		today:['date',new Date()],
		html:'file'
	},
	create:function(deps){
		this.el.innerHTML=deps.html
	}
}
