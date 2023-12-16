const fs = require("fs");
const al = require("../aoclib.js")

// directions encoded as numbers, odd numbers are negative direction, below 2 horizontal and above 2 vertical
const RIGHT = 0;
const LEFT = 1;
const DOWN = 2;
const UP = 3;

// short-names (for visualization)
const snames = [">","<","^","V"]

// for each map tile, an arry of 4 (input dirs), gives an arrya of output directions
// prettier-ignore
const tileTypes = {
    '.' :[[RIGHT],  [LEFT],   [DOWN],       [UP]],
    '/' :[[UP],     [DOWN],   [LEFT],       [RIGHT]],
    '\\':[[DOWN],   [UP],     [RIGHT],      [LEFT]],
    '-' :[[RIGHT],  [LEFT],   [LEFT,RIGHT], [LEFT,RIGHT]],
    '|' :[[UP,DOWN],[UP,DOWN],[DOWN],       [UP]],
}

const parseMap = data => {
    const tiles = 
        data
        .split(/\r\n|\n/)
        .map(l=>[...l].map(c=>tileTypes[c]))
    const width = tiles[0].length;
    const height = tiles.length;
    return {tiles,width,height}
}

const simulate = ({tiles,width,height},sx,sy,dir) => {
    const beamdata = tiles.map(l=>l.map(c=>0));

    beamdata[sy][sx] = 1<<dir; // entry-beam in upper left-cell(A), arbitrary cell in B (thus sx/sy)
    const workQueue = [sy*width + sx]; // above cell in the starting work-queue

    for(let i=0;i<workQueue.length;i++) {
        const x = workQueue[i]%width;
        const y = (workQueue[i]-x)/width;
        //console.log(`Working on ${x} ${y} with ${beamdata[y][x]}`)
        const connections = tiles[y][x]
        for (let j=0;j<4;j++) {
            // go through the existing directions/direction-dests in this tile
            if (!( beamdata[y][x]&(1<<j) ))
                continue;
            const outs = connections[j];
            for (let k=0;k<outs.length;k++) {
                // now take a destination
                const d=outs[k];
                const ax = (d<2?1:0) * (d&1?-1:1);
                const ay = (d<2?0:1) * (d&1?-1:1);
                const dx = x+ax;
                const dy = y+ay;
                //console.log(`Shooting ${snames[d]} from ${x} ${y} to ${dx} ${dy}`);
                if (dx<0 || dy<0 || dx>=width || dy>=height)
                    continue; // out of bounds ray
                const oldBD = beamdata[dy][dx];
                const newBD = beamdata[dy][dx] |= (1<<d);
                if (newBD!=oldBD) // beam addition, need to add to work-queue
                    workQueue.push(dy*width + dx);
                }
        }
    }
    //return beamdata.map(r=>r.map(c=>c!=0?al.hexbitsToChar(c):'.').join("")).join("\n");
    return beamdata.flatMap(r=>r).reduce((p,c)=>p+(c!=0?1:0),0);
}

function a(data) {
    const m = parseMap(data);
    return simulate(m,0,0,RIGHT)
}
function b(data) {
    const m = parseMap(data);
    const configurations = 
        [
            al.rangeExclusive(0,m.width)
                .flatMap(x=>[{x,y:0,d:DOWN},{x,y:m.height-1,d:UP}]),
            al.rangeExclusive(0,m.height)
                .flatMap(y=>[{x:0,y,d:RIGHT},{x:m.width-1,y,d:LEFT}])
        ].flatMap(v=>v);
    //return simulate(m,3,0,DOWN);
    return configurations
        .reduce((best,conf)=>Math.max(best,simulate(m,conf.x,conf.y,conf.d)),0);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
//console.log("\n---------------------------------\n")
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
