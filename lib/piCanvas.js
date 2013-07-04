pico.def('piCanvas', function(){

    var
    me = this,
    stage = null,
    canvasWidth = 320,
    canvasHeight = 320,
    layers = {},
    mouseButton;

    Object.defineProperty(me, 'FINGER_UP', {value:me.moduleName+'.up', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'FINGER_DOWN', {value:me.moduleName+'.down', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'FINGER_MOVE', {value:me.moduleName+'.move', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'FINGER_OUT', {value:me.moduleName+'.out', writable:false, configurable:false, enumerable:true});

    var
    // options = {x, y, width, height, depth, panLimits}
    Layer = function(id, canvas, options){
        var
        width = options.width || canvasWidth,
        height = options.height || canvasHeight;

        this.id = id;
        this.offsetTop = options.y || Math.ceil((stage.offsetHeight - height)/2);
        this.offsetLeft = options.x || Math.ceil((stage.offsetWidth - width)/2);
        this.width = width;
        this.height = height;
        this.limits = options.panLimits || [0,0,0,0];

        if (canvas || canvas.getContext) {
            this.canvas = canvas;
            this.context = canvas.getContext('2d');

            canvas.setAttribute('id', this.id);

            var style = canvas.style;
            style.position = 'absolute';
            style.visibility = 'visible';
            style.top = this.offsetTop+'px';
            style.left = this.offsetLeft+'px';
            style.zIndex = options.depth || layers.length * 100;

            this.resize(width, height);

        }else{
            console.log('no 2d canvas context');
        }

        this.autoResize = (width === canvasWidth && height === canvasHeight);
    };

    Layer.prototype = {
        save: function(){
            return this.canvas.toDataURL();
        },

        open: function(src){
            var
            me = this,
            img = new Image();

            img.onload = function(){ me.context.drawImage(img, 0, 0); };
            img.src = src;
        },

        resize: function(width, height){
            if (false === this.autoResize) return;

            var
            canvas = this.canvas,
            style = canvas.style;
            
            this.width = width;
            this.height = height;

            style.width = width+'px';
            style.height = height+'px';

            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
        },

        getContext: function(){ return this.context; },

        setPanLimits: function(xMin, xMax, yMin, yMax){
            this.limits = [xMin, xMax, yMin, yMax];
        },

        pan: function(dx, dy){
            var
            s = this.canvas.style,
            y = parseInt(s.top) + dy,
            x = parseInt(s.left) + dx;

            this.setTopLeft(x, y);
        },

        setTopLeft: function(x, y){
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
        },

        clearRect: function(x, y, w, h){
            this.context.clearRect(x || 0, y || 0, w || this.width, h || this.height);
        },

        clear: function(){
            this.context.clearRect(0, 0, this.width, this.height);
            //this.canvas.width = this.canvas.width; // this will kill some android devices
        },
    };

    // width and height are optional, if they are not provided, resize method must be called after init
    me.init = function(query, width, height){
        stage = query instanceof Object ? query : document.querySelector(query);
        if (width) canvasWidth = width;
        if (height) canvasHeight = height;
        if (!stage) return console.error('stage not found:', query);

        if (pico.detectEvent('touchstart')){
            stage.addEventListener('touchstart', me, false);
            stage.addEventListener('touchend', me, false);
            stage.addEventListener('touchcancel', me, false);
            stage.addEventListener('touchleave', me, false);
        }else{
            stage.addEventListener('mousedown', me, false);
            stage.addEventListener('mouseup', me, false);
            stage.addEventListener('mouseout', me, false);
        }
    };

    me.handleEvent = function(evt){
        evt.preventDefault();
        evt.stopPropagation();
        var target = evt.target;
        switch(evt.type){
            case 'mousedown':
                mouseButton = evt.which;
                target.addEventListener('mousemove', me, false);
                me.signal(me.FINGER_DOWN, [evt, evt.clientX, evt.clientY]);
                break;
            case 'mouseup':
                if (mouseButton === evt.which) mouseButton = 0;
                target.removeEventListener('mousemove', me, false);
                me.signal(me.FINGER_UP, [evt, evt.clientX, evt.clientY]);
                break;
            case 'mouseout':
                mouseButton = 0;
                target.removeEventListener('mousemove', me, false);
                me.signal(me.FINGER_OUT, [evt]);
                break;
            case 'mousemove':
                me.signal(me.FINGER_MOVE, [evt, evt.clientX, evt.clientY]);
                break;
            case 'touchstart':
                var touch = evt.changedTouches[0];
                mouseButton = 1;
                target.addEventListener('touchmove', me, false);
                me.signal(me.FINGER_DOWN, [evt, touch.pageX, touch.pageY]);
                break;
            case 'touchend':
            case 'touchcancel':
                var touch = evt.changedTouches[0];
                mouseButton = 0;
                target.removeEventListener('touchmove', me, false);
                me.signal(me.FINGER_UP, [evt, touch.pageX, touch.pageY]);
                break;
            case 'touchleave':
                mouseButton = 0;
                target.removeEventListener('touchmove', me, false);
                me.signal(me.FINGER_OUT, [evt]);
                break;
            case 'touchmove':
                var touch = evt.changedTouches[0];
                me.signal(me.FINGER_MOVE, [evt, touch.pageX, touch.pageY]);
                break;
        }
    };

    me.resize = function(width, height){
        canvasWidth = width;
        canvasHeight = height;

        var keys = Object.keys(layers);
        for(var i=0,l=keys.length; i<l; i++){
            layers[keys[i]].resize(width, height);
        }
    };

    // options are optional
    me.addLayer = function(id, options){
        
        var 
        canvas = document.createElement('canvas'),
        l = new Layer(id, canvas, options || {});

        stage.appendChild(canvas);
        layers[id] = l;

        return l;
    };

    me.getLayer = function(id){ return layers[id]; };
    me.getStageTop = function(){ return stage.offsetTop; };
    me.getStageLeft = function(){ return stage.offsetLeft; };
    me.getStageWidth = function(){ return stage.offsetWidth; };
    me.getStageHeight = function(){ return stage.offsetHeight; };
    me.getCanvasWidth = function(){ return canvasWidth; };
    me.getCanvasHeight = function(){ return canvasHeight; };

    me.pan = function(dx, dy){
        for(var key in layers){
            layers[key].pan(dx, dy);
        }
    };

    me.setTopLeft = function(x, y){
        for(var key in layers){
            layers[key].setTopLeft(x, y);
        }
    };
});
