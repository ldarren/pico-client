return{
	className:'scrollable',
	deps:{
        owner:'models',
		html:['file','<div><ul></ul></div>'],
		cell:'view'
	},
	create: function(deps){
		this.el.innerHTML=deps.html
	},
	rendered:function(){
		var deps=this.deps
		this.setElement(this.el.querySelector('ul'))
		this.spawn(deps.cell, null, [
			['img','url','dat/p6.png'],
			['name','text','Visit Joey place'],
			['time','text','8 - 10am'],
			['place','text','Jurong East'],
			['note','text','Change water tap']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p5.png'],
			['name','text','Visit Darren place'],
			['time','text','1 - 3pm'],
			['place','text','Manhattan'],
			['note','text','Fix shower pipe']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p7.png'],
			['name','text','Visit Hock Soon place'],
			['time','text','8 - 19pm'],
			['place','text','London'],
			['note','text','Aircon service']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p6.png'],
			['name','text','Visit Joey place'],
			['time','text','8 - 10am'],
			['place','text','Jurong East'],
			['note','text','Change water tap']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p5.png'],
			['name','text','Visit Darren place'],
			['time','text','1 - 3pm'],
			['place','text','Manhattan'],
			['note','text','Fix shower pipe']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p7.png'],
			['name','text','Visit Hock Soon place'],
			['time','text','8 - 19pm'],
			['place','text','London'],
			['note','text','Aircon service']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p6.png'],
			['name','text','Visit Joey place'],
			['time','text','8 - 10am'],
			['place','text','Jurong East'],
			['note','text','Change water tap']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p5.png'],
			['name','text','Visit Darren place'],
			['time','text','1 - 3pm'],
			['place','text','Manhattan'],
			['note','text','Fix shower pipe']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p7.png'],
			['name','text','Visit Hock Soon place'],
			['time','text','8 - 19pm'],
			['place','text','London'],
			['note','text','Aircon service']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p6.png'],
			['name','text','Visit Joey place'],
			['time','text','8 - 10am'],
			['place','text','Jurong East'],
			['note','text','Change water tap']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p5.png'],
			['name','text','Visit Darren place'],
			['time','text','1 - 3pm'],
			['place','text','Manhattan'],
			['note','text','Fix shower pipe']
		])
		this.spawn(deps.cell, null, [
			['img','url','dat/p7.png'],
			['name','text','Visit Hock Soon place'],
			['time','text','8 - 19pm'],
			['place','text','London'],
			['note','text','Aircon service']
		])
	},
	slots:{
	},
	events:{
	}
}
