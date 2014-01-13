pico.def('effect', 'picBase', function(){
    var
    me = this,
    TWEENER = 'picTween',
    Floor = Math.floor,
    name = me.moduleName,
    effectEnd = function(game, ent, evt, targetName){
        game.stopLoop('doEffect');
        game.go('clearEffect', evt);
        if (evt && evt.callback) game.go(evt.callback, evt.event);

        var
        tweenOpts = ent.getComponent(TWEENER),
        tweenOpt = tweenOpts[targetName],
        tweenRateOpt = tweenOpts['@'+targetName],
        opt = ent.getComponent(targetName),
        pk = Object.keys(tweenOpt),
        key;

        for(var i=0,l=pk.length; i<l; i++){
            key = pk[i];
            tweenOpt[key] = tweenRateOpt[key] = opt[key] = 0;
        }
    };

    me.use(TWEENER);
    me.use('camera');
    me.use('picRenderer');

    me.draw = function(ctx, ent, clip){
    };

    me.drawScreenshot = function(ctx, ent, clip, bitmap, evt){
        var tweenOpt = ent.getComponent(TWEENER)[name];

        ctx.save();
        switch(evt.type){
        case 'castEfx':
            var
            ratio = tweenOpt.p1, alpha = tweenOpt.p2,
            targets = evt.targets,
            spells = evt.spells,
            mapW = this.mapWidth,
            tileW = this.tileWidth,
            tileH = this.tileHeight,
            spellSet = this.spellSet,
            view = me.camera.viewPos(),
            pos, spell, x, y;

            ratio *= ratio;
            var
            w = tileW*ratio, h = tileH*ratio,
            dx = (w - tileW)/2, dy = (h - tileH)/2;

            ctx.clearRect.apply(ctx, clip);

            ctx.globalAlpha = alpha;
            for(var i=0,l=targets.length; i<l; i++){
                pos = targets[i];
                spell = spells[i];
                x = view[0] + tileW * (pos%mapW) - dx, y = view[1] + tileH * Floor(pos/mapW) - dy;
                spellSet.draw(ctx, spell, x, y, w, h);
            }
            break;
        case 'damageEfx':
            var
            targets = evt.targets,
            objects = this.objects,
            mapW = this.mapWidth,
            tileW = this.tileWidth,
            tileH = this.tileHeight,
            tileSet = this.tileSet,
            view = me.camera.viewPos(),
            pos, x, y;

            for(var i=0,l=targets.length; i<l; i++){
                pos = targets[i];
                x = view[0] + tileW * (pos%mapW), y = view[1] + tileH * Floor(pos/mapW);
                tileSet.draw(ctx, objects[pos][OBJECT_ICON], x, y, tileW, tileH);
            }
                            
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = G_COLOR_TONE[0];
            ctx.fillRect(clip[0], clip[1], clip[2], clip[3]);
            break;
        case 'boltEfx':
            var x = tweenOpt.p1, y = tweenOpt.p2;
            ctx.globalAlpha = 0.1;
            ctx.globalCompositeOperation = 'source-over';
            // some older android browser require this to draw gradient
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; 
            ctx.drawImage(bitmap, clip[0], clip[1], clip[2], clip[3]);
            //ctx.fillRect(clip[0], clip[1], clip[2], clip[3]);

            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
                    
            //Time for some colors
            var gradient = ctx.createRadialGradient(x, y, 0, x, y, 16);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(0.5, 'white');
            gradient.addColorStop(0.5, 'transparent');
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.arc(x, y, 10, Math.PI*2, false);
            ctx.fill();
            break;
        }

        ctx.restore();
    };

    // add effectEnt, start do Effect loop
    me.start = function(elpased, evt, entities){
        this.hideEntity('camera');

        var
        ent = this.showEntity('effects'),
        tweenOpts = ent.getComponent(TWEENER),
        tweenOpt = tweenOpts[name],
        tweenRateOpt = tweenOpts['@'+name],
        opt = ent.getComponent(name);

        switch(evt.type){
        case 'damageEfx':
            tweenOpt.p1 = 0;
            opt.p1 = 200;
            tweenRateOpt.p1 = 1000;
            break;
        case 'castEfx':
            tweenOpt.p1 = 1,tweenOpt.p2 = 1;
            opt.p1 = 2,opt.p2 = 0;
            tweenRateOpt.p1 = 1,tweenRateOpt.p2 = 1;
            break;
        case 'boltEfx':
            tweenOpt.p1 = 0, tweenOpt.p2 = 0;
            opt.p1 = 300, opt.p2 = 300;
            tweenRateOpt.p1 = 100, tweenRateOpt.p2 = 100;
            break;
        default:
            console.error('invalid effect type: '+evt.effect);
            break;
        }

        this.lockInputs();
            
        me.picRenderer.setBG('efxPane', 'transparent', function(){});

        me[TWEENER].slot('stop', effectEnd);
        this.startLoop('doEffect', evt);

        return entities;
    };

    me.clear = function(elapsed, evt, entities){
        me.picRenderer.setBG('efxPane');
        return entities;
    };

    // put back ui, hide effect entity
    me.stop = function(elapsed, evt, entities){
        this.showEntity('camera');
        this.hideEntity('effects');

        this.unlockInputs();

        this.go('stopEffect', evt);
        return;
    };
});
