const fs = require("fs");
const al = require("../aoclib.js")

// the B solution is perhaps needlessly complicated with integer lookups as 
// it was initially built to just do with raw computation instead of the 
// implicit periods in the data that becomes obvious when optimizing.


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
        .map(g=>({at:g[1],start:g[1],name:g[0],ppos:0}))

    const ghostPath = (start) => {
        let sco = 0;
        let vpos = new Map
        let ti = 0;
        let at = start;
        let path=[]
        console.log("Making path")
        // find a full period before the path re-starts
        for (at = start; !vpos.has(at+","+ti) ; sco++, ti=(ti+1)%turns.length) {
            let pp = {sco,ti,at,end:ends[at],pos:path.length}
            vpos.set(at+","+ti, pp); //[ti,ends[at],sco,path.length])
            path.push(pp); //[ti,ends[at],sco])
            at = igraph[at][turns[ti]]
            path.slice(-1)[0].nat=(at);
            path.slice(-1)[0].nti=((ti+1)%turns.length);
        }
        console.log("Patching path")
        path = 
            path
            .map((p,pi)=>{
                //let untilEnd = 0;
                // let at = p.at;
                // let ti = p.ti;
                //console.log(at,ti)
                // for(;!ends[at];ti=(ti+1)%turns.length) {
                //     untilEnd++;
                //     at = igraph[at][turns[ti]]
                // }
                return {...p,nextEnd:vpos.get(p.at+","+p.ti).pos,npos:vpos.get(p.nat+","+p.nti).pos}
            })
        return path;//[start,at,ti,sco,[...vpos.entries()].length,[...vpos.values()].filter(v=>v[1]).length];
    }
    console.log("Making paths")
    let ghostPaths = ghosts
         .map(g=>ghostPath(g.at))
    console.log("Making paths done")

    // ############# Try 2
    // Try 2 was semi-raw but 1000x faster than raw by skipping... but still too slow 
    // let sco = 0n;
    // let rounds=0;
    // for (let allAtEnd = false; !allAtEnd;rounds++) {
    //     // //     console.log(ghosts)
    //     // //     allAtEnd = ghosts.reduce((a,at,i)=>(ghosts[i]=graph.get(at)[turns[sco%turns.length]],at.endsWith("Z")&&a),true)
    //     //     let td = turns[sco%turns.length]
    //     allAtEnd = true;
    //     let steps = 10000000;
    //     for (let i = 0; i < ghosts.length; i++) {
    //         const g = ghosts[i];
    //         const pp = ghostPaths[i][g.ppos];
    //         let stepc = pp.end ? 1 : pp.untilEnd;
    //         if (g.ppos+stepc>=ghostPaths[i].length)
    //             stepc = ghostPaths[i].length-g.ppos-1;
    //         if (stepc<1)
    //             stepc=1;
    //         steps = steps < stepc ? steps : stepc;
    //         allAtEnd = allAtEnd && pp.end;
    //     }
    //     if (allAtEnd)
    //         break;
    //     //console.log(steps)
    //     for (let i = 0; i < ghosts.length; i++) {
    //         const g = ghosts[i];
    //         const pp = ghostPaths[i][g.ppos];
    //         if (steps == 1)
    //             g.ppos = pp.npos;
    //         else
    //             g.ppos += steps;
    //     }
    //     sco+=BigInt(steps);
    //     if ((rounds%1000000)==0) {
    //         console.log(`At round ${rounds} sco=${sco}`)
    //     }
    // }
    //return [sco,rounds];
    // ############# Try 2

    // Try 3, realized that the periods are probably equally long so we can just use the periods to multiply them together (same as day 12 of 2019)

    // test periods (and that returns are as long.. which they are).. thus we will be able to 
    let periods= ghostPaths.map(p=>{
        //console.log(p)
        let s=0;
        let c=0;
        let idx = 0;
        let si = []
        while(true) {
            //console.log(idx);
            let pc = c;
            if (p[idx].end)
                c++;
            if (pc!=c)
                si.push(s);
            if (c>=2)
                break;
            idx = p[idx].npos;
            s++;
        }
        return [...si,si[1]-si[0]]
    });

    // a common gcd will reduce the number of iterations combined so we need to calculate it
    let gcd = (a,b) => 
        b>a
        ?gcd(b,a)
        :b==0
        ?a
        :gcd(b,a%b);

    let tgcd = gcd(periods[0][0],periods[1][0]);
    for (let i=0;i<periods.length;i++) {
        for (let j=i+1;j<periods.length;j++) {
            if (tgcd!=gcd(periods[i][0],periods[j][0]))
                throw new Error("Sanity check..");
        }
    }
    // produce new smaller common periods by removing the gcd
    periods = periods.map(p=>p[0]/tgcd);
    // combine periods, then we will need to scale up by the gcd again to get the correct result
    return periods.reduce((c,p)=>c*BigInt(p),1n)*BigInt(tgcd);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("bex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
