pico.def('socials', 'piSocials', function(){
    var
    Random=Math.random,Floor=Math.floor,
    me = this,
    fbAllies = [],
    fbNewbees = [],
    fbNPCs = [],
    fbAlliesCB,
    fbMedalTarget={
        beast: [0, 50,500,5000],
        burn: [0, 50,500,5000],
        cast: [0, 50,500,5000],
        charm: [0, 50,500,5000],
        chest: [0, 50,500,5000],
        common: [0, 50,500,5000],
        curse: [0, 50,500,5000],
        def: [0, 50,500,5000],
        demon: [0, 50,500,5000],
        disease: [0, 50,500,5000],
        drink: [0, 50,500,5000],
        enchant: [0, 50,500,5000],
        fall: [0, 50,500,5000],
        fear: [0, 50,500,5000],
        frozen: [0, 50,500,5000],
        gold: [0, 50,500,5000],
        insect: [0, 50,500,5000],
        learn: [0, 50,500,5000],
        legendary: [0, 50,500,5000],
        patk: [0, 50,500,5000],
        piety: [0, 50,500,5000],
        plant: [0, 50,500,5000],
        poison: [0, 50,500,5000],
        ratk: [0, 50,500,5000],
        undead: [0, 50,500,5000],
        will: [0, 50,500,5000],
        won: [0, 50,500,5000],
    },
    readLevel = function(id, cb){
        me.fbReadScore(id, function(user, score){
            if (!user) return; // no score for this player
            var
            level = score ? score - 1 : 0,  // minus 1 to prevent at last level being finish dungeon
            maxLevel = G_MAP_PARAMS.length;

            cb(user, Floor(level / maxLevel), (level % maxLevel)+1);
        });
    },
    addAllies = function(user, times, score){
        var data = [user.id, user.name, score];
        fbAllies.push(data);
console.warn('addAllies: '+user.name);
        if (fbAlliesCB) fbAlliesCB([data]);
    },
    accomplished = function(medalId, count){
    };

    me.use('god');

    me.loadNPCs = function(cb){
        fbAllies.length = 0;
        fbNPCs.length = 0;
        readLevel('me', addAllies);
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
                if (request.data) gifts.push([JSON.parse(request.data), 1, request.id]);
                npcId = request.from.id;
                npcIds.push(npcId);

                readLevel(npcId, addAllies);

                fbNPCs.push([npcId, request.from.name, gifts]);
                for (ri=requests.length-1; ri>-1; ri--){
                    request = requests[ri];
                    if (request.from.id === npcId){
                        if (request.data) gifts.push([JSON.parse(request.data), 1, request.id]);
                        requests.splice(ri, 1);
                    }
                }
            }
            me.fbFriends(1000, function(friends){
                var friend;
                fbNewbees.length = 0;
                for (i=friends.length-1; i>-1; i--){
                    friend = friends[i];
                    if (friend.installed) {
                        if (-1 !== npcIds.indexOf(friend.id)) friends.splice(i, 1);
                        else readLevel(friend.id, addAllies);
                        continue;
                    }
                    fbNewbees.push(friend);
                    friends.splice(i, 1);
                }
                target = 2 - fbNPCs.length; // if npc count less than 2, fill than number of installed friends
                for(i=0,l=(friends.length >= target ? target : friends.length); i<l; i++){
                    friend = friends.splice(Random()*friends.length, 1)[0];
                    npcId = friend.id;
                    npcIds.push(npcId);
                    fbNPCs.push([npcId, friend.name, []]);
                }
                target = 3 - fbNPCs.length; // fill the rest  of npc with friends without this app
                for(i=0,l=(fbNewbees.length >= target ? target : fbNewbees.length); i<l; i++){
                    friend = fbNewbees.splice(Random()*fbNewbees.length, 1)[0];
                    npcId = friend.id;
                    npcIds.push(npcId);
                    fbNPCs.push([npcId, friend.name, []]);
                }
                cb(fbNPCs);
            });
        });
    };

    me.loadAllies = function(cb){
console.warn('loadAllies: '+JSON.stringify(fbAllies));
        if (fbAllies.length) cb(fbAllies.slice());
        fbAlliesCB = cb;
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

        me.fbWriteRequests(G_MSG.TRADE.replace('ITEM', item[OBJECT_NAME]), evt.npc[NPC_ID], JSON.stringify(item), function(recipients){
            if (recipients && recipients.length) game.go('giftSent', {selected: selected});
        });

        return entities;
    };

    me.updateLevel = function(level){
        readLevel('me', function(user, times, score){
            me.fbWriteScore((times*G_MAP_PARAMS.length) + level);
        });
    };

    me.castSpell = function(elapsed, evt, entities){
        /*cast: [0, 50,500,5000],
        burn: [0, 50,500,5000],
        curse: [0, 50,500,5000],
        disease: [0, 50,500,5000],
        fear: [0, 50,500,5000],
        frozen: [0, 50,500,5000],
        poison: [0, 50,500,5000],*/
        return entities;
    };

    me.chantScroll = function(elapsed, evt, entities){
        // learn: [0, 50,500,5000],
        return entities;
    };

    me.lootItem = function(elapsed, evt, entities){
        /*chest: [0, 50,500,5000],
        common: [0, 50,500,5000],
        charm: [0, 50,500,5000],
        enchant: [0, 50,500,5000],
        legendary: [0, 50,500,5000],*/
        return entities;
    };

    me.attack = function(elapsed, evt, entities){
        /*patk: [0, 50,500,5000],
        ratk: [0, 50,500,5000],
        will: [0, 50,500,5000],
        beast: [0, 50,500,5000],
        demon: [0, 50,500,5000],
        insect: [0, 50,500,5000],
        plant: [0, 50,500,5000],
        undead: [0, 50,500,5000],*/
        return entities;
    };

    me.counter = function(elapsed, evt, entities){
        //def: [0, 50,500,5000],
        return entities;
    };

    me.sellItem = function(elapsed, evt, entities){
        //gold: [0, 50,500,5000],
        //piety: [0, 50,500,5000],
        return entities;
    };

    me.useItem = function(elapsed, evt, entities){
        //drink: [0, 50,500,5000],
        return entities;
    };

    me.resetWorld = function(elapsed, evt, entities){
        //fall: [0, 50,500,5000],
        //won: [0, 50,500,5000],
        return entities;
    };
});
