<div class="card__part__inner">
  <header class="card__header">
	<div class="card__header__close-btn"></div>
	<span class="card__header__id"># <%=data.id%></span>
	<span class="card__header__price">$<%=data.price%></span>
  </header>
  <div class="card__stats" ng-style="{'background-image': 'url(<%=data.bgImgUrl%>)'}">
	<div class="card__stats__item card__stats__item--req">
	  <p class="card__stats__type">Requests</p>
	  <span class="card__stats__value"><%=data.requests%></span>
	</div>
	<div class="card__stats__item card__stats__item--pledge">
	  <p class="card__stats__type">Pledge</p>
	  <span class="card__stats__value">$<%=data.pledge%></span>
	</div>
	<div class="card__stats__item card__stats__item--weight">
	  <p class="card__stats__type">Weight</p>
	  <span class="card__stats__value"><%=data.weight%> oz</span>
	</div>
  </div>
</div>
