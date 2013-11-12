pico.def('effect', 'picBase', function(){
    var
    me = this,
    name = me.moduleName,
    fingerUp, fingerDown, fingerMove, fingerOut, fingerTwice;

    me.draw = function(ctx, ent, clip){
    };

    me.drawScreenshot = function(ctx, ent, clip, bitmap){
        var
        tweenOpt = ent.getComponent('picTween')[name],
        x = tweenOpt.p1, y = tweenOpt.p2;

        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.globalCompositionOperation = 'source-over';
        ctx.drawImage(bitmap, clip[0], clip[1], clip[2], clip[3]);

        ctx.globalCompositionOperation = 'lighter';
        ctx.beginPath();
                
        //Time for some colors
        var gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.4, "white");
        gradient.addColorStop(0.4, "yellow");
        gradient.addColorStop(1, "black");

        ctx.fillStyle = gradient;
        ctx.arc(x, y, 10, Math.PI*2, false);
        ctx.fill();

console.log('effect draw');
        ctx.restore();
    };

    // add effectEnt, start do Effect loop
    me.start = function(elpased, evt, entities){
        this.hideAllEntities();
        this.showEntity('effects');

        var
        ent = me.findHostByCom(entities, name),
        tweenOpt = ent.getComponent('picTween')[name],
        tweenRateOpt = ent.getComponent('picTween')['@'+name],
        opt = ent.getComponent(name);

        switch(evt){
            case 'bullet':
                break;
            default:
                tweenOpt.p1 = 100, tweenOpt.p2 = 100;
                opt.p1 = 0, opt.p2 = 0;
                tweenRateOpt.p1 = 9, tweenRateOpt.p2 = 9;
                break;
        }

        fingerUp = this.getRoute('fingerUp');
        this.route('fingerUp', []);
        fingerDown = this.getRoute('fingerDown');
        this.route('fingerDown', []);
        fingerMove = this.getRoute('fingerMove');
        this.route('fingerMove', []);
        fingerOut = this.getRoute('fingerOut');
        this.route('fingerOut', []);
        fingerTwice = this.getRoute('fingerTwice');
        this.route('fingerTwice', []);

        this.startLoop('doEffect', evt);
console.log('effect start');
        return entities;
    };

    me.update = function(elapsed, evt, entities){
        var
        ent = me.findHostByCom(entities, name),
        tweenOpt = ent.getComponent('picTween')[name],
        opt = ent.getComponent(name),
        dx = tweenOpt.p1 - opt.p1,
        dy = tweenOpt.p2 - opt.p2;

console.log('effect update', dx, dy);
        if ((dx*dx + dy * dy) < 5){
            tweenOpt.p1 = tweenOpt.p2 = opt.p1 = opt.p2 = 0;
            this.stopLoop('doEffect');
            this.go('stopEffect', evt);
            return;
        }
        return entities;
    };

    // put back ui, hide effect entity
    me.stop = function(elapsed, evt, entities){
        this.showAllEntities();
        this.hideEntity('effects');

        this.route('fingerUp', fingerUp);
        this.route('fingerDown', fingerDown);
        this.route('fingerMove', fingerMove);
        this.route('fingerOut', fingerOut);
        this.route('fingerTwice', fingerTwice);
console.log('effect stop');
        return entities;
    };
});
