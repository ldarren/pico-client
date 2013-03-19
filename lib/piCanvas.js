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
    Layer = function(id, canvas, x, y, width, height, zIndex, unit){
        this.id = id;
        this.width = width || 400;
        this.height = height || 400;
        this.unitSize = unit || 10;
        this.color = '#00f';
        this.scale = 1;
        this.mode = 1;

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

    Layer.prototype.getContext = function(){ return this.context; }

    Layer.prototype.drawImage = function(src, x, y, cb){
        var
        ctx = this.context,
        img = new Image();

        img.addEventListener('load', function(){
            ctx.drawImage(img, x, y);
            if (cb) cb();
        });
        img.src = src;
    };

    Layer.prototype.drawGrid = function(color){
        var
        context = this.context,
        width = this.width,
        height = this.height,
        gridPixelSize = this.unitSize;

        context.save();
        context.strokeStyle = color;

        var
        count = Math.ceil(height / gridPixelSize),
        gap;

        // horizontal grid lines
        for(var i = 0; i <= count; i++){
            gap = i * gridPixelSize;
            context.beginPath();
            context.moveTo(0, gap);
            context.lineTo(width, gap);
            context.lineWidth = i % 5 ? 0.5 : 2;
            context.closePath();
            context.stroke();
        }

        count = Math.ceil(width/ gridPixelSize);

        // vertical grid lines
        for(var j = 0; j <= count; j++){
            gap = j * gridPixelSize;
            context.beginPath();
            context.moveTo(gap, 0);
            context.lineTo(gap, height);
            context.lineWidth = j % 5 ? 0.5 : 2;
            context.closePath();
            context.stroke();
        }

        context.restore();
    }

    Layer.prototype.drawDot = function(offsetX, offsetY){
        var
        ctx = this.context,
        penWeight = this.unitSize * this.scale,
        x = Math.floor(offsetX / penWeight),
        y = Math.floor(offsetY / penWeight);
        if (this.mode){
            ctx.fillStyle = this.color;
            ctx.fillRect(x*penWeight, y*penWeight, penWeight, penWeight);
        }else{
            ctx.clearRect(x*penWeight, y*penWeight, penWeight, penWeight);
        }
    };

    Layer.prototype.changeColor = function(color){
        this.color = color;
    };

    Layer.prototype.changeScale = function(scale){
        this.scale = scale;
    };

    Layer.prototype.toggleMode = function(){
        this.mode ^= 1;
    };

    Layer.prototype.setMode = function(mode){
        this.mode = mode;
    };

    Layer.prototype.clear = function(){
        this.context.clearRect(0, 0, this.width, this.height);
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
                this.signal('piCanvas.down', [evt]);
                break;
            case 'mouseup':
                if (mouseButton === evt.which) mouseButton = 0;
                target.removeEventListener('mousemove', this, false);
                this.signal('piCanvas.up', [evt]);
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
                this.signal('piCanvas.down', [evt]);
                break;
            case 'touchend':
            case 'touchcancel':
            case 'touchleave':
                evt.preventDefault();
                mouseButton = 0;
                target.removeEventListener('touchmove', this, false);
                this.signal('piCanvas.up', [evt]);
                break;
            case 'touchmove':
                evt.preventDefault();
                var
                s = stage,
                touches = evt.changedTouches,
                touch = touches[0];
                this.signal('piCanvas.move', [evt, (touch.pageX - s.offsetLeft, touch.pageY - s.offsetTop)]);
                break;
        }
    };

    this.addLayer = function(id, depth, unit){
        var
        canvas = document.createElement('canvas'),
        ctrX = Math.ceil(stage.offsetLeft + stage.offsetWidth/2),
        ctrY = Math.ceil(stage.offsetTop + stage.offsetHeight/2),
        offsetTop = Math.ceil(ctrY - canvasHeight/2),
        offsetLeft = Math.ceil(ctrX - canvasWidth/2),
        l = new Layer(id, canvas, offsetLeft, offsetTop, canvasWidth, canvasHeight, depth || 100, unit);

        stage.appendChild(canvas);

        layers[id] = l;
        return l;
    };
});
