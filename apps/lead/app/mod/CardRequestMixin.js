var
COLORS=['purple','green','orange','red'],
COLOR_HEX=['#BA68C8','#52A43A','#F7AA17','#EF5350'],
picoTime=require('pico/time')

return{
    parseData:function(data){
		var
		self=this,
        d=data.$detail,
		cdt=new Date(d.collect),
		ct=cdt.toLocaleTimeString(),
		rdt=new Date(d.return),
		rt=rdt.toLocaleTimeString()

		return {
			detail:d,
            theme:COLORS[data.s],
            color:COLOR_HEX[data.s],
			collectDate:picoTime.day(cdt),
			collectTime:ct.substring(0, ct.indexOf('M')+1),//remove time zone
			returnDate:picoTime.day(rdt),
			returnTime:rt.substring(0, rt.indexOf('M')+1),//remove time zone
        }
    }
}
