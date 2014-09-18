var
Module = require('js/Module'),
Router = require('js/Router'),
storage = window.localStorage,
poll = function(self){
    if (!self.owner.length) return
    self.pull.fetch({
        data: {seen:self.seen},
        success: function(models, raw){
            if (self.pollId) self.pollId = setTimeout(poll, self.freq, self)

            self.seen = raw.seen
            if (raw.data){
                var userId = self.owner.models[0].id,

                self.data.add(raw.data, {merge: true})
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
sortDesc = function(m1, m2){
    var s1 = m1.get('updatedAt'), s2 = m2.get('updatedAt')
    return s1 < s2 ? 1 : s1 > s2 ? -1 : 0;
},
sortAsc = function(m1, m2){
    var s1 = m1.get('updatedAt'), s2 = m2.get('updatedAt')
    return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
}

exports.Class = Module.Clas.extend({
    initialize: function(options){
        var self = this

        self.pollId = 0

        this.init(options, function(err, spec){
            for(var i=0,s; s=spec[i]; i++){
                switch(s.name){
                case 'owner': self.owner = s.value; break
                case 'data': self.data = s.value; break
                case 'pull': self.pull = s.value; break
                case 'freq': self.freq = s.value; break
                }
            }
            self.data.comparator = sortDesc
            self.listenTo(self.owner, 'add', self.start)
            self.listenTo(self.owner, 'reset', self.stop)
        })
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
