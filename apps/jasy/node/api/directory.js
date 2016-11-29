const
pStr=require('pico/str'),
pObj=require('pico/obj'),
sqlDir=require('sql/directory')

let MOD

return {
	setup(context,cb){
		MOD=sqlDir.MOD
		cb()
/*
		const poll=[],output={}
		this.poll({id:1},{t:new Date('1947')},output,(err)=>{
			if (err) return console.error(err)
			console.log('output',output)
		})
*/
	},
    reply(output,next){
        this.setOutput(output,sqlDir.clean,sqlDir)
        next()
    },
    replyPrivate(output,next){
        this.setOutput(output,sqlDir.cleanSecret,sqlDir)
        next()
    },
    replyList(list,next){
        this.setOutput(list,sqlDir.cleanList,sqlDir)
        next()
    },
	getEntityGrp(entId,$grp,next){
		sqlDir.entityMap_findId(entId,'entity',(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next(this.error(401))
			sqlDir.getOnly(rows[0],(err,rows)=>{
				if (err) return next(this.error(500,err.message))
				if (!rows.length) return next(this.error(401))
				this.set($grp,rows[0].grp)
				next()
			})
		})
	},
	newUser(cred,user,next){
		sqlDir.set('',user.id,MOD.DIR|MOD.G_RX,cred.id,(err)=>{
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
	userJoin(cred,input,next){
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
			sqlDir.usermap_set(dir.id,input.id,key,val,cred.id,(err)=>{
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
	poll(cred,input,poll,output,next){
		sqlDir.poll(cred.id,input.t,(err,usermaps,lastseen)=>{
console.log(err,usermaps,lastseen)
			if (err) return next(this.error(500,err.message))
			if (!usermaps.length) return next()
			output['t']=lastseen
			poll.push(...usermaps)
			next()
		})
	},
	last(cred,input,poll,output,next){
		sqlDir.filter(poll,cred.grp,(err,usermaps)=>{
			if (err) return next(this.error(500,err.message))
			if (!usermaps.length) return next()
			sqlDir.last(pObj.pluck(usermaps,'id'),cred.id,input.t,(err,dirs)=>{
				if (err) return next(this.error(500,err.message))
				for(let i=0,d; d=dirs[i]; i++){
					dirs[i]=sqlDir.clean(d)
				}
				output['directory']=dirs
				next()
			})
		})
	},
	getDependencies(cred,input,next){
	},
	getMembers(cred,input,next){
	},
	read(cred,input,output,next){
		let 
		cwd=input.cwd,
		d=[],f=[]
		output.cwd=cwd
		output.d=d
		output.f=f
		sqlDir.findId(cwd,(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next()
			sqlDir.usermap_gets(rows[0].id,'role',(err,rows)=>{
				if (err) return next(this.error(500,err.message))
				f.push(...pObj.pluck(rows,'userId'))
				sqlDir.findNames(cwd,(err,rows)=>{
					if (err) return next(this.error(500,err.message))
					d.push(...pObj.pluck(rows,'name'))
					next()
				})
			})
		})
	}
}
