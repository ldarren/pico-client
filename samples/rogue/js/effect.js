pico.def('effect', 'picBase', function(){
    var
    me = this,
    TWEENER = 'picTween',
    name = me.moduleName,
    fingerUp, fingerDown, fingerMove, fingerOut, fingerTwice,
    effectEnd = function(game, ent, name, targetName){
        console.log(this, arguments);
    };

    me.use(TWEENER);

    me.draw = function(ctx, ent, clip){
    };

    me.drawScreenshot = function(ctx, ent, clip, bitmap){
        var
        tweenOpt = ent.getComponent(TWEENER)[name],
        x = tweenOpt.p1, y = tweenOpt.p2;

        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.globalCompositionOperation = 'source-over';
        //ctx.drawImage(bitmap, clip[0], clip[1], clip[2], clip[3]);
        ctx,fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0,0,500,500);

        ctx.globalCompositionOperation = 'lighter';
        ctx.beginPath();
                
        //Time for some colors
        var gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.4, "white");
        gradient.addColorStop(0.4, "yellow");
        gradient.addColorStop(1, "transparent");

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
        tweenOpt = ent.getComponent(TWEENER)[name],
        tweenRateOpt = ent.getComponent(TWEENER)['@'+name],
        opt = ent.getComponent(name);

        switch(evt){
            case 'bullet':
                break;
            default:
                tweenOpt.p1 = 100, tweenOpt.p2 = 100;
                opt.p1 = 0, opt.p2 = 0;
                tweenRateOpt.p1 = 15, tweenRateOpt.p2 = 15;
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

        me[TWEENER].slot('stop', effectEnd);
        this.startLoop('doEffect', evt);
console.log('effect start');
        return entities;
    };

    me.update = function(elapsed, evt, entities){
        var
        ent = me.findHostByCom(entities, name),
        tweenOpt = ent.getComponent(TWEENER)[name],
        opt = ent.getComponent(name),
        dx = tweenOpt.p1 - opt.p1,
        dy = tweenOpt.p2 - opt.p2;

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
