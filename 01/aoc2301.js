const { readFileSync } = require("fs");

const adata =
    readFileSync("aex.txt","utf8")
    .split("\n")
    .map(l=>l.trim())
    .filter(l=>l.length);

const digitFilt = l=>l.replace(/[a-zA-Z]/g,"");

const par = adata
    .map(l=>digitFilt(l))
    .map(l=>l[0]+l.slice(-1))
const ar = par
    .map(l=>parseInt(l))
    .reduce((p,c)=>p+c,0);

console.log(par,ar);

const nwords = [
    "zero","one","two","three","four","five","six","seven","eight","nine"
];

const bdata = 
    readFileSync("a.txt","utf8")
    .split("\n")
    .map(l=>l.trim())
    .filter(l=>l.length);

const takedig = (l,dir) => {
    if (!l) {
        console.log("L empty?!");
        return "X";
    }
    for (let i=0;i<10;i++) {
        if (dir) {
            if (l.startsWith(nwords[i]) || l[0]===(""+i))
            return ""+i;
        } else {
            if (l.endsWith(nwords[i]) || l.slice(-1)[0]===(""+i))
            return ""+i;
        }
    }
    return takedig(dir?l.slice(1):l.slice(0,-1),dir);
}

const b =
    bdata
    .map(l=>takedig(l,true)+takedig(l,false))
    .reduce((p,c)=>p+parseInt(c),0)

console.log(bdata,b)