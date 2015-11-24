inherit('pico/piSocials');

var god = require('god');
var hero = require('hero');

var
Random=Math.random,Floor=Math.floor,
MEDAL_URL = 'http://dungeon-chronicles.com/rogue/html/medals/',
fbAllies = [],
fbNewbees = [],
fbNPCs = [],
fbAlliesCB,
fbMedals={},
fbMedalRewards={
    beast:      [10,100,1000, 1000],
    burn:       [10,100,1000, 1000],
    cast:       [10,100,1000, 1000],
    charm:      [10,100,1000, 1000],
    chest:      [10,100,1000, 1000],
    common:     [10,100,1000, 1000],
    curse:      [10,100,1000, 1000],
    def:        [10,100,1000, 1000],
    demon:      [10,100,1000, 1000],
    plague:     [10,100,1000, 1000],
    drink:      [10,100,1000, 1000],
    enchant:    [10,100,1000, 1000],
    die:        [10,100,1000, 1000],
    fame:       [10,100,1000, 1000],
    fear:       [10,100,1000, 1000],
    frozen:     [10,100,1000, 1000],
    gold:       [10,100,1000, 1000],
    insect:     [10,100,1000, 1000],
    learn:      [10,100,1000, 1000],
    legendary:  [10,100,1000, 1000],
    patk:       [10,100,1000, 1000],
    piety:      [10,100,1000, 1000],
    plant:      [10,100,1000, 1000],
    poison:     [10,100,1000, 1000],
    ratk:       [10,100,1000, 1000],
    undead:     [10,100,1000, 1000],
    will:       [10,100,1000, 1000],
    won:        [10,100,1000, 1000],
},
fbMedalTargets={
    beast:      [50,500,5000, 5000],
    burn:       [50,500,5000, 5000],
    cast:       [50,500,5000, 5000],
    charm:      [50,500,5000, 5000],
    chest:      [50,500,5000, 5000],
    common:     [50,500,5000, 5000],
    curse:      [50,500,5000, 5000],
    def:        [50,500,5000, 5000],
    demon:      [50,500,5000, 5000],
    plague:     [50,500,5000, 5000],
    drink:      [50,500,5000, 5000],
    enchant:    [50,500,5000, 5000],
    die:        [1,2,5000, 5000],
    fame:       [5,500,5000, 5000],
    fear:       [50,500,5000, 5000],
    frozen:     [50,500,5000, 5000],
    gold:       [50,500,5000, 5000],
    insect:     [50,500,5000, 5000],
    learn:      [50,500,5000, 5000],
    legendary:  [50,500,5000, 5000],
    patk:       [50,500,5000, 5000],
    piety:      [50,500,5000, 5000],
    plant:      [50,500,5000, 5000],
    poison:     [50,500,5000, 5000],
    ratk:       [50,500,5000, 5000],
    undead:     [50,500,5000, 5000],
    will:       [50,500,5000, 5000],
    won:        [50,500,5000, 5000],
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
    if (fbAlliesCB) fbAlliesCB([data]);
},
accomplished = function(id, incr){
    var
    medals = fbMedals[me.fbUserId()],
    currLevel = medals[id] || 0;
    if (currLevel > 2) return currLevel;

    var
    val = god.incrProgress(id, incr),
    targets = fbMedalTargets[id],
    level = 0;

    for(var i=0; i<3; i++){
        if (val >= targets[i]) level++;
        else break;
    }
    if (level > currLevel){
        me.fbWriteAchievement(MEDAL_URL+id+'-'+level+'.html', function(res){
            if (res) god.incrPiety(me.getMedalReward(id, level));
        });
        medals[id] = level;
        return level;
    }
},
unlockNoti = function(id, level){
    if (!level) return;

    this.go('showDialog', {
    info: [
        '`2'+(G_MEDAL_ICON[id + '-' + level]),
        'You have unlocked '+(G_MEDAL_GRADE[level] + G_MEDAL_NAME[id]),
        'You have been rewarded with '+me.getMedalReward(id, level)+' Piety points'
    ],
    callbacks: [],
    labels: ['Ok'],
    events: []});
};

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
            // fill all the noc with gifted friends
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
            // if npc count less than 2 or 3 if no new newbees, fill than number of installed friends
            target = (fbNewbees.length ? 2 - fbNPCs.length : 3 - fbNPCs.length);
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

me.syncMedals = function(cb){
    me.readMedals(me.fbUserId(), function(medals){
        for(var key in fbMedalTargets){
            accomplished(key, 0);
        }
        if (cb) cb();
    });
};

me.readMedals = function(id, cb){
    id = 'me' === id ? me.fbUserId() : id;
    var medals = fbMedals[id];
    if (medals) return cb(medals);
    me.fbReadAchievements(id, function(res){
        var
        arr = res.data,
        domainLen = MEDAL_URL.length,
        medalId, url;

        medals = {};
        if (arr && arr.length) {
            for(var i=0,l=arr.length; i<l; i++){
                url = arr[i].data.achievement.url;
                medalId = url.substring(domainLen, url.indexOf('-', domainLen));
                medals[medalId] = (medals[medalId] || 0) + 1;
            }
        }
        fbMedals[id] = medals;
        cb(medals);
    });
};

me.getMedalLevel = function(userId, id){ 
    userId = ('me' === userId ? me.fbUserId() : userId);
    return fbMedals[userId][id] || 0;
};
me.getMedalTarget = function(id, lvl){ return fbMedalTargets[id][lvl]; };
me.getMedalReward = function(id, lvl){ 
    return fbMedalRewards[id][lvl];
};

me.castSpell = function(elapsed, evt, entities){
    /*cast: [0, 50,500,5000],
    burn: [0, 50,500,5000],
    curse: [0, 50,500,5000],
    plague: [0, 50,500,5000],
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

me.tradeItem = function(elapsed, evt, entities){
    var newLevel = accomplished('fame', 1);
    if (newLevel) unlockNoti.call(this, 'fame', newLevel);
    return entities;
};

me.resetWorld = function(elapsed, evt, entities){
    //accomplised('won', 1);
    var
    id = 'die',
    newLevel = accomplished(id, 5);
    if (newLevel) unlockNoti.call(this, id, newLevel);
    return entities;
};
