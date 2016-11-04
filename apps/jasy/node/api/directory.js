const
Max=Math.max,
pStr=require('pico/str'),
pObj=require('pico/obj'),
sqlDir=require('sql/directory')

let MOD

return {
	setup(context,cb){
		MOD=sqlDir.MOD
		cb()
		let output=[]
		this.getMyEntityIds.call({error:console.error},{id:1,grp:'/'},output,(err)=>{
			if (err) return console.error(err)
			console.log(output)
		})
	},
    reply(output,next){
        this.setOutput(output)
        next()
    },
    replyPrivate(output,next){
        this.setOutput(output)
        next()
    },
    replyList(list,next){
        this.setOutput(list)
        next()
    },
	newUser(cred,user,next){
		sqlDir.set(cred.grp,user.id,MOD.DIR|MOD.G_RX,cred.id,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	newGroup(cred,input,entity,next){
		let userId=cred.id
		sqlDir.set([cred.grp,userId],input.name,MOD.DIR|MOD.G_RX,userId,(err,meta)=>{
			if(err) return next(this.error(500))
			let id=meta.insertId
			sqlDir.map_set(id,'entityId',entity.id,userId,(err)=>{
				if(err) return next(this.error(500))
				sqlDir.usermap_set(id,userId,'role','root',userId,(err)=>{
					if(err) return next(this.error(500))
					next()
				})
			})
		})
	},
	userJoin(cred,user,next){
		sqlDir.findId(cred.grp,(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next(this.error(400))
			const dir=rows[0]
			let key,val
			if (MOD_FREE & dir.s.readUInt16LE()){
				key='role',val='member'
			}else{
				key='applicant',val=''
			}
			sqlDir.usermap_set(dir.id,user.id,key,val,cred.id,(err)=>{
				if(err) return next(this.error(500))
				next()
			})
		})
	},
	getMyEntityIds(cred,output,next){
		sqlDir.usermap_findId(cred.id,'role',(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next()
			sqlDir.filter(pObj.pluck(rows,'id'),cred.grp,(err,rows)=>{
				if (err) return next(this.error(500,err.message))
				if (!rows.length) return next()
				sqlDir.map_getList(pObj.pluck(rows,'id'),'entityId',(err,rows)=>{
					if (err) return next(this.error(500,err.message))
					output.push(...pObj.pluck(rows,'id'))
					next()
				})
			})
		})
	},
	getDependencies(cred,input,next){
	},
	getMembers(cred,input,next){
	},
	read(input,output,next){
		next()
	},
	poll(input,output,next){
		next()
	}
}
