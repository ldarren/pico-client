const
Max=Math.max,
pStr=require('pico/str'),
pObj=require('pico/obj'),
sqlDir=require('sql/directory'),
sqlEntity=require('sql/entity') // tmp

let MOD

return {
	setup(context,cb){
		MOD=sqlDir.MOD
		cb()
		let dirs=[]
		this.poll.call({error:console.error},{id:1,grp:'/'},dirs,{t:Date.now()},(err)=>{
			if (err) return console.error(err)
			console.log(dirs)
			sqlEntity.poll(pObj.pluck(dirs,'entityId'),Date.now(),(err,entities,lastseen)=>{
				if (err) return console.error(err)
				console.log(entities,lastseen)
			})
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
	getRole(cred,output,next){
		next()
	},
	userJoin(cred,user,input,next){
		sqlDir.findId(cred.grp,(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next(this.error(400))
			const dir=rows[0]
			// TODO: root and sudo cred should skip this check
			let key,val
			if (MOD.FREE & dir.s.readUInt16LE()){
				key='role',val='member'
			}else{
				key='applicant',val=input.msg||''
			}
			sqlDir.usermap_set(dir.id,user.id,key,val,cred.id,(err)=>{
				if(err) return next(this.error(500))
				next()
			})
		})
	},
	touch(id,next){
		sqlDir.touch(id,(err)=>{
			if (err) return next(this.error(500,err.message))
			next()
		})
	},
	// should return pure dirs
	poll(cred,dirs,output,next){
console.log(output.t)
		sqlDir.poll(cred.id,output.t,(err,usermaps)=>{
console.log(usermaps)
			if (err) return next(this.error(500,err.message))
			if (!usermaps.length) return next()
			sqlDir.filter(usermaps,cred.grp,(err,usermaps)=>{
				if (err) return next(this.error(500,err.message))
				if (!usermaps.length) return next()
				sqlDir.map_getList(usermaps,'entityId',(err,usermaps)=>{
					if (err) return next(this.error(500,err.message))
					dirs.push(...usermaps)
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
	}
}
