const
DIR_ROOT=		'.root/',
DIR_SUDO=		'.sudo/',
DIR_NOOB=		'.noob/',
DIR_OUST=		'.oust/',
DIR_API=		'.api/',
DIR_APP=		'.app/',
DIR_EPI=		'.epi/',
DIR_EPP=		'.epp/',
DIR_GRP=		'.grp/',
EXPIRE=			1000*60*60*24,

addRight=function(id,dir,right,cb){
	let grp=db.path(...dir)
	db.create(grp, right, right, TYPE.DIR, MODE.NONE, (err)=>{
		if (err) return cb(err)
		if (!Number.isFinite(id)) return cb()
		id=db.path(id)
		db.createp(db.join(grp,right,id),id,TYPE.LINK, MODE.NONE, cb)
	})
},
cr=function(id,rights,root,url,cb){
	if (!url.length) return cb()
	let u=db.path(...url)
	db.read(db.join(root,u),(err,data,type)=>{
		if (err) return cb(err)
		if (data !== url[url.length-1]) return cb('checking right on wrong path')
		if (TYPE.DIR !== type) return cb('checking right on non group')
		let paths=[]
		for(let i=0,r; r=rights[i]; i++){
			paths.push(db.join(u,r))
		}
		db.findLink(id,root,paths, (err, found)=>{
			if (err || found) return cb(err, found)
			url.pop()
			cr(id,rights,root,url,cb)
		})
	})
},
checkRight=function(id,rights,root,url,cb){
	cr(db.path(id),rights,db.path(...root),url,cb)
},
newGroup=function(dir, cby, cb){
	db.createp(db.path(...dir), dir[dir.length-1], TYPE.DIR, MODE.A_RX, (err)=>{
		if (err) return cb(err)
		addRight(cby, dir, DIR_ROOT, (err)=>{
			if (err) return cb(err)
			addRight(null, dir, DIR_NOOB, cb)
		})
	})
}

let db,TYPE,MODE,META

module.exports= {
    setup(context, cb){
        db=context.group
		TYPE=db.TYPE
		MODE=db.MODE
		META=db.META
		cb()
	},
	checkRight,
	createUser(user,cb){
		var uid=user.id
		db.createp(db.path(uid), uid, TYPE.DIR, MODE.G_RX, cb)
	},
	join(session,cb){
		let grp=db.path(session.grpp,session.grp)
		db.mode(grp, (err,mode)=>{
			if (err) return cb(err)
			if (!mode) return cb(`${grp} not found`)
			let noob=db.join(grp,DIR_NOOB)
			db.mode(noob, (err,mode)=>{
				if (err) return cb(err)
				let
				uid=session.id,
				u=db.path(uid)
				if (mode) return db.createp(db.join(noob,u),u,TYPE.LINK, MODE.NONE, cb)
				db.createp(db.join(grp,u),u,TYPE.LINK, MODE.NONE, cb)
			})
		})
	},
	createGroup(root,name,cby,cb){
		checkRight(cby,[DIR_ROOT,DIR_SUDO],root,[],(err)=>{
			if (err) return cb(err)
			newGroup([...root,name],cby,cb)
		})
	},
	removeGroup(root,name,cby,cb){
		checkRight(cby,[DIR_ROOT,DIR_SUDO],root,name,(err)=>{
			if (err) return cb(err)
			db.remove(db.path(root,name),cb)
		})
	}
}
