const fs = require("fs");

const textToLines = text => 
    text.split(/\r\n|\n/)

// vector Less Equal helper, find that the first is always less or equal to the second
const vecLEq = (a,b) => !a.find((av,idx)=>av>b[idx]);

if ("undefined"===typeof Array.prototype.zip)
    Array.prototype.zip = function (other) {
        return this.map((e,i)=>[e,other[i]])
    }

if ("undefined"===typeof Array.prototype.groupBy)
    Array.prototype.groupBy = function (sel) {
        return [... this.reduce((p,c)=>{
            let kv = sel[c];
            let arr;
            if (!(arr=p.get(kv)))
                p.set(kv,arr);
            arr.push(c);
            return p;
        },new Map).entries()];
    }


function a(data) {
    const l = textToLines(data)
    // much of the effort of this problem was in parsing the files
    const games = l
        // divide each line into game and rest, eg {g:"123",r:"20 red;1 green,3 blue"}
        .map(l=>/Game (?<g>\d+):(?<r>.*)/.exec(l).groups)
        // map it to objects, eg [123,[[20,0,0],[0,1,3]]]
        .map(g=>[
            parseInt(g.g),
            g.r
                // separate the vectors from the rest (; separator)
                .split(/;/)
                .map(se=>
                    se
                    // each vector has components eg "1 green, 3 blue", split and parse the vector
                    .split(/,/)
                    // divide each component into digit and color
                    .map(inf=>/(?<c>\d+)\s+(?<t>\w+)/.exec(inf).groups)
                    // convert units into [R,G,B] vectors, use JS's indexing of objects to easily convert words to positions
                    .reduce((p,c)=>(p[{red:0,green:1,blue:2}[c.t]]=parseInt(c.c),p),[0,0,0])
                )
        ])
    const bag = [12,13,14];
    const validGames = games.filter(g=>!g[1].find(s=>!vecLEq(s,bag)))
    // sum the valid game id's
    return validGames.reduce((p,c)=>p+c[0],0);
}

function b(data) {
    const l = textToLines(data)
    // same parsing as in A, see comments there
    const games = l
        .map(l=>/Game (?<g>\d+):(?<r>.*)/.exec(l).groups)
        .map(g=>[
            parseInt(g.g),
            g.r
                .split(/;/)
                .map(se=>
                    se
                    .split(/,/)
                    .map(inf=>/(?<c>\d+)\s+(?<t>\w+)/.exec(inf).groups)
                    .reduce((p,c)=>(p[{red:0,green:1,blue:2}[c.t]]=parseInt(c.c),p),[0,0,0])
                )
        ])
    const maxVecForGames = games.map(g=>g[1].reduce((p,c)=>p.zip(c).map((a)=>Math.max(a[0],a[1])),[0,0,0]))
    return maxVecForGames.map(g=>g[0]*g[1]*g[2]).reduce((p,c)=>p+c,0)
}

console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("a.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("a.txt","utf8")));
