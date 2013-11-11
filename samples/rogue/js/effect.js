pico.def('effect', 'picBase', function(){
    var me = this;

    me.drawScreenshot = function(ctx, ent, clip, bitmap){
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.globalCompositionOperation = 'source-over';
        ctx.drawImage(bitmap, clip[0], clip[1], clip[2], clip[3]);

        ctx.globalCompositionOperation = 'lighter';
        ctx.beginPath();
                
        //Time for some colors
        var gradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 10);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.4, "white");
        gradient.addColorStop(0.4, "yellow");
        gradient.addColorStop(1, "black");

        ctx.fillStyle = gradient;
        ctx.arc(100, 100, 10, Math.PI*2, false);
        ctx.fill();

        ctx.restore();
    };

    // add effectEnt, start do Effect loop
    me.start = function(elpased, evt, entities){
        switch(evt){
            case 'bullet':
                break;
        }

        this.hideAllEntities();
        this.showEntity('effects');
        this.startLoop('doEffect', evt);

        return entities;
    };

    // put back ui, hide effect entity
    me.stop = function(elpased, evt, entities){
        this.stopLoop('doEffect');
        this.showAllEntities();
        this.hideEntity('effects');
        return entities;
    };
});
