var
storage = window.localStorage,
merge1={merge:true},
addRemove = function(coll, list){
    if (!coll || !list || !list.length) return false
    coll.add(list, merge1)
    return true
},
writeData = function(model){ writeColl(this,model.collection.name, this.me.id) },
reconn=function(count){
    this.retry(count)
    if (!this.me) return
    var push=this.deps.push
    this.connect(push, this.me.attributes, this.seen)
    this.stopListening(push)
    this.listenTo(push, 'closed', reconn) // when server side shutdown connect
    this.listenTo(push, 'connecting', this.retry)// when client cant react server
    for(var i=0,evts=this.sseEvts,cbs=this.sseCBs,e; e=evts[i]; i++){
        this.listenTo(push, e, cbs[i])
    }
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
    try{self.seen=JSON.parse(seen)||0}
    catch(e){self.seen=0}
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
console.log('readColl: '+name+', count'+coll.length)
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
        this.addSSEEvents()
    },

    slots:{
        signin: function(from, sender, model){
            if(this.me)this.slots.signout.call(this)
            var userId = model.id

            this.me=model 
            readSeen(this,userId)

            reconn.call(this)

            for(var i=0,models=this.deps.models,keys=Object.keys(models),k,d; k=keys[i]; i++){
                readColl(this,k, userId)
                d=models[k]
                this.listenTo(d, 'add', writeData)
                this.listenTo(d, 'remove', writeData)
                this.listenTo(d, 'change', writeData)
            }
        },
        signout: function(){
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
        refreshCache: function(){
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

    sseEvts:['poll'],
    sseCBs:[function(raw){
        var userId = this.me.id
        if (!userId) return
        writeSeen(this, userId, raw.seen)
        var models=this.deps.models
        for(var i=0,keys=Object.keys(raw),k; k=keys[i]; i++){
            addRemove(models[k],raw[k])
        }
    }],
    addSSEEvents: function(){
    },
    connect: function(stream, model, seen, count){
        stream.reconnect()
    },
    retry: function(count){
    }
}
