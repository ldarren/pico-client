const
path=pico.import('path'),
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
	newUser(cred,cwd,user,next){
		sqlDir.set(cwd,user.id,MOD.DIR|MOD.G_RX,cred.id,(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	newGroup(cred,cwd,name,output,next){
		const userId=cred.id
		sqlDir.set(cwd,name,MOD.DIR|MOD.G_RX,userId,(err,meta)=>{
			if(err) return next(this.error(500))
			const id=meta.insertId
			output.id=id
			sqlDir.usermap_set(id,userId,'role','root',userId,(err)=>{
				if(err) return next(this.error(500))
				this.addJob([output],sqlDir.get,sqlDir)
				next()
			})
		})
	},
	linkEntity(cred,dir,entity,next){
		sqlDir.entitymap_set(dir.id,entity.id,'entity',null,cred.id,(err)=>{
			if(err) return next(this.error(500,err.message))
			next()
		})
	},
	getRole(cred,output,next){
		next()
	},
	userJoin(cred,grp,input,next){
		sqlDir.findId(grp,(err,rows)=>{
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
console.log('poll',err,usermaps,lastseen)
			if (err) return next(this.error(500,err.message))
			if (!usermaps.length) return next()
			output['t']=lastseen
			poll.push(...usermaps)
			next()
		})
	},
	last(cred,input,grp,poll,output,next){
		if (!poll.length) return next()
		sqlDir.filter(poll.slice(),path.join(grp,cred.cwd),(err,usermaps)=>{
			if (err) return next(this.error(500,err.message))
			if (!usermaps.length) return next()
			sqlDir.last(pObj.pluck(usermaps,'id'),cred.id,input.t,(err,dirs)=>{
				if (err) return next(this.error(500,err.message))
				output['directory']=sqlDir.cleanList(dirs)
				next()
			})
		})
	},
	getDependencies(cred,input,next){
		next()
	},
	getMembers(cred,input,next){
		next()
	},
	read(input,output,next){
		next()
	},
	list(grp,input,output,next){
		const
		cwd=path.join(grp,input.d),
		d=[],f=[]

		sqlDir.findId(cwd,(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next()
			Object.assign(output,rows[0])
			sqlDir.usermap_gets(output.id,'role',(err,rows)=>{
				if (err) return next(this.error(500,err.message))
				f.push(...pObj.pluck(rows,'userId'))
				sqlDir.findNames(cwd,(err,rows)=>{
					if (err) return next(this.error(500,err.message))
					d.push(...pObj.pluck(rows,'name'))
					Object.assign(output,{d,f})
					next()
				})
			})
		})
	}
}
