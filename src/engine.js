(function(root){
const G="甲乙丙丁戊己庚辛壬癸", Z="子丑寅卯辰巳午未申酉戌亥";
const RING=[1,8,3,4,9,2,7,6];
const STAR={1:"天蓬",8:"天任",3:"天沖",4:"天輔",9:"天英",2:"天芮",7:"天柱",6:"天心"};
const DOOR={1:"休",8:"生",3:"傷",4:"杜",9:"景",2:"死",7:"驚",6:"開"};
const PNAME={1:"坎一",2:"坤二",3:"震三",4:"巽四",5:"中五",6:"乾六",7:"兌七",8:"艮八",9:"離九"};
const PDIR={1:"北",2:"西南",3:"東",4:"東南",5:"中",6:"西北",7:"西",8:"東北",9:"南"};
const PEL={1:"水",2:"土",3:"木",4:"木",5:"土",6:"金",7:"金",8:"土",9:"火"};
const DEL={"休":"水","生":"土","傷":"木","杜":"木","景":"火","死":"土","驚":"金","開":"金"};
const SEL={"天蓬":"水","天任":"土","天沖":"木","天輔":"木","天英":"火","天芮":"土","天禽":"土","天柱":"金","天心":"金"};
const STEL={"甲":"木","乙":"木","丙":"火","丁":"火","戊":"土","己":"土","庚":"金","辛":"金","壬":"水","癸":"水"};
const TERMN=["小寒","大寒","立春","雨水","驚蟄","春分","清明","穀雨","立夏","小滿","芒種","夏至","小暑","大暑","立秋","處暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];
// [陰?, 上,中,下]
const JU=[[0,2,8,5],[0,3,9,6],[0,8,5,2],[0,9,6,3],[0,1,7,4],[0,3,9,6],[0,4,1,7],[0,5,2,8],[0,4,1,7],[0,5,2,8],[0,6,3,9],
 [1,9,3,6],[1,8,2,5],[1,7,1,4],[1,2,5,8],[1,1,4,7],[1,9,3,6],[1,7,1,4],[1,6,9,3],[1,5,8,2],[1,6,9,3],[1,5,8,2],[1,4,7,1],[0,1,7,4]];
let TERMS=null;
function setTerms(str){TERMS={};str.split(',').forEach((r,i)=>{const a=[];for(let k=0;k<24;k++)a.push(parseInt(r.substr(k*4,4),36));TERMS[1901+i]=a;});}
function termDate(y,k){const t=new Date(Date.UTC(y,0,1)+TERMS[y][k]*60000);return `${t.getUTCMonth()+1}/${t.getUTCDate()} ${String(t.getUTCHours()).padStart(2,"0")}:${String(t.getUTCMinutes()).padStart(2,"0")}`;}
const SHENG={"木":"火","火":"土","土":"金","金":"水","水":"木"};
const KE={"木":"土","土":"水","水":"火","火":"金","金":"木"};
function rel(a,b){ if(a===b)return"比和"; if(SHENG[a]===b)return"生"; if(SHENG[b]===a)return"被生"; if(KE[a]===b)return"剋"; return"被剋"; }
function doy(y,m,d){return Math.round((Date.UTC(y,m-1,d)-Date.UTC(y,0,1))/864e5)+1;}
function addDays(y,m,d,n){const t=new Date(Date.UTC(y,m-1,d)+n*864e5);return [t.getUTCFullYear(),t.getUTCMonth()+1,t.getUTCDate()];}
function dayIdx(y,m,d){const n=Math.round((Date.UTC(y,m-1,d)-Date.UTC(1900,0,1))/864e5);return ((n+10)%60+60)%60;}
function termAt(y,m,d,h,mi){ // latest term whose exact time <= given moment
  const r=TERMS[y]; if(!r||!TERMS[y-1]) throw new Error("年份需介於 1902–2100");
  const t=Math.round((Date.UTC(y,m-1,d,h||0,mi||0)-Date.UTC(y,0,1))/60000); let idx=-1;
  for(let k=0;k<24;k++) if(r[k]<=t) idx=k;
  if(idx<0) return {idx:23,year:y-1};
  return {idx,year:y};
}
const gz=i=>G[i%10]+Z[i%12];
const nxt=(p,yin)=>yin?((p+7)%9)+1:(p%9)+1;
const r5=p=>p===5?2:p;
const SEASON_BY_BRANCH={2:"木",3:"木",5:"火",6:"火",8:"金",9:"金",11:"水",0:"水",1:"土",4:"土",7:"土",10:"土"};
// month branch from 節 (even term indices: 小寒=丑...)
function monthBranch(y,m,d,h,mi){const t=termAt(y,m,d,h,mi);let k=t.idx; if(k%2===1)k-=1; return (Math.floor(k/2)+1)%12;}
function wangState(el,season){ if(el===season)return"旺"; if(SHENG[season]===el)return"相"; if(SHENG[el]===season)return"休"; if(KE[el]===season)return"囚"; return"廢"; }
const KONG={0:"戌亥",10:"申酉",20:"午未",30:"辰巳",40:"寅卯",50:"子丑"};
const XUNSTEM={0:"戊",10:"己",20:"庚",30:"辛",40:"壬",50:"癸"};
const BR_PAL={"子":1,"丑":8,"寅":8,"卯":3,"辰":4,"巳":4,"午":9,"未":2,"申":2,"酉":7,"戌":6,"亥":6};
const HORSE={"申":"寅","子":"寅","辰":"寅","寅":"申","午":"申","戌":"申","亥":"巳","卯":"巳","未":"巳","巳":"亥","酉":"亥","丑":"亥"};
const TOMB={"水":4,"土":4,"木":2,"火":6,"金":8};
const XING={"戊":3,"己":2,"庚":8,"辛":9,"壬":4,"癸":4};
const GE={"戊丙":["青龍返首","吉"],"丙戊":["飛鳥跌穴","吉"],"乙辛":["青龍逃走","凶"],"辛乙":["白虎猖狂","凶"],"癸丁":["螣蛇夭矯","凶"],"丁癸":["朱雀投江","凶"],"庚丙":["太白入熒","凶"],"丙庚":["熒入太白","凶"],"庚癸":["大格","凶"],"庚壬":["小格","凶"],"庚己":["刑格","凶"]};

function chart(y,m,d,h,mi,opt){
  opt=opt||{}; let Y=y,M=m,D=d;
  if(h===23 && opt.zi!=="same"){[Y,M,D]=addDays(y,m,d,1);}
  const di=dayIdx(Y,M,D); const hb=Math.floor((h+1)/2)%12; const hs=((di%10)%5*2+hb)%10;
  let hi=0; for(let i=0;i<60;i++) if(i%10===hs&&i%12===hb){hi=i;break;}
  const back=di%10<5?di%10:di%10-5; const [fy,fm,fd]=addDays(Y,M,D,-back);
  const fb=((di-back)%12+12)%12; const yuan=[0,3,6,9].includes(fb)?0:([2,5,8,11].includes(fb)?1:2);
  const term=termAt(y,m,d,h,mi); const ju=JU[term.idx]; const yin=!!ju[0]; const n=ju[1+yuan];
  const ground={}; let p=n; for(const s of "戊己庚辛壬癸丁丙乙"){ground[p]=s;p=nxt(p,yin);}
  const inv={}; for(const k in ground) inv[ground[k]]=+k;
  const xun=hi-hi%10, xs=XUNSTEM[xun], kong=KONG[xun];
  const src=inv[xs], srcR=r5(src);
  const hstem=G[hi%10], ref=hstem==="甲"?xs:hstem, dest=inv[ref], destR=r5(dest);
  const sshift=(RING.indexOf(destR)-RING.indexOf(srcR)+8)%8;
  let q=src; for(let i=0;i<hi-xun;i++) q=nxt(q,yin); const qR=r5(q);
  const dshift=(RING.indexOf(qR)-RING.indexOf(srcR)+8)%8;
  const gods=yin?["值符","騰蛇","太陰","六合","白虎","玄武","九地","九天"]:["值符","騰蛇","太陰","六合","勾陳","朱雀","九地","九天"];
  const P={}; for(let k=1;k<=9;k++) P[k]={no:k,name:PNAME[k],dir:PDIR[k],el:PEL[k],ground:ground[k],flags:[],ge:[]};
  const gi=RING.indexOf(destR);
  for(let k=0;k<8;k++){const pi=((gi+(yin?-k:k))%8+8)%8; P[RING[pi]].god=gods[k];}
  const mb=monthBranch(y,m,d,h,mi); let season=SEASON_BY_BRANCH[mb];
  if(season==="土"){ // 四季月：立春/立夏/立秋/立冬前18日為土旺，其餘仍屬本季
    const t=termAt(y,m,d,h,mi); const nextLi=[2,8,14,20].find(k=>k>t.idx); const ly=nextLi===undefined?t.year+1:t.year; const li=nextLi===undefined?2:nextLi;
    const liDate=Date.UTC(ly,0,1)+TERMS[ly][li]*60000; const days=(liDate-Date.UTC(y,m-1,d,h,mi))/864e5;
    if(days>18) season={1:"水",4:"木",7:"火",10:"金"}[mb];
  }
  RING.forEach((pl,i)=>{
    const s0=RING[(i-sshift+8)%8]; const c=P[pl];
    c.stars=[STAR[s0]]; c.heaven=[ground[s0]];
    if(s0===2){c.stars.push("天禽");c.heaven.push(ground[5]);}
    c.door=DOOR[RING[(i-dshift+8)%8]];
  });
  const horse=HORSE[Z[hb]], kongP=[...kong].map(b=>BR_PAL[b]);
  for(const pl of RING){const c=P[pl];
    const de=DEL[c.door], r=rel(de,c.el);
    if(r==="剋") c.flags.push({t:"門迫",k:"bad",d:"門剋宮"});
    if(r==="被剋") c.flags.push({t:"宮迫",k:"bad",d:"宮剋門"});
    if(r==="生") c.flags.push({t:"門生宮",k:"good",d:"門生宮，和順"});
    if(r==="被生") c.flags.push({t:"宮生門",k:"good",d:"宮生門，得助"});
    if(TOMB[de]===pl) c.flags.push({t:c.door+"門入墓",k:"bad",d:"門入墓，受困、延遲"});
    if(XING[c.heaven[0]]===pl) c.flags.push({t:"擊刑",k:"bad",d:"六儀擊刑"});
    if(kongP.includes(pl)) c.flags.push({t:"空亡",k:"warn",d:"虛而未實"});
    if(BR_PAL[horse]===pl) c.flags.push({t:"馬星",k:"info",d:"主動、變動"});
    const g=GE[c.heaven[0]+c.ground]; if(g) c.ge.push({t:g[0],k:g[1]==="吉"?"good":"bad"});
    if(c.heaven[0]===c.ground) c.ge.push({t:"伏吟",k:"warn"});
    c.starState=c.stars.map(s=>wangState(SEL[s],season));
  }
  P[5].god=null;P[5].stars=[];P[5].heaven=[];P[5].door=null;
  const dayXun=di-di%10, dayStem=G[di%10]==="甲"?XUNSTEM[dayXun]:G[di%10];
  const zhifuP=destR, zhishiP=qR;
  return {termTime:termDate(term.year,term.idx),input:{y,m,d,h,mi},dayGZ:gz(di),hourGZ:gz(hi),term:TERMN[term.idx],yuan:"上中下"[yuan],yin,ju:n,
    xunHead:"甲"+Z[xun%12]+xs, xunStem:xs, kong, horse, season, monthBranch:Z[mb],
    zhifuStar:STAR[srcR], zhishiDoor:DOOR[srcR], zhifuP, zhishiP,
    dayStem, hourStem:ref, dayP:r5(inv[dayStem]), hourP:r5(inv[ref]), palaces:P,
    fuTou:`${fy}/${fm}/${fd}`, groundOf:s=>r5(inv[s]),
    heavenOf:s=>{for(const k of RING){if(P[k].heaven.includes(s))return k;}return null;}};
}
const api={chart,setTerms,rel,SHENG,KE,PEL,DEL,SEL,STEL,PNAME,PDIR,RING};
if(typeof module!=="undefined") module.exports=api; else root.QM=api;
})(this);
