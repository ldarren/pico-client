// TODO: use mixin?
var
Router = require('Router'),
storage = window.localStorage,
status1 = {status:1},status0={status:0},merge1={merge:true},
poll = function(self){
console.log('poll: '+self.myId)
    var userId = self.myId
    if (!userId) return
    self.pull.fetch({
        data: {seen:self.seen},
        success: function(models, raw){
            if (self.pollId) self.pollId = setTimeout(poll, self.freq, self)
            self.writeSeen(userId, raw.seen)
            var data = raw.data
            if (data){
                addRemove(self.data, data) 
                // TODO: use mixin? dataUsers is not general
                var dUsers = data.ref
                if (data.refs){
                    addRemove(self.dataUsers, data.refs) 
                }
            }
        },
        error: function(){
            if (self.pollId) self.pollId = setTimeout(poll, self.freq, self)
        }
    })
},
addRemove = function(coll, list){
    if (!list || !list.length) return false
    coll.add(_.where(list, status1), merge1)
    coll.remove(_.where(list, status0))
    return true
},
writeData = function(){ this.writeColl('data', this.myId) },
writeDataUsers = function(){ this.writeColl('dataUsers', this.myId) },
sortDesc = function(m1, m2){
    var s1 = m1.get('updatedAt'), s2 = m2.get('updatedAt')
    return s1 < s2 ? 1 : s1 > s2 ? -1 : 0;
},
sortAsc = function(m1, m2){
    var s1 = m1.get('updatedAt'), s2 = m2.get('updatedAt')
    return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
}

exports.Class = {
    signals:[],
    deps:{
        data:'models',
        dataUsers:'models',
        pull:'models',
        freq:'number'
    },
    create: function(deps){
        this.data = deps.data
        this.dataUsers = deps.dataUsers
        this.pull = deps.pull
        this.freq = deps.freq
        this.pollId = 0
        this.data.comparator = sortDesc
    },

    slots:{
        signin: function(from, sender, model){
            this.slots.signout.call(this, from, sender)
            var userId = model.id
            this.myId = userId
            this.readSeen(userId)
            this.readColl('data', userId)
            this.readColl('dataUsers', userId)
            this.pollId = setTimeout(poll, 0, this)

            var data = this.data, dataUsers = this.dataUsers
            this.listenTo(data, 'add', writeData)
            this.listenTo(data, 'remove', writeData)
            this.listenTo(data, 'change', writeData)
            this.listenTo(dataUsers, 'add', writeDataUsers)
            this.listenTo(dataUsers, 'remove', writeDataUsers)
            this.listenTo(dataUsers, 'change', writeDataUsers)
        },
        signout: function(from, sender){
            this.stopListening()
            clearTimeout(this.pollId)
            this.pollId = 0
            this.dataUsers.reset()
            this.data.reset()
            this.seen = 0
            this.myId = 0
        },
        refreshCache: function(from, sender){
            var userId = this.myId
            clearTimeout(this.pollId)
            this.pollId = 0
            this.dataUsers.reset()
            this.removeColl('dataUsers', userId)
            this.data.reset()
            this.removeColl('data', userId)
            this.removeSeen(userId)
            this.readSeen(userId)
            this.pollId = setTimeout(poll, 0, this)
        }
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