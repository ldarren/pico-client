var
sqlDevice=require('sql/device'),
picoObj=require('pico/obj'),
notifier,
set=function(input, cb){
    sqlDevice.findByUserId(input.id, (err, rows)=>{
        if (err) return cb(err)
        if (rows.length) return cb(null, rows[0])
        sqlDevice.set({
            userId:input.id,
            token:input.token,
            os:input.os,
            model:input.model
        }, input.id, cb)
    })
}

module.exports= {
    setup: function(context, next){
        notifier=context.pdl_consumer_notifier
        next()
    },
    update: function(input, next){
        set(input, (err, device)=>{
            if (err) return next(this.error(500))
            sqlDevice.map_set(device,input.id,(err)=>{
                if (err) return next(this.error(500))
                next()
            })
        })
    },
    readTokens: function(users, output, next){
        sqlDevice.gets(users,(err,devices)=>{
            if (err) return next(this.error(500, err))
            sqlDevice.map_gets(picoObj.pluck(devices,'id'),(err,maps)=>{
                if (err) return next(this.error(500, err))
                var ids={},tokens={}
                for(var i=0,d; d=maps[i]; i++){
                    switch(d.os){
                    case 'ios':
                        tokens[d.token]=1
                        break
                    case 'android':
                        ids[d.token]=1
                        break
                    }
                }
                output['ids']=ids
                output['tokens']=tokens
                next()
            })
        })
    }
}
