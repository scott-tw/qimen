const QM=require('../engine.js');QM.setTerms(require('fs').readFileSync(__dirname+'/../terms2.txt','utf8'));
for(const t of [[2000,1,1,12,0],[2026,1,1,9,0],[2026,10,23,0,43]]){const c=QM.chart(...t);
console.log(t.join('-'),c.dayGZ,c.hourGZ,c.term,c.yuan,c.yin?'陰':'陽',c.ju,'空',c.kong,'馬',c.horse,'日干宮',c.dayP);
for(const p of [4,9,2,3,7,8,1,6]){const P=c.palaces[p];console.log(' ',P.name,P.god,P.stars.join('/'),P.door,P.heaven.join(''),P.ground,P.flags.map(f=>f.t).join('|'),P.ge.map(g=>g.t).join('|'),P.starState.join(''));}}
