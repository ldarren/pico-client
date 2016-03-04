var
specMgr=require('js/specMgr'),
picoTime=require('pico/time'),
step1 = 500,
step2 = 500,
step3 = 500,
reqStep1 = 600,
reqStep2 = 800,
reqClosingStep1 = 500,
reqClosingStep2 = 500,
initMap=function(card) {
	// my first experience with google maps api, so I have no idea what I'm doing
	var latLngFrom = {lat:1.289365, lng:103.8521763};
	var latLngTo = {lat:1.2897934, lng:103.8558166};
	var latLngCenter = {
		lat: (latLngFrom.lat + latLngTo.lat)/2,
		lng: (latLngFrom.lng + latLngTo.lng)/2
	};
	var themeColor = card.dataset.color;

	var map = new google.maps.Map(card.querySelector('.card__map__inner'), {
		zoom: 12,
		center: latLngCenter,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true
	});

	map.set('styles', [
		{
			'featureType': 'landscape',
			'elementType': 'geometry',
			'stylers': [
				{ 'hue': '#00ffdd' },
				{ 'gamma': 1 },
				{ 'lightness': 100 }
			]
		},{
			'featureType': 'road',
			'stylers': [
				{ 'lightness': 60 },
				{ 'hue': '#006eff' }
			]
		}
	]);

	var pinImage = new google.maps.MarkerImage(
		'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + themeColor.slice(1),
		new google.maps.Size(21, 34),
		new google.maps.Point(0,0),
		new google.maps.Point(10, 34)
	);

	var marker = new google.maps.Marker({
		position: latLngFrom,
		map: map,
		title: 'From',
		icon: pinImage
	});

	var marker = new google.maps.Marker({
		position: latLngTo,
		map: map,
		title: 'To',
		icon: pinImage
	});

	var polylineOpts = new google.maps.Polyline({
		strokeColor: themeColor,
		strokeWeight: 3
	});
	var rendererOptions = {map: map, polylineOptions: polylineOpts, suppressMarkers: true};
	var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

	var request = {
		origin: latLngFrom,
		destination: latLngTo,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};

	var directionsService = new google.maps.DirectionsService();
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		} else {
			console.log('wtf')
		}
	});
};

return{
	tagName:'li',
	className:'card',
	signals:['scrollTo'],
	deps:{
		data:'map'
	},
	create: function(deps){
		this.animating = false;

		var
		self=this,
		data=deps.data,
		dt=new Date(data.datetime),
		t=dt.toLocaleTimeString()

		t=t.substring(0, t.indexOf('M')+1)

		// HACK: remove when server code is ready
		this.spec.push(['card','map',{
			card:data,
			delivDateNoun:picoTime.day(dt),
			delivTime:t}])
		this.el.classList.add('theme-'+data.themeColor)
		this.el.dataset.color=data.themeColorHex

		this.spawnAsync(specMgr.findAllByType('view',this.spec),null,null,null,function(){
			//initMap(self.el)
		})
	},
	slots:{
	},
	events:{
		'click': function() {
			var
			el=this.el,
			cl=el.classList

			if (cl.contains('active')) return

			if (this.animating) return;
			this.animating = true;

			var
			self=this,
			cardTop = el.offsetTop,
			scrollTopVal = cardTop - 30

			cl.add('flip-step1');
			cl.add('active');

			self.signals.scrollTo(scrollTopVal, step1).sendNow(this.host)

			setTimeout(function() {
				self.signals.scrollTo(scrollTopVal, step2).sendNow(this.host)
				cl.add('flip-step2');

				setTimeout(function() {
					self.signals.scrollTo(scrollTopVal, step3).sendNow(this.host)
					cl.add('flip-step3');

					setTimeout(function() {
						self.animating = false;
					}, step3);
				}, step2*0.5);
			}, step1*0.65);
		},

		'click .card__header__close-btn': function() {
			var
			el=this.el,
			cl=el.classList

			if (cl.contains('req-active1')) return

			if (this.animating) return;
			this.animating = true;

			var self=this

			cl.remove('flip-step3');
			cl.remove('active');

			setTimeout(function() {
				cl.remove('flip-step2');

				setTimeout(function() {
					cl.remove('flip-step1');

					setTimeout(function() {
						self.animating = false;
					}, step1);
				}, step2*0.65);
			}, step3/2);
		},

		'click .card__request-btn': function(e) {
			var
			el=this.el,
			cl=el.classList

			if (cl.contains('req-active1')) return

			if (this.animating) return;
			this.animating = true;

			var
			self=this,
			cardTop = el.offsetTop,
			scrollTopVal = cardTop - 30

			cl.add('req-active1');
			cl.add('map-active');

			initMap(el);

			setTimeout(function() {
				cl.add('req-active2');
				self.signals.scrollTo(scrollTopVal, reqStep2).sendNow(this.host)

				setTimeout(function() {
					self.animating = false;
				}, reqStep2);
			}, reqStep1);
		},

		'click .card__header__close-btn, .card__request-btn': function() {
			var
			el=this.el,
			cl=el.classList

			if (!cl.contains('req-active1')) return

			if (this.animating) return;
			this.animating = true;

			var self=this

			cl.add('req-closing1');

			setTimeout(function() {
				cl.add('req-closing2');

				setTimeout(function() {
					cl.add('no-transition')
					cl.add('hidden-hack')
					//el.offsetHeight//$card.css('top');
					cl.remove('req-closing2')
					cl.remove('req-closing1')
					cl.remove('req-active2')
					cl.remove('req-active1')
					cl.remove('map-active')
					cl.remove('flip-step3')
					cl.remove('flip-step2')
					cl.remove('flip-step1')
					cl.remove('active')
					//el.offsetHeight//$card.css('top');
					cl.remove('no-transition');
					cl.remove('hidden-hack');
					self.animating = false;
				}, reqClosingStep2);
			}, reqClosingStep1);
		}
	}
}
