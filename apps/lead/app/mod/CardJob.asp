<header class="color-<%=d.COLORS[d.jobState]%>">
<!--<img src="dat/p<%=d.user.img%>.png" alt="" class="profile" />-->
<img src="dat/p.png" alt="" class="profile" />
<div class=title>
    <div>#<%=d.id%></div>
    <div><%=d.userName%></div>
    <div><%=d.jobCollectDate%> <%=d.jobCollectTime%></div>
</div>
</header>
<footer>
<div class=name>Address</div>
<div class=info><%=d.locker.address%></div>
<div class=info><%=d.locker.postcode%></div>
<button type=button>Connect</button>
</footer>