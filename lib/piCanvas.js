pico.def('piCanvas', function(){

    Object.defineProperty(this, 'UPDATE', {value:this.moduleName+'.update', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(this, 'FINGER_UP', {value:this.moduleName+'.up', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(this, 'FINGER_DOWN', {value:this.moduleName+'.down', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(this, 'FINGER_MOVE', {value:this.moduleName+'.move', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(this, 'FINGER_OUT', {value:this.moduleName+'.out', writable:false, configurable:false, enumerable:true});

    var
    CIRCLE = 1,
    RECT = 2,
    SPRITE = 3;

    var
    me = this,
    lastUpdateTime = Date.now(),
    stage = null,
    canvasWidth = 320,
    canvasHeight = 320,
    layers = {},
    mouseButton,
    // shim layer with setTimeout fallback
    requestAnimFrame = (function(){
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                    window.setTimeout(callback, 17);
                };
    })(),
    update = function(){
        var
        now = Date.now(),
        elapsed = now - lastUpdateTime,
        keys = Object.keys(layers),
        l;

        for(var i=0, l=keys.length; i<l; i++){
            l = layers[keys[i]];
            l.update(elapsed);
        }

        me.signal(me.UPDATE, [layers, elapsed]);
        lastUpdateTime = now;
        requestAnimFrame(update);
    };

    var
    Renderer = function(option){
        this.entities = []; // entities: 0: type, 1: visibility, 2: x, 3: y, 4++: type specific
        this.context = option.context;
        this.zOrder = option.zOrder;
        this.isdirty = false;
    };

    Renderer.prototype.createCircle = function(option){
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
    };

    Renderer.prototype.update = function(option, ids){
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
    };

    Renderer.prototype.remove = function(ids){
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
    };

    Renderer.prototype.needRedraw = function() { return this.isDirty; }

    Renderer.prototype.redraw = function(elapsed){
        var
        ctx = this.context,
        e = this.entities,
        PI2 = 2 * Math.PI,
        i,l,ce;

        ctx.save();
        ctx.fillStyle = '#000000ff';
        ctx.beginPath();
        for(var i=0,l=e.length; i<l; i++){
            ce = e[i];
            if (!ce || !ce[1]) continue;
            switch(ce[0]){
                case CIRCLE:
                    ctx.arc(ce[2], ce[3], ce[4], 0, PI2, true);
                    break;
                case RECT:
                    break;
                case SPRITE:
                    break;
            }
        }
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        this.isDirty = false;
    };

    var
    Layer = function(id, canvas, x, y, width, height, zIndex){
        this.id = id;
        this.width = width || 400;
        this.height = height || 400;
        this.offsetTop = y;
        this.offsetLeft = x;
        this.limits = [0,0,0,0];
        this.rendererList = [];

        var style;
        if (canvas || canvas.getContext) {
            style = canvas.style;
            style.position = 'absolute';
            style.visibility = 'visible';
            style.width = this.width+'px';
            style.top = y+'px';
            style.left = '50%';
            style['margin-left'] = Math.floor(-this.width/2)+'px';
            style.zIndex = zIndex;
            canvas.setAttribute('id', this.id);
            canvas.setAttribute('width', this.width);
            canvas.setAttribute('height', this.height);
            this.canvas = canvas;
            this.context = canvas.getContext('2d');
        }else{
            console.log('no 2d canvas context');
        }
    };

    Layer.prototype.save = function(){
        return this.canvas.toDataURL();
    };

    Layer.prototype.open = function(src){
        var
        me = this,
        img = new Image();

        img.onload = function(){ me.context.drawImage(img, 0, 0); };
        img.src = src;
    };

    Layer.prototype.createRenderer = function(zOrder){
        var r = new Renderer({
            context: this.context,
            zOrder: zOrder
        });
        var
        rl = this.rendererList,
        cr;

        for (var i=0,l=rl.length; i<=rl; i++){
            cr = rl[i];
            if (!cr) rl.push(r);
            else if (zOrder < cr.zOrder) rl.splice(i, 0, r);
        }
        return r;
    };

    Layer.prototype.getContext = function(){ return this.context; };

    Layer.prototype.setPanLimits = function(xMin, xMax, yMin, yMax){
        this.limits = [xMin, xMax, yMin, yMax];
    };

    Layer.prototype.pan = function(dx, dy){
        var
        s = this.canvas.style,
        y = parseInt(s.top) + dy,
        x = parseInt(s.left) + dx;

        this.setTopLeft(x, y);
    };

    Layer.prototype.setTopLeft = function(x, y){
        var
        s = this.canvas.style,
        limits = this.limits;

        if (x > limits[0]) x = limits[0];
        else if (x < limits[1]) x = limits[1];
        if (y > limits[2]) y = limits[2];
        else if (y < limits[3]) y = limits[3];

        this.offsetTop = y;
        this.offsetLeft = x;
        s.top = y + 'px';
        s.left = x + 'px';
    };

    Layer.prototype.clearRect = function(x, y, w, h){
        this.context.clearRect(x || 0, y || 0, w || this.width, h || this.height);
    };

    Layer.prototype.clear = function(){
        this.canvas.width = this.canvas.width;
    };

    Layer.prototype.update = function(elapsed){
        var
        rl = this.rendererList,
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
    };

    this.init = function(query, width, height){
        stage = query instanceof Object ? query : document.querySelector(query);
        canvasWidth = width;
        canvasHeight = height;
        if (!stage) return console.error('stage not found:', query);

        if (pico.detectEvent('touchstart')){
            stage.addEventListener('touchstart', this, false);
            stage.addEventListener('touchend', this, false);
            stage.addEventListener('touchcancel', this, false);
            stage.addEventListener('touchleave', this, false);
        }else{
            stage.addEventListener('mousedown', this, false);
            stage.addEventListener('mouseup', this, false);
            stage.addEventListener('mouseout', this, false);
        }

        requestAnimFrame(update);
    };

    this.handleEvent = function(evt){
        evt.preventDefault();
        evt.stopPropagation();
        var target = evt.target;
        switch(evt.type){
            case 'mousedown':
                mouseButton = evt.which;
                target.addEventListener('mousemove', this, false);
                this.signal(me.FINGER_DOWN, [evt, evt.clientX, evt.clientY]);
                break;
            case 'mouseup':
                if (mouseButton === evt.which) mouseButton = 0;
                target.removeEventListener('mousemove', this, false);
                this.signal(me.FINGER_UP, [evt, evt.clientX, evt.clientY]);
                break;
            case 'mouseout':
                mouseButton = 0;
                target.removeEventListener('mousemove', this, false);
                this.signal(me.FINGER_OUT, [evt]);
                break;
            case 'mousemove':
                this.signal(me.FINGER_MOVE, [evt, evt.clientX, evt.clientY]);
                break;
            case 'touchstart':
                var touch = evt.changedTouches[0];
                mouseButton = 1;
                target.addEventListener('touchmove', this, false);
                this.signal(me.FINGER_DOWN, [evt, touch.pageX, touch.pageY]);
                break;
            case 'touchend':
            case 'touchcancel':
                var touch = evt.changedTouches[0];
                mouseButton = 0;
                target.removeEventListener('touchmove', this, false);
                this.signal(me.FINGER_UP, [evt, touch.pageX, touch.pageY]);
                break;
            case 'touchleave':
                mouseButton = 0;
                target.removeEventListener('touchmove', this, false);
                this.signal(me.FINGER_OUT, [evt]);
                break;
            case 'touchmove':
                var touch = evt.changedTouches[0];
                this.signal(me.FINGER_MOVE, [evt, touch.pageX, touch.pageY]);
                break;
        }
    };

    this.addLayer = function(id, depth, width, height){
        width = width || canvasWidth;
        height = height || canvasHeight;
        depth = depth || 100;

        var
        canvas = document.createElement('canvas'),
        offsetTop = Math.ceil((stage.offsetHeight - height)/2),
        offsetLeft = Math.ceil((stage.offsetWidth - width)/2),
        l = new Layer(id, canvas, offsetLeft, offsetTop, width, height, depth);

        stage.appendChild(canvas);

        layers[id] = l;
        return l;
    };

    this.getLayer = function(id){ return layers[id]; };
    this.getStageTop = function(){ return stage.offsetTop; };
    this.getStageLeft = function(){ return stage.offsetLeft; };
    this.getStageWidth = function(){ return stage.offsetWidth; };
    this.getStageHeight = function(){ return stage.offsetHeight; };
    this.getCanvasWidth = function(){ return canvasWidth; };
    this.getCanvasHeight = function(){ return canvasHeight; };

    this.pan = function(dx, dy){
        for(var key in layers){
            layers[key].pan(dx, dy);
        }
    };

    this.setTopLeft = function(x, y){
        for(var key in layers){
            layers[key].setTopLeft(x, y);
        }
    };
});
