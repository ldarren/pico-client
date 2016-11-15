const
pStr=require('pico/str'),
pObj=require('pico/obj'),
sqlDir=require('sql/directory')

let MOD

return {
	setup(context,cb){
		MOD=sqlDir.MOD
		cb()
/*		const poll=[],output={}
		this.poll({id:1},{t:new Date('1947')},poll,output,(err)=>{
			if (err) return console.error(err)
			console.log('poll',poll)
			console.log('output',output)
		})*/
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
	poll(cred,input,poll,output,next){
		sqlDir.poll(cred.id,input.t,(err,usermaps)=>{
			if (err) return next(this.error(500,err.message))
			if (!usermaps.length) return next()
			sqlDir.filter(usermaps,cred.grp,(err,usermaps)=>{
				if (err) return next(this.error(500,err.message))
				if (!usermaps.length) return next()
				sqlDir.map_getList(usermaps,'entityId',(err,usermaps)=>{
					if (err) return next(this.error(500,err.message))
					poll.push(...usermaps)
					sqlDir.last(pObj.pluck(poll,'id'),cred.id,input.t,(err,dirs,lastseen)=>{
						if (err) return next(this.error(500,err.message))
						for(let i=0,d,j,p; d=dirs[i]; i++){
							for(j=0; p=poll[j]; j++){
								if (p.id !== d.id) continue
								switch(p.role){
								case 'root':
								case 'admin':
									dirs[i]=sqlDir.cleanSecret(d)
									break
								default:
									dirs[i]=sqlDir.clean(d)
									break
								}
								break
							}
						}
console.log(dirs,lastseen)
						output['t']=lastseen
						output['directory']=dirs
						next()
					})
				})
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
