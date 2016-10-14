const
ROOT='.root/',
ADMIN='.admin/',
WRITER='.writer/',
READER='.reader/',
NEWBIE='.newbie/',
EXILE='.exile/'

let fsdb,TYPE,MODE,META

module.exports= {
    setup(context, cb){
        fsdb=context.group
		TYPE=fsdb.TYPE
		MODE=fsdb.MODE
		META=fsdb.META
	},
	createGroup(name,meta,cby,cb){
		fsdb.create(fsdb.path(name), meta, TYPE.DIR, MODE.G_X | MODE.A_X, cb)
	},
	removeGroup(name,cb){
		fsdb.remove(fsdb.path(name)+META,cb)
	},
	addRole(name,data,group,cb){
	}
}
