// Transcribed from the full semester timetable supplied by the user.
// Week 8 starts 2026-10-19, so week 1 starts 2026-08-31.
const SEMESTER_START=[2026,7,31], LAST_WEEK=18;
const PERIODS=[['1','08:20','09:05'],['2','09:10','09:55'],['3','10:15','11:00'],['4','11:05','11:50'],['5','14:00','14:45'],['6','14:50','15:35'],['7','15:55','16:40'],['8','16:45','17:30'],['9','18:30','19:15'],['10','19:20','20:05']];
// id, subject, weekday (Monday=0), first period, weeks, room, attached class
const RULES=[
 ['js-wed-am','js',2,1,'11-14','2-C603',true],
 ['js-fri-am','js',4,1,'1-4','2-C603',false],
 ['ssm-mon-am','ssm',0,3,'13-18','2-C604',true],
 ['os-tue-am','os',1,3,'1-4,7-11','2-D314',false],
 ['ssm-tue-am','ssm',1,3,'13-18','2-C604',true],
 ['os-thu-am','os',3,3,'1-4,7-11','2-D314',false],
 ['spring-fri','spring',4,3,'1-4,7-8','2-C604',false],
 ['spring-fri-lab','spring',4,3,'9-10','2-C604',true],
 ['js-mon','js',0,5,'7-10','2-C603',false],
 ['js-mon-lab','js',0,5,'11-14','2-C603',true],
 ['python-tue','python',1,5,'2-4,7-10','2-D312',false],
 ['os-wed-lab','os',2,5,'12-16','2-C617',true],
 ['js-wed','js',2,5,'1-4','2-C603',false],
 ['python-thu','python',3,5,'1-4,7-10','2-D312',false],
 ['os-thu-pm','os',3,5,'6','2-D314',false],
 ['ssm-fri','ssm',4,5,'1-4,7-12','2-C604',false],
 ['spring-wed','spring',2,7,'1-4,7-8','2-C604',false],
 ['spring-wed-lab','spring',2,7,'9-10','2-C604',true],
 ['python-thu-lab','python',3,7,'2-4,7-11','1-B204',true],
 ['ssm-tue-night','ssm',1,9,'1-4','2-C604',false],
 ['ssm-wed-night','ssm',2,9,'7-12','2-C604',false]
];
const SUBJECTS={js:['JavaScript 与 jQuery 开发技术',0],os:['操作系统',1],python:['Python 程序设计',2],spring:['SpringBoot 框架开发技术',3],ssm:['SSM 框架开发技术',4]};
function weeksIn(spec){return spec.split(',').flatMap(part=>{const [a,b=a]=part.split('-').map(Number);return Array.from({length:b-a+1},(_,i)=>a+i)})}
function semesterSeed(){return RULES.flatMap(([id,subject,day,period,weeks,room,attached])=>weeksIn(weeks).map(week=>({id:`term-${id}-${week}`,week,day,title:SUBJECTS[subject][0]+(attached?' · 附属课堂':''),start:PERIODS[period-1][1],end:PERIODS[period][2],color:attached&&subject==='spring'?5:SUBJECTS[subject][1],location:`工 ${room} · 西教学区工程 ${room[0]} 号教学楼`,memo:`教务课表：第 ${weeks.replaceAll(',', '、')} 周，第 ${period}–${period+1} 节。`,pending:false})))}
function dateForWeek(week,day=0){return new Date(2026,7,31+(week-1)*7+day)}
function weekForDate(d){return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(...SEMESTER_START))/604800000)+1}
