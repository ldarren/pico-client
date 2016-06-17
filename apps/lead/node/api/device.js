var
sqlDevice=require('sql/device'),
picoObj=require('pico/obj'),
notifier

module.exports= {
    setup: function(context, next){
        notifier=context.pdl_consumer_notifier
        next()
    },
    update: function(input, next){
        var device={
            userId:input.id,
            uuid:input.uuid,
            token:input.token,
            os:input.os,
            $detail:input.$detail
        }
        sqlDevice.findByUserIdUUID(input.id, input.uuid, (err, rows)=>{
            if (err) return cb(err)
            if (rows.length){
                device['id']=rows[0].id
                sqlDevice.map_set(device,input.id,(err)=>{
                    if (err) return next(this.error(500,err))
                    next()
                })
            }else{
                sqlDevice.set(device, input.id, (err)=>{
                    if (err) return next(this.error(500,err))
                    next()
                })
            }
        })
    },
    readTokens: function(users, output, next){
        sqlDevice.gets(users,(err,devices)=>{
            if (err) return next(this.error(500, err))
            if (!devices.length) return next()// TODO: add chrome and safari notification
            sqlDevice.map_gets(devices,(err,maps)=>{
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
