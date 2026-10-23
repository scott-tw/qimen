const QM=require('../engine.js');QM.setTerms(require('fs').readFileSync(__dirname+'/../terms2.txt','utf8'));const QI=require('../interp.js');
const c=QM.chart(2026,10,23,16,50);const R=QI.interpret(c,{type:"travel"});console.log(QI.fullText(c,R,"出行測試"));console.log(QI.friendText(c,R));
const c2=QM.chart(2026,10,23,0,43);console.log(QI.friendText(c2,QI.interpret(c2,{type:"health",target:"oldman"})));
for(const t of Object.keys(QI.TYPES)) for(let i=0;i<80;i++){const ch=QM.chart(1950+i,1+(i%12),1+(i%28),i%24,0); QI.interpret(ch,{type:t,target:["self","oldman","oldwoman","other"][i%4],gender:i%2?"female":"male"});}
console.log("all ok");
