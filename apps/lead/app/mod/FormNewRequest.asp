<p class="comment error"></p>
<% for(var i=0,f; f=d[i]; i++){%>
<div class="row">
	<svg class="icon"><use xlink:href="#icon_<%d.icon%>"/></svg>
	<input type="text" name=<%d.name%> class="input" placeholder="<%d.placeHolder%>" <%d.required?'required':''%> />
</div>
<%}%>
