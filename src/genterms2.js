const {Lunar}=require('lunar-javascript');
const order=['小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'];
const rows=[];
for(let y=1901;y<=2100;y++){
  const tbl=Lunar.fromYmd(y,6,1).getJieQiTable();
  const r=order.map(n=>{
    // pick the occurrence inside Gregorian year y
    let s=tbl[n]; const alt={'小寒':'XIAO_HAN','大寒':'DA_HAN','冬至':'DONG_ZHI','大雪':'DA_XUE'}[n];
    if(s.getYear()!==y && alt && tbl[alt] && tbl[alt].getYear()===y) s=tbl[alt];
    if(s.getYear()!==y) throw new Error(y+n+s.toYmd());
    const mins=Math.round((Date.UTC(s.getYear(),s.getMonth()-1,s.getDay(),s.getHour(),s.getMinute())-Date.UTC(y,0,1))/60000);
    return mins.toString(36).padStart(4,'0');
  });
  rows.push(r.join(''));
}
require('fs').writeFileSync('terms2.txt',rows.join(','));
const T=Lunar.fromYmd(2026,6,1).getJieQiTable(); console.log(T['霜降'].toYmdHms(), T['小雪'].toYmdHms(), rows.join(',').length);
