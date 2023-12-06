const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
    const timeDistLines = 
        al.textToLines(data)
        .map(l=>l.split(/\s+/).slice(1).map(tn=>parseInt(tn)));
    const races = timeDistLines[0]
        .zip(timeDistLines[1])
    const rc = races.map(
        r=>al.rangeExclusive(0,r[0]+1)
            .map(loadTime=>(r[0]-loadTime)*loadTime)
            .filter(dist=>dist>r[1])
            .length
            //.reduce((a,c)=>a*c.length,1)
    ).reduce((a,c)=>a*c,1)
    return rc;
}
function b(data) {
    const timeDistLines = 
        al.textToLines(data)
        .map(l=>[parseInt(l.split(/:/)[1].replace(/\s/g,""))]); // (1).map(tn=>parseInt(tn)));
    const races = timeDistLines[0]
        .zip(timeDistLines[1])
    const rc = races.map(
        r=>al.rangeExclusive(0,r[0]+1)
            .map(loadTime=>(r[0]-loadTime)*loadTime)
            .filter(dist=>dist>r[1])
            .length
            //.reduce((a,c)=>a*c.length,1)
    ).reduce((a,c)=>a*c,1)
    return rc;
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
