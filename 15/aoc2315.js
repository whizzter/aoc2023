const fs = require("fs");
const al = require("../aoclib.js")

const HASH = s => [...s].reduce((p,c,ci)=>(((p+c.charCodeAt(0))*17)&0xff),0)

function a(data) {
    const i = data.replace(/\r|\n/g,"");

    // just a sum of hashes of the comma separated items
    return i.split(",").reduce((p,c)=>p+HASH(c),0);
}

function b(data) {
    // bytecode list
    const bcl = data
        .replace(/\r|\n/g,"")
        .split(",");
    // now execute it
    const os = bcl.reduce((s,c)=>{
        // separate TOK- and TOK=123 instructions and take the number parameter (idx)
        const ti = /(?<t>\w+)(?:-|=(?<idx>\d+))/.exec(c).groups;
        // token, it's hash index and the "add-lens-index" 
        const tok = ti.t;
        const idx = HASH(tok)
        const aidx = ti.idx;

        // now map the old state to a new one
        return s.map((box,boxIndex)=>{
            if (boxIndex!==idx)
                return box;
            if (aidx===undefined) {
                // remove mentioned lens
                return box.filter(v=>v[0]!==tok)
            } else {
                // check for existence of lens
                const ev = box.find(v=>v[0]===tok);
                if (ev) {
                    // if so, replace it
                    return box.map(v=>v===ev?[tok,aidx]:v)
                } else {
                    // otherwise append it.
                    return [...box,[tok,aidx]];
                }
            }         
        });
    },al.repeat([],256))
    // now sum it up
    const res = os
        .reduce((p,box,boxIndex)=>
            p
            +box
            .reduce((p,lensData,lensIndex)=>p+(1+lensIndex)*(1+boxIndex)*lensData[1],0)
            ,0
        )
    return res
    // return os
    //     .map((bl,bli)=>[bl,bli])
    //     .filter(bl=>bl[0].length)[1];
}

//console.log(HASH("HASH"))

console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
