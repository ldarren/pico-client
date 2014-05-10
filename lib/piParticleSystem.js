var
emitterList = [],
Emitter = function(option){
    this.particleList = [];
    this.particleCount = this.particleList.length;
    this.active = false;
    this.countdown = 0;

    this.renderer = option.layer.createRenderer(option.zOrder || 1000);
    var org = option.origin;
    this.x = org[0];
    this.y = org[1];
    this.length = org[2];
    this.angle = org[3];
    this.offset = option.offset;

    this.rate = 0;
    this.speedMin = 0;
    this.speedMax = 0;
    this.angleMin = 0;
    this.angleMax = 0;
    this.life = 0;
    this.lifeVar = 0;
    this.textures = {start: null, end:null, delta: null};
    this.colors = {start: 0xffffffff, end: 0xffffffff, delta: 0x00000000};
    this.sizes = {start: 0, end: 0, delta: 0};
};

Emitter.prototype = {
    start: function(option){
        this.active = true;

        this.rate = option.rate;
        this.speedMin = option.speed[0] / 1000;
        this.speedMax = option.speed[1] / 1000;
        this.angleMin = option.angle[0];
        this.angleMax = option.angle[1];
        this.life = option.life[0] * 1000;
        this.lifeVar = option.life[1] * 1000;
        this.textures = option.textures;
        this.colors = option.colors;
        this.sizes = option.sizes;
    },

    stop: function(){
        this.active = false;
    },

    update: function(elapsed){
        var
        a = this.active,
        pc = this.particleCount;

        if (!a && !pc) return;

        var
        render = this.renderer,
        pl = this.particleList,
        l = pl.length,
        p, dist, x, y;

        for (var i=0; i<pc; i++){
            p = pl[i];
            p[1] -= elapsed;
            if (p[1] < 0){
                // move count pointer backward
                this.particleCount = pc = pc-1;
                pl[i] = pl[pc];
                pl[pc] = p;
                --i; // update the newly move backward particle
                render.update({visible: false}, [p[0]]);
                continue;
            }
            dist = p[4] += p[5] * elapsed;
            x = p[2] + (dist * p[6]);
            y = p[3] + (dist * p[7]);
            render.update({x:~~x, y:~~y}, [p[0]]);
        }

        if (a){
            var
            r = this.rate,
            cd = this.countdown += elapsed,
            smin = this.speedMin,
            smax = this.speedMax,
            amin = this.angleMin,
            amax = this.angleMax,
            o = this.offset,
            s = smin + (Math.random() * (smax - smin)),
            rad = amin + (Math.random() * (amax - amin)),
            ax = Math.cos(rad),
            ay = Math.sin(rad),
            x = this.x + (o * ax)
            y = this.y + (o * ay);

            if ((cd - r) > 0){
                this.countdown = cd - r > r ? r : cd - r;
                if (pc != pl.length){
                    p = pl[pc];
                }else{
                    p = [];
                    pl.push(p);
                    p[0] = render.createCircle({
                        radius: 5,
                        x: x,
                        y: y
                    });
                }
                this.particleCount = pc = pc + 1;

                p[1] = this.life + Math.random()*this.lifeVar;
                p[2] = x;
                p[3] = y;
                p[4] = o;
                p[5] = s;
                p[6] = ax;
                p[7] = ay;
                render.update({x:~~x, y:~~y, visible:true}, [p[0]]);
            }
        }
    }
};

me.createEmitter = function(option){ // TODO: paramter should be piRenderer instead of raw canvas context
    var e =  new Emitter(option);
    emitterList.push(e);
    return e;
};

me.update = function(elapsed){
    var e;
    for(var i=0, l=emitterList.length; i<l; i++){
        e = emitterList[i];
        e.update(elapsed);
    }
};
