const { readFileSync } = require("fs");

// quick-n-dirty solution
const adata =
    readFileSync("aex.txt","utf8")
    .split("\n")
    .map(l=>l.trim())
    .filter(l=>l.length);

const digitFilt = l=>l.replace(/[a-zA-Z]/g,"");

const pre_a_result = adata
    // remove all but digits
    .map(l=>digitFilt(l))
    // make a string of length-2 from the 2 digits
    .map(l=>l[0]+l.slice(-1))

// the a reuslt is the numbers parsed and summed.
const a_result = pre_a_result
    .map(l=>parseInt(l))
    .reduce((p,c)=>p+c,0);

// output of a-resul
console.log(pre_a_result,a_result);

// part b
const nwords = [
    "zero","one","two","three","four","five","six","seven","eight","nine"
];

const bdata = 
    readFileSync("a.txt","utf8")
    .split("\n")
    .map(l=>l.trim())
    .filter(l=>l.length);

// take-dig will work from start(or end if dir=true) recursively trying to take the first occuring number as a digit or text
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
    // get the needed digits with the take-dig function
    .map(l=>takedig(l,true)+takedig(l,false))
    // sum the digit-produced numbers.
    .reduce((p,c)=>p+parseInt(c),0)

console.log(bdata,b)