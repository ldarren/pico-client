var webpush

return {
    setup:function(context,cb){
		webpush=context.webPush
        cb()
    },
	send:function(input,next){
		switch(input.os){
		case 'chrome': webpush.broadcast(null,[input.token]); break
		case 'moz': webpush.broadcast(null,null,[input.token]); break
		case 'safari':webpush.broadcast([input.token],null,null,'hello','hellow webpush',['customer','112']); break
		default: console.error('os type unknown',input.os);
		}
		next()
	}
}
