const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
    const lines = al.textToLines(data);
    const mappingSegments = al.arraySplit(lines,l=>!l.length)
    // parse out the seeds from the first segment (special one-liner)
    const seeds = 
        mappingSegments[0][0]
        .split(/:/)[1]
        .trim()
        .split(/\s/g)
        .map(v=>parseInt(v))
    const mapFunctions = mappingSegments
        // skip the seed segment
        .slice(1)
        .map(mi=>
            mi
            // we ignore the mapping name, they're all consecutive anyhow
            .slice(1)
            .map(imi=>imi
                // split each line in a mapping by spaces
                .split(/ /)
                // and convert to numbers
                .map(nt=>parseInt(nt))))
        .map(mappingInfo=>
            (idx)=>{
                // locate a mapping info that matches the input
                const rem = mappingInfo.find(imi=>imi[1]<=idx&&idx<imi[1]+imi[2]);
                // if a mapping info exists, we adjust the index,otherwise retain it.
                return rem?idx-rem[1]+rem[0]:idx;
            }
            )
                //mi.reduce((idx,imi)=>imi[1]<idx&&idx<imi[1]+imi[2]?idx-imi[1]+imi[0]:idx,idx))
    const fd = seeds.map(s=>mapFunctions.reduce((p,m)=>m(p),s) )
    return fd.reduce((p,c)=>Math.min(p,c),fd[0]);
}
function b(data) {
    const lines = al.textToLines(data);
    const mappingSegments = al.arraySplit(lines,l=>!l.length)
    // parsing and functions is same as in A
    const seeds = 
        mappingSegments[0][0]
        .split(/:/)[1]
        .trim()
        .split(/\s/g)
        .map(v=>parseInt(v))
    const mapFunctions = mappingSegments
        .slice(1)
        .map(mi=>mi
            .slice(1)
            .map(imi=>imi
                .split(/ /)
                .map(nt=>parseInt(nt))))
        .map(mappingInfo=>
            (idx)=>{
                const rem = mappingInfo.find(imi=>imi[1]<=idx&&idx<imi[1]+imi[2]);
                return rem?idx-rem[1]+rem[0]:idx;
            }
            )
    
    // the below variables are just an debug-output since solving the problem will take some CPU time with brute-force
    let c = 0;
    let step = 10_000_000;
    // combine [1 2 3 4] into [[1,2],[3,4]] by zipping with an offset-by-1 slice and filtering out odd ones.
    let segments= seeds.zip(seeds.slice(1)).filter((v,i)=>!(i&1))
    
    // now run the segments
    return segments.reduce((mi,seg)=>{
        let segmentEnd = seg[0]+seg[1];
        for(let i=seg[0];i<segmentEnd;i++) {
            let v = i; // seed
            for(let j=0;j<mapFunctions.length;j++) {
                v = mapFunctions[j](v);
            }
            // update minimum after all mappings are applied
            mi = Math.min(mi,v);
            // debug-counter-update-render
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
