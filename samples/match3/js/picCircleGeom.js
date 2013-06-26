pico.def('picCircleGeom', 'picBase', function(){
    var
    layerUpdate = function(elapsed){
        var
        rl = this.drawTaskList,
        i,l,r,redraw=false;

        for(var i=0, l=rl.length; i<l; i++){
            r = rl[i];
            redraw = r.needRedraw();
            if (redraw) break;
        }

        if (!redraw) return;
        this.clear();
        for(var i=0, l=rl.length; i<l; i++){
            r = rl[i];
            r.redraw(elapsed);
        }
    },
    update = function(){
        var
        keys = Object.keys(layers),
        l;

        for(var i=0, l=keys.length; i<l; i++){
            l = layers[keys[i]];
            l.layerUpdate(elapsed);
        }

        me.signal(me.UPDATE, [layers, elapsed]);
    };

    Renderer.prototype = {
        createCircle : function(option){
            var
            e = this.entities,
            ent = [CIRCLE, true, option.x, option.y, option.radius]; // 4: radius

            for(var i=0,l=e.length; i<=l; i++){
                if (!e[i]){
                    e[i] = ent;
                    break;
                }
            }
            this.isDirty = true;
            return i;
        },

        update: function(option, ids){
            var list,i,l,ce;

            if (!ids){
                list = this.entities;
            }else{
                var e = this.entities;

                list = [];

                for(i=0,l=ids.length; i<l; i++){
                    ce = e[ids[i]];
                    if (!ce) continue;
                    list.push(ce);
                }
            }
            for (i=0,l=list.length;i<l;i++){
                ce = list[i];
                if (!ce) continue;
                if (option.visible !== undefined) ce[1] = option.visible;
                if (option.x !== undefined) ce[2] = option.x;
                if (option.y !== undefined) ce[3] = option.y;
                switch(ce[0]){
                    case CIRCLE:
                        if (option.radius !== undefined) ce[4] = option.radius;
                        break;
                    case RECT:
                        break;
                    case SPRITE:
                        break;
                }
            }
            
            this.isDirty = true;
        },

        remove: function(ids){
            if (!ids){
               this.entities = [];
            }else{
                var
                e = this.entities,
                ce;

                for(var i=0,l=ids.length; i<l; i++){
                    e[ids[i]] = undefined;
                }
            }
            this.isDirty = true;
        },

        needRedraw: function() { return this.isDirty; },

        redraw: function(elapsed){
            var
            ctx = this.context,
            e = this.entities,
            PI2 = 2 * Math.PI,
            i,l,ce;

            ctx.save();
            ctx.fillStyle = 'rgba(50,0,50,255)';
            ctx.beginPath();
            for(var i=0,l=e.length; i<l; i++){
                ce = e[i];
                if (!ce || !ce[1]) continue;
                switch(ce[0]){
                    case CIRCLE:
                        ctx.moveTo(ce[2], ce[3]);
                        ctx.arc(ce[2], ce[3], ce[4], 0, PI2, true);
                        break;
                    case RECT:
                        break;
                    case SPRITE:
                        break;
                }
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            this.isDirty = false;
        }
    };

    this.createRenderer = function(zOrder){
        var r = new Renderer({
            context: this.context,
            zOrder: zOrder
        });
        var
        rl = this.drawTaskList,
        cr;

        for (var i=0,l=rl.length; i<=rl; i++){
            cr = rl[i];
            if (!cr) rl.push(r);
            else if (zOrder < cr.zOrder) rl.splice(i, 0, r);
        }
        return r;
    };
});
