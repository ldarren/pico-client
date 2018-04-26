return {
  deps: {
  	idx:['int', 1],
	tpl: 'file'
  },
  create(deps, params){
  	this.el.innerHTML = deps.tpl({idx: deps.idx})
  }
}
