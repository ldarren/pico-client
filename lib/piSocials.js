pico.def('piSocials', function(){
    var me = this;

    me.loadFacebook = function(){
        if (window.FB){
            // Use phonegap facebook plugin
            window.fbAsyncInit();
        }else{
            // Load the SDK asynchronously
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/all.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    };
});
