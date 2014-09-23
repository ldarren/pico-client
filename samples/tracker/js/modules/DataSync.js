var
Module = require('Module'),
Router = require('Router'),
storage = window.localStorage,
status1 = {status:1},status0={status:0},merge1={merge:true},
poll = function(self){
    if (!self.owner.length) return
    self.pull.fetch({
        data: {seen:self.seen},
        success: function(models, raw){
            if (self.pollId) self.pollId = setTimeout(poll, self.freq, self)
            self.seen = raw.seen
            if (raw.data){
                var userId = self.owner.models[0].id

                addRemove(self.data, raw.data)        
                self.data.trigger('sync')
                self.writeSeen(userId)
                self.writeColl('data', userId)
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
sortDesc = function(m1, m2){
    var s1 = m1.get('updatedAt'), s2 = m2.get('updatedAt')
    return s1 < s2 ? 1 : s1 > s2 ? -1 : 0;
},
sortAsc = function(m1, m2){
    var s1 = m1.get('updatedAt'), s2 = m2.get('updatedAt')
    return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
}

exports.Class = Module.Class.extend({
    create: function(spec){
        for(var i=0,s; s=spec[i]; i++){
            switch(s.name){
            case 'owner': this.owner = s.value; break
            case 'data': this.data = s.value; break
            case 'pull': this.pull = s.value; break
            case 'freq': this.freq = s.value; break
            }
        }
        this.pollId = 0
        this.data.comparator = sortDesc
        this.listenTo(this.owner, 'add', this.start)
        this.listenTo(this.owner, 'reset', this.stop)
    },

    start: function(model, coll, option){
        var userId = model.id
        this.readSeen(userId)
        this.readColl('data', userId)
        this.pollId = setTimeout(poll, 0, this)
    },

    stop: function(model, coll, option){
        clearTimeout(this.pollId)
        this.pollId = 0
    },

    readSeen: function(userId){
        this.seen = storage.getItem('seen'+userId) || (new Date(0)).toISOString()
    },

    writeSeen: function(userId){
        storage.setItem('seen'+userId, this.seen)
    },

    readColl: function(name, userId){
        var coll = this[name]
        if (!userId || !coll) return
        try{
            coll.add(JSON.parse(storage.getItem(name+userId)))
        }catch(exp){
            return console.error(exp)
        }
    },

    writeColl: function(name, userId){
        var coll = this[name]
        if (!userId || !coll || !coll.length) return
        storage.setItem(name+userId, JSON.stringify(coll.toJSON()))
    }
})
