const fs = require("fs");
const al = require("../aoclib.js")

// raw-solution... prob takes too long to run sanely

function a(data) {
    const li = al.textToLines(data);
    const turns = [...li[0]].map(t=>({L:0,R:1}[t]))
    const graph = li
        .slice(2)
        .map(l=>/(\w+)\s*=\s*\((\w+),\s*(\w+)\)/.exec(l).slice(1,4))
        .reduce((m,c)=>(m.set(c[0],c.slice(1)),m),new Map);
    let sco = 0;
    for (let at = 'AAA';at!='ZZZ';sco++) {
        at=graph.get(at)[turns[sco%turns.length]]
    }
    return sco;
}
function b(data) {
    const li = al.textToLines(data);
    const turns = [...li[0]].map(t=>({L:0,R:1}[t]))
    const graph = li
        .slice(2)
        .map(l=>/(\w+)\s*=\s*\((\w+),\s*(\w+)\)/.exec(l).slice(1,4))
        //.reduce((m,c)=>(m.set(c[0],c.slice(1)),m),new Map);
    const names = graph.map(l=>l[0]);
    const ends = graph.map(l=>l[0].endsWith("Z"))
    const igraph = graph
        .map(l=>[names.indexOf(l[1]),names.indexOf(l[2])])

    let ghosts = names
        .map((n,i)=>[n,i])
        .filter(g=>g[0].endsWith("A"))
        .map(g=>g[1])

    //let ghosts = [...graph.keys()]
    //     .filter(k=>k.endsWith("A"))
    
    // const ghostPeriod = (start) => {
    //     let sco = 0;
    //     let vpos = new Map
    //     let ends = 0;
    //     for (let at = start;ends==0 || !vpos.has(at);sco++) {
    //         vpos.set(at,sco)
    //         at=graph.get(at)[turns[sco%turns.length]]
    //         if (at.endsWith("Z"))
    //             ends++;
    //     }
    //     return [sco,ends];
    // }
    // let ghostPeriods = ghosts
    //     .map(g=>ghostPeriod(g))

    let sco = 0;
    for (let allAtEnd=false;!allAtEnd;sco++) {
    //     console.log(ghosts)
    //     allAtEnd = ghosts.reduce((a,at,i)=>(ghosts[i]=graph.get(at)[turns[sco%turns.length]],at.endsWith("Z")&&a),true)
        let td = turns[sco%turns.length]
        allAtEnd = true;
        for (let i=0;i<ghosts.length;i++) {
            let at = ghosts[i] = igraph[ghosts[i]][td];
            allAtEnd = allAtEnd && ends[at];
        }
    }

    return [sco,ghosts];
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("bex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
