<section class="card__part card__part-2">
	<div class="card__part__side m--back">
	  <div class="card__sender">
		<h4 class="card__sender__heading">Sender</h4>
		<div class="card__sender__img-cont">
		  <div class="card__sender__img-cont__inner">
			<img src="<%=card.senderImg%>" class="card__sender__img" />
		  </div>
		</div>
		<div class="card__sender__name-and-rating">
		  <p class="card__sender__name"><%=card.sender%></p>
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
				<div class="">
					<%=delivDateNoun%>
					<p><%=delivTime%></p>
				</div>
		  </div>
		  <div class="card__text card__text--right">
			<p class="card__text__heading">Address</p>
			<p class="card__text__middle"><%=card.toStreet%></p>
			<p class="card__text__bottom"><%=card.toCity%></p>
		  </div>
		</div>
		  <button type="button" class="card__request-btn">
			<span class="card__request-btn__text-1">Open</span>
		  </button>
	  </div>
	</div>
</section>
