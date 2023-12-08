const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
    const m2 = al
        .textToLines(data)
        .map(l=>l
            // convert a "2d" map of numbers to a sane representation
            // we first combine the digits by reg-exp matching so ..123*. becomes 5 tokens with the number being a single token
            .match(/\d+|./g)
            // but since it's a 2d-map we need to re-explode it
            .flatMap(v=>
                // if we had a number
                /\d+/.exec(v)
                // create X boxed copies (inside the box for identity testing) based on the length of the number text
                ?al.repeat([parseInt(v)],v.length)
                // otherwise just output the character
                :[v]));
    // within the 2d map, pick out adjecent numbers for non-num/. positions
    const mas = al.adjacent2d(m2,(vat,k,vadj,kadj)=>{
        if ("string"===typeof vat) {
            if (vat===".")
                return null;
            return vadj.filter(v=>v instanceof Array); //.map(v=>v[0]);
        } else {
            return null;
        }
    });
    // and sum the distinct numbers
    mas2 = mas.flatMap(r=>r.filter(c=>c).flatMap(c=>c)).distinct().map(a=>a[0]).reduce((p,c)=>p+c,0);

    return mas2;
}
function b(data) {
    // see a for comments on parsing and data-format
    const m2 = al
        .textToLines(data)
        .map(l=>l
            .match(/\d+|./g)
            .flatMap(v=>
                /\d+/.exec(v)
                ?al.repeat([parseInt(v)],v.length)
                :[v]));
    // convert the map of "cogs" and their adjecents to a map of ratios
    const mas = al.adjacent2d(m2,(vat,k,vadj,kadj)=>{
        if ("string"===typeof vat) {
            if (vat!=="*")
                return null;
            var ratios= vadj.filter(v=>v instanceof Array).distinct();
            if (ratios.length!=2)
                return null;
            return ratios[0][0]*ratios[1][0];
        } else {
            return null;
        }
    });

    // sum the ratio factors
    return mas.flatMap(v=>v.filter(v=>v)).reduce((p,c)=>p+c,0);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
