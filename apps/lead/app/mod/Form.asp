<p class="comment error"></p>
<% for(var i=0,f; f=d[i]; i++){%>
<div class="row">
	<%if (f.icon){%><svg class="icon"><use xlink:href="#icon_<%=f.icon%>"/></svg><%}%>
	<input type="text" name=<%=f.name%> class="input" placeholder="<%=f.placeHolder%>" <%=(f.required?'required':'')%> />
</div>
<%}%>
