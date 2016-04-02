var Router=require('js/Router')
return {
    id:'gcse',
    deps:{
        keyword:"param"
    },
    create:function(deps){
    },
    rendered:function(){
		google.search.cse.element.render({
			gname:'gsearch',
			div:'gcse',
			tag:'search',
			attributes:{
				disableWebSearch:true
			}
		})
		var element = google.search.cse.element.getElement('gsearch');
		element.execute(this.deps.keyword);
    },
    events:{
        'click .gs-image-popup-box':function(e){
            e.preventDefault()
            var popup=e.target
            while('gs-image-popup-box'!==popup.className && popup) popup=popup.parentElement;
            var img=popup.querySelector('img.gs-image')
            Router.go('home/'+encodeURI(img.src))
        }
    }
}
