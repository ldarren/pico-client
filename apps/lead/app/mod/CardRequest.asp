<header class="color-<%=d.COLORS[d.state]%>">
<div class="profile color-<%=d.COLORS[4-d.type]%>"><%=d.abbr%></div>
<div class=title>
    <div>Collection: <%=d.collectDate%> <%=d.collectTime%></div>
    <div>Service: <%=d.service%></div>
    <div>Status: <%=d.STATES[d.state]%></div>
</div>
</header>
<footer>
<div>Laundry type: <%=d.laundry%></div>
<div>Laundry count: <%=d.count%></div>
<div>Locker: <%=d.locker%></div>
</footer>
