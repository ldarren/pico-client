<section class="card__map">
	<div class=card__map__inner></div>
</section>
<section class="card__part card__part-1">
	<div class="card__part__inner">
	  <header class="card__header">
		<div class="card__header__close-btn"></div>
		<span class="card__header__id"># <%=card.id%></span>
		<span class="card__header__price">$<%=card.price%></span>
	  </header>
	  <div class="card__stats" style="background-image: url(<%=card.bgImgUrl%>)">
		<div class="card__stats__item card__stats__item--req">
		  <p class="card__stats__type">Requests</p>
		  <span class="card__stats__value"><%=card.requests%></span>
		</div>
		<div class="card__stats__item card__stats__item--pledge">
		  <p class="card__stats__type">Pledge</p>
		  <span class="card__stats__value">$<%=card.pledge%></span>
		</div>
		<div class="card__stats__item card__stats__item--weight">
		  <p class="card__stats__type">Weight</p>
		  <span class="card__stats__value"><%=card.weight%> kg</span>
		</div>
	  </div>
	</div>
</section>
<section class="card__part card__part-2">
	<div class="card__part__side m--back">
	  <div class="card__part__inner card__face">
		<div class="card__face__colored-side"></div>
		<h3 class="card__face__price">$<%=card.price%></h3>
		<div class="card__face__divider"></div>
		<div class="card__face__path"></div>
		<div class="card__face__from-to">
		  <p><%=card.fromStreet%>, <%=card.fromCity%></p>
		  <p><%=card.toStreet%>, <%=card.toCity%></p>
		</div>
		<div class="card__face__deliv-date">
			<%=delivDateNoun%>
			<p><%=delivTime%></p>
		</div>
		<div class="card__face__stats card__face__stats--req">
		  Requests
		  <p><%=card.requests%></p>
		</div>
		<div class="card__face__stats card__face__stats--pledge">
		  Pledge
		  <p>$<%=card.pledge%></p>
		</div>
		<div class="card__face__stats card__face__stats--weight">
		  Weight
			<p class="card__face__stats__weight"><span><%= card.weight > 60 ? "Heavy" : "Light" %></span></p>
		</div>
	  </div>
	</div>
	<div class="card__part__side m--front">
	  <div class="card__sender">
		<h4 class="card__sender__heading">Sender</h4>
		<div class="card__sender__img-cont">
		  <div class="card__sender__img-cont__inner">
			<img src="<%=card.senderImg%>" class="card__sender__img" />
		  </div>
		</div>
		<div class="card__sender__name-and-rating">
		  <p class="card__sender__name"><%=card.sender%></p>
		  <p class="card__sender__rating card__sender__rating-<%=card.rating%>">
			<span class="card__sender__rating__star">&#9733;</span>
			<span class="card__sender__rating__star">&#9733;</span>
			<span class="card__sender__rating__star">&#9733;</span>
			<span class="card__sender__rating__star">&#9733;</span>
			<span class="card__sender__rating__star">&#9733;</span>
			<span class="card__sender__rating__count">(<%=card.ratingCount%>)</span>
		  </p>
		  <p class="card__sender__address">
			<%=card.fromStreet%>, <%=card.fromCity%>
		  </p>
		</div>
		<div class="card__receiver">
		  <div class="card__receiver__inner">
			<div class="card__sender__img-cont">
			  <div class="card__sender__img-cont__inner">
				<img src="<%=card.senderImg%>" class="card__sender__img" />
			  </div>
			</div>
			<div class="card__sender__name-and-rating">
			  <p class="card__sender__name"><%=card.sender%></p>
			  <p class="card__sender__address">
				<%=card.toStreet%>, <%=card.toCity%>
			  </p>
			</div>
		  </div>
		</div>
		<div class="card__path-big"></div>
	  </div>
	  <div class="card__from-to">
		<div class="card__from-to__inner">
		  <div class="card__text card__text--left">
			<p class="card__text__heading">From</p>
			<p class="card__text__middle"><%=card.fromStreet%></p>
			<p class="card__text__bottom"><%=card.fromCity%></p>
		  </div>
		  <div class="card__text card__text--right">
			<p class="card__text__heading">To</p>
			<p class="card__text__middle"><%=card.toStreet%></p>
			<p class="card__text__bottom"><%=card.toCity%></p>
		  </div>
		</div>
	  </div>
		<section class="card__part card__part-3">
			<div class="card__part__side m--back"></div>
			<div class="card__part__side m--front">
			  <div class="card__timings">
				<div class="card__timings__inner">
				  <div class="card__text card__text--left">
					<p class="card__text__heading">Delivery Date</p>
					<p class="card__text__middle"><%=delivDateNoun%></p>
					<p class="card__text__bottom"><%=delivTime%></p>
				  </div>
				  <div class="card__text card__text--right">
					<p class="card__text__heading">Request Deadline</p>
					<p class="card__text__middle"><%=card.reqDl%></p>
				  </div>
				</div>
			  </div>
			  <div class="card__timer">60 min 00 sec</div>
				<section class="card__part card__part-4">
					<div class="card__part__side m--back"></div>
					<div class="card__part__side m--front">
					  <button type="button" class="card__request-btn">
						<span class="card__request-btn__text-1">Request</span>
						<span class="card__request-btn__text-2">Start</span>
					  </button>
					  <p class="card__counter"><%=card.requests%> people have sent a request</p>
					</div>
				</section>
		</div>
		</section>
	</div>
</section>
