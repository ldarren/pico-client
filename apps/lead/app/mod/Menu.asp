<%for(var i=0,btn; btn=d[i]; i++){%>
<li class="<%=btn.className%>">
    <svg class="icon <%=btn.url?btn.url:""%>"><use xlink:href="#icon_<%=btn.icon%>" xlink:role="<%=btn.url%>"/></svg>
</li>
<%}%>
