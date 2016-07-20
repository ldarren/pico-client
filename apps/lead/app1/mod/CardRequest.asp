<header class="color-<%=d.COLORS[d.state]%>">
<img src="dat/m1.png" alt="" class="profile" />
<div class=title>
    <div>#<%=d.id%></div>
    <div>Collection: <%=d.collectDate%> <%=d.collectTime%></div>
    <div>Status: <%=d.STATES[d.state]%></div>
</div>
</header>
<footer>
<div>Service: <%=d.service%></div>
<div>Type: <%=d.process%></div>
<div>Count: <%=d.count%></div>
<div>Locker: <%=d.locker%></div>
</footer>
