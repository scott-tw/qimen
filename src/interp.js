(function(root){
const QM=(typeof module!=="undefined")?require('./engine.js'):root.QM;

/* ---------- 白話詞庫：每個符號「對一般人代表什麼」 ---------- */
// [白話說明, 分數]
const DOOR={
 "開":["門路是打開的，事情推得動",2],
 "休":["氣氛和緩，人和、好溝通",2],
 "生":["有生機、有實際收穫",2],
 "景":["和文件、資訊、名聲有關，表面熱鬧，要看實質內容",0],
 "杜":["卡住、不通，比較適合先守著或私下處理",-1],
 "傷":["容易有衝突、損耗，或身體受傷",-2],
 "驚":["容易擔心受怕、有口舌是非",-2],
 "死":["停滯、推不太動",-2]};
const GOD={
 "值符":["有貴人或有份量的人出面相挺",1],
 "太陰":["有人在背後默默幫忙，適合低調處理",1],
 "六合":["有合作、牽線、談得攏的機會",1],
 "九地":["適合穩穩來、守得住，不宜急",1],
 "九天":["有衝勁，適合主動出擊",1],
 "騰蛇":["容易想太多、虛驚一場，或事情反反覆覆",-1],
 "白虎":["壓力大，要防受傷、硬碰硬",-1],
 "玄武":["要防被騙、資訊不透明或暗中損失",-1],
 "勾陳":["容易拖延、糾纏不清",-1],
 "朱雀":["會有口舌、消息或文件往來，說話要小心",-0.5]};
const STAR={ // [代表, 分數]
 "天蓬":["膽大冒險與耗損",-1],"天任":["穩重可靠",1],"天沖":["行動力",0.5],"天輔":["文教與貴人輔助",1],
 "天英":["光彩與名聲（也容易急躁）",0.5],"天芮":["問題與病痛",-1],"天柱":["破損與口舌",-1],"天心":["醫藥與謀略",1],"天禽":["中正穩定",1]};
const FLAG={
 "門迫":["事情和環境有點對沖，做起來會覺得卡、要多花力氣",-1],
 "宮迫":["外在環境不太配合，事情不好推",-1],
 "入墓":["像被關住一樣，進展慢、要等",-1],
 "擊刑":["容易有摩擦、被找麻煩或身體小傷",-1],
 "空亡":["目前還「虛」，可能只是說說、還沒定案，要等時機到才落實",-1],
 "馬星":["會有變動或移動，事情節奏變快",0],
 "門生宮":["你出力就能帶動局面",0.5],
 "宮生門":["環境支持你，有順風",0.5]};
const GE={"青龍返首":["大吉之象，事情有轉機",1.5],"飛鳥跌穴":["大吉之象，機會自己找上門",1.5],"青龍逃走":["要防錢財流失、人離開",-1.5],"白虎猖狂":["壓力很大，要防受傷或被強勢對待",-1.5],
 "螣蛇夭矯":["容易虛驚一場、文件出狀況",-1.5],"朱雀投江":["消息或文件容易落空",-1.5],"太白入熒":["容易處於被動、有損耗",-1.5],"熒入太白":["容易有爭執和消耗",-1.5],
 "大格":["中間有阻隔，事情反覆",-1.5],"小格":["小有阻滯",-1.5],"刑格":["容易受制、有是非",-1.5],"伏吟":["原地踏步，適合守、不適合大動作",-0.5]};
const STATE={"旺":"力量很足","相":"力量不錯","休":"力量普通","囚":"力量偏弱","廢":"力量很弱"};
const BODY={1:"腰、腎、泌尿、耳朵",2:"腹部、腸胃",3:"腳、肝、筋",4:"肝膽、大腿、呼吸道",5:"腸胃",6:"頭部、肺、骨頭",7:"口腔、牙齒、肺、呼吸",8:"背部脊椎、手、關節",9:"心臟、眼睛、血壓"};
const REL={"比和":"和你本人五行相同，彼此合得來","生":"對你有幫助，像是事情主動找上你","被生":"需要你多付出心力去經營","剋":"會帶給你壓力，讓你有點被牽著走","被剋":"你掌控得住，但要花力氣"};

/* ---------- 每種問事的用神：代表什麼、順/卡時怎麼說、建議 ---------- */
// id: [代表什麼（白話）, 順的時候的建議, 卡的時候的建議]
const ROLE={
 natal:["你本人（依出生年）","你個人的狀態不錯，可以主動一點。","你個人目前比較吃力，先把自己顧好再行動。"],
 self:["你自己目前的狀態","你本身狀態不錯，可以主動一點。","你目前比較累或心裡有卡，先把自己狀態顧好再行動。"],
 matter:["這件事本身","這件事本身有機會成。","這件事本身有阻力，要有心理準備會拖延或需要調整做法。"],
 open:["機會與門路（職位、工作）","機會是開著的，可以積極去爭取。","機會還沒真正打開，先多方打聽，不要只押一個。"],
 zhifu:["上面能拍板的人（主管、決策者）","上面的人對你有利，可以去爭取支持。","上面的人態度不明或使不上力，重要的事要白紙黑字。"],
 liuhe:["合約與牽線的人","合作、談條件容易談攏。","談合作要小心細節，條件一定寫清楚。"],
 sheng:["賺錢的機會、實際收穫","有實際收穫，可以期待。","收穫可能不如預期，花錢要保守。"],
 capital:["本錢、投入的資金","資金面還算穩。","資金容易卡住或有損耗，不宜加碼。"],
 patient:["病人本身的體力與生機","病人本身還有底子，恢復有希望。","病人體力較弱，需要多休養，家人多陪伴照顧。"],
 ill:["病情本身","病情的力量不強，可望慢慢改善。","病情需要時間，要耐心配合治療。"],
 doctor:["醫生與治療","治療方向合適，可以信任醫療團隊。","治療可能比較慢或需要調整，有疑問多和醫師討論。"],
 recover:["恢復力","恢復的力量還在，好好休養會有進展。","恢復需要比較長的時間，不要心急。"],
 caution:["需要特別小心的地方","",""],
 other:["對方的心意與狀態","對方態度不錯，可以多互動。","對方目前有顧慮或狀態不穩，先多了解、別逼太緊。"],
 bond:["兩人的緣分","緣分是有的，有機會走在一起。","緣分還需要經營，急不得。"],
 go:["出發與行程能否順利展開","可以出發，行程推得動。","行程容易卡關，出發前再確認細節。"],
 rest:["旅途平安與休息","旅途大致平安，心情輕鬆。","旅途要多注意安全與休息。"],
 gain:["這趟的收穫","此行會有收穫。","收穫可能不如預期，別抱太大期待。"],
 move:["變動與移動","變動對你有利，可以順勢而動。","變動多，行程可能改來改去，預留彈性。"],
 studyprep:["學習與準備程度","準備方向對，有人可以請教。","準備還不夠扎實，要加強弱項。"],
 exam:["考試表現與成績","考試表現可以期待。","考場上容易緊張或失常，多做模擬練習。"],
 luck:["靈感與考運","有靈感、有考運。","考運平平，靠實力穩穩拿分。"],
 opp:["對方","對方本身也有困難，你比較有利。","對方實力不弱，要做好準備。"],
 result:["處理過程與結果","結果偏向對你有利。","過程會比較辛苦，結果需要爭取。"],
 judge:["裁決的人（法官、上級）","裁決的人態度對你有利。","裁決的人不一定站在你這邊，證據要充分。"],
 helper:["能幫你或能做主的人","有人能幫你，可以開口求助。","能幫忙的人目前使不上力，先靠自己。"],
 trend:["事情接下來的走向","事情會往好的方向走。","事情的走向有波折，邊走邊調整。"],
 nature:["你的本性與基本盤","本性條件不錯，有自己的優勢。","本性中有容易卡住自己的地方，需要多留意。"],
 axis:["人生的主軸與貴人","一生有貴人、有主軸。","人生主軸上壓力與責任較重。"],
 style:["做事的方式","做事方式得力。","做事方式容易被卡住，需要轉個彎。"],
 career:["事業","事業有發揮空間。","事業上常有被壓住、要等時機的感覺。"],
 wealth:["財運","財運有來源。","財運要靠穩健累積，防漏財。"],
 health:["健康上的弱點","健康底子不錯。","這是身體較需要保養的地方。"]
};
const TYPEADV={
 career:{good:"可以積極爭取，但條件要談清楚。",warn:"可以進行，但不要急著定案，多比較幾個機會。",bad:"時機還不成熟，建議先觀望、做好準備。"},
 wealth:{good:"可以適度把握機會，仍要控制風險。",warn:"以穩為主，不宜大筆投入。",bad:"先保守，避免投資、借貸或擴張。"},
 health:{good:"恢復有底子，配合治療、好好休養。",warn:"需要時間，按部就班配合醫療。",bad:"需要較多耐心，多和醫療團隊溝通，家人多陪伴。"},
 love:{good:"可以主動表達心意。",warn:"順其自然，多溝通、多了解對方。",bad:"先別急著推進，給彼此一點空間。"},
 travel:{good:"可以出發，行程大致順利。",warn:"可以去，但行程預留彈性。",bad:"能延就延，不然就要準備周全。"},
 study:{good:"準備方向對，保持節奏就好。",warn:"加強弱項，多做練習。",bad:"要再加把勁，調整讀書方法。"},
 legal:{good:"情勢對你有利，但仍要準備充分。",warn:"雙方各有籌碼，可以考慮協商。",bad:"情勢較不利，建議尋求專業協助，考慮和解。"},
 general:{good:"可以進行。",warn:"可以進行，但多留意細節。",bad:"建議暫緩，或換個方式進行。"},
 natal:{info:"命盤看的是個性和傾向，不是定數，用來了解自己就好。"}
};
const TYPES={
 career:{name:"事業・工作・聘任"},wealth:{name:"財運・投資・生意"},health:{name:"健康・疾病"},love:{name:"感情・婚姻"},
 travel:{name:"出行・搬遷・洽談"},study:{name:"考試・學業"},legal:{name:"官司・談判・人際"},general:{name:"一般問事"},natal:{name:"出生命盤概覽"}};

function findDoor(ch,d){for(const p of QM.RING) if(ch.palaces[p].door===d) return p;}
function findStar(ch,s){for(const p of QM.RING) if(ch.palaces[p].stars.includes(s)) return p;}
function findGod(ch,g){for(const p of QM.RING) if(ch.palaces[p].god===g) return p;}
const stemP=(ch,s)=>ch.heavenOf(s)||ch.groundOf(s);
function roles(ch,q){
 const R=(id,label,tech,p)=>({id,label,tech,p});
 if(q.birthStem){const natal=R("natal","年命","年干"+q.birthStem,ch.groundOf(q.birthStem)); return [natal,...baseRoles(ch,q,natal.p)];}
 return baseRoles(ch,q,null);
}
function baseRoles(ch,q,natalP){
 const R=(id,label,tech,p)=>({id,label,tech,p});
 const self=R("self","本人","日干"+ch.dayStem,ch.dayP), matter=R("matter","這件事","時干"+ch.hourStem,ch.hourP);
 const horseP=({"寅":8,"申":2,"巳":4,"亥":6})[ch.horse];
 switch(q.type){
  case "career": return [self,matter,R("open","開門","職位",findDoor(ch,"開")),R("zhifu","值符","決策者",ch.zhifuP),R("liuhe","六合","合約",findGod(ch,"六合"))];
  case "wealth": return [self,matter,R("sheng","生門","財源",findDoor(ch,"生")),R("capital","戊","資本",stemP(ch,"戊"))];
  case "health": {const t=q.target; const pp=t==="self"?(natalP||ch.dayP):t==="oldman"?6:t==="oldwoman"?2:ch.hourP;
    const pl=t==="self"?"病人（本人）":t==="oldman"?"病人（男性長輩）":t==="oldwoman"?"病人（女性長輩）":"病人";
    return [R("patient",pl,t==="oldman"?"乾宮":t==="oldwoman"?"坤宮":t==="self"?(natalP?"年干"+q.birthStem:"日干"):"時干",pp),R("ill","天芮","病星",findStar(ch,"天芮")),R("doctor","天心","醫星",findStar(ch,"天心")),R("recover","生門","生機",findDoor(ch,"生")),R("caution","死門","",findDoor(ch,"死"))];}
  case "love": {const o=q.gender==="female"?"庚":"乙"; return [self,R("other","對方","天盤"+o,stemP(ch,o)),R("bond","六合","緣分",findGod(ch,"六合"))];}
  case "travel": return [self,R("go","開門","出行",findDoor(ch,"開")),R("rest","休門","平安",findDoor(ch,"休")),R("gain","生門","收穫",findDoor(ch,"生")),R("move","馬星","變動",horseP)];
  case "study": return [self,R("studyprep","天輔","學業",findStar(ch,"天輔")),R("exam","景門","考試",findDoor(ch,"景")),R("luck","丁","文星",stemP(ch,"丁"))];
  case "legal": return [self,R("opp","對方","時干"+ch.hourStem,ch.hourP),R("result","開門","結果",findDoor(ch,"開")),R("judge","值符","裁決者",ch.zhifuP)];
  case "natal": return [R("nature","本人","日干"+ch.dayStem,ch.dayP),R("axis","值符","主軸",ch.zhifuP),R("style","值使","行事",ch.zhishiP),R("career","開門","事業",findDoor(ch,"開")),R("wealth","生門","財運",findDoor(ch,"生")),R("health","天芮","健康",findStar(ch,"天芮"))];
  default: return [self,matter,R("helper","值符","主事者",ch.zhifuP),R("trend","值使","走向",ch.zhishiP)];
 }
}
const strong=s=>s==="旺"||s==="相", weak=s=>s==="囚"||s==="廢";

/* 把一個宮位翻成白話理由：pros / cons，每條都是完整句子 */
function reasonsFor(ch,P,opt){
 const pros=[],cons=[]; let s=0; const add=(txt,v,tech)=>{const line=`${txt}（${tech}）`; if(v>0)pros.push(line); else if(v<0)cons.push(line); s+=v;};
 const d=DOOR[P.door]; add(d[0],d[1],P.door+"門");
 const g=GOD[P.god]; add(g[0],g[1],P.god);
 P.flags.forEach(f=>{const k=f.t.endsWith("入墓")?"入墓":f.t; const m=FLAG[k]; if(!m)return;
   if(k==="馬星"){(opt&&opt.horseGood?pros:cons).push(`${m[0]}（馬星）`); return;}
   if(k==="伏吟"&&opt&&opt.skipFuyin) return;
   add(m[0],m[1],f.t);});
 P.ge.forEach(x=>{if(x.t==="伏吟"&&opt&&opt.skipFuyin)return; const m=GE[x.t]; if(m) add(m[0],m[1],x.t);});
 const st=P.stars[0], ss=P.starState[0], sm=STAR[st];
 if(sm[1]>0){ if(strong(ss)){pros.push(`坐鎮的${st}代表${sm[0]}，而且${STATE[ss]}（${st}${ss}）`); s+=1.5;}
   else if(weak(ss)){cons.push(`坐鎮的${st}代表${sm[0]}，但${STATE[ss]}，幫助有限（${st}${ss}）`); s+=0.5;}
   else s+=1; }
 else if(sm[1]<0 && strong(ss)){cons.push(`坐鎮的${st}代表${sm[0]}，而且${STATE[ss]}（${st}${ss}）`); s-=1.5;}
 else s+=sm[1]*0.5;
 return {pros,cons,score:s};
}
function illnessReasons(ch,P){
 const i=P.stars.indexOf("天芮"), ss=P.starState[i]; const pros=[],cons=[]; let s=0;
 if(strong(ss)){cons.push(`病星正當令，${STATE[ss]}，表示病情有一定份量，需要耐心治療（天芮${ss}）`); s-=1;}
 else {pros.push(`病星不當令，${STATE[ss]}，病情的力量不算強（天芮${ss}）`); s+=1;}
 if(P.flags.some(f=>f.t==="空亡")){pros.push("病星落在空亡，傳統上表示病勢較虛、有機會緩解（空亡）"); s+=1;}
 if(["白虎","騰蛇","玄武"].includes(P.god)){cons.push(`同宮有${P.god}，${GOD[P.god][0]}（${P.god}）`); s-=0.5;}
 if(["死","傷","驚","杜"].includes(P.door)){cons.push(`同宮是${P.door}門，${DOOR[P.door][0]}（${P.door}門）`); s-=0.5;}
 else {pros.push(`同宮是${P.door}門，${DOOR[P.door][0]}，病情有轉機（${P.door}門）`); s+=0.5;}
 if(P.flags.some(f=>f.t==="馬星")) cons.push("有馬星，病況或治療安排可能會有變動，例如換治療方式、轉院（馬星）");
 return {pros,cons,score:s};
}
function nextDates(ch,branches){
 const Z="子丑寅卯辰巳午未申酉戌亥", G="甲乙丙丁戊己庚辛壬癸"; const out=[]; const {y,m,d}=ch.input;
 const base=Date.UTC(y,m-1,d); const di0=Math.round((base-Date.UTC(1900,0,1))/864e5);
 for(let k=1;k<=24;k++){const idx=((di0+k+10)%60+60)%60; const b=Z[idx%12];
   if(branches.includes(b)&&!out.find(o=>o.b===b)){const t=new Date(base+k*864e5); out.push({b,gz:G[idx%10]+b,date:`${t.getUTCMonth()+1}/${t.getUTCDate()}`});}}
 return out;
}
function verdictOf(score){ return score>=1.5?"good":score>=-0.5?"warn":"bad"; }
const VWORD={good:"順",warn:"普通",bad:"較吃力"};

function interpret(ch,q){
 const raw0=roles(ch,q).filter(r=>r.p);
 const fuyin=QM.RING.every(p=>ch.palaces[p].ge.some(g=>g.t==="伏吟"));
 const solo=["ill","caution","opp"]; const raw=[];
 for(const r of raw0){const g=!solo.includes(r.id)&&raw.find(x=>x.p===r.p&&!solo.includes(x.id)); if(g){g.ids.push(r.id);g.labels.push(r.label);} else raw.push({...r,ids:[r.id],labels:[r.label]});}
 const natalP=q.birthStem?ch.groundOf(q.birthStem):null, baseP=natalP||ch.dayP;
 const items=[]; const selfEl=QM.PEL[baseP];
 for(const r of raw){
   const P=ch.palaces[r.p], infos=r.ids.map(id=>ROLE[id]);
   let e;
   if(r.p===5||!P.door) e={pros:[],cons:[],score:0};
   else if(r.id==="ill") e=illnessReasons(ch,P);
   else e=reasonsFor(ch,P,{horseGood:r.ids.includes("move"),skipFuyin:fuyin});
   if(q.type!=="health"&&!r.ids.some(x=>["natal","self","nature"].includes(x))&&r.p!==baseP&&r.p!==5){
     const rel=QM.rel(QM.PEL[r.p],selfEl); const t=`和你的關係：${REL[rel]}（宮位五行）`;
     (rel==="生"||rel==="比和"?e.pros:e.cons).push(t);
   }
   if(q.type==="health"&&r.ids.includes("patient")) e.body=`這個宮位傳統上對應身體的：${BODY[r.p]}`;
   if(r.id==="ill") e.body=`病星落在的部位，傳統上對應：${BODY[r.p]}`;
   let v=verdictOf(e.score), verdict;
   if(r.id==="caution"){ v="warn"; verdict=e.cons.length?"這裡是比較需要小心的地方，多留意下面提到的狀況即可，不必過度擔心。":"這一宮沒有特別凶的訊號，不必擔心。"; }
   else if(r.id==="opp"){ v=e.score>=1.5?"bad":e.score>=-0.5?"warn":"good"; verdict=v==="bad"?"對方條件不差、有人支持，"+ROLE.opp[2]:v==="good"?"對方本身也有不少困難，"+ROLE.opp[1]:"對方有優勢也有弱點，雙方各有籌碼。"; }
   else verdict=infos.map(info=>v==="good"?info[1]:v==="bad"?info[2]:info[1].replace(/。$/,"")+"，但也有要注意的地方。").join("");
   items.push({...r,label:r.labels.join("・"),meaning:r.ids.map((id,k)=>natalP&&id==="self"?"今天的你（日干）":infos[k][0]).join("、"),palace:P,verdict,tone:v,pros:e.pros,cons:e.cons,body:e.body,score:e.score,
     head:`${P.name}（${P.dir}）・${P.god||""}・${P.stars.join("、")}・${P.door?P.door+"門":""}・天盤${P.heaven.join("")} 地盤${P.ground}`});
 }
 const scored=items.filter(i=>i.id!=="caution"&&i.id!=="opp"); const avg=scored.reduce((a,b)=>a+(b.id==="opp"?-b.score:b.score),0)/Math.max(1,scored.length);
 let tone=avg>=1.5?"good":avg>=0?"warn":"bad";
 if(fuyin&&tone==="good") tone="warn"; // 伏吟主停滯，最多評為「有好有壞」
 const TEND={good:"偏順，可以進行",warn:"有好有壞，可以進行但要留意",bad:"阻力較多，宜保守"};
 const HT={good:"生機不錯，宜耐心調養",warn:"需要時間，按部就班",bad:"需要較多耐心，配合醫療"};
 let tendency=q.type==="health"?HT[tone]:TEND[tone];
 if(q.type==="natal"){tone="info";tendency="了解自己的個性與傾向";}
 // 整體白話
 const ranked=[...scored].sort((a,b)=>b.score-a.score);
 const best=ranked.find(i=>i.pros.length&&i.tone!=="bad"), worst=[...ranked].reverse().find(i=>i.cons.length&&i.tone!=="good");
 const clean=s=>s.replace(/（[^）]*）$/,"");
 let summary=q.type==="natal"?"這張是出生命盤，看的是個性與一生的傾向。":`整體來看，${tendency}。`;
 const natal=natalP?{stem:q.birthStem,yearGZ:q.birthGZ||"",p:natalP}:null;
 if(natal){const NP=ch.palaces[natalP]; summary=`你的年命（${natal.yearGZ?natal.yearGZ+"年，":""}${natal.stem}）落在${NP.name}（${NP.dir}），`+summary;}
 if(best) summary+=`最有利的是「${best.meaning}」：${clean(best.pros[0])}。`;
 if(worst&&worst!==best) summary+=`最需要注意的是「${worst.meaning}」：${clean(worst.cons[0])}。`;
 if(fuyin&&q.type!=="natal") summary+="另外，這張是「伏吟盤」，九星都停在原位，傳統上代表事情偏向原地踏步，適合守、不適合大動作。";
 summary+=(TYPEADV[q.type][tone]||TYPEADV[q.type].info||"");
 const good=[],bad=[];
 items.forEach(i=>{ if(i.id==="opp"){return;} i.pros.forEach(p=>good.push(`${i.meaning}：${p}`)); i.cons.forEach(c=>bad.push(`${i.meaning}：${c}`)); });
 const kong=nextDates(ch,[...ch.kong]), horse=nextDates(ch,[ch.horse]); const timing=[];
 if(kong.length) timing.push(`${kong.map(o=>o.date).join("、")}（${kong.map(o=>o.gz+"日").join("、")}）：盤上「還沒落實」的部分，傳統上在這幾天比較容易有消息或定案。`);
 if(horse.length) timing.push(`${horse.map(o=>o.date).join("、")}（${horse.map(o=>o.gz+"日").join("、")}）前後：比較容易出現變動或新的安排。`);
 return {type:q.type,typeName:TYPES[q.type].name,natal,items,avg,tendency,tone,summary,good:[...new Set(good)],bad:[...new Set(bad)],timing};
}
function chartLine(ch){return `${ch.input.y}/${ch.input.m}/${ch.input.d} ${String(ch.input.h).padStart(2,"0")}:${String(ch.input.mi).padStart(2,"0")}｜${ch.dayGZ}日 ${ch.hourGZ}時｜${ch.term}${ch.yuan}元 ${ch.yin?"陰":"陽"}遁${"一二三四五六七八九"[ch.ju-1]}局`;}
function fullText(ch,R,title){
 const L=[`【${title||"奇門占事"}】`,chartLine(ch),`問事類別：${R.typeName}`,"",`整體：${R.summary}`,""];
 R.items.forEach(i=>{L.push(`◆ ${i.meaning}（${i.label}）：${{good:"順",warn:"普通",bad:"較吃力"}[i.tone]}。${i.verdict}`);
   if(i.body) L.push(`　${i.body}`);
   i.pros.forEach(p=>L.push(`　＋ ${p}`)); i.cons.forEach(c=>L.push(`　－ ${c}`));
   L.push("");});
 if(R.timing.length){L.push("時間參考："); R.timing.forEach(g=>L.push("・"+g)); L.push("");}
 L.push(`盤面：${R.items.map(i=>i.label+" "+i.head).join("；")}`);
 L.push("","※ 奇門遁甲屬傳統術數，僅供參考，不能取代醫療、法律、財務等專業判斷。"); return L.join("\n");
}
function friendText(ch,R,title){
 const soften=s=>s.replace(/（[^）]*）$/,"");
 const L=[`【${title||"奇門盤簡要說明"}】`,`（${ch.input.y}/${ch.input.m}/${ch.input.d} ${String(ch.input.h).padStart(2,"0")}:${String(ch.input.mi).padStart(2,"0")} 起盤，傳統術數參考）${R.natal?"（已依問事者出生年個人化）":""}`,"",R.summary,""];
 R.items.filter(i=>i.id!=="caution"&&i.id!=="opp").forEach(i=>L.push(`・${i.meaning}：${{good:"順",warn:"普通",bad:"較吃力"}[i.tone]}，${i.verdict}`));
 if(R.timing.length) L.push("","時間參考：",...R.timing.map(x=>"・"+x));
 L.push("",R.type==="health"?"以上不能取代醫師的診斷與建議，請以醫療團隊的判斷為準。祝早日康復。":"以上僅供參考，實際決定請以現實條件與專業意見為準。");
 return L.join("\n");
}
const api={interpret,fullText,friendText,chartLine,TYPES,BODY};
if(typeof module!=="undefined") module.exports=api; else root.QI=api;
})(this);
