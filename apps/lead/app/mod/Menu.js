var Router=require('js/Router')
return {
    tagName:'ul',
    className:'menu',
    signals:['refreshcache'],
    deps:{
		tpl:'file',	
        owner:'models',
		list:'list'
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl(deps.list)
    },

    events: {
		'tap li':function(e){
			var
			use='use'===e.target.tagName?e.target:e.target.querySelector('use'),
			url=use.getAttributeNS('http://www.w3.org/1999/xlink', 'role')
			if(url) Router.go(url)
		},
        'tap .signout':function(){
            this.deps.owner.reset()
        },
        'tap .restart':function(){
            window.location.reload(true)
        },
        'tap .reload':function(){
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
