var
crypto=pico.import('crypto'),
redisGreets=require('redis/greets'),
tpl=require('tpl/greet.html'),
codechar=function(codes){
    return String.fromCodePoint(...codes)
}

return {
    setup: function(context, next){
        next()
    },
    create: function(input,next){
        var
        data=JSON.stringify(input),
        hash=crypto.createHash('md5').update(data).digest('hex')

        redisGreets.create(hash, data, (err)=>{
            if (err) return next(this.error(500))
            this.setOutput({id:hash})
            next()
        })
    },
    read: function(input,next){
        var id=input.id
        redisGreets.read(id, (err, json)=>{
            if (err) return next(this.error(500))
            try{var obj=JSON.parse(json)}
            catch(exp){return next(this.error(500))}
            if (!obj) return next(this.error(500))
            var
            title=codechar(obj.title),
            desc=codechar(obj.desc)
            this.setOutput(tpl.replace(/URL/g, obj.url).replace(/TITLE/g, title).replace(/DESC/g, desc).replace(/ID/g,id))
            next()
        })
    }
}
