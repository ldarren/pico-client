return {
    setup:function(context,cb){
        cb()
    },
    decision:function(req,next){
        if('DELETE'===req.method) return next('safari.pushId.remove')
		next('safari.pushId.update')
    },
	redirect:function(res,next){
		res.setHeader('X-Accel-Redirect','/pico/client/apps/mindsair/apn/')
		next()
	},
	update:function(next){
		next()
	},
	remove:function(next){
		next()
	},
	log:function(next){
		next()
	}
}
/* order
pushId=A2F9291A69A0120FA71BC13E951626B38D1C451DDDEBCC5F9F060CAA5FCE42DD
DELETE /msair/v1/devices/A2F9291A69A0120FA71BC13E951626B38D1C451DDDEBCC5F9F060CAA5FCE42DD/registrations/web.com.jasaws.mindsair-st
POST /msair/v1/pushPackages/web.com.jasaws.mindsair-st
POST /msair/v1/devices/A2F9291A69A0120FA71BC13E951626B38D1C451DDDEBCC5F9F060CAA5FCE42DD/registrations/web.com.jasaws.mindsair-st
*/
