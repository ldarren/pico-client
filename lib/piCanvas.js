pico.def('piCanvas', function(){

    var
    me = this,
    stage = null,
    DDC_TIMEOUT = 250, // double click timeout
    fingerTimerId = 0,
    fingerTimer = 0,
    fingerBucket = [],
    mouseButton,
    canvasWidth = 0,
    canvasHeight = 0,
    layers = {};

    Object.defineProperty(me, 'FINGER_TWICE', {value:me.moduleName+'.twice', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'FINGER_UP', {value:me.moduleName+'.up', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'FINGER_DOWN', {value:me.moduleName+'.down', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'FINGER_MOVE', {value:me.moduleName+'.move', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'FINGER_OUT', {value:me.moduleName+'.out', writable:false, configurable:false, enumerable:true});

    var
    evtRegulator = function(){
        var
        bucket = fingerBucket.splice(0, fingerBucket.length),
        fingerUp=[],fingerDown=[],
        evt,lastMove;

        for(var i=0,l=bucket.length; i<l; i++){
            evt = bucket[i];
            switch(evt[0]){
                case me.FINGER_DOWN:
                    fingerDown.push(evt);
                    break;
                case me.FINGER_UP:
                    fingerUp.push(evt);
                    break;
            }
        }
        if (1 < fingerUp.length){
            // double click, eat all finger event except of outstanding finger down
            me.signal(me.FINGER_TWICE, fingerUp[fingerUp.length-1][1]);
            if (fingerUp.length < fingerDown.length) me.signal(me.FINGER_DOWN, fingerDown[fingerDown.length-1][1]);
        }else{
            for(var i=0,l=bucket.length; i<l; i++){
                evt = bucket[i];
                switch(evt[0]){
                    case me.FINGER_DOWN:
                        me.signal(me.FINGER_DOWN, evt[1]);
                        break;
                    case me.FINGER_UP:
                        if (lastMove) {
                            me.signal(me.FINGER_MOVE, lastMove[1]);
                            lastMove = undefined;
                        }
                        me.signal(me.FINGER_UP, evt[1]);
                        break;
                    case me.FINGER_MOVE:
                        lastMove = evt;
                        break;
                }
            }
            if (lastMove){
                me.signal(me.FINGER_MOVE, lastMove[1]);
                lastMove = undefined;
            }
        }
        fingerTimerId = 0;
    },
    // options = {x, y, width, height, depth, panLimits}
    Layer = function(id, canvas, options){
        // init all properties here for v8 optimization
        this.id = id;
        this.offsetTop = 0;
        this.offsetLeft = 0;
        this.width = 0;
        this.height = 0;
        this.limits = options.panLimits || [0,0,0,0];

        if (canvas || canvas.getContext) {
            this.canvas = canvas;
            this.context = canvas.getContext('2d');

            canvas.setAttribute('id', this.id);

            var style = canvas.style;
            style.position = 'absolute';
            style.visibility = 'visible';
            style.zIndex = options.depth || layers.length * 100;

            this.resize();

        }else{
            console.error('no 2d canvas context');
        }
    };

    Layer.prototype = {
        save: function(){
            return this.canvas.toDataURL();
        },

        open: function(src){
            var img = new Image();

            img.onload = function(){ this.context.drawImage(img, 0, 0); };
            img.src = src;
        },

        resize: function(){
            var
            canvas = this.canvas,
            style = canvas.style,
            box = stage.getBoundingClientRect(),
            w = box.width,
            h = box.height;

            //style.top = box.top+'px';
            //style.left = box.left+'px';
            
            this.offsetTop = 0;
            this.offsetLeft = 0;
            this.width = w;
            this.height = h;

            style.width = w+'px';
            style.height = h+'px';

            canvas.setAttribute('width', w);
            canvas.setAttribute('height', h);
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
            stage.addEventListener('touchleave', me, false); // ignore touchenter, touch started else where and slide into canvas
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
                fingerBucket.push([me.FINGER_DOWN, [evt, evt.clientX, evt.clientY, evt.which]]);
                target.addEventListener('mousemove', me, false);
                if (!fingerTimerId) fingerTimerId = window.setTimeout(evtRegulator, DDC_TIMEOUT);
                break;
            case 'mouseup':
                mouseButton = 0;
                target.removeEventListener('mousemove', me, false);
                if (fingerTimerId){
                    fingerBucket.push([me.FINGER_UP, [evt, evt.clientX, evt.clientY, evt.which]]);
                }else{
                    me.signal(me.FINGER_UP, [evt, evt.clientX, evt.clientY]);
                }
                break;
            case 'mouseout':
                mouseButton = 0;
                target.removeEventListener('mousemove', me, false);
                if (fingerTimerId){
                    window.clearTimeout(fingerTimerId);
                    fingerTimerId = 0;
                    evtRegulator();
                }
                me.signal(me.FINGER_OUT, [evt]);
                break;
            case 'mousemove':
                if (!mouseButton) break;
                fingerBucket.push([me.FINGER_MOVE, [evt, evt.clientX, evt.clientY]]);
                if (!fingerTimerId) fingerTimerId = window.setTimeout(evtRegulator, DDC_TIMEOUT);
                break;
            case 'touchstart':
                var touch = evt.changedTouches[0];
                fingerBucket.push([me.FINGER_DOWN, [evt, touch.pageX, touch.pageY, evt.touches.length]]);
                target.addEventListener('touchmove', me, false);
                if (!fingerTimerId) fingerTimerId = window.setTimeout(evtRegulator, DDC_TIMEOUT);
                break;
            case 'touchend':
            case 'touchcancel':
                var touch = evt.changedTouches[0];
                target.removeEventListener('touchmove', me, false);
                if (fingerTimerId){
                    fingerBucket.push([me.FINGER_UP, [evt, touch.pageX, touch.pageY, evt.touches.length]]);
                }else{
                    me.signal(me.FINGER_UP, [evt, touch.pageX, touch.pageY, evt.touches.length]);
                }
                break;
            case 'touchleave':
                target.removeEventListener('touchmove', me, false);
                if (fingerTimerId){
                    window.clearTimeout(fingerTimerId);
                    fingerTimerId = 0;
                    evtRegulator();
                }
                me.signal(me.FINGER_OUT, [evt]);
                break;
            case 'touchmove':
                var touch = evt.changedTouches[0];
                fingerBucket.push([me.FINGER_MOVE, [evt, touch.pageX, touch.pageY, evt.touches.length]]);
                if (!fingerTimerId) fingerTimerId = window.setTimeout(evtRegulator, DDC_TIMEOUT);
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
