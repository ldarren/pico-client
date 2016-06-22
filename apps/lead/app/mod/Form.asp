<ul class="errors hidden"></ul>
<% for(var i=0,f; f=d[i]; i++){%>
<div class="row">

<% if (f.label){%><label for=<%=f.name%>><%=f.label%></label>
<% } else if (f.icon){%><svg class="icon"><use xlink:href="#icon_<%=f.icon%>"/></svg><%}%>

<% if (f.type === "static"){ %>
<% if (f.url) {%>
    <a class=input href="<%=f.url%>"><%=f.value || ""%></a>
<% }else{ %>
    <span class=input><%=f.value%></span>
<% }%>
</div>
<% continue} else if (f.type === "checkbox"){%>
<input type=checkbox class=input name="<%=f.name%>" <%=f.value?"checked=1":""%> <%=f.required?"required":""%> <%=f.readonly?"readonly":""%>>
</div>
<% continue} else if (f.type === "select"){%>
<select class=input name="<%=f.name%>" <%=f.required?"required":""%> <%=f.readonly?"readonly":""%>>
    <option value="" <%=f.value ? "" : "selected"%> disabled><%=f.holder || "Select an option"%></option>
    <% for(var j=0,os=f.options,o; o=os[j]; j++){ %>
    <option value=<%=o[0]%> <%=o[0]==f.value ? "selected":""%>><%=o[1]%></option>
    <%}%>
</select>
</div>
<% continue} %>

<% if (f.type === "tel"){ %>
<input type="tel" placeholder="<%=f.holder || "+6598765432"%>" pattern="[\+]\d{2}[\(]\d{2}[\)]\d{4}[\-]\d{4}"
<% } else if (f.type === "email"){ %>
<input type="email" placeholder="<%=f.holder || "name@domain.ext"%>" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
<% } else {%>
<input type="<%=f.type%>" placeholder="<%=f.holder || ""%>"
<% }%>
class=input
name="<%=f.name%>"
value="<%=undefined===f.value?"":f.value%>"
<%=f.autocapitalize?"autocapitalize="+f.autocapitalize:""%>
<%=f.autocomplete?"autocomplete="+f.autocomplete:""%>
<%=f.min?"min="+f.min:""%>
<%=f.max?"max="+f.max:""%>
<%=f.autofocus?"autofocus":""%>
<%=f.required?"required":""%>
<%=f.readonly?"readonly":""%>>
</div>
<% }%>
