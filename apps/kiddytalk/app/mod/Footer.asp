<%for(var i=0,btn; btn=d[i]; i++){%>
<li id="<%=btn.id%>">
    <svg class="icon <%=btn.url?btn.url:""%>"><use xlink:href="#icon-<%=btn.icon%>" xlink:role="<%=btn.url%>"/></svg>
	<span><%=btn.name%></span>
</li>
<%}%>
