const fs = require("fs");

const textToLines = text => 
    text.split(/\r\n|\n/)

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
    const bag = [12,13,14];
    const validG = games.filter(g=>!g[1].find(s=>!vecLEq(s,bag)))
    return validG.reduce((p,c)=>p+c[0],0);
}

function b(data) {
    const l = textToLines(data)
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
    const mg = games.map(g=>g[1].reduce((p,c)=>p.zip(c).map((a)=>Math.max(a[0],a[1])),[0,0,0]))
    return mg.map(g=>g[0]*g[1]*g[2]).reduce((p,c)=>p+c,0)
}

console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("a.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("a.txt","utf8")));
