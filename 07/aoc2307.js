const fs = require("fs");
const al = require("../aoclib.js")

const cardGroupReverseCompare = (a,b) => -(a[1].length - b[1].length);

const cardsA = [..."AKQJT98765432"].reverse();
const cardsB = [..."AKQT98765432J"].reverse();

const cmpHand = (cards,jokerPatchGroups)=>(a,b) => {
    let ag = a[0].groupBy(v=>v)
    let bg = b[0].groupBy(v=>v)

    ag.sort(cardGroupReverseCompare);
    bg.sort(cardGroupReverseCompare);

    if (jokerPatchGroups) {
        ag = jokerPatchGroups(ag);
        bg = jokerPatchGroups(bg);
    }

    while(ag.length && bg.length) {
        const ldiff= (ag[0][1].length-bg[0][1].length)
        if (ldiff)
            return ldiff;
        ag.shift();
        bg.shift();
    }

    //console.log("Same?!:",a,b);
    for (let i=0;i<5;i++) {
        const ac = a[0][i];
        const bc = b[0][i]
        if (ac!=bc) {
            const as = cards.indexOf(ac);
            const bs = cards.indexOf(bc);
            //console.log("Diff at:",ac,bc,as,bs);
            return as-bs;
        }
    }

    return 0;
}

function a(data) {
    const l = data
        .split(/\r\n|\n/)
    const h=l
        .map(l=>l.split(" "))
        .map(l=>[[...l[0]],parseInt(l[1])])
    h.sort(cmpHand(cardsA))
    return h.reduce((p,c,i)=>p+c[1]*(i+1),0);
}

const jokerPatchGroups = (groups) => {
    const jokerGroup = groups.find(gr=>gr[0]==='J')
    if (jokerGroup && groups.length>1) {
        groups = groups.filter(gr=>gr!==jokerGroup);
        groups[0][1]=[...groups[0][1],...jokerGroup[1]];
    }
    return groups;
}

function b(data) {
    const l = data
        .split(/\r\n|\n/)
    const h=l
        .map(l=>l.split(" "))
        .map(l=>[[...l[0]],parseInt(l[1])])
    h.sort(cmpHand(cardsB,jokerPatchGroups))
    return h.reduce((p,c,i)=>p+c[1]*(i+1),0);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
