return{
	className: 'void',
	deps:{
		tpl:['file','<%=d.message%>'],
		info:['map',{message:'Empty'}]
	},
	create: function(deps){
		this.el.innerHTML=deps.tpl(deps.info)
	}
}
