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
    models=this.deps.data,
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
        data:'refs',
        demux:'map',
        pull:'stream'
    },
    create: function(deps){
        for(var i=0,data=deps.data,keys=Object.keys(data),k; k=keys[i]; i++){
            data[k].comparator=sortDesc
        }
    },

    slots:{
        signin: function(from, sender, model){
            this.slots.signout.call(this, from, sender)
            var userId = model.id
            this.myId = userId
            this.readSeen(userId)

            this.listenTo(this.deps.pull, 'message', poll)
            this.connect(this.deps.pull, model.attributes, this.seen)

            for(var i=0,data=this.deps.data,keys=Object.keys(data),k,d; k=keys[i]; i++){
                this.readColl(k, userId)
                d=data[k]
                this.listenTo(d, 'add', writeData)
                this.listenTo(d, 'remove', writeData)
                this.listenTo(d, 'change', writeData)
            }
        },
        signout: function(from, sender){
            this.stopListening()
            this.seen = 0
            this.myId = 0

            for(var i=0,data=this.deps.data,keys=Object.keys(data),k; k=keys[i]; i++){
				if ('owner'===k)continue
                data[k].reset()
            }
        },
        refreshCache: function(from, sender){
            var userId = this.myId

            for(var i=0,data=this.deps.data,keys=Object.keys(data),k; k=keys[i]; i++){
                data[k].reset()
                this.removeColl(k, userId)
            }

            this.removeSeen(userId)
            this.readSeen(userId)
        }
    },

    connect: function(stream, model){
        stream.reconnect()
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
        var coll = this[name]
        if (!userId || !coll) return
        try{
            console.log(storage.getItem(name+userId))
            coll.add(JSON.parse(storage.getItem(name+userId)))
        }catch(exp){
            return console.error(exp)
        }
    },

    writeColl: function(name, userId){
        var coll = this[name]
        if (!userId || !coll || !coll.length) return
        storage.setItem(name+userId, JSON.stringify(coll.toJSON()))
    },

    removeColl: function(name, userId){
        storage.removeItem(name+userId)
    }
}
