<%var card=d.card%>
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
		<%=d.delivDateNoun%>
		<p><%=d.delivTime%></p>
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
</div>
