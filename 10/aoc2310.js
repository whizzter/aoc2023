const fs = require("fs");
const al = require("../aoclib.js")

// Map letters to connections, we map S to "all" initially (there's a patchup later)
const types = [
    ["|",[+0,+1],[+0,-1]],
    ["-",[+1,+0],[-1,+0]],
    ["L",[+0,-1],[+1,+0]],
    ["J",[-1,+0],[+0,-1]],
    ["7",[-1,+0],[+0,+1]],
    ["F",[+1,+0],[+0,+1]],
    ["."],
    ["S",[+1,+0],[-1,+0],[+0,+1],[+0,-1]]
]

// some vector helpers
const v2add = (v1,v2) => ([v1[0]+v2[0],v1[1]+v2[1]])
const v2sub = (v1,v2) => ([v1[0]-v2[0],v1[1]-v2[1]])
const v2eq = (v1,v2) => ( v1[0]===v2[0] && v1[1]===v2[1] )

// common parsing/connection/path builder
const build = (data) => {
    // grid to single char entries
    const field = data
        .split(/\r\n|\n/)
        .map(l=>[...l])
    // build connection field
    let start = null;
    const connsField = al.adjacent2d(field,(cell,coord,nbValues,nbCells)=>{
        start = (cell==='S'?coord:null)??start;
        //console.log(cell);
        const ct = types.find(t=>t[0]===cell).slice(1);
        return ct.map(co=>v2add(coord,co));
    })
    // infofield is build from the connection field and contains a dist(d), connections and below-winding-flips (stored as (b), used for part2)
    let rv;
    const infoField = al.adjacent2d(connsField,(cell,coord,nbValues,nbCells)=>{
        if (cell.length!=4)
            return {d:null,c:cell,b:cell.find(c=>v2sub(c,coord)[1]>0)};
        // special logic for the start position where we filter in only the connected neighbours that connect back to the start.
        const sfix =
            nbCells
            .zip(nbValues)
        // neighbours that connect back
        rv=sfix
            .filter(
                nb=>nb[1].find(nch=>v2eq(nch,coord))
            );
        const c = rv.map(t=>t[0]);
        return {d:0,c,b:c.find(c=>v2sub(c,coord)[1]>0)};
    })
    // finally we will find distances by walking a work-queue (that doubles as a path-list)
    const workQueue=[start];
    const visitedNodes = new Map
    const toKey = c=>c[0]+",,"+c[1]
    for(let i=0;i<workQueue.length;i++) {
        const coord = workQueue[i];
        visitedNodes.set(toKey(coord),null);
        const cellData = infoField[coord[1]][coord[0]];

        for(const neighbourCoord of cellData.c) {
            const neighbourData = infoField[neighbourCoord[1]][neighbourCoord[0]];
            if (!visitedNodes.has(toKey(neighbourCoord))) {
                // new node, add 1 to the distance and then add the neighbour to the workQeueue and visited list
                neighbourData.d = cellData.d+1;
                workQueue.push(neighbourCoord)
                visitedNodes.set(toKey(neighbourCoord),null);
            }
        }
    }
    return {q: workQueue,fixConns: infoField}
}

function a(data) {
    const d = build(data);
    // the workQueue will have the start at the start, end at the end and inbetweens between them
    // the end-node is always at a distance of the queue length/2
    return d.q.length/2;
}
function b(data) {
    const d = build(data);
    // we use a trick from triange-filling methods
    // namely, we count only the odd/even of the "below" vertical crossings,
    // this will give us an inside-outside info that can then be
    // combined with the "distance" data to determine if we're not on a connected
    // node that is ALSO inside.
    return d
        .fixConns
        .map(r=>r
            .reduce((st,c)=>
                ({
                    w:(c.b && (c.d!==null)?1:0) ^st.w, // winding flips happens only for members with an lower crossing
                    wl:[...st.wl,st.w], // debug winding list
                    c:st.c+( st.w && (c.d==null)?1:0 ), // counter will increase only with true windings (inside) and a cell not part of the loop
                    cl:[...st.cl,st.c]
                }),{w:0,wl:[],c:0,cl:[]})
            .c
        )
        .reduce((p,c)=>p+c,0)
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("bex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
