pico.def('effect', 'picBase', function(){
    var
    me = this,
    TWEENER = 'picTween',
    name = me.moduleName,
    fingerUp, fingerDown, fingerMove, fingerOut, fingerTwice,
    effectEnd = function(game, ent, evt, targetName){
console.log('effectEnd');
        var
        tweenOpt = ent.getComponent(TWEENER)[targetName],
        opt = ent.getComponent(targetName);

        tweenOpt.p1 = tweenOpt.p2 = opt.p1 = opt.p2 = 0;
        game.stopLoop('doEffect');
        game.go('clearEffect', evt);
    };

    me.use(TWEENER);
    me.use('picRenderer');

    me.draw = function(ctx, ent, clip){
        console.error('effect.draw');
    };

    me.drawScreenshot = function(ctx, ent, clip, bitmap){
        var
        tweenOpt = ent.getComponent(TWEENER)[name],
        x = tweenOpt.p1, y = tweenOpt.p2;

        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.globalCompositionOperation = 'source-over';
        // some older android browser require this to draw gradient
        ctx.fillStyle = "rgba(0,0,0,0.5)"; 
        ctx.drawImage(bitmap, clip[0], clip[1], clip[2], clip[3]);
        //ctx.fillRect(clip[0], clip[1], clip[2], clip[3]);

        ctx.globalAlpha = 1;
        ctx.globalCompositionOperation = 'lighter';
        ctx.beginPath();
                
        //Time for some colors
        var gradient = ctx.createRadialGradient(x, y, 0, x, y, 16);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.5, "white");
        gradient.addColorStop(0.5, "transparent");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.arc(x, y, 10, Math.PI*2, false);
        ctx.fill();

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
                tweenOpt.p1 = 300, tweenOpt.p2 = 300;
                opt.p1 = 0, opt.p2 = 0;
                tweenRateOpt.p1 = 100, tweenRateOpt.p2 = 100;
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
            
        me.picRenderer.setBG('efxPane', 'transparent', function(){});

        me[TWEENER].slot('stop', effectEnd);
        this.startLoop('doEffect', evt);
console.log('effect start');
        return entities;
    };

    me.clear = function(elapsed, evt, entities){
        me.picRenderer.setBG('efxPane');
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
        this.go('stopEffect', evt);
        return;
    };
});
