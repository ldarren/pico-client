var
storage = window.localStorage,
merge1={merge:true},
poll = function(raw){
    var userId = this.me.id
    if (!userId) return
    writeSeen(this, userId, raw.seen)
    var models=this.deps.models
    for(var i=0,data=raw.data,keys=Object.keys(data),k; k=keys[i]; i++){
        addRemove(models[k],data[k])
    }
},
addRemove = function(coll, list){
    if (!list || !list.length) return false
    coll.add(list, merge1)
    return true
},
writeData = function(model){ writeColl(this,model.collection.name, this.me.id) },
reconn=function(){
    this.connect(this.deps.push, this.me.attributes, this.seen)
},
sortDesc = function(m1, m2){
    var s1 = m1.get('uat'), s2 = m2.get('uat')
    return s1 < s2 ? 1 : s1 > s2 ? -1 : 0;
},
sortAsc = function(m1, m2){
    var s1 = m1.get('uat'), s2 = m2.get('uat')
    return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
},
readSeen= function(self,userId){
    var seen=storage.getItem('seen'+userId)
    self.seen=!seen||'undefined'===seen ?(new Date(0)).toISOString() : seen
},
writeSeen= function(self,userId, seen){
    storage.setItem('seen'+userId, self.seen = seen)
},
removeSeen= function(self,userId){
    storage.removeItem('seen'+userId)
},
readColl= function(self,name, userId){
    var coll = self.deps.models[name]
    if (!userId || !coll) return
    try{ coll.add(JSON.parse(storage.getItem(name+userId))) }
    catch(exp){ return console.error(exp) }
},
writeColl= function(self,name, userId){
    var coll = self.deps.models[name]
    if (!userId || !coll || !coll.length) return
    storage.setItem(name+userId, JSON.stringify(coll.toJSON()))
},
removeColl= function(self,name, userId){
    storage.removeItem(name+userId)
}

return{
    signals:[],
    deps:{
        models:'refs',
        push:'stream'
    },
    create: function(deps){
        for(var i=0,models=deps.models,keys=Object.keys(models),k; k=keys[i]; i++){
            models[k].comparator=sortDesc
        }
		this.listenTo(deps.push, 'closed', reconn)
    },

    slots:{
        signin: function(from, sender, model){
            if(this.me)this.slots.signout.call(this, from, sender)
            var
            push=this.deps.push,
			userId = model.id

            this.me=model 
            readSeen(this,userId)

            this.listenTo(push, 'message', poll)
            this.connect(push, model.attributes, this.seen)

            for(var i=0,models=this.deps.models,keys=Object.keys(models),k,d; k=keys[i]; i++){
                readColl(this,k, userId)
                d=models[k]
                this.listenTo(d, 'add', writeData)
                this.listenTo(d, 'remove', writeData)
                this.listenTo(d, 'change', writeData)
            }
        },
        signout: function(from, sender){
			if (!this.me) return
			this.deps.push.close()
            this.stopListening()
			var userId=this.me.id

            for(var i=0,models=this.deps.models,keys=Object.keys(models),k; k=keys[i]; i++){
                models[k].reset()
            }
			storage.clear()

            this.seen = 0
            this.me= null
        },
        refreshCache: function(from, sender){
			if (!this.me) return
            var userId = this.me.id

            for(var i=0,models=this.deps.models,keys=Object.keys(models),k; k=keys[i]; i++){
                models[k].reset()
                removeColl(this,k, userId)
            }

            removeSeen(this,userId)
            readSeen(this,userId)
        },
		online: function(){
			reconn.call(this)
		},
		offline: function(){
			this.deps.push.close()
		}
    },

    connect: function(stream, model, seen){
        stream.reconnect()
    }
}
