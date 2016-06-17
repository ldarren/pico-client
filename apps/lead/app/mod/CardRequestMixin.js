var
COLORS=['purple','green','orange','red'],
picoTime=require('pico/time')

return{
    deps:{
        lockers:'models',
        laundryOpt:'models',
        surcharges:'models'
    },
    parseData:function(data){
		var
		deps=this.deps,
        lockers=deps.lockers,
        surcharges=deps.surcharges,
        laundryOpt=deps.laundryOpt,
        d=data.$detail,
		dt=new Date(d.collect),
		t=dt.toLocaleTimeString()

		return {
            colors:COLORS,
			collectDate:picoTime.day(dt),
			collectTime:t.substring(0, t.indexOf('M')+1),//remove time zone
            type:1==d.type?'LDY':'NA',
            service:surcharges.get(d.return).get('name'),
            laundry:laundryOpt.get(d.laundry).get('name'),
            locker:lockers.get(d.lockerId).get('name')
        }
    }
}
