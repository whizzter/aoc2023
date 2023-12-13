const fs = require("fs");
const al = require("../aoclib.js");

// Solution B took more time than expected

// A was feasible to solve by bruteforcing permutations of the "random" block

// initial test of B was to cut down by recursion pruning but it was still infeasible (result was in order of 10^13 possibilities)

// successful B was achieved by twitter mention of nonograms (picross) that was unfamiliar to the author
// it did hint at the system and that permutating the "answer" rather than the "board" was the solution.
// testing multiple boards was faster, but to solve it in feasible time the final thing to remember is that
// permutations with answer and board indexes at the same position was always the same, thus memoizable
// and once memoization was used the solution was quickly gotten.

const parse = (data) => data.split(/\r\n|\n/g).map((l) => l.split(" "));
const expand = (parsed) =>
  parsed.map((l) => [
    al.repeat(l[0], 5).join("?"),
    al.repeat(l[1], 5).join(","),
  ]);

function a(data) {
  const a = parse(data);

  // function to permutate the board and call the callback with possible permutations
  const permutate = (d, cb) => {
    const ip = (d, s) => {
      //console.log(s);
      if (s.length == 0) {
        return cb(d);
      } else if (s[0] === "?") {
        const ds = s.substring(1);
        return ip(d + ".", ds) + ip(d + "#", ds);
      } else {
        return ip(d + s[0], s.substring(1));
      }
    };
    return ip("", d);
  };

  return a
    .map((r) => {
      // test all permutations found if they match the answer.
      return permutate(r[0], (v) =>
        (v.match(/#+/g) ?? []).map((w) => w.length).join(",") === r[1] ? 1 : 0
      );
    })
    .reduce((p, c) => p + c, 0);
}

function bRecursivePrune(data) {
  // ("failed") historic recursive board flipping with pruning, still too slow for this task.
  //const a = parse(data);
  const a = expand(parse(data));
  //console.log(a);
  const walk = ([ttrack, truthText]) => {
    const segs = truthText.split(",").map((v) => parseInt(v));
    const steps = { "?": [true, false], "#": [true], ".": [false] };
    const track = [...ttrack].map((v) => steps[v]);
    const step = (tidx, sidx, sv, oldInside, wa) => {
      //console.log(tidx, sidx, sv, oldInside, wa);
      if (tidx >= track.length) {
        // end-of-track, decide if we got 0/1
        if (sidx === segs.length - 1 && segs[sidx] === sv) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (sidx >= segs.length) {
          return 0;
        }
        const br = track[tidx];
        let sum = 0;
        for (let i = 0; i < br.length; i++) {
          const nis = br[i];
          if (nis) {
            // new is inside
            if (oldInside) {
              if (sv + 1 > segs[sidx]) continue;
              wa[wa.length - 1]++;
              sum += step(tidx + 1, sidx, sv + 1, true, wa);
              wa[wa.length - 1]--;
            } else {
              // verify old first!
              if (sidx >= 0 && segs[sidx] !== sv) continue;
              // begin new seg.
              wa.push(1);
              sum += step(tidx + 1, sidx + 1, 1, true, wa);
              wa.pop();
            }
          } else {
            // new is outside
            if (oldInside) {
              if (sidx >= 0 && segs[sidx] !== sv) continue;
            }
            sum += step(tidx + 1, sidx, sv, false, wa);
          }
        }
        return sum;
      }
    };
    return step(0, -1, 0, false, []);
  };

  //return walk(a[0]);
  return a
    .map((r, ri) => {
      console.log("Doing row:" + ri);
      const rv = walk(r);
      return rv;
    })
    .reduce((p, c) => p + c, 0);
}

function b(data) {
  //  const a = parse(data);
  const a = expand(parse(data));

  // answer-walk will try different sizes of the consequtive working counts
  // (since we already know the non-working ones that are fixed in the answer hint)
  const awalk = (v, vi) => {
    // remap the answer to an array of 0s(Edges) or 1s(rest) for working counts
    // so 1,1,3 for failed becomes 0,1,1,1,1,3,0 (we want numbers for both working/nonworking)
    const answer = [
      ...v[1]
        .split(",")
        .map((v) => parseInt(v))
        .flatMap((v) => [1, v]),
      0,
    ];
    answer[0] = 0;
    // reverse the list and make a summed list to figure out how many must remain at each point
    // (gives us an bound on how many we can have as a max)
    const mustRemain = [...answer]
      .reverse()
      .reduce((p, c) => [...p, (p.length ? p.slice(-1)[0] : 0) + c], [])
      .reverse();

    const vlen = v[0].length;
    // what board slots are random?
    const randoms = [...v[0]].map((v) => v === "?");
    // what board slots are broken (or if not random, implicitly working)
    const brokens = [...v[0]].map((v) => v === "#");
    //console.log(v[0], randoms, brokens);

    // the test function, counts at aidx/bidx are always fixed so we can memoize the result
    const test = al.memoize((aidx, bidx) => {
      if (aidx === answer.length) {
        //console.log(answer);
        const ok = bidx === vlen ? 1n : 0n;
        return ok;
      }
      // how many remaining board tiles are there?
      const remain = vlen - bidx;
      // is the current answer index for broken or working board tiles?
      const eBroken = !!(aidx & 1);
      let sum = 0n;
      // find the lower (From the initial-answer) to upper(from remaining) bounds of this iteration
      let start = answer[aidx];
      let end = answer[aidx] + (eBroken ? 0 : remain - mustRemain[aidx]);
      //console.log(aidx, start, end, bidx, eBroken, brokens, randoms);

      // now do the loop
      for (let i = start; i <= end; i++) {
        answer[aidx] = i;
        // check if the span is possibly valid
        let ok = true;
        for (let j = 0; j < i && ok; j++) {
          let tbIdx = j + bidx;
          if (randoms[tbIdx]) continue; // always accepted on random
          ok = brokens[tbIdx] === eBroken; // otherwise check if correct
        }
        if (ok) {
          // sum the rest of the board permutations
          sum += test(aidx + 1, bidx + i);
        }
      }
      // restore start-answer for the next iteration
      answer[aidx] = start;
      //console.log(aidx, bidx, remain, answer, mustRemain);
      return sum;
    });

    // run a sum
    return test(0, 0);
  };

  // run the answer walk for all lines
  return a
    .map((r, ri) => {
      //console.warn(ri);
      return awalk(r, ri);
    })
    .reduce((p, c) => p + c, 0n);

  //return awalk(a[1]);
}

console.log(a(fs.readFileSync("aex.txt", "utf8")));
console.log(al.timeIt(() => a(fs.readFileSync("input.txt", "utf8"))));
console.log(b(fs.readFileSync("aex.txt", "utf8")));
console.log(al.timeIt(() => b(fs.readFileSync("input.txt", "utf8"))));
