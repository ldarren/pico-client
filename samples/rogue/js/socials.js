pico.def('socials', 'piSocials', function(){
    var
    FB_PROFILE_URL = "https://graph.facebook.com/USER_ID/picture?width=SIZE&access_token=TOKEN",
    me = this,
    fbAppId, fbApi, fbCallback, fbUserId, fbToken,
    fbFriends = [],
    getFBFriends = function(query, cb){
        FB.api(query, function(friends){
            Array.prototype.push.apply(fbFriends, friends.data);
            if (friends.next) getFBFriends(friends.next, cb);
            else cb(fbFriends);
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

    me.fbFriends = function(batch, cb){
        batch = batch || 100;
        if (fbFriends.length) return cb(fbFriends);
        getFBFriends('/me/friends?fields=id,name,installed&limit='+batch, cb);
    };

    me.fbLogin = function(){
        if ('Phonegap' === pico.states.browser) FB.login(null, {scope:''});
        else FB.login();
    };

    me.fbLogout = function(){
        FB.logout();
    };

    me.sendGift = function(elapsed, evt, entities){
        var
        hero = this.hero,
        bag = hero.getBag(),
        selected = evt.selected,
        slot = bag[selected];

        if (!slot) return;

        FB.ui({
            method: 'apprequests',
            message: 'My Great Request',
            to: evt.npc.id
        }, function(){
            this.go('giftSent', {selected: selected});
        });

        return entities;
    };
});
