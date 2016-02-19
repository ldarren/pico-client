return {
    tagName:'ul',
    className:'menu',
    signals:['refreshcache'],
    deps:{
		tpl:'file',
        owner:'models'
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl()
    },

    events: {
        'touchstart .signout':function(){
            this.deps.owner.reset()
        },
        'touchstart .restart':function(){
            window.location.reload(true)
        },
        'touchstart .reload':function(){
            this.signals.refreshCache().send()
        }
    }
}
/*
    if (animating) return;
    $(".ripple").remove();
    animating = true;
    var that = this;
    $(that).addClass("clicked");
    setTimeout(function() {
      $app.removeClass("active");
      $login.show();
      $login.css("top");
      $login.removeClass("inactive");
    }, logoutPhase1 - 120);
    setTimeout(function() {
      $app.hide();
      animating = false;
      $(that).removeClass("clicked");
    }, logoutPhase1);
*/
