pico.def('socials', 'piSocials', function(){
    var
    Random=Math.random,
    me = this,
    fbNPCs = [];

    me.loadNPCs = function(cb){
        fbNPCs.length = 0;
        me.fbReadRequests(1000, function(requests){
            var 
            target = 2,
            npcIds=[],
            npc, npcId,
            i,l,ri,request,gifts;
            for(i=0,l=(requests.length >= target ? target : requests.length); i<l; i++){
                if (!requests.length) break;
                gifts = [];
                request = requests.splice(Random()*requests.length, 1)[0];
                if (request.data) gifts.push([request.id, JSON.parse(request.data)]);
                npcId = request.from.id;
                npcIds.push(npcId);
                fbNPCs.push({name: request.from.name, id: npcId, gifts:gifts});
                for (ri=requests.length-1; ri>-1; ri--){
                    request = requests[ri];
                    if (request.from.id === npcId){
                        if (request.data) gifts.push([request.id, JSON.parse(request.data)]);
                        requests.splice(ri, 1);
                    }
                }
            }
            me.fbFriends(1000, function(friends){
                var newUsers = [], friend;
                for (i=friends.length-1; i>-1; i--){
                    friend = friends[i];
                    if (friend.installed) {
                        if (-1 !== npcIds.indexOf(friend.id)) friends.splice(i, 1);
                        continue;
                    }
                    newUsers.push(friend);
                    friends.splice(i, 1);
                }
                if (newUsers.length){
                    friend = newUsers.splice(Random()*newUsers.length, 1)[0];
                    npcId = friend.id;
                    npcIds.push(npcId);
                    fbNPCs.push({name: friend.name, id: npcId, gifts:[]});
                }
                target = 3 - fbNPCs.length;
                for(i=0,l=(friends.length >= target ? target : friends.length); i<l; i++){
                    gifts = [];
                    friend = friends.splice(Random()*friends.length, 1)[0];
                    npcId = request.data.id;
                    npcIds.push(npcId);
                    fbNPCs.push({name: friend.name, id: npcId, gifts:gifts});
                }
                cb(friends);
            });
        });
    };

    me.loadRanking = function(cb){
        if (fbFriends.length) return cb(fbFriends); // placeholder
        me.loadNPCs(cb);
    };

    me.getNPCs = function(cb){
        if (fbNPCs.length) return cb(fbNPCs);
        me.loadNPCs(cb);
    };

    me.sendGift = function(elapsed, evt, entities){
        var
        game = this,
        hero = this.hero,
        bag = hero.getBag(),
        selected = evt.selected,
        slot = bag[selected],
        item;

        if (!slot) return;
        item = slot[0];

        me.fbWriteRequests(G_MSG.TRADE.replace('ITEM', item[OBJECT_NAME]), evt.npc.id, JSON.stringify(item), function(recipients){
            if (recipients && recipients.length) game.go('giftSent', {selected: selected});
        });

        return entities;
    };
});
