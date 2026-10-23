const fs=require('fs');
let t=fs.readFileSync('template.html','utf8');
t=t.replace('!f.t.includes("生")','!["門生宮","宮生門"].includes(f.t)');
t=t.replace(/\/\/ 初始：示範盤[\s\S]*?render\(readState\(\)\); drawHist\(\);/,'// 初始：以現在時間起一般問事盤\nsetMode("q"); setNow(); $("qtype").value="general"; render(readState()); drawHist();');
t=t.replace('/*ENGINE*/',()=>fs.readFileSync('engine.js','utf8')).replace('/*INTERP*/',()=>fs.readFileSync('interp.js','utf8')).replace('/*TERMS*/',()=>fs.readFileSync('terms2.txt','utf8'));
fs.writeFileSync(require('path').join(__dirname,'..','index.html'),t); console.log(t.length);
