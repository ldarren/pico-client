<header><h1 class=title><a href="#users/<%=user.id%>"><%=user.json.name%></a></h1></header>
<ul class=table-view>
	<% var subm, j, s%>
    <% for(var i=0,m; m=menu[i]; i++){%>
    <li class="table-view-cell media"><a href="#<%=m[2]%>"><span class="media-object pull-left icon <%=m[1]%>"></span><div class="media-body"><%=m[0]%></div></a>
		<%subm=m[3];if(!subm)continue%>
		<ul class=table-sub-view>
		<% for(j=0; s=subm[j]; j++){%>
		<li class="table-sub-view-cell"><a href="#<%=s[2]%>"><%=s[0]%></a></li>
		<%}%>
		</ul>
	</li>
    <%}%>
</ul>