<header class="color-<%=d.COLORS[d.jobState]%>">
<img src="dat/p<%=d.user.img%>.png" alt="" class="profile" />
<div class=title>
    <div><%=d.userName%></div>
    <div><%=d.jobCollectDate%> <%=d.jobCollectTime%></div>
</div>
</header>
<footer>
<div class=name>Address</div>
<div class=info><%=d.locker.street%></div>
<div class=info><%=d.locker.city%></div>
<button type=button>Scan</button>
</footer>
