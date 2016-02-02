var tpl= require('Calendar.html')

return{
    className: 'calendar',
    create: function(deps){
        this.el.innerHTML=tpl
    }
}
