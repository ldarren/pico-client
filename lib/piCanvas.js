pico.def('piCanvas', function(){

    Object.defineProperty(this, 'UPDATE', {value:this.moduleName+'.update', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(this, 'FINGER_UP', {value:this.moduleName+'.up', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(this, 'FINGER_DOWN', {value:this.moduleName+'.down', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(this, 'FINGER_MOVE', {value:this.moduleName+'.move', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(this, 'FINGER_OUT', {value:this.moduleName+'.out', writable:false, configurable:false, enumerable:true});

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
        var now = Date.now();
        me.signal(me.UPDATE, [layers, now - lastUpdateTime]);
        lastUpdateTime = now;
        requestAnimFrame(update);
    },
    Layer = function(id, canvas, x, y, width, height, zIndex){
        this.id = id;
        this.width = width || 400;
        this.height = height || 400;
        this.offsetTop = y;
        this.offsetLeft = x;

        var style;
        if (canvas || canvas.getContext) {
            style = canvas.style;
            style.position = 'absolute';
            style.visibility = 'visible';
            style.top = y+'px';
            style.left = x+'px';
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

    Layer.prototype.getContext = function(){ return this.context; };

    Layer.prototype.pan = function(dx, dy, limits){
        var
        s = this.canvas.style,
        y = parseInt(s.top) + dy,
        x = parseInt(s.left) + dx;

        if (limits){
            if (x > limits[0]) x = limits[0];
            else if (x < -limits[1]) x = -limits[1];
            if (y > limits[2]) y = limits[2];
            else if (y < -limits[3]) y = -limits[3];
        }
        this.offsetTop = y;
        this.offsetLeft = x;
        s.top = y + 'px';
        s.left = x + 'px';
    };

    Layer.prototype.clearRect = function(x, y, w, h){
        //this.context.clearRect(x || 0, y || 0, w || this.width, h || this.height);
        this.canvas.width = this.canvas.width;
    };

    this.init = function(query, width, height){
        stage = query instanceof Object ? query : document.querySelector(query);
        canvasWidth = width;
        canvasHeight = height;
        if (!stage) return console.error('stage not found:', query);

        if (window.ontouchstart){
            stage.addEventListener("touchstart", this, false);
            stage.addEventListener("touchend", this, false);
            stage.addEventListener("touchcancel", this, false);
            stage.addEventListener("touchleave", this, false);
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
                this.signal('me.FINGER_MOVE', [evt, touch.pageX, touch.pageY]);
                break;
        }
    };

    this.addLayer = function(id, depth){
        var
        canvas = document.createElement('canvas'),
        offsetTop = Math.ceil((stage.offsetHeight - canvasHeight)/2),
        offsetLeft = Math.ceil((stage.offsetWidth - canvasWidth)/2),
        l = new Layer(id, canvas, offsetLeft, offsetTop, canvasWidth, canvasHeight, depth || 100);

        stage.appendChild(canvas);

        layers[id] = l;
        return l;
    };

    this.getLayer = function(id){
        return layers[id];
    };

    this.pan = function(x, y, limits){
        for(var key in layers){
            layers[key].pan(x, y, limits);
        }
    };
});
