const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
    const ma = data.split(/\r\n|\r/).map(l=>[...l])

    const enlarge = a=>a.flatMap(r=>-1===r.indexOf('#')?[r,r]:[r])

    const enlarged = enlarge(al.transpose(enlarge(al.transpose(ma))))

    const toStars = m=>
        m
        .flatMap((r,y)=>
            r.map((c,x)=>({v:c,x,y})
        ))
        .filter(v=>v.v==='#')
    
    const sdi = (sl) => sl.map((s,i)=>sl.slice(i+1).reduce((p,os)=>p+(Math.abs(s.x-os.x)+Math.abs(s.y-os.y)),0))

    return sdi(toStars(enlarged)).reduce((p,c)=>p+c,0);
}
function b(data) {
    const ma = data.split(/\r\n|\r/).map(l=>[...l])

    const mkMap = (m,f)=>m.reduce((p,r)=>({m:[...p.m,p.i],i:-1===r.indexOf('#')?p.i+f:p.i+1}),{m:[],i:0}).m;

    const factor = 1000000;
    const xMap = mkMap(al.transpose(ma),factor);
    const yMap = mkMap(ma,factor);

    const toStars = m=>
        m
        .flatMap((r,y)=>
            r.map((c,x)=>({v:c,x,y})
        ))
        .filter(v=>v.v==='#')

    
    const sdi = (sl) => sl.map((s,i)=>sl.slice(i+1).reduce((p,os)=>p+(Math.abs(s.x-os.x)+Math.abs(s.y-os.y)),0))

    const remapStars = sl=>sl.map(s=>({...s,x:xMap[s.x],y:yMap[s.y]}))

    return sdi(remapStars(toStars(ma))).reduce((p,c)=>p+c,0);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
