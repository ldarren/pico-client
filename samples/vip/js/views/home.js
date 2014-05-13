var homePage =
    '<div>' +
        '<div class="header"><h1>Page Slider</h1></div>' +
        '<div class="scroller">' +
        '<ul class="list">' +
            '<li><a href="#page1"><strong>Build Bot</strong></a></li>' +
            '<li><a href="#page2"><strong>Medi Bot</strong></a></li>' +
            '<li><a href="#page3"><strong>Ripple Bot</strong></a></li>' +
        '</ul>' +
        '</div>' +
    '</div>';

me.render = function(){
    this.$el.html(_.template(hopePage, {}));
    return this;
};

var Home = Backbone.View.extend({
    initialize: function(){
    },
    render: function(){
    }
});
