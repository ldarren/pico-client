var
errorMsgs=function(fe,ee){
    //Find all invalid fields within the form.
    var
    es=fe.querySelectorAll(':invalid'),
    label,li,span
    for(var i=0,f; f=es[i]; i++){
        li=document.createElement('li')

        //Find the field's corresponding label
        label = fe.querySelector('label[for=' + f.name + ']')
       
        span=document.createElement('span')
        span.textContent=label?label.textContent:name
        li.appendChild(span)

        span=document.createElement('span')
        //Opera incorrectly does not fill the validationMessage property.
        span.textContent=f.validationMessage || 'Invalid value.';
        li.appendChild(span)

        ee.appendChild(li)
    }
    ee.classList.remove('hidden')
},
getFieldValue=function(f){
    switch(f.type){
    case 'checkbox': return f.checked?1:0
    case 'number':
    case 'range': return f.valueAsNumber
    default: return f.value
    }
},
setFieldValue=function(f,v,options){
    if (!f) return
    switch(f.type){
    case 'checkbox': return f.checked=v?true:false
    case 'select-one':
        var
        holder=f.children[0],
        option=document.createElement('option')
        
        f.innerHTML=''

        if (v) option.selected=true
        option.disabled=true
        option.text=holder?holder.text:'Select an option'

        f.appendChild(option)
        
        for(var j=0,o; o=options[j]; j++){
            option=document.createElement('option')
            option.value=o[0]
            if (o[0]==v) option.selected=true
            option.text=o[1]
            f.appendChild(option)
        }
        break
    default: return f.value=v
    }
}

return {
    tagName:'form',
    className: 'form',
    signals:['formChange'],
    deps:{
		tpl:'file',
		rows:'list'
    },
    create: function(deps){
		if (deps.rows) this.el.innerHTML=deps.tpl(deps.rows)
    },
    events:{
        change:function(e){
            var f=e.target
            this.signals.formChange(f.name, getFieldValue(f)).send()
        }
    },
    slots:{
		formShow:function(from,sender,rows){
			this.el.innerHTML=this.deps.tpl(rows)
		},
        formUpdate:function(from,sender,name,value,options){
            setFieldValue(this.el.querySelector('[name='+name+']'),value,options)
        },
		formCollect:function(from,sender,verify,cb){
			var
			fe = this.el,
			ee = fe.querySelector('.errors')
			
			ee.textContent = ''
            ee.classList.add('hidden')
			
			if (verify && !fe.checkValidity()){
				cb('form error')
				return errorMsgs(fe,ee)
			}
			var results={}
			for(var i=0,f; f=fe[i]; i++){
                results[f.name]=getFieldValue(f)
			}
			cb(null, results)
		}
    }
}
