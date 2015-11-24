inherit('pico/picBase');

var picTween = require('pico/picTween');
var picUIContent = require('pico/picUIContent');
var picRenderer = require('pico/picRenderer');
var camera = require('camera');

var
TWEENER = 'pico/picTween',
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
},
blinkEfx = function(ctx, targets, color, clip){
    var
    objects = this.objects,
    mapW = this.mapWidth,
    tileW = this.tileWidth,
    tileH = this.tileHeight,
    tileSet = this.tileSet,
    view = camera.viewPos(),
    pos, x, y;

    ctx.save();
    for(var i=0,l=targets.length; i<l; i++){
        pos = targets[i];
        x = view[0] + tileW * (pos%mapW), y = view[1] + tileH * Floor(pos/mapW);
        tileSet.draw(ctx, objects[pos][OBJECT_ICON], x, y, tileW, tileH);
    }
                    
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(clip[0], clip[1], clip[2], clip[3]);
    ctx.restore();
};

me.draw = function(ctx, ent, clip){
};

me.drawScreenshot = function(ctx, ent, clip, bitmap, evt){
    var tweenOpt = ent.getComponent(TWEENER)[name];

    ctx.save();
    switch(evt.type){
    case 'traitEfx':
    case 'castEfx':
        var
        ratio = tweenOpt.p1, alpha = tweenOpt.p2,
        targets = evt.targets,
        spells = evt.spells,
        mapW = this.mapWidth,
        tileW = this.tileWidth,
        tileH = this.tileHeight,
        spellSet = this.spellSet,
        view = camera.viewPos(),
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
        blinkEfx.call(this, ctx, evt.targets, G_COLOR_TONE[0], clip);
        break;
    case 'mistakeEfx':
        blinkEfx.call(this, ctx, evt.targets, 'red', clip);
        break;
    case 'battleText':
        var
        targets = evt.targets,
        objects = this.objects,
        mapW = this.mapWidth,
        tileW = this.tileWidth,
        tileH = this.tileHeight,
        tss = [this.tileSet],
        scale = this.smallDevice ? 1 : 2,
        view = camera.viewPos(),
        fill = picUIContent.fillIconText,
        rect = [0, 0, tileW*3, tileH],
        target, pos, attr, val, text;

        ctx.save();
        ctx.font = 1 === scale ? '14px Helvetica' : 'bold 24px alagard';

        for(var i=0,l=targets.length; i<l; i++){
            target = targets[i];
            pos = target[0];
            attr = target[1];
            val = target[2];
            rect[0] = (view[0] + tileW * (pos%mapW))-tileW, rect[1] = view[1] + tileH * (Floor(pos/mapW)-0.5);
            text = '`0'+G_STAT_ICON[attr]+(val > 0 ? ' +' : ' ')+val;
            
            ctx.fillStyle = val > 0 ? 'YELLOW' : 'RED';
            
            fill(ctx, tss, text, rect, scale);
        }

        ctx.restore();
                        
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
    case 'mistakeEfx':
        tweenOpt.p1 = 0;
        opt.p1 = 200;
        tweenRateOpt.p1 = 800;
        break;
    case 'battleText':
        tweenOpt.p1 = 0;
        opt.p1 = 800;
        tweenRateOpt.p1 = 1000;
        break;
    case 'castEfx':
        tweenOpt.p1 = 1,tweenOpt.p2 = 1;
        opt.p1 = 2,opt.p2 = 0;
        tweenRateOpt.p1 = 1,tweenRateOpt.p2 = 1;
        break;
    case 'traitEfx':
        tweenOpt.p1 = 2,tweenOpt.p2 = 1;
        opt.p1 = 1,opt.p2 = 0;
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
        
    picRenderer.setBG('efxPane', 'transparent', this.clearNone);

    picTween.slot('stop', effectEnd);
    this.startLoop('doEffect', evt);

    return entities;
};

me.clear = function(elapsed, evt, entities){
    if ('Chrome' === pico.getEnv('browser')) picRenderer.setBG('efxPane');
    else picRenderer.setBG('efxPane', 'transparent', this.clearHack);
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
