const pStr=require('pico/str')

return {
    setup(context,cb){ cb() },  
    route(req,next){
        switch(req.method){
        case 'POST': return next()
        case 'GET': this.setOutput(this.time)
        default: return next(null, this.sigslot.abort())
        } 
    },
	randomStr($key,size,next){
		let str=''
		while(1){
			str+=pStr.rand()
			if (str.length >= size) break
		}
		this.set($key,str.substr(0,size))
		next()
	},
	have(input,fields,next){
		for(let i=0,f; f=fields[i]; i++){
			if (undefined===input[f]) return next(this.error(400))
		}
		next()
	},
	read(input,$key,$output,next){
		this.set($output,input[$key])
		next()
	},
	redirect($api,next){
		next(null,$api)
	},
    sep(msg,next){console.log(msg); return next()},
    logParams(next){this.log(this.params); return next()},
    delay(period,next){ setTimeout(next,period) },  
    help(next){ next(`api ${this.api} is not supported yet`) }       
}
