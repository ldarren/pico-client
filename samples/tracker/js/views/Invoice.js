var Transaction = Backbone.View.extend({
    template: _.template(
    '#<%=id%>'+
    '<div class=right>$<%=charge%></div>'+
    '<div><%=time%></div>'+
    '<div class=pickup><%=pickup%></div>'+
    '<div class=dropoff><%=dropoff%></div>'
    ),
    model: null,
    tagName: 'li',
    className: 'table-view-cell',
    initialize: function(options){
        this.model = options.model
    },
    render: function(){
        var model = this.model
        this.$el.html(this.template(this.model.attributes))
        return this
    }
})

var
route = require('route'),
dateTpl = '<div class=card><ul class=table-view><li class="table-view-cell table-view-divider">DATE</li></ul></div>',
totalTpl = 
'<div class=card><ul class=table-view>'+
'<li class="table-view-cell table-view-divider">Summary</li>'+
'<li class=table-view-cell>Grand total<div class=right>$TOTAL</div></li>'+
'<li class=table-view-cell>Deposit<div class=right>$DEPOSIT</div></li>'+
'<li class=table-view-cell>Total Due<div class=right>$DUE</div></li>'+
'</ul></div>',
searchPhase = ''

me.Class = Backbone.View.extend({
    startDate: null,
    endDate: null,
    initialize: function(options){
        var self = this
        self.startDate = options.start
        self.endDate = options.end
        options.collection.fetch({
            data:{
                start: options.start,
                end: options.end,
            },
            success: function(collections, data){
                var
                $el = self.$el,
                models = collections.models,
                currDate, date, model, $ul, total=0

                for(var i=0, l=models.length; i<l; i++){
                    model = models[i]
                    date = model.get('date')
                    if (currDate !== date){
                        $el.append(dateTpl.replace('DATE', (new Date(date)).toLocaleDateString()))
                        $ul = $el.find('ul').eq(-1)
                        currDate = date
                    }
                    total += model.get('charge')
                    $ul.append((new Transaction({model: model})).render().el)
                }
                $el.append(totalTpl.replace('TOTAL', total).replace('DEPOSIT', 0).replace('DUE', total))
            }
        })
    },

    header: function(){
        return {
            title: 'Invoice',
            left: ['left-nav'],
            options:['#download']
        }
    },

    render: function(){
        return this
    },

    events: {
        'download': function(e){
            route.instance.navigate('report/invoice/download/'+this.startDate+'/'+this.endDate, {trigger:true})
        }
    }
})
