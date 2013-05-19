pico.def('piParticleSystem', function(){
    var
    me = this,
    emitterList = [];
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

    Emitter.prototype.start = function(option){
        this.active = true;

        this.rate = option.rate;
        this.speedMin = option.speed[0];
        this.speedMax = option.speed[1];
        this.angleMin = option.angle[0];
        this.angleMax = option.angle[1];
        this.life = option.life[0];
        this.lifeVar = option.life[1];
        this.textures = option.textures;
        this.colors = option.colors;
        this.sizes = option.sizes;
    };

    Emitter.prototype.stop = function(){
        this.active = false;
    };

    Emitter.prototype.update = function(elapsed){
        var
        a = this.active,
        pc = this.particleCount;

        if (!a && !pc) return;

        var
        render = this.renderer,
        p,
        pl = this.particleList,
        l = pl.length;

        for (var i=0; i<pc; i++){
            p = pl[i];
            p[1] -= elapsed;
            if (p[1] < 0){
                // move count pointer backward
                this.particleCount = pc = pc-1;
                pl[i] = pl[pc];
                pl[pc] = p;
                --i; // update the newly move backward particle
                render.hideEntity(p[0]);
                continue;
            }
            p[2] += p[4];
            p[3] += p[5];
            render.updateEntity(p[0], p[2], p[3]);
        }

        if (a){
            var
            r = this.rate,
            cd = this.countdown + elapsed,
            smin = this.speedMin,
            smax = this.speedMax,
            amin = this.angleMin,
            amax = this.angleMax,
            o = this.offset,
            s = smin + (Math.random() * smax - smin),
            ax = Math.cos(amin + (Math.random() * amax - amin)),
            ay = Math.sin(amin + (Math.random() * amax - amin));

            if ((cd - r) > 0){
                this.countdown = cd - r;
                if (pc != pl.length){
                    p = pl[pc];
                }else{
                    p = [];
                    pl.push(p);
                    p[0] = render.createCircle(5);
                }
                this.particleCount = pc = pc + 1;

                p[1] = this.life + Math.random()*this.lifeVar;
                p[2] = Math.ceil( this.x + (o * ax));
                p[3] = Math.ceil( this.y + (o * ay));
                p[4] = Math.ceil( s * ax );
                p[5] = Math.ceil( s * ay );
                render.showEntity(p[0], p[2], p[3]);
            }
        }
    };

    this.createEmitter = function(option){ // TODO: paramter should be piRenderer instead of raw canvas context
        var e =  new Emitter(option);
        emitterList.push(e);
        return e;
    };

    this.update = function(elapsed){
        var e;
        for(var i=0, l=emitterList.length; i<l; i++){
            e = emitterList[i];
            e.update(elapsed);
        }
    };
});
