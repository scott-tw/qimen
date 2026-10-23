const QM=require('../engine.js');QM.setTerms(require('fs').readFileSync(__dirname+'/../terms2.txt','utf8'));const QI=require('../interp.js');
const assert=require('assert');
assert.deepStrictEqual(QM.natalStem(1970,6,15),{yearGZ:"庚戌",stem:"庚"});
assert.deepStrictEqual(QM.natalStem(1971,1,20),{yearGZ:"庚戌",stem:"庚"}); // 立春前屬前一年
assert.deepStrictEqual(QM.natalStem(1984,6,1),{yearGZ:"甲子",stem:"戊"}); // 甲年用旬首儀
const c=QM.chart(2026,10,22,9,13);
assert.strictEqual(c.groundOf("庚"),7);
const R=QI.interpret(c,{type:"career",birthStem:"庚",birthGZ:"庚戌"});
assert.strictEqual(R.items[0].ids[0],"natal"); assert.strictEqual(R.items[0].p,7);
assert.ok(R.summary.startsWith("你的年命（庚戌年，庚）落在兌七（西），"));
assert.ok(R.items.some(i=>i.meaning.includes("今天的你（日干）"))||R.items[0].ids.includes("self"));
assert.ok(QI.friendText(c,R).split("\n")[1].includes("（已依問事者出生年個人化）"));
// 沒填生日：與原本完全相同
const a=JSON.stringify(QI.interpret(c,{type:"career"})), b=JSON.stringify(QI.interpret(c,{type:"career",birthStem:""}));
assert.strictEqual(a,b); assert.ok(!a.includes("年命"));
// 健康類：病人＝本人時用年命宮
const H=QI.interpret(c,{type:"health",target:"self",birthStem:"庚",birthGZ:"庚戌"});
assert.ok(H.items.find(i=>i.ids.includes("patient")).p===7);
const H2=QI.interpret(c,{type:"health",target:"oldman",birthStem:"庚"});
assert.ok(H2.items.find(i=>i.ids.includes("patient")).p===6);
// 出生命盤：年命宮與日干宮相同時合併
for(let i=0;i<300;i++){const y=1930+i%90,m=1+i%12,d=1+i%28,ch=QM.chart(y,m,d,i%24,0),n=QM.natalStem(y,m,d);
  const N=QI.interpret(ch,{type:"natal",birthStem:n.stem,birthGZ:n.yearGZ});
  if(ch.groundOf(n.stem)===ch.dayP) assert.ok(N.items[0].ids.includes("natal")&&N.items[0].ids.includes("nature"));
  for(const t of Object.keys(QI.TYPES)) QI.interpret(ch,{type:t,target:"self",birthStem:n.stem,birthGZ:n.yearGZ});}
console.log("natal all ok");
