me.Class = Backbone.View.extend({
    template:  _.template(
    '<div class="header"><h1>Page Slider</h1></div>' +
    '<div class="scroller">' +
        '<ul class="list">' +
        '<li><a href="#shop/1"><strong>Build Bot</strong></a></li>' +
        '<li><a href="#shop/2"><strong>Medi Bot</strong></a></li>' +
        '<li><a href="#shop/3"><strong>Ripple Bot</strong></a></li>' +
        '</ul>' +
    '</div>'),

    render: function(){
        this.$el.html(this.template({}));
        return this;
    }
});
