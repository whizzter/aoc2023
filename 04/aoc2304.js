const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
    const cards = al.textToLines(data)
        .map(l=>
            /Card\s+\d+:(?<w>[^|]+)\|(?<y>.+)/
            .exec(l)
            // divide the match-groups (w)inning and (y)our
            .slice(1,3)
            // parse into lists of number strings
            .map(p=>p.match(/\d+/g)
            // and convert said lists to lists of actual numbers
            .map(n=>parseInt(n))))
        // pick out the your winning numbers
        .map(l=>l[1].filter(v=>l[0].find(wv=>wv===v)))
        // filter out non-winning cards
        .filter(l=>l.length)
        // convert winning-number-counts to 2^n points
        .map(l=>1<<(l.length-1))
        // sum it
        .reduce((p,c)=>p+c,0)
    return cards;
}
function b(data) {
    const cards = al.textToLines(data)
        // same line-parsing as in A
        .map(l=>
            /Card\s+\d+:(?<w>[^|]+)\|(?<y>.+)/
            .exec(l)
            .slice(1,3)
            .map(p=>p.match(/\d+/g)
            .map(n=>parseInt(n))))
        // and converting cards just a list of winning numbers
        .map(l=>l[1].filter(v=>l[0].find(wv=>wv===v)))
        // .filter(l=>l.length)
        // .map(l=>1<<(l.length-1))
        // .reduce((p,c)=>p+c,0)
    // we create a recursive function that does the summing as specified in the problem by adding subsequent cards
    const cwc = (idx) => 1+al.rangeExclusive(idx+1,idx+1+cards[idx].length).map(cwc).reduce((p,c)=>p+c,0);
    // and now sum the totals for the answer
    return cards.map((v,i)=>cwc(i)).reduce((p,c)=>p+c,0);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
