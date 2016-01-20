return{
    deps:{
        info:'map'
    },
    className: 'ripple hidden',
    deps:{
        pageClass:'text',
        timeout:['int',1100]
    },
    create: function(deps){
        document.addEventListener()
    },
    events:{
        'animationstart': function(e){
            console.log(e.animationName)
        }
    }
  function ripple(elem, e) {
    $(".ripple").remove();
    var elTop = elem.offset().top,
        elLeft = elem.offset().left,
        x = e.pageX - elLeft,
        y = e.pageY - elTop;
    var $ripple = $("<div class='ripple'></div>");
    $ripple.css({top: y, left: x});
    elem.append($ripple);
  };
}
