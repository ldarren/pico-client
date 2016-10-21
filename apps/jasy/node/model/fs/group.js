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

addRight=function(db,id,dir,right,cb){
	let grp=db.path(...dir)
	db.create(grp, right, right, TYPE.DIR, MODE.NONE, (err)=>{
		if (err) return cb(err)
		if (!id) return cb()
		id=db.path(id.toString())
		db.createp(db.join(grp,right,id),id,TYPE.LINK, MODE.NONE, cb)
	})
},
cr=function(db,id,rights,root,url,cb){
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
checkRight=function(db,id,rights,root,url,cb){
	cr(db,db.path(id),rights,db.path(...root),url,cb)
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
	},
	createSession(session,cb){
		db.create(db.path(session.id), session.sess, TYPE.DIR, MODE.G_RX, cb)
	},
	joinGroup(session,cb){
		let
		uid=session.id.toString(),
		u=db.path(uid),
		grp=db.join(u,session.grp)

		db.mode(grp, (err,mode)=>{
			if (!err) return cb(err)
			if (!mode) return cb(`${grp} not found`)
			let noob=db.join(grp,DIR_NOOB)
			db.mode(noob, (err,mode)=>{
				if (mode) return db.create(db.join(noob,uid),u,TYPE.LINK, MODE.G_X | MODE.A_X, cb)
				db.create(db.join(grp,uid),u,TYPE.LINK, MODE.G_X | MODE.A_X, cb)
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
