const fs = require("fs");
const al = require("../aoclib.js")

// we find a list of mirrorings by walking a list of future strings to past and checking for mirrorings as we go on.
const axisMirrorings = (o,past,future,left)=>{
    // no more work, return the output list
    if (!future.length)
        return o;
    // only check as many steps as is available on "both sides"
    const sz = Math.min(past.length,future.length);
    // only work if there is 2 sides
    if (sz) {
        // take the mtching-length subsets from each side
        const lp = past.slice(0,sz);
        const rp = future.slice(0,sz);
        // now produce a simple string to compare
        if (lp.join("\n")===rp.join("\n")) {
            // if they match, we have another solution (at this step)
            o.push(left);
        }
    }
    // continue working recursively
    return axisMirrorings(
        o,
        // _append_ the incoming item to the old list (thus the past is reversed and easy to compare to the future for mirroring)
        [...future.slice(0,1),...past], 
        future.slice(1), // rest of the incoming list
        left+1 // position incremented
    );
}

const mirroring = (c,rem=-1) => {
    // we check both vertical ..
    const vm = axisMirrorings([],[],al.transposeText(c),0)
        .filter(v=>v!==rem); // remove previous hits
    // and horizontaal
    const hm = axisMirrorings([],[],c,0)
        .filter(v=>v*100!==rem); // remove previous hits
    // vertical hits?
    if (vm.length)
        return vm[0] // return it
    else if (hm.length)
        return hm[0]*100; // or return horizontal hits
    else return -1; // or non if there isn
}


function a(data) {
    // parse lines to a list, split up the list into segments where there is empty line separators
    const d = al.arraySplit(al.textToLines(data),l=>!l.length);

    // sum the mirroring "points" to the result
    return d.map(mirroring).reduce((p,c)=>p+c,0)
}
function b(data) {
    // same parsing as in A
    const d = al.arraySplit(al.textToLines(data),l=>!l.length);

    return d.map((c,ci) => {
        // find initial mirroring
        const im = mirroring(c);
        // do a 2d iteration to flip pieces
        for (let i = 0; i < c.length; i++) {
            for (let j = 0; j < c[0].length; j++) {
                // map to a board with one piece flipped
                const fic = c.map((l, li) => [...l].map((c, ci) => (ci === j && li === i) ? c == '#' ? '.' : '#' : c).join(""))
                // check for a mirroring
                const om = mirroring(fic,im)
                
                // if we find a mirroring that differs, return it.
                if (om != im && om != -1)
                    return om;
            }
        }
        // debug crash (should not be reached when there is a correct solution)
        console.log(c.join("\n"))
        throw new Error("No-find:"+ci+" orig:"+im);
    }).reduce((p,c)=>p+c,0)
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
