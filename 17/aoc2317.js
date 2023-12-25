const fs = require("fs");
const al = require("../aoclib.js")

const v2add = (v1,v2) => ([v1[0]+v2[0],v1[1]+v2[1]])
const v2sub = (v1,v2) => ([v1[0]-v2[0],v1[1]-v2[1]])
const v2eq = (v1,v2) => ( v1[0]===v2[0] && v1[1]===v2[1] )

function findPath(data,minBT,maxST) {
    const cost = data
        .split(/\r\n|\n/)
        .map(l=>[...l].map(v=>parseInt(v)))

    const width = cost[0].length;
    const height = cost.length;

    // 2d array of array of entry-costs
    // each entry-cost is an object: {key:"frX,frY,dc",from:[x,y],dirCount:123,cost:123}
    const infoMap = cost.map(l=>l.map(c=>[]))

    // get an adjecancy map
    const aMap = al.adjacent2d(infoMap,(cellV,coord,nVals,nCoords)=>{
        //return nCoords.filter(v=>Math.abs(v[0]-coord[0])+Math.abs(v[1]-coord[1])<2);
        return nCoords.map(v=>({c:v,d:[v[0]-coord[0],v[1]-coord[1]]})).filter(v=>Math.abs(v.d[0])+Math.abs(v.d[1])<2);
    })

    // use a low-cost first with a queue
    infoMap[0][0]=[
        { key: "-1,0,0", from: [-1, 0], dirCount: 0, cost: 0 },
        { key: "0,-1,0", from: [0, -1], dirCount: 0, cost: 0 }];


    const queue = aMap.flatMap(r=>r.map(v=>-1));
    let head=0;
    let tail=0;
    while(true) {
        const [x,y] = [head%width,0|(head/height)];
        // try making outputs for each input.
        for(const ind of infoMap[y][x] ) {
            const [fx,fy]=ind.from;
            const [dx,dy]=[x-fx,y-fy];
            const potTargets = 
                (
                    ind.dirCount>=(minBT-1)
                        ? [[x + dx, y + dy, ind.dirCount + 1], [x + dy, y + dx, 0], [x - dy, y - dx, 0]]
                        : [[x + dx, y + dy, ind.dirCount + 1]]
                )
                .filter(od=>aMap[y][x].find(adj=>v2eq(adj.c,od)));
            // now we have outputs with a dircount, now try seeing if the cost is minimal

            for(const potTarget of potTargets) {
                if (potTarget[2]>(maxST-1))
                    continue;
                const tx = potTarget[0];
                const ty = potTarget[1];
                const targetCost = cost[ty][tx] + ind.cost;
                const key = `${x},${y},${potTarget[2]}`;
                const targetList = infoMap[ty][tx];
                const te = targetList.find(tte=>tte.key===key);
                const ne = {key,from:[x,y],dirCount:potTarget[2],cost:targetCost};
                if (!te) {
                    targetList.push(ne);
                } else if (te.cost>ne.cost) {
                    infoMap[ty][tx]=targetList.map(ee=>ee===te?ne:ee);
                } else {
                    continue;
                }
                const qc = ty*width + tx;
                if (queue[qc]===-1) {
                    queue[tail]=qc;
                    tail=qc;
                }
                //console.log(`${tx} ${ty} ${targetCost} ${key}`)
            }
            //console.log(dx,dy,potTargets)
            //console.log(ind,dx,dy)
        }
        const oldHead = head;
        head=queue[head]
        queue[oldHead]=-1;
        if (head===-1)
            break;
    }
    

    return infoMap[height-1][width-1].reduce((p,c)=>Math.min(p,c.cost),Infinity);
}

function a(data) {
    return findPath(data,0,3);
}
function b(data) {
    return findPath(data,4,10);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
