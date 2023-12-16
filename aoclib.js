exports.textToLines = (text) => text.split(/\r\n|\n/);

exports.arraySplit = (li, splitFn) => {
  let o = [];
  for (let ii = 0, oi = 0; ii < li.length; ) {
    while (ii < li.length && !splitFn(li[ii])) {
      if (!o[oi]) o[oi] = [];
      o[oi].push(li[ii++]);
    }
    while (ii < li.length && splitFn(li[ii])) {
      ii++;
      oi++;
    }
  }
  return o;
};

exports.rangeExclusive = (from, to, incr) => {
  let o = [];
  while (from !== to) {
    o.push(from);
    from += incr ?? 1;
  }
  return o;
};

exports.repeat = (what, times) => {
  return exports.rangeExclusive(0, times, 1).map((v) => what);
};

exports.hexbitsToChar = c=>String.fromCharCode(c<10?c+'0'.charCodeAt(0):c-10+'A'.charCodeAt(0));


if ("undefined" === typeof Array.prototype.zip)
  Array.prototype.zip = function (other) {
    return this.map((e, i) => [e, other[i]]);
  };

if ("undefined" === typeof Array.prototype.distinct)
  Array.prototype.distinct = function (sel) {
    let id = (v) => v;
    sel = sel ?? id;
    return this.reduce(
      (p, c) => {
        let kv = sel(c);
        //console.log("Distincg kv:",kv,c,sel(c));
        if (!p.e.has(kv)) {
          p.o.push(c);
          p.e.add(kv);
        }
        return p;
      },
      { o: [], e: new Set() }
    ).o;
  };

if ("undefined" === typeof Array.prototype.groupBy)
  Array.prototype.groupBy = function (sel) {
    return [
      ...this.reduce((p, c) => {
        let kv = sel(c);
        let arr;
        if (!(arr = p.get(kv))) p.set(kv, (arr = []));
        arr.push(c);
        return p;
      }, new Map()).entries(),
    ];
  };

let adjCoord = [
  [-1, -1],
  [0, -1],
  [+1, -1],
  [-1, 0],
  [+1, 0],
  [-1, +1],
  [0, +1],
  [+1, +1],
];

/**
 *
 * @param {*} a 2d map
 * @param {*} f A function called for each cell, arguments are (cellValue,cellCoord,neighbourCellValues,neighbourCellCoords)
 */
exports.adjacent2d = function (map, f) {
  return map.map((row, ri) => {
    return row.map((cell, ci) => {
      let rac = adjCoord.map((ac) => [ac[0] + ci, ac[1] + ri]);
      let orac = rac.filter(
        (rac) =>
          rac[0] >= 0 &&
          rac[0] < row.length &&
          rac[1] >= 0 &&
          rac[1] < map.length
      );
      return f(
        cell,
        [ci, ri],
        orac.map((rac) => map[rac[1]][rac[0]]),
        orac
      );
    });
  });
};

const id = (v) => v;
exports.id = id;
exports.transpose = function (a, a1, a2) {
  let defv = undefined;
  let xf = id;
  if (a1 instanceof Function) {
    xf = a1;
    defv = a2;
  } else {
    defv = a1;
  }
  let o = [];
  //let maxl = a.reduce((p,r)=>Math.max(r.length),0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].length; j++) {
      while (o.length <= j) o.push([]);
      while (o[j].length < i) o[j].push(defv);
      o[j][i] = xf(a[i][j], i, j);
    }
  }
  return o;
};

exports.transposeText = function(ta) {
  return exports.transpose(ta.map(l=>[...l])).map(l=>l.join(""))
}

exports.memoize = (f) => {
  const mem = new Map();
  return (...args) => {
    const k = args.join(",");
    if (mem.has(k)) {
      return mem.get(k);
    } else {
      const v = f(...args);
      mem.set(k, v);
      return v;
    }
  };
};

exports.timeIt = (v, ...r) => {
  const start = new Date().valueOf();
  const rv = v(...r);
  const end = new Date().valueOf();
  console.warn("Ran in " + (end - start) + "ms");
  return rv;
};
