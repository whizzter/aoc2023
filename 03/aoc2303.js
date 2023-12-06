const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
    const m2 = al
        .textToLines(data)
        .map(l=>l
            .match(/\d+|./g)
            .flatMap(v=>
                /\d+/.exec(v)
                ?al.repeat([parseInt(v)],v.length)
                :[v]));
    const mas = al.adjacent2d(m2,(vat,k,vadj,kadj)=>{
        if ("string"===typeof vat) {
            if (vat===".")
                return null;
            return vadj.filter(v=>v instanceof Array); //.map(v=>v[0]);
        } else {
            return null;
        }
    });
    mas2 = mas.flatMap(r=>r.filter(c=>c).flatMap(c=>c)).distinct().map(a=>a[0]).reduce((p,c)=>p+c,0);

    return mas2;
}
function b(data) {
    const m2 = al
        .textToLines(data)
        .map(l=>l
            .match(/\d+|./g)
            .flatMap(v=>
                /\d+/.exec(v)
                ?al.repeat([parseInt(v)],v.length)
                :[v]));
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

    return mas.flatMap(v=>v.filter(v=>v)).reduce((p,c)=>p+c,0);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
