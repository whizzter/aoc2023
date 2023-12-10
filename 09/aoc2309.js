const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
    const lines = data
        .split(/\r\n|\n/)
    const s = lines
        .map(l=>l.split(/ /).map(v=>parseInt(v)))
    
    const ext = l => {
        const dl =
            l
            .zip(l.slice(1))
            .slice(0,l.length-1)
            .map(v2=>v2[1]-v2[0])
        const isZ = !l.find(v=>v!=0)
        if (isZ)
            return 0;
        return l.slice(-1)[0]+ext(dl);
    }

    return s.map(ext).reduce((p,c)=>p+c,0);
}
function b(data) {
    const lines = data
        .split(/\r\n|\n/)
    const s = lines
        .map(l=>l.split(/ /).map(v=>parseInt(v)).reverse())
    
    const ext = l => {
        const dl =
            l
            .zip(l.slice(1))
            .slice(0,l.length-1)
            .map(v2=>v2[1]-v2[0])
        const isZ = !l.find(v=>v!=0)
        if (isZ)
            return 0;
        return l.slice(-1)[0]+ext(dl);
    }

    return s.map(ext).reduce((p,c)=>p+c,0);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
