const $=id=>document.getElementById(id), KEY='my-course-semester-v1';
const colors=[['#f0efff','#7469d9','#cec1fa'],['#eef6ff','#408fe1','#c8defc'],['#ebfaf8','#2c9faf','#ade9e3'],['#fff7e5','#c28a08','#ffe3a0'],['#fff0f4','#e06188','#f6bdca'],['#fceffa','#bc50b1','#f3c0ec']];
const base=[['JavaScript 与 jQuery 开发技术',0,'14:00','15:35',0],['操作系统',1,'10:15','11:50',1],['Python 程序设计',1,'14:00','15:35',2],['JavaScript 与 jQuery 开发技术',2,'14:00','15:35',0],['SpringBoot 框架开发技术',2,'15:55','17:30',3],['SSM 框架开发技术',2,'19:00','20:40',4],['操作系统',3,'10:15','11:50',1],['Python 程序设计',3,'14:00','15:35',2],['Python 程序设计 · 附属课堂',3,'15:55','17:30',0],['SpringBoot 框架开发技术',4,'10:15','11:50',3],['SSM 框架开发技术',4,'14:00','15:35',4]];
const originalSeed=()=>[8,9].flatMap(week=>base.map(([title,day,start,end,color],i)=>{let location=title==='操作系统'?'西教学区工程 2 号教学楼 · 工 2-D…':'西教学区工程 2 号教学楼';let memo='截图地点未完整显示，请补充完整教室。';if(i===8){location='';memo='截图原文：Python程序设计_06课堂的附属课堂_FS0（后续可能被截断），请确认地点。'}if(week===9&&(i===4||i===9)){title='SpringBoot 框架开发技术 · 附属课堂';location='';memo='截图原文：SpringBoot框架开发技术_09课堂的附属课堂，请确认地点。';color=5}return {id:week+'-'+i,week,title,day,start,end,color,location,memo,pending:true}}));
// Fill only original, incomplete locations; preserve user edits and deleted lessons.
function completeLocation(c){
 const original=originalSeed().find(o=>o.id===c.id);
 if(!original || !c.pending || c.location!==original.location || c.title!==original.title)return c;
 const i=Number(c.id.split('-')[1]);
 const room=i===8?'工 1-B204':[1,6].includes(i)?'工 2-D314':[2,7].includes(i)?'工 2-D312':[0,3].includes(i)?'工 2-C603':'工 2-C604';
 const building=i===8?'1':'2';
 return {...c,location:`${room} · 西教学区工程 ${building} 号教学楼`,pending:false,memo:c.memo===original.memo?'教室已根据完整教务课表补齐；课程安排按第 8、9 周截图保留。':c.memo};
}
function updateEvening(c){
 if((c.id==='8-5'||c.id==='9-5')&&c.start==='19:00'&&c.end==='20:40')return {...c,start:'18:30',end:'20:05'};
 return c;
}
const legacySeed=()=>originalSeed().map(completeLocation).map(updateEvening);
const seed=semesterSeed;
function migrateLegacy(saved){
 let result=seed();
 const defaults=legacySeed();
 const fields=['title','location','memo','week','day','start','end','color'];
 const matching=(old)=>result.find(c=>c.week===old.week&&c.day===old.day&&c.start===old.start&&c.title===old.title);
 for(const original of defaults){
  const row=saved.find(c=>c.id===original.id),target=matching(original);
  if(!row){if(target)result=result.filter(c=>c.id!==target.id);continue}
  const upgraded=updateEvening(completeLocation(row));
  const changes=fields.filter(k=>upgraded[k]!==original[k]);
  if(!changes.length)continue;
  if(target){for(const k of changes)target[k]=upgraded[k];target.pending=upgraded.pending}
  else result.push({...upgraded,id:'migrated-'+upgraded.id});
 }
 for(const row of saved)if(!defaults.some(c=>c.id===row.id))result.push(row);
 return result;
}
let courses=seed(), storageFailed=false;
try{
 const stored=localStorage.getItem(KEY);
 if(stored!==null){const v=JSON.parse(stored);if(!Array.isArray(v)||!v.every(valid))throw Error();courses=v}
 else {const old=JSON.parse(localStorage.getItem('my-course-weeks-v1'));if(Array.isArray(old)&&old.every(valid))courses=migrateLegacy(old);localStorage.setItem(KEY,JSON.stringify(courses))}
}catch{storageFailed=true}
function valid(c){return c&&typeof c.id==='string'&&typeof c.title==='string'&&c.title.trim().length>0&&Number.isInteger(c.week)&&c.week>=1&&c.week<=LAST_WEEK&&Number.isInteger(c.day)&&c.day>=0&&c.day<7&&typeof c.location==='string'&&typeof c.memo==='string'&&Number.isInteger(c.color)&&c.color>=0&&c.color<6&&/^([01]\d|2[0-3]):[0-5]\d$/.test(c.start)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(c.end)&&minute(c.start)>=500&&minute(c.end)<=1240&&minute(c.start)<minute(c.end)}
const now=new Date(),iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
let selected=Math.min(LAST_WEEK,Math.max(1,weekForDate(now))), editing=null;
for(let w=1;w<=LAST_WEEK;w++){for(let id of ['week','weekPicker']){const o=document.createElement('option');o.value=w;o.textContent=`第 ${w} 周` ;$(id).append(o)}}
function minute(t){let [h,m]=t.split(':').map(Number);return h*60+m}
const anchors=PERIODS.flatMap((p,i)=>[[minute(p[1]),i*108],[minute(p[2]),(i+1)*108]]);
function y(t){let n=minute(t);for(let i=1;i<anchors.length;i++){let [b,q]=anchors[i],[a,p]=anchors[i-1];if(n<=b)return p+(n-a)/(b-a)*(q-p)}return 1080}
function el(tag,cls,txt){let x=document.createElement(tag);x.className=cls||'';if(txt!==undefined)x.textContent=txt;return x}
function render(){ $('weekNumber').textContent=selected;$('weekPicker').value=selected;$('prev').disabled=selected===1;$('next').disabled=selected===LAST_WEEK;
 const first=dateForWeek(selected),last=dateForWeek(selected,6);
 $('dateRange').textContent=`${first.getMonth()+1}.${first.getDate()} — ${last.getMonth()+1}.${last.getDate()}`;
 $('dates').replaceChildren(el('div','month',`${first.getMonth()+1} 月`));
 for(let i=0;i<7;i++){let d=dateForWeek(selected,i),cell=el('div',iso(d)===iso(now)?'now':'');cell.append(el('b','',['一','二','三','四','五','六','日'][i]),el('span','',d.getDate()===1?`${d.getMonth()+1}/1`:d.getDate()));$('dates').append(cell)}
 $('empty').hidden=courses.some(c=>c.week===selected);
 $('grid').replaceChildren();let times=PERIODS;times.forEach((t,i)=>{let row=el('div','row'),label=el('div','time');row.style.top=i*108+'px';label.style.top=i*108+12+'px';label.append(el('strong','',t[0]),el('div','',t[1]),el('div','',t[2]));$('grid').append(row,label)});courses.filter(c=>c.week===selected).forEach(c=>{let b=el('button','course'),co=colors[c.color];b.style.cssText=`left:calc(37px + (100% - 37px) / 7 * ${c.day} + 2px);width:calc((100% - 37px) / 7 - 4px);top:${y(c.start)+3}px;height:${Math.max(32,y(c.end)-y(c.start)-6)}px;--bg:${co[0]};--fg:${co[1]};--cap:${co[2]}`;b.append(el('strong','',c.title),el('span','place',c.location||'地点待确认'));if(c.pending)b.append(el('span','pending','待补充'));b.setAttribute('aria-label',`${c.title}，${c.start} 至 ${c.end}，${c.location||'地点待确认'}`);b.onclick=()=>open(c);$('grid').append(b)})}
