var
w=64,h=64,x=0,y=0,
json = [],
i,l,j,k;

for(i=0,l=28;i<l;i++){
    y=i*h;
    for(j=0,k=3;j<k;j++){
        x=j*w;
        json.push([x, y, w, h]);
    }
}

console.log(JSON.stringify(json));
