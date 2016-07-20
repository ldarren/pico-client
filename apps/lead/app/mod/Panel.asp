<% for(var i=0,f; f=d[i]; i++){ %>
<div class="row">
    <%if (f.label){%><label><%=f.label%></label>
	<%} else if (f.icon){%><svg class="icon"><use xlink:href="#icon_<%=f.icon%>"/></svg><%}%>
    <% if (f.url) { %>
    <a class=input href="<%=f.url%>"><%=f.value%></a>
    <% }else{ %>
    <input class=input type="text" value="<%=f.value%>" readonly>
    <% } %>
</div>
<% } %>
