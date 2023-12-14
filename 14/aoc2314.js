const fs = require("fs");
const al = require("../aoclib.js")

// took a simple approach, worked well
// field data is just handled as arrays of strings and "simulation" is replaced by regexps and repetition expansions

const rollLineFwd = l=>
    l
    // segment string into runs of . (ground) and O (roundstone) characters and # (fixed stones, "blockers") 
    .match(/[.O]+|#+/g)
    // use flatMap to re-attach the segments post-processing
    .flatMap(l=>
        // "fixed" stones are just re-output w/o movement
        l[0]==='#'
        ?l
        // use regexps to find "count" matches of ground and roundstones,again flatmap to re-attach them
        // and use the order-of-matching to "move" all roundstones after the ground
        :[/\./g,/O/g]
            .flatMap(cm => l.match(cm)))
    // if spans did not have roundstones or ground then we could have some null-groups, filter those out
    .filter(e=>e!=null)
    // and re-join to a new string that is "rolled"
    .join("");

// this is basically the method above but with the second array of reg-exps in flipped order to move O's in the other direction.
const rollLineBackwards = l=>
    l
    .match(/[.O]+|#+/g)
    .flatMap(l=>
        l[0]==='#'
        ?l
        :[/O/g,/\./g].flatMap(cm=>l.match(cm)))
        .filter(e=>e!=null)
        .join("");

// to roll north, transpose text, roll backwards and transpose back
const rollNorth = f => 
    al.transposeText(
        al.transposeText(f)
        .map(l=>rollLineBackwards(l))
    )

// same as above but roll forwards between transpositions
const rollSouth = f=>
    al.transposeText(
        al.transposeText(f)
        .map(l=>rollLineFwd(l))
    );

// rolling "west" is just rolling each line backwards
const rollWest = f =>f.map(l=>rollLineBackwards(l));
// and opposite.
const rollEast = f=>f.map(l=>rollLineFwd(l));

// (part B) order of rolling in a cycle is north, west, south and finally east
const rollFns = [rollNorth,rollWest,rollSouth,rollEast]

// nscore is a "north support" score
const nscore = f=>
    f.map((l,li)=>
        // use match to find all stones (or empty array if missing)
        (l.match(/O/g) ?? [])
        // the length of the output array is the count on the line
        .length
        // and multiply by how far-up we are for the score
        *(f.length-li))
    // just a sum
    .reduce((p,c)=>p+c,0)

function a(data) {
    const field = data
        .split(/\r\n|\r/g)

    const rnField = rollNorth(field)    

    const ns = nscore(rnField);
    
    return ns;
}

function b(data) {
    let field = data
        .split(/\r\n|\r/g)

    let fieldToIdxMapping = new Map
    let idxToFieldMapping = new Map
    let loop = null; // null or a 2-tuple containing [endPoint,startPoint]
    for (let i=0,p=0
        ;
        true
        ;) {

        // if we've found the loop we can stop simulating and just walk the loop until the end
        if (loop) {
            // are we at the loop position with the position pointer?
            if (p===loop[0])
                // re-wind it
                p=loop[1];
            // do a "simulation step"
            p++;
            i++;
            if (i>=1_000_000_000) {
                // once at the end, just score the map we point to with the position pointer (one of the simulated fields within the loop)
                return nscore(idxToFieldMapping.get(p).split("\n"))
            }
            continue;
        }
        // build a key of the field to find a loop of positions (since they cycle)
        let k = field.join("\n");
        if (fieldToIdxMapping.has(k)) {
            loop = [i,fieldToIdxMapping.get(k)];
            console.log("Loop at ",loop)
            continue;
        }
        fieldToIdxMapping.set(k,i);
        idxToFieldMapping.set(i,k);

        // if we haven't found the loop yet, do raw simulations (slow.. but luckily the loop is quickly found)
        for (let j = 0; j < 4; j++) {
            field = rollFns[j](field);
        }
        i++;
        p++;
    }

    return 1
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
