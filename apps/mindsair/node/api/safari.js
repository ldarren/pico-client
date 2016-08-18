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

// https://bravenewmethod.com/2011/02/21/node-js-tls-client-example/
// create push package with nodejs https://github.com/MySiteApp/node-safari-push-notifications
// socket https://github.com/argon/node-apn/blob/master/lib/socket.js
