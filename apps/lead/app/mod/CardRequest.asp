<%var detail=d.detail%>
<span class=profile><%=detail.type==1?"L":"O"%></span>
<header>
<span>Collection: <%=d.collectDate%><p><%=d.collectTime%></p></span>
<span>Return: <%=d.returnDate%><p><%=d.returnTime%></p></span>
</header>
<footer>
<span>type: <%=detail.laundry%></span>
<span>Count: <%=detail.count%></span>
<span>Locker: <%=detail.lockerId%></span>
</footer>
