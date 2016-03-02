<div class="card__part__side m--back">
  <div class="card__part__inner card__face">
	<div class="card__face__colored-side"></div>
	<h3 class="card__face__price">$<%=data.price%></h3>
	<div class="card__face__divider"></div>
	<div class="card__face__path"></div>
	<div class="card__face__from-to">
	  <p><%=data.fromStreet%>, <%=data.fromCity%></p>
	  <p><%=data.toStreet%>, <%=data.toCity%></p>
	</div>
	<div class="card__face__deliv-date">
		<%=delivDateNoun%>
		<p><%=delivTime%></p>
	</div>
	<div class="card__face__stats card__face__stats--req">
	  Requests
	  <p><%=data.requests%></p>
	</div>
	<div class="card__face__stats card__face__stats--pledge">
	  Pledge
	  <p>$<%=data.pledge%></p>
	</div>
	<div class="card__face__stats card__face__stats--weight">
	  Weight
		<p class="card__face__stats__weight"><span><%= data.weight > 60 ? "Heavy" : "Light" %></span></p>
	</div>
  </div>
</div>
<div class="card__part__side m--front">
  <div class="card__sender">
	<h4 class="card__sender__heading">Sender</h4>
	<div class="card__sender__img-cont">
	  <div class="card__sender__img-cont__inner">
		<img ng-src="<%=data.senderImg%>" class="card__sender__img" />
	  </div>
	</div>
	<div class="card__sender__name-and-rating">
	  <p class="card__sender__name"><%=data.sender%></p>
	  <p class="card__sender__rating card__sender__rating-<%=data.rating%>">
		<span class="card__sender__rating__star">&#9733;</span>
		<span class="card__sender__rating__star">&#9733;</span>
		<span class="card__sender__rating__star">&#9733;</span>
		<span class="card__sender__rating__star">&#9733;</span>
		<span class="card__sender__rating__star">&#9733;</span>
		<span class="card__sender__rating__count">(<%=data.ratingCount%>)</span>
	  </p>
	  <p class="card__sender__address">
		<%=data.fromStreet%>, <%=data.fromCity%>
	  </p>
	</div>
	<div class="card__receiver">
	  <div class="card__receiver__inner">
		<div class="card__sender__img-cont">
		  <div class="card__sender__img-cont__inner">
			<img ng-src="<%=data.senderImg%>" class="card__sender__img" />
		  </div>
		</div>
		<div class="card__sender__name-and-rating">
		  <p class="card__sender__name"><%=data.sender%></p>
		  <p class="card__sender__address">
			<%=data.toStreet%>, <%=data.toCity%>
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
		<p class="card__text__middle"><%=data.fromStreet%></p>
		<p class="card__text__bottom"><%=data.fromCity%></p>
	  </div>
	  <div class="card__text card__text--right">
		<p class="card__text__heading">To</p>
		<p class="card__text__middle"><%=data.toStreet%></p>
		<p class="card__text__bottom"><%=data.toCity%></p>
	  </div>
	</div>
  </div>
</div>
