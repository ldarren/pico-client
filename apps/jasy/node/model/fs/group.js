const
DIR_ROOT=		'.root/',
DIR_SUDO=		'.sudo/',
DIR_EDIT=		'.edit/',
DIR_READ=		'.read/',
DIR_NOOB=		'.noob/',
DIR_OUST=		'.oust/',
DIR_API=		'.api/',
DIR_APP=		'.app/',
DIR_EPI=		'.epi/',
DIR_EPP=		'.epp/',
DIR_GRP=		'.grp/',

addRight=function(db,group,id,right,meta,cb){
	db.create(group, right, meta, TYPE.DIR, MODE.G_X | MODE.A_X, (err)=>{
		if (err) return cb(err)
		if (!id) return cb()
		id=id.toString()
		db.createp(db.join(group,right,id),db.path(id),TYPE.LINK, MODE.G_X | MODE.A_X, cb)
	})
},
checkRight=function(db,id,right,root,url,cb){
	let
	us=db.split(url),
	urls=[]
	while(us.length){
		urls.push(db.join(...us,right))
		urls.pop()
	}
	db.findLink(db.path(id),root,urls,cb)
},
newGroup=function(db, root, meta, cby, cb){
	db.createp(root, meta, TYPE.DIR, MODE.G_X | MODE.A_X, (err)=>{
		if (err) return cb(err)
		addRight(db, root, cby, DIR_ROOT, 'root', (err)=>{
			if (err) return cb(err)
			addRight(db, root, cby, DIR_SUDO, 'sudo', (err)=>{
				if (err) return cb(err)
				addRight(db, root, cby, DIR_EDIT, 'edit', (err)=>{
					if (err) return cb(err)
					addRight(db, root, cby, DIR_READ, 'read', (err)=>{
						if (err) return cb(err)
						addRight(db, root, 0, DIR_NOOB, 'noob', cb)
					})
				})
			})
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
		db.create(db.path(session.id), session.sess, TYPE.FILE, MODE.G_X | MODE.A_X, cb)
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
	createGroup(root,name,meta,cby,cb){
		checkRight(db,cby,DIR_ROOT,root,name,(err)=>{
			if (err) return cb(err)
			newGroup(root+name,meta,cby,cb)
		})
	},
	removeGroup(root,name,cby,cb){
		checkRight(db,cby,DIR_ROOT,root,name,(err)=>{
			if (err) return cb(err)
			db.remove(db.path(root,name),cb)
		})
	}
}
