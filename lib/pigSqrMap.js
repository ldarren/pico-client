pico.def('pigSqrMap', 'picGroup', function(){
    var me = this;

    me.init = function(width, height){
        this.mapWidth = width;
        this.mapHeight = height;
        if (this.map){
            this.map.length = 0;
        }else{
            this.map = [];
            this.closedPath = [],
            this.openPath = [],
            this.costG = [],
            this.costF = [],
            this.path = [];
        }
    };

    me.isTouching = function(here, there){
        var w = this.mapWidth;
        if (there === (here-w) || there === (there+w) ||
            (0 !== (here%w) && (there === (here-1) || there === (here-w-1) || there === (here+w-1))) ||
            (0 !== ((here+1)%w) && (there === (here+1) || there === (here-w+1) || there === (here+w+1)))) return true;
        return false;
    };

    me.getAdjacent = function(at, toward, isOpen, heuristic){
        var
        map = this.map,
        width = this.mapWidth,
        height = this.mapHeight,
        bestPos = at,
        minCost = width * height,
        pos, cost;

        if (isOpen(pos = at+width) && minCost > (cost = heuristic(pos, toward))) { bestPos = pos; minCost = cost;}
        if (isOpen(pos = at-width) && minCost > (cost = heuristic(pos, toward))) { bestPos = pos; minCost = cost;}
        if (0 !== (at%width)){
            if (isOpen(pos = at-1) && minCost > (cost = heuristic(pos, toward))) { bestPos = pos; minCost = cost;}
            if (isOpen(pos = at-width-1) && minCost > (cost = heuristic(pos, toward))) { bestPos = pos; minCost = cost;}
            if (isOpen(pos = at+width-1) && minCost > (cost = heuristic(pos, toward))) { bestPos = pos; minCost = cost;}
        }
        if (0 !== ((at+1)%width)){
            if (isOpen(pos = at+1) && minCost > (cost = heuristic(pos, toward))) { bestPos = pos; minCost = cost;}
            if (isOpen(pos = at-width+1) && minCost > (cost = heuristic(pos, toward))) { bestPos = pos; minCost = cost;}
            if (isOpen(pos = at+width+1) && minCost > (cost = heuristic(pos, toward))) { bestPos = pos; minCost = cost;}
        }
        return bestPos;
    };

    me.aStar = function(from, to, getNeighbours, heuristic){
        var
        map = this.map,
        mapW = this.mapWidth,
        costG = this.costG,
        costF = this.costF,
        openPath = this.openPath,
        closedPath = this.closedPath,
        path = this.path;

        costG.length = 0;
        costF.length = 0;
        openPath.length = 0;
        closedPath.length = 0;

        var
        current = from,
        prev = undefined,
        g, f,
        l, n, nl, o, node, nodeO;

        openPath.push(from);
        costG[current] = 0;
        closedPath[current] = undefined;

        while(l = openPath.length){
            current = openPath.pop();
            path.length = 0;
            if(current === to){
                path.push(current);
                while(current = closedPath[current]){
                    path.push(current);
                }
                openPath.length = 0;
            }else{
                path = getNeighbours(map, mapW, current, path);
                DONE: for(n=0,nl=path.length;n<nl;n++){
                    node = path[n];
                    if (!costF[node]){
                        closedPath[node] = current;
                        costG[node] = g = costG[current] + heuristic(node, current);
                        costF[node] = f = g + heuristic(node, to);
                        for(o=openPath.length-1;-1!==o;o--){
                            nodeO = openPath[o];
                            if (costF[nodeO] >= f){
                                openPath.splice(o+1, 0, node);
                                continue DONE;
                            }
                        }
                        openPath.unshift(node);
                    }
                }
            }
        }

        return path;
    };

});
