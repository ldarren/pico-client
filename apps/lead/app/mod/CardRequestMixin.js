var
COLORS=['purple','orange','green','red'],
STATES=['Cancelled','Order placed','Collected','Delivered'],
picoTime=require('pico/time'),
picoStr=require('pico/str')

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
            id:picoStr.pad(data.id,4),
			collectDate:picoTime.day(dt),
			collectTime:t.substring(0, t.indexOf('M')+1),//remove time zone
            type:d.type,
            service:surcharges.get(d.delivery).get('name'),
            process:laundryOpt.get(d.process).get('name'),
            locker:lockers.get(d.lockerId).get('name'),
            count:d.count,
            state:data.s
        })
    }
}
