const
path=pico.import('path'),
pStr=require('pico/str'),
pObj=require('pico/obj'),
sqlDir=require('sql/directory'),
hideHome=function($grp,output){
	let wd=path.join(output.grp,output.name)
	output.wd=wd=wd.substr($grp.length)
	const idx=wd.lastIndexOf(output.name)
	if (-1===idx){ // the folder itself
		output.grp=wd
		output.name=''
	}else{
		let grp=wd.substr(0,idx)
		if (grp.endsWith(path.sep)) output.grp=grp.slice(0,-1)
		else output.grp=grp
	}
}

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
    reply($grp,output,next){
		hideHome($grp,output)
        this.setOutput(output,sqlDir.clean,sqlDir)
        next()
    },
    replyPrivate($grp,output,next){
		hideHome($grp,output)
        this.setOutput(output,sqlDir.cleanSecret,sqlDir)
        next()
    },
    replyList($grp,list,next){
		for(let i=0,l; l=list[i]; i++){
			hideHome($grp,l)
		}
        this.setOutput(list,sqlDir.cleanList,sqlDir)
        next()
    },
	replyStream($grp,output,next){
		const list=output.directory
		if (!list) return next()
		for(let i=0,l; l=list[i]; i++){
			hideHome($grp,l)
		}
		sqlDir.cleanList(list)
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
	newGroup(cred,wd,name,dir,next){
		const userId=cred.id
		sqlDir.set(wd,name,MOD.DIR|MOD.G_RX,userId,(err,meta)=>{
			if(err) return next(this.error(500))
			const id=meta.insertId
			dir.id=id
			sqlDir.usermap_set(id,userId,'role','root',userId,(err)=>{
				if(err) return next(this.error(500))
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
	userJoin(cred,dir,input,next){
		const userId=input.id
		sqlDir.usermap_getByKeys(dir,userId,['role','applicant'],(err,dir)=>{
			if(err) return next(this.error(500))
			if (dir.role || undefined !== dir.applicant) return next() // already joined

			let key,val
			if (MOD.FREE & dir.s.readUInt16LE()){
				key='role',val='member'
			}else{
				key='applicant',val=input.msg||''
			}
			sqlDir.usermap_set(dir.id,userId,key,val,cred.id,(err)=>{
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
		sqlDir.filter(poll,grp,(err,usermaps)=>{
			if (err) return next(this.error(500,err.message))
			if (!usermaps.length) return next()
			sqlDir.last(pObj.pluck(usermaps,'id'),cred.id,input.t,(err,dirs)=>{
				if (err) return next(this.error(500,err.message))
				output['directory']=dirs
				next()
			})
		})
	},
	getDependencies(grp,output,next){
		next()
	},
	// ...list,$wd,next
	join(){
		const
		l=arguments.length,
		next=arguments[l-1]

		if (l<3) return next(this.error(400))

		this.set(arguments[l-2],path.join(...Array.prototype.slice.call(arguments,0,l-2)))
		next()
	},
	listMine(cred,wd,output,next){
		const userId=cred.id
		sqlDir.usermap_findId(userId,'role',(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			sqlDir.filter(rows,wd,(err,usermaps)=>{
				if (err) return next(this.error(500,err.message))
				if (!usermaps.length) return next()
				sqlDir.gets(pObj.pluck(usermaps,'id'),userId,(err,dirs)=>{
					if (err) return next(this.error(500,err.message))
					output.push(...dirs)
					next()
				})
			})
		})
	},
	find(wd,output,next){
		sqlDir.findId(wd,(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			if (!rows.length) return next(this.error(400))
			sqlDir.get(rows[0],(err,dir)=>{
				if (err) return next(this.error(500,err.message))
				Object.assign(output,dir)
				next()
			})
		})
	},
	role(cred,dir,roles,next){
		if (!roles || !roles.length) return next(this.error(401))
		sqlDir.usermap_get(dir,cred.id,'role',(err,dir)=>{
			if (err) return next(this.error(500,err.message))
			if (~roles.indexOf(dir.role)) return next()
			next(this.error(401))
		})
	},
	read(dir,next){
		sqlDir.get(dir,(err,dir)=>{
			if (err) return next(this.error(500,err.message))
			next()
		})
	},
	groupList(wd,dir,next){
		//const d=[],f=[]

		sqlDir.usermap_gets(dir.id,'role',(err,rows)=>{
			if (err) return next(this.error(500,err.message))
			dir.users=pObj.pluck(rows,'userId')
			next()
			/*
			sqlDir.findNames(wd,(err,rows)=>{
				if (err) return next(this.error(500,err.message))
				d.push(...pObj.pluck(rows,'name'))
				Object.assign(dir,{d,f})
				next()
			})
			*/
		})
	}
}
