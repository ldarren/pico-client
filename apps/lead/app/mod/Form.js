return {
    tagName:'form',
    className: 'form',
    deps:{
		tpl:'file',
		rows:'list'
    },
    create: function(deps){
		if (deps.rows) this.el.innerHTML=deps.tpl(deps.rows)
    },
    slots:{
		formShow:function(from,sender,rows){
			this.el.innerHTML=this.deps.tpl(rows)
		},
		formCollect:function(from,sender,verify,cb){
			var
			fe = this.el,
			ee = fe.querySelector('.error')
			
			ee.textContent = ''
			
			if (verify && !fe.checkValidity()){
				cb('Missing required fields')
				return ee.textContent = 'Missing required fields'
			}
			var results={}
			for(var i=0,f; f=fe[i]; i++){
                switch(f.type){
                case 'checkbox':
				    results[f.name]=f.checked?1:0
                    break
                default:
				    results[f.name]=f.value
                    break
                }
			}
			cb(null, results)
		}
    }
}
