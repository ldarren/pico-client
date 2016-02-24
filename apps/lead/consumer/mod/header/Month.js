var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December']

return{
    className: 'month',
    deps:{
		tpl:'file'
    },
    create: function(deps){
		var now=new Date
		this.monthInt=now.getMonth()
        this.el.innerHTML=deps.tpl({month:MONTHS[this.monthInt]})
		this.monthEle=this.el.querySelector('p.month-name')
    },
    events: {
        'tap span.left': function(e){
			var m=this.monthInt-1
			m=m<0?MONTHS.length-1:m
			this.monthEle.textContent=MONTHS[m]
			this.monthInt=m
        },
        'tap span.right': function(e){
			var m=this.monthInt+1
			m=m>MONTHS.length-1?0:m
			this.monthEle.textContent=MONTHS[m]
			this.monthInt=m
        }
    },
    slots: {
    }
}
