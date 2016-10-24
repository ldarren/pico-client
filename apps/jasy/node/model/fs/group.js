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

addRight=function(db,id,dir,right,cb){
	let grp=db.path(...dir)
	db.create(grp, right, right, TYPE.DIR, MODE.NONE, (err)=>{
		if (err) return cb(err)
		if (!id) return cb()
		id=db.path(id.toString())
		db.createp(db.join(grp,right,id),id,TYPE.LINK, MODE.NONE, cb)
	})
},
checkRight=function(db,id,rights,root,url,cb){
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
			cr(db,id,rights,root,url,cb)
		})
	})
},
newGroup=function(db, dir, cby, cb){
	db.createp(db.path(...dir), dir[dir.length-1], TYPE.DIR, MODE.A_RX, (err)=>{
		if (err) return cb(err)
		addRight(db, cby, dir, DIR_ROOT, (err)=>{
			if (err) return cb(err)
			addRight(db, 0, dir, DIR_NOOB, cb)
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
	checkRight(db,id,rights,root,url,cb){
		checkRight(db,db.path(id),rights,db.path(...root),url,cb)
	},
	createUser(user,cb){
		var uid=user.id.toString()
		db.createp(db.path(uid), uid, TYPE.DIR, MODE.G_RX, cb)
	},
	join(session,cb){
		let grp=db.path(session.grpp.toString(),session.grp)
		db.mode(grp, (err,mode)=>{
			if (err) return cb(err)
			if (!mode) return cb(`${grp} not found`)
			let noob=db.join(grp,DIR_NOOB)
			db.mode(noob, (err,mode)=>{
				if (err) return cb(err)
				let
				uid=session.id.toString(),
				u=db.path(uid)
				if (mode) return db.createp(db.join(noob,u),u,TYPE.LINK, MODE.NONE, cb)
				db.createp(db.join(grp,u),u,TYPE.LINK, MODE.NONE, cb)
			})
		})
	},
	createGroup(root,name,cby,cb){
		checkRight(db,cby,[DIR_ROOT],root,name,(err)=>{
			if (err) return cb(err)
			newGroup(db,[root,name],cby,cb)
		})
	},
	removeGroup(root,name,cby,cb){
		checkRight(db,cby,DIR_ROOT,root,name,(err)=>{
			if (err) return cb(err)
			db.remove(db.path(root,name),cb)
		})
	}
}
