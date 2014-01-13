var
w=32,h=32,x=0,y=0,
json = [],
i,l,j,k;

for(i=0,l=67;i<l;i++){
    y=i*h;
    for(j=0,k=6;j<k;j++){
        x=j*w;
        json.push([x, y, w, h]);
    }
}

console.log(JSON.stringify(json));
