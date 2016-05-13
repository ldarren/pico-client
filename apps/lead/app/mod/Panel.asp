<p class="comment error"></p>
<% for(var i=0,f; f=d[i]; i++){%>
<div class="row">
	<%if (f.icon){%><svg class="icon"><use xlink:href="#icon_<%=f.icon%>"/></svg><%}%>
	<input type="text" name=<%=f.name%> class="input" placeholder="<%=f.placeHolder%>" <%=(f.required?"required":"")%> />
</div>
<%}%>

<% for(var i=0,f; f=fields[i]; i++){ %>
<div class="input-row">
    <label><%=f.label%></label>
    <% if (f.url) { %>
    <a href="<%=f.url%>"><%=f.value%></a>
    <% }else{ %>
    <input type="text" value="<%=f.value%>" readonly>
    <% } %>
</div>
<% } %>
</form>
<form class=content-padded>
<% for(var i=0,a; a=actions[i]; i++){%>
<button type=button name="<%=a.name%>" class="btn btn-block <%=a.icon%>"><%=a.text%></button>
<%}%>
