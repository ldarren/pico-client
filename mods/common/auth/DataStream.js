var
storage = window.localStorage,
status1 = {status:1},status0={status:0},merge1={merge:true},
demultiplexer=function(name,models,raw,dmux){
    var
    m=models[k],
    r=raw[k],
    d=demux[k]

    addRemove(m, r) 

    if (!d) return

    for(var i=0,keys=Object.keys(d),k; k=keys[i]; i++){
        if (!raw.k) continue
        addRemove(models[d.k],raw.k)
    }
},
poll = function(raw){
console.log('poll: '+this.myId)
    var userId = this.myId
    if (!userId) return
    this.writeSeen(userId, raw.seen)
    var
    models=this.deps.models,
    dmux=this.deps.demux
    for(var i=0,data=raw.data,keys=Object.keys(data),k; k=keys[i]; i++){
        demultiplexer(k,models,data,dmux)
    }
},
addRemove = function(coll, list){
    if (!list || !list.length) return false
    coll.add(_.where(list, status1), merge1)
    coll.remove(_.where(list, status0))
    return true
},
writeData = function(model){ this.writeColl(model.collection.name, this.myId) },
sortDesc = function(m1, m2){
    var s1 = m1.get('updatedAt'), s2 = m2.get('updatedAt')
    return s1 < s2 ? 1 : s1 > s2 ? -1 : 0;
},
sortAsc = function(m1, m2){
    var s1 = m1.get('updatedAt'), s2 = m2.get('updatedAt')
    return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
}

return{
    signals:[],
    deps:{
        models:'refs',
        demux:'map',
        pull:'stream'
    },
    create: function(deps){
        for(var i=0,models=deps.models,keys=Object.keys(models),k; k=keys[i]; i++){
            models[k].comparator=sortDesc
        }
    },

    slots:{
        signin: function(from, sender, model){
            this.slots.signout.call(this, from, sender)
            var
			self=this,
			userId = model.id
            this.myId = userId
            this.readSeen(userId)

			this.readOwnerUserInfo(userId, function(err, user){
				self.listenTo(self.deps.pull, 'message', poll)
				self.connect(self.deps.pull, model.attributes, self.seen)

				for(var i=0,models=self.deps.models,keys=Object.keys(models),k,d; k=keys[i]; i++){
					self.readColl(k, userId)
					d=models[k]
					self.listenTo(d, 'add', writeData)
					self.listenTo(d, 'remove', writeData)
					self.listenTo(d, 'change', writeData)
				}
			})
        },
        signout: function(from, sender){
            this.stopListening()
			var userId=this.myId

            for(var i=0,models=this.deps.models,keys=Object.keys(models),k; k=keys[i]; i++){
				if ('owner'===k)continue
				this.writeColl(k, userId)
                models[k].reset()
            }

            this.seen = 0
            this.myId = 0
        },
        refreshCache: function(from, sender){
            var userId = this.myId

            for(var i=0,models=this.deps.models,keys=Object.keys(models),k; k=keys[i]; i++){
                models[k].reset()
                this.removeColl(k, userId)
            }

            this.removeSeen(userId)
            this.readSeen(userId)
        }
    },

    connect: function(stream, model){
        stream.reconnect()
    },

	readOwnerUserInfo: function(userId, cb){
		var users=this.deps.models.users
		users.retrieve([userId], function(err, coll){
			if (err) return cb(err)
			cb(null, coll.get(userId))
		})
	},

    readSeen: function(userId){
        var seen=storage.getItem('seen'+userId)
        this.seen=!seen||'undefined'===seen ?(new Date(0)).toISOString() : seen
    },

    writeSeen: function(userId, seen){
        storage.setItem('seen'+userId, this.seen = seen)
    },

    removeSeen: function(userId){
        storage.removeItem('seen'+userId)
    },

    readColl: function(name, userId){
        var coll = this.deps.models[name]
        if (!userId || !coll) return
        try{
            console.log(storage.getItem(name+userId))
            coll.add(JSON.parse(storage.getItem(name+userId)))
        }catch(exp){
            return console.error(exp)
        }
    },

    writeColl: function(name, userId){
        var coll = this.deps.models[name]
        if (!userId || !coll || !coll.length) return
        storage.setItem(name+userId, JSON.stringify(coll.toJSON()))
    },

    removeColl: function(name, userId){
        storage.removeItem(name+userId)
    }
}