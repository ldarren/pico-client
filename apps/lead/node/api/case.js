var
sqlCase=require('sql/case'),
picoStr=require('pico/str'),
picoObj=require('pico/obj')

module.exports= {
    setup: function(context, next){
        next()
    },
	create:function(input,next){
        next()
	},
	update:function(input,next){
        next()
	},
    poll:function(input,next){
        this.setOutput('hello SSE')
        next()
    }
}
