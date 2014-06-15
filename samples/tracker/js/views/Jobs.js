var JobSummary = Backbone.View.extend({
    template: _.template(
    '<div><span><%=time%></span><span>$<%=charges%></span></div>'+
    '<div><span><%=pickup%></span><span><%=dropoff%></span></div>'
    ),
    model: null,
    tagName: 'li',
    className: 'table-view-cell',
    initialize: function(options){
        this.model = options.model;
    },
    render: function(){
        var model = this.model;
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

var
jobTpl = '<li class="table-view-cell"><a class="glyph glyph-right icon-right-plus" href="#job/create">Add a new job</a></li>',
dayTpl = '<div class="card"><ul class="table-view"><li class="table-view-cell table-view-divider">DATE</li></ul></div>',
searchPhase = '';

me.Class = Backbone.View.extend({
    template: _.template('<div class="card"><ul class="table-view"></ul></div>'),
    collection: null,
    initialize: function(collection){
        this.collection = collection;
    },

    getHeader: function(){
        return{
            title: searchPhase || 'All',
            left: 'left-nav',
            right: 'search',
            options:[
                'job/create'
            ]
        }
    },

    render: function(){
        var
        $el = this.$el,
        models,view;

        if (searchPhase){
            var s = searchPhase.toLowerCase();
            models = this.collection.filter(function(m){
                return -1 !== m.get('pickup').toLowerCase().indexOf(s) || -1 !== m.get('dropoff').toLowerCase().indexOf(s)
            });
        }else{
            models = this.collection.models;
        }

        $el.html(this.template({}));
        var $ul = $el.find('ul');

        for(var i=0, l=models.length; i<l; i++){
            view = new JobSummary({model: models[i]});
            $ul.append(view.render().el);
        }
        $ul.append($(jobTpl));
        return this;
    },

    events: {
        'find': function(e){
            searchPhase = e._args[0];
            this.render();
        },
        'touchstart a.icon-plus':function(e){
            e.preventDefault();
            e.stopPropagation();
            if (window.plugins){
                window.plugins.barcodeScanner.scan(
                function (result) {
                    alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
                }, 
                function (error) {
                    alert("Scanning failed: " + error);
                });
            }
        }
    }
});
