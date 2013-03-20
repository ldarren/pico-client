pico.def('piCanvas', function(){
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
        me.signal('piCanvas.update', [layers, now - lastUpdateTime]);
        lastUpdateTime = now;
        requestAnimFrame(update);
    },
    Layer = function(id, canvas, x, y, width, height, zIndex){
        this.id = id;
        this.width = width || 400;
        this.height = height || 400;

        var style;
        if (canvas || canvas.getContext) {
            style = canvas.style;
            style.position = 'relative';
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
        s.top = y + 'px';
        s.left = x + 'px';
    };

    this.init = function(query, width, height){
        stage = document.querySelector(query);
        canvasWidth = width;
        canvasHeight = height;
        if (!stage) return console.error('stage not found:', query);

        stage.addEventListener('mousedown', this, false);
        stage.addEventListener('mouseup', this, false);
        stage.addEventListener('mouseover', this, false);
        stage.addEventListener('mouseout', this, false);

        stage.addEventListener("touchstart", this, false);
        stage.addEventListener("touchend", this, false);
        stage.addEventListener("touchcancel", this, false);
        stage.addEventListener("touchleave", this, false);

        requestAnimFrame(update);
    };

    this.handleEvent = function(evt){
        var target = evt.target;
        switch(evt.type){
            case 'click':
                var srcId = evt.srcElement.id;
                this.signal('piCanvas.click', [evt]);
                break;
            case 'mousedown':
                mouseButton = evt.which;
                target.addEventListener('mousemove', this, false);
                this.signal('piCanvas.down', [evt, evt.clientX - stage.offsetLeft, evt.clientY - stage.offsetTop]);
                break;
            case 'mouseup':
                if (mouseButton === evt.which) mouseButton = 0;
                target.removeEventListener('mousemove', this, false);
                this.signal('piCanvas.up', [evt, evt.clientX - stage.offsetLeft, evt.clientY - stage.offsetTop]);
                break;
            case 'mouseout':
                mouseButton = 0;
                target.removeEventListener('mousemove', this, false);
                this.signal('piCanvas.out', [evt]);
                break;
            case 'mousemove':
                this.signal('piCanvas.move', [evt, evt.clientX - stage.offsetLeft, evt.clientY - stage.offsetTop]);
                break;
            case 'mouseover':
                this.signal('piCanvas.over', [evt, evt.clientX - stage.offsetLeft, evt.clientY - stage.offsetTop]);
                break;
            case 'touchstart':
                evt.preventDefault();
                mouseButton = 1;
                target.addEventListener('touchmove', this, false);
                this.signal('piCanvas.down', [evt, touch.pageX - s.offsetLeft, touch.pageY - s.offsetTop]);
                break;
            case 'touchend':
            case 'touchcancel':
            case 'touchleave':
                evt.preventDefault();
                mouseButton = 0;
                target.removeEventListener('touchmove', this, false);
                this.signal('piCanvas.up', [evt, touch.pageX - s.offsetLeft, touch.pageY - s.offsetTop]);
                break;
            case 'touchmove':
                evt.preventDefault();
                var
                s = stage,
                touches = evt.changedTouches,
                touch = touches[0];
                this.signal('piCanvas.move', [evt, touch.pageX - s.offsetLeft, touch.pageY - s.offsetTop]);
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
});
