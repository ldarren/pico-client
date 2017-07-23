var pages = []
var curr=0
var page
function changePage(){
	var newpage = pages[curr++]
	if (curr >= pages.length) curr=0
	page && page.stop()
	page = newpage
	page.start(curr, changePage)
}

return function(Page){
	pages = [Page, Page]
	changePage()
}
