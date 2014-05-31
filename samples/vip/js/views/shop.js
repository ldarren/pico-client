var model, bw;

me.Class = Backbone.View.extend({
    template: _.template(
        '<div class="card">'+
        '<ul class="table-view">'+
        '<li class="table-view-cell table-view-divider">Divider</li>'+
        '<li class="table-view-cell"><canvas id=barcode></canvas></li>'+
        '<li class="table-view-cell">Item 2</li>'+
        '<li class="table-view-cell">Item 3</li>'+
        '<li class="table-view-cell">Item 4</li>'+
        '</ul>'+
        '</div>'),

    initialize: function(options){
        model = options.model;
        // Create a barcode writer instance
        bw = new BWIPJS;

        // Create the bitmap interface and pass to the emulator
        bw.bitmap(new Bitmap);

        // Set the scaling factor
        bw.scale(2, 2);
    },

    getHeader: function(){
        return {
            left: 'left-nav',
            right: 'search',
            title: model.get('name'),
            options: {
                Scan: 'OCR Scanner'
            }
        }
    },

    render: function(){
        this.$el.html(this.template(model.attributes));

        // Create a dictionary object and set the options
        var opts = {};
        opts.parsefnc    = bw.value(true);
        opts.includetext = bw.value(true);
        opts.alttext     = bw.value("(00)1234567890");

        // Push the barcode text and options onto the operand stack
        bw.push("^FNC1001234567890");
        bw.push(opts);

        // Invoke the encoder and render the barcode
        bw.call('code128');
        setTimeout(function(){
        bw.bitmap().show('barcode', 'N'); //R, L, N, I
        }, 1000);
        return this;
    }
});
