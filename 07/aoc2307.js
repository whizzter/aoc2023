const fs = require("fs");
const al = require("../aoclib.js")

const cardGroupReverseCompare = (a,b) => -(a[1].length - b[1].length);

const cardsA = [..."AKQJT98765432"].reverse();
const cardsB = [..."AKQT98765432J"].reverse();

const cmpHand = (cards,jokerPatchGroups)=>(a,b) => {
    // convert the hands (array of chars inside first of tuple) into groups of the cards
    let ag = a[0].groupBy(v=>v)
    let bg = b[0].groupBy(v=>v)

    // sort them in reverse by group size (most same-cards first)
    ag.sort(cardGroupReverseCompare);
    bg.sort(cardGroupReverseCompare);

    // if we need to run any joker logic, do so now to patch the groups
    if (jokerPatchGroups) {
        ag = jokerPatchGroups(ag);
        bg = jokerPatchGroups(bg);
    }

    // now run through the list of card-groups
    while(ag.length && bg.length) {
        // is the top group differently sized?
        const ldiff= (ag[0][1].length-bg[0][1].length)
        if (ldiff)
            return ldiff; // if so, sort by that size
        // otherwise remove from top
        ag.shift();
        bg.shift();
    }

    // same size of groups (ie 2x full house), break ties by the first "bigger" card
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
    const lines = data
        .split(/\r\n|\n/)
    const parsedHandsAndBets=lines
        .map(l=>l.split(" "))
        .map(l=>[[...l[0]],parseInt(l[1])])
    // calculate result from sorted hands and bets
    parsedHandsAndBets.sort(cmpHand(cardsA))
    return parsedHandsAndBets.reduce((p,c,i)=>p+c[1]*(i+1),0);
}

const jokerPatchGroups = (groups) => {
    const jokerGroup = groups.find(gr=>gr[0]==='J')
    if (jokerGroup && groups.length>1) {
        // If a group of jokers has been found (and it isn't the only group as in a hand of 5 jokers)..
        groups = groups.filter(gr=>gr!==jokerGroup);
        // .. then patch the other largest group with the jokers. 
        groups[0][1]=[...groups[0][1],...jokerGroup[1]];
    }
    return groups;
}

function b(data) {
    const lines = data
        .split(/\r\n|\n/)
    const parsedHandsAndBets=lines
        .map(l=>l.split(" "))
        .map(l=>[[...l[0]],parseInt(l[1])])
    // calculate result from sorted hands and bets
    parsedHandsAndBets.sort(cmpHand(cardsB,jokerPatchGroups))
    return parsedHandsAndBets.reduce((p,c,i)=>p+c[1]*(i+1),0); 
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