function change(w){selected=Math.min(LAST_WEEK,Math.max(1,Number(w)));render()}
$('weekPicker').onchange=e=>change(e.target.value);$('prev').onclick=()=>change(selected-1);$('next').onclick=()=>change(selected+1);
$('today').onclick=()=>{let w=weekForDate(new Date());if(w>=1&&w<=LAST_WEEK)change(w);else toast('当前日期不在本学期第 1–18 周内')};
let touch; $('grid').addEventListener('touchstart',e=>{touch=[e.changedTouches[0].clientX,e.changedTouches[0].clientY]},{passive:true});$('grid').addEventListener('touchend',e=>{if(!touch)return;let dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)change(selected+(dx<0?1:-1));touch=null},{passive:true});
function open(c){editing=c?.id||null;$('sheetTitle').textContent=c?'课程详情':'添加课程';for(let k of ['title','location','memo'])$(k).value=c?.[k]||'';$('week').value=c?.week||selected;$('day').value=c?.day??0;$('start').value=c?.start||'14:00';$('end').value=c?.end||'15:35';$('sourceNote').textContent=c?.pending?'地点未完整识别，保存完整地点后可去掉待补充标记。':'';$('remove').hidden=!c;$('error').textContent='';$('editor').showModal()}
$('add').onclick=()=>open();$('close').onclick=()=>$('editor').close();
function persist(){try{localStorage.setItem(KEY,JSON.stringify(courses));return true}catch{toast('浏览器无法保存，请立即导出备份');return false}}
$('form').onsubmit=e=>{e.preventDefault();let old=courses.find(c=>c.id===editing);let c={id:editing||crypto.randomUUID(),week:+$('week').value,day:+$('day').value,title:$('title').value.trim(),location:$('location').value.trim(),start:$('start').value,end:$('end').value,memo:$('memo').value.trim(),color:old?.color??0};c.pending=!c.location||c.location.includes('…')||(old?.pending&&c.location===old.location);if(!valid(c)||minute(c.end)>1205||y(c.end)-y(c.start)<16){$('error').textContent='请输入课程名称和有效时间（08:20–20:05，至少覆盖一段上课时间）。';return}if(courses.some(o=>o.id!==c.id&&o.week===c.week&&o.day===c.day&&o.start<c.end&&c.start<o.end)){$('error').textContent='这个时间已有课程，请调整时间。';return}courses=editing?courses.map(o=>o.id===editing?c:o):[...courses,c];let saved=persist();change(c.week);$('editor').close();if(saved)toast('已保存到此设备')};
$('remove').onclick=()=>{if(confirm('删除这一次课程？其他周的课程不受影响。')){courses=courses.filter(c=>c.id!==editing);persist();render();$('editor').close()}};
$('help').onclick=()=>$('info').showModal();$('closeInfo').onclick=()=>$('info').close();for(let d of [$('info'),$('editor')])d.addEventListener('click',e=>{if(e.target===d){let r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});
$('backup').onclick=()=>{let url=URL.createObjectURL(new Blob([JSON.stringify({version:2,courses},null,2)],{type:'application/json'}));let a=el('a');a.href=url;a.download='我的学期课表.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$('restore').onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let v=JSON.parse(await f.text());if(![1,2].includes(v.version)||!Array.isArray(v.courses)||v.courses.length>1000||!v.courses.every(valid))throw Error();if(v.version===1)v.courses=migrateLegacy(v.courses);if(confirm('用备份替换当前设备上的课表？')){courses=v.courses;persist();render();$('backupStatus').textContent='备份已恢复。'}}catch{$('backupStatus').textContent='备份格式无效，原课表未修改。'}e.target.value=''};
let timer;function toast(t){$('toast').textContent=t;$('toast').style.display='block';clearTimeout(timer);timer=setTimeout(()=>$('toast').style.display='none',3500)}render();if(storageFailed)toast('未能读取本地数据，已显示截图课表');
