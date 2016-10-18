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
DIR_GRP=		'.grp/'

let
fsdb,TYPE,MODE,META,
newGroup=function(root, cby, cb){
	fsdb.createp(root, 'genesis', TYPE.DIR, MODE.G_X | MODE.A_X, (err)=>{
		if (err) return cb(err)
		fsdb.create(root, DIR_ROOT, 'root', TYPE.DIR, MODE.G_X | MODE.A_X, (err)=>{
			if (err) return cb(err)
			cby=cby.toString()
			fsdb.create(fsdb.join(root,DIR_ROOT),cby,fsdb.path(cby),TYPE.LINK, MODE.G_X | MODE.A_X, (err)=>{
				if (err) return cb(err)
				fsdb.create(root, DIR_NOOB, 'noob', TYPE.DIR, MODE.G_X | MODE.A_X, cb)
			})
		})
	})
}

module.exports= {
    setup(context, cb){
        fsdb=context.group
		TYPE=fsdb.TYPE
		MODE=fsdb.MODE
		META=fsdb.META

		// TODO: move this to separate tool?
		fsdb.createp('0', 'adam', TYPE.DIR, MODE.G_X | MODE.A_X, (err)=>{
			if (err) cb(err)
			newGroup('0/jasy', 0, cb)
		})
	},
	createSession(session,cb){
		fsdb.create(fsdb.path(session.id), session.sess, TYPE.FILE, MODE.G_X | MODE.A_X, cb)
	},
	joinGroup(session,cb){
		let
		uid=session.id.toString(),
		u=fsdb.path(uid),
		grp=fsdb.join(u,session.grp)

		fsdb.mode(grp, (err,mode)=>{
			if (!err) return cb(err)
			if (!mode) return cb(`${grp} not found`)
			let noob=fsdb.join(grp,DIR_NOOB)
			fsdb.mode(noob, (err,mode)=>{
				if (mode) return fsdb.create(fsdb.join(noob,uid),u,TYPE.LINK, MODE.G_X | MODE.A_X, cb)
				fsdb.create(fsdb.join(grp,uid),u,TYPE.LINK, MODE.G_X | MODE.A_X, cb)
			})
		})
	},
	createGroup(name,meta,cby,cb){
		fsdb.create(fsdb.path(name), meta, TYPE.DIR, MODE.G_X | MODE.A_X, cb)
	},
	removeGroup(name,cb){
		fsdb.remove(fsdb.path(name)+META,cb)
	}
}
