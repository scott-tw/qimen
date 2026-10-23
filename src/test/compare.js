const QM=require('../engine.js'); const fs=require('fs');
QM.setTerms(fs.readFileSync(__dirname+'/../terms2.txt','utf8'));
const cases=JSON.parse(fs.readFileSync(process.argv[2]||__dirname+'/reference-kinqimen.json','utf8'));
const KEY={"坎":1,"坤":2,"震":3,"巽":4,"中":5,"乾":6,"兌":7,"艮":8,"離":9};
const GOD={"符":"值符","蛇":"騰蛇","陰":"太陰","合":"六合","虎":"白虎","玄":"玄武","地":"九地","天":"九天","勾":"勾陳","雀":"朱雀"};
let ok=0,bad=[],cats={};
for(const c of cases){const [y,m,d,h,mi]=c.t,r=c.r; let ch;
 try{ch=QM.chart(y,m,d,h,mi);}catch(e){bad.push([c.t,'err '+e.message]);continue;}
 const errs=[];
 const ju=(ch.yin?"陰":"陽")+"遁"+"一二三四五六七八九"[ch.ju-1]+"局"+ch.yuan+"元";
 if(ju!==r["排局"]) errs.push('局 '+ju+' vs '+r["排局"]+' '+r["節氣"]+'/'+ch.term);
 else for(const g in KEY){const p=KEY[g]; if(p===5)continue; const P=ch.palaces[p];
   if(r["門"][g]!==P.door) errs.push('門'+g);
   if(GOD[r["神"][g]]!==P.god) errs.push('神'+g+r["神"][g]+P.god);
   const st=r["星"][g]; if(st && !P.stars.map(s=>s[1]).includes(st)) errs.push('星'+g);
   if(r["天盤"][g]!==P.heaven[0]) errs.push('天'+g);
   if(r["地盤"][g]!==P.ground) errs.push('地'+g);
 }
 if(errs.length){bad.push([c.t,errs.slice(0,3).join(',')]);const k=errs[0].split(' ')[0];cats[k]=(cats[k]||0)+1;} else ok++;
}
console.log('ok',ok,'bad',bad.length,cats); console.log(bad.slice(0,15).map(x=>JSON.stringify(x)).join('\n'));
