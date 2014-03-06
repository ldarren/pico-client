pico.def('socials', 'piSocials', function(){
    var
    Random=Math.random,
    GRAPH_DOMAIN = 'https://graph.facebook.com',
    FB_PROFILE_URL = 'https://graph.facebook.com/USER_ID/picture?width=SIZE&access_token=TOKEN',
    me = this,
    fbAppId, fbApi, fbCallback, fbUserId, fbToken,
    fbFriends = [],
    fbAppRequests = [],
    fbNPCs = [],
    getFBRecurse = function(query, container, limit, cb){
        FB.api(query, function(res){
            Array.prototype.push.apply(container, res.data);
            if (container.length >= limit) return cb(container);
            var paging = res.paging;
            if (paging && paging.next) getFBRecurse(paging.next.substr(GRAPH_DOMAIN.length), container, limit, cb);
            else return cb(container);
        });
    };

    me.fbProfile = function(id, size){
        return FB_PROFILE_URL.replace('USER_ID', id).replace('SIZE', size).replace('TOKEN',fbToken);
    };

    me.loadFacebook = function(appId, api, cb){
        fbAppId = appId;
        fbApi = api;
        fbCallback = cb;
        Object.getPrototypeOf(me).loadFacebook();
    };

    window.fbAsyncInit = function() {
        if (!fbAppId) return console.warn('window.fbAsyncInit without appid');
        if ('Phonegap' === pico.states.browser){
            FB.init({
                appId               : fbAppId,
                nativeInterface     : fbApi,
                useCachedDialogs    : false
            });
        }else{
            // init the FB JS SDK
            FB.init({
                appId      : fbAppId,   // App ID from the app dashboard
                channelUrl : fbApi,     // Channel file for x-domain comms
                status     : true,      // Check Facebook Login status
                cookie     : true,      // enable cookies to allow the server to access the session
                xfbml      : true       // Look for social plugins on the page
            });
        }

        // Additional initialization code such as adding Event Listeners goes here
        FB.getLoginStatus(function(res){
            switch(res.status){
            case 'connected':
                // do it in authResponseChange
                break;
            case 'not_authorized':
            case 'unknown':
            default:
                fbCallback();
                break;
            }
        });

        // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
        // for any authentication related change, such as login, logout or session refresh. This means that
        // whenever someone who was previously logged out tries to log in again, the correct case below 
        // will be handled. 
        FB.Event.subscribe('auth.authResponseChange', function(res) {
            switch(res.status){
            case 'connected':
                var auth = res.authResponse;
                fbUserId =auth.userId || auth.userID;
                fbToken = auth.accessToken;
                fbCallback(fbUserId);
                break;
            case 'not_authorized':
            case 'unknown':
            default:
                console.warn('Facebook authorization cancelled?');
                fbCallback();
                break;
            }
        });
    };

    me.fbUserId = function(){return fbUserId;};
    me.fbAccessToken = function(){return fbToken;};

    me.fbLogin = function(){
        if ('Phonegap' === pico.states.browser) FB.login(null, {scope:''});
        else FB.login();
    };

    me.fbLogout = function(){
        FB.logout();
    };

    me.fbFriends = function(batch, cb){
        batch = batch || 100;
        if (fbFriends.length) return cb(fbFriends);
        getFBRecurse('/me/friends?fields=id,name,installed&limit='+batch, fbFriends, 1000, cb);
    };

    me.fbAppRequests = function(batch, cb){
        batch = batch || 100;
        getFBRecurse('/me/apprequests?limit='+batch, fbAppRequests, 1000, cb);
    };

    me.loadNPCs = function(cb){
        fbNPCs.length = 0;
        me.fbAppRequests(100, function(requests){
            var 
            target = 2,
            npcIds=[],
            npc, npcId,
            i,l,ri,request,gifts;
            for(i=0,l=(requests.length >= target ? target : request.length); i<l; i++){
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
            me.fbFriends(100, function(friends){
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

        FB.ui({
            method: 'apprequests',
            message: 'Send a '+item[OBJECT_NAME]+' gift over Facebook',
            to: evt.npc.id,
            data: JSON.stringify(item)
        }, function(){
            game.go('giftSent', {selected: selected});
        });

        return entities;
    };
});
