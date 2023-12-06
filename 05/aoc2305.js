const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
    const li = al.textToLines(data);
    const ms = al.arraySplit(li,l=>!l.length)
    const seeds = 
        ms[0][0]
        .split(/:/)[1]
        .trim()
        .split(/\s/g)
        .map(v=>parseInt(v))
    const maps = ms
        .slice(1)
        .map(mi=>mi.slice(1).map(imi=>imi.split(/ /).map(nt=>parseInt(nt))))
        .map(mi=>
            (idx)=>{
                const rem = mi.find(imi=>imi[1]<=idx&&idx<imi[1]+imi[2]);
                return rem?idx-rem[1]+rem[0]:idx;
            }
            )
                //mi.reduce((idx,imi)=>imi[1]<idx&&idx<imi[1]+imi[2]?idx-imi[1]+imi[0]:idx,idx))
    const fd = seeds.map(s=>maps.reduce((p,m)=>m(p),s) )
    return fd.reduce((p,c)=>Math.min(p,c),fd[0]);
}
function b(data) {
    const li = al.textToLines(data);
    const ms = al.arraySplit(li,l=>!l.length)
    const seeds = 
        ms[0][0]
        .split(/:/)[1]
        .trim()
        .split(/\s/g)
        .map(v=>parseInt(v))
    const maps = ms
        .slice(1)
        .map(mi=>mi.slice(1).map(imi=>imi.split(/ /).map(nt=>parseInt(nt))))
        .map(mi=>
            (idx)=>{
                const rem = mi.find(imi=>imi[1]<=idx&&idx<imi[1]+imi[2]);
                return rem?idx-rem[1]+rem[0]:idx;
            }
            )
    let c = 0;
    let step = 10_000_000;
    let segments= seeds.zip(seeds.slice(1)).filter((v,i)=>!(i&1))
    
    return segments.reduce((mi,seg)=>{
        let se = seg[0]+seg[1];
        for(let i=seg[0];i<se;i++) {
            let v = i; // seed
            for(let j=0;j<maps.length;j++) {
                v = maps[j](v);
            }
            mi = Math.min(mi,v);
            c++;
            if (0==(c%step)) {
                console.log("Seed gr "+(c/step))
            }
        }
        return mi;
    },+Infinity);
    //.reduce((p,c)=>p+c[1],0)
                //mi.reduce((idx,imi)=>imi[1]<idx&&idx<imi[1]+imi[2]?idx-imi[1]+imi[0]:idx,idx))
//    const fd = seeds.map(s=>maps.reduce((p,m)=>m(p),s) )
//    return fd.reduce((p,c)=>Math.min(p,c),fd[0]);

}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
