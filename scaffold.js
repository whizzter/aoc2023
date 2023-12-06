const fs = require("fs");

const base = fs.readFileSync("base.js","utf8");

const args = process.argv.slice(2);
if (args.length==0) {
    console.log("No number specified")
    return;
}

const dir = args[0].padStart(2,"0");

fs.mkdirSync(dir);
const files = [
    [`${dir}/aoc${new Date().toISOString().substring(2,4)}${dir}.js`,base]
]
for(var f of files) {
    if (!fs.existsSync(f[0])) {
        fs.writeFileSync(f[0],f[1],"utf8");
    }
}


//console.log(process.argv);