inherit('pico/picGroup');

me.init = function(width, height){
    me.mapWidth = width;
    me.mapHeight = height;
    if (me.map){
        me.map.length = 0;
    }else{
        me.map = [];
        me.closedPath = [],
        me.openPath = [],
        me.costG = [],
        me.costF = [],
        me.path = [];
    }
};

me.isTouching = function(here, there){
    var w = me.mapWidth;
    if (there === (here-w) || there === (here+w) ||
        (0 !== (here%w) && (there === (here-1) || there === (here-w-1) || there === (here+w-1))) ||
        (0 !== ((here+1)%w) && (there === (here+1) || there === (here-w+1) || there === (here+w+1)))) return true;
    return false;
};

me.getNeighbours = function(at, isOpen, neighbours){
    var
    w = me.mapWidth,
    pos;

    if (!neighbours) neighbours = [];

    if (isOpen(pos = at+w)) { neighbours.push(pos);}
    if (isOpen(pos = at-w)) { neighbours.push(pos);}
    if (0 !== (at%w)){
        if (isOpen(pos = at-1)) { neighbours.push(pos);}
        if (isOpen(pos = at-w-1)) { neighbours.push(pos);}
        if (isOpen(pos = at+w-1)) { neighbours.push(pos);}
    }
    if (0 !== ((at+1)%w)){
        if (isOpen(pos = at+1)) { neighbours.push(pos);}
        if (isOpen(pos = at-w+1)) { neighbours.push(pos);}
        if (isOpen(pos = at+w+1)) { neighbours.push(pos);}
    }
    return neighbours;
};

me.getNeighbour = function(at, toward, isOpen, heuristic){
    var
    width = this.mapWidth,
    bestPos = at,
    minCost = width * this.mapHeight,
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

me.aStar = function(from, to, isOpen, getNeighbours, heuristic){
    var
    costG = me.costG,
    costF = me.costF,
    openPath = me.openPath,
    closedPath = me.closedPath,
    path = me.path;

    //costG.length = 0;
    costF.length = 0;
    openPath.length = 0;
    //closedPath.length = 0;

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
            path = getNeighbours(current, isOpen, path);
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
