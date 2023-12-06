const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
    const cards = al.textToLines(data)
        .map(l=>
            /Card\s+\d+:(?<w>[^|]+)\|(?<y>.+)/
            .exec(l)
            .slice(1,3)
            .map(p=>p.match(/\d+/g)
            .map(n=>parseInt(n))))
        .map(l=>l[1].filter(v=>l[0].find(wv=>wv===v)))
        .filter(l=>l.length)
        .map(l=>1<<(l.length-1))
        .reduce((p,c)=>p+c,0)
    return cards;
}
function b(data) {
    const cards = al.textToLines(data)
        .map(l=>
            /Card\s+\d+:(?<w>[^|]+)\|(?<y>.+)/
            .exec(l)
            .slice(1,3)
            .map(p=>p.match(/\d+/g)
            .map(n=>parseInt(n))))
        .map(l=>l[1].filter(v=>l[0].find(wv=>wv===v)))
        // .filter(l=>l.length)
        // .map(l=>1<<(l.length-1))
        // .reduce((p,c)=>p+c,0)
    const cwc = (idx) => 1+al.rangeExclusive(idx+1,idx+1+cards[idx].length).map(cwc).reduce((p,c)=>p+c,0);

    return cards.map((v,i)=>cwc(i)).reduce((p,c)=>p+c,0);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
