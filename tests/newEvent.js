function send(a){
	setTimeout(function(api, args, modules){
		var i, m
		switch(typeof a){
		case 'object':
			if (a.length){
				for(i=0; (m=modules[i]); i++){
					if (-1 === a.indexOf(m)) console.log(m, api, args)
				}
			}else{
				console.log(a, api, args)
			}
			break
		case 'string': // actual case dun need
			console.log(a, api, args)
			break
		default:
			for(i=0; (m=modules[i]); i++){
				console.log(m, api, args)
			}
			break
		}
	}, 0, this.api, this.args, this.context.modules)
}

var Com = {
	requires:{
		users:'models',
		config:'map',
		options:'list',
		owner:'model'
	},
	signals: ['popup', 'invalidate','actions'],
	modules: ['a','b','c'],
	initialize: function(){
		var
			temp = this.signals,
			signals = {},
			x

		for(var i=0,s; (s=temp[i]); i++){
			x = function(){
				arguments.callee.args = Array.prototype.slice.call(arguments)
				return arguments.callee
			}
			x.context = this
			x.api = s
			x.send = send
			signals[s] = x
		}
		this.signals = signals
	},
	slots: {
		popup: function(sender){
		},
		invalidate: function(sender){
		},
		actions: function(sender){
		}
	},
	action: function(){
		this.signals.popup('arg1', 'arg2').send(['a'])
		this.signals.invalidate('inv1').send('b')
		this.signals.actions('act1', 'act2').send()
	}
}

Com.initialize()
Com.action()
