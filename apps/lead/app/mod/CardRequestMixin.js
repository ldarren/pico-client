var
COLORS=['purple','green','orange','red'],
STATES=['Cancelled','Order placed','Collected','Delivered'],
picoTime=require('pico/time')

return{
    deps:{
        lockers:'models',
        laundryOpt:'models',
        surcharges:'models'
    },
    parseData:function(data, cb){
		var
		deps=this.deps,
        lockers=deps.lockers,
        surcharges=deps.surcharges,
        laundryOpt=deps.laundryOpt,
        d=data.$detail,
		dt=new Date(d.collect),
		t=dt.toLocaleTimeString()

		cb(null, {
            COLORS:COLORS,
            STATES:STATES,
			collectDate:picoTime.day(dt),
			collectTime:t.substring(0, t.indexOf('M')+1),//remove time zone
            type:d.type,
            abbr:1==d.type?'LDY':'NA',
            service:surcharges.get(d.return).get('name'),
            process:laundryOpt.get(d.laundry).get('name'),
            locker:lockers.get(d.lockerId).get('name'),
            count:d.count,
            state:data.s
        })
    }
}
