const express=require('express');
const http=require('http');
const path=require('path');
const crypto=require('crypto');
const {Server}=require('socket.io');
const QRCode=require('qrcode');
const questions=require('./questions');
const app=express(),server=http.createServer(app),io=new Server(server);
app.use(express.json());app.use(express.static(path.join(__dirname,'public')));
let teams=[
 {name:'Đội Mặt Trời',color:'#e4b84b',icon:'☀️',score:0},
 {name:'Đội Mặt Trăng',color:'#83b4df',icon:'🌙',score:0},
 {name:'Đội Sao Băng',color:'#d17a71',icon:'☄️',score:0},
 {name:'Đội Cầu Vồng',color:'#83b98b',icon:'🌈',score:0}
];
let round=0,questionIndex=0,open=false,token='',entries=[],history=[];
const current=()=>questions[questionIndex-1];
const publicQuestion=()=>current()?{no:questionIndex,text:current()[0],answers:current()[1],subject:current()[4]}:null;
const ranked=()=>{let n=0;return entries.map(e=>({...e,rank:e.correct&&n<5?++n:null,points:e.correct&&n<=5?6-n:0}));};
const state=()=>({teams,round,questionIndex,currentNo:questionIndex,question:publicQuestion(),open,isOpen:open,total:questions.length,totalQuestions:questions.length,submissions:ranked(),history,winner:null});
function publish(){io.emit('state',state());io.emit('host-teams',teams);io.emit('team-list',teams);io.emit('host-submissions',ranked());}
function safeHistory(){return history.map(h=>({...h,submissions:h.submissions.map(e=>({...e}))}));}
function saveRound(){if(!questionIndex)return;const idx=history.findIndex(h=>h.round===round);const record={round,questionNo:questionIndex,subject:current()[4],question:current()[0],submissions:ranked(),closed:!open};if(idx>=0)history[idx]=record;else history.push(record);}
function origin(req){const proto=req.get('x-forwarded-proto')?.split(',')[0]||req.protocol;return `${proto}://${req.get('host')}`;}
app.get('/api/state',(req,res)=>res.json(state()));
app.get('/api/questions',(req,res)=>res.json(questions.map((q,i)=>({no:i+1,text:q[0],answers:q[1],subject:q[4]}))));
app.get('/api/history',(req,res)=>res.json(safeHistory()));
app.get('/api/qr',async(req,res)=>{try{const url=`${origin(req)}/join.html?r=${round}&k=${encodeURIComponent(token)}`;const png=await QRCode.toBuffer(url,{width:380,margin:2,errorCorrectionLevel:'M'});res.type('png').set('Cache-Control','no-store').send(png);}catch(e){res.status(500).send('QR error');}});
app.post('/api/teams',(req,res)=>{if(!Array.isArray(req.body.teams)||req.body.teams.length!==4)return res.status(400).json({error:'Cần đúng 4 đội'});teams=teams.map((old,i)=>({...old,name:String(req.body.teams[i].name||old.name).slice(0,35),color:String(req.body.teams[i].color||old.color),icon:String(req.body.teams[i].icon||old.icon)}));publish();res.json({ok:true,teams});});
app.post('/api/open',(req,res)=>{const no=Number(req.body.no);if(!Number.isInteger(no)||no<1||no>questions.length)return res.status(400).json({error:'Câu không hợp lệ'});if(questionIndex)saveRound();round++;questionIndex=no;token=crypto.randomBytes(18).toString('hex');entries=[];open=true;io.emit('question-open',publicQuestion());publish();res.json({ok:true,round,question:publicQuestion()});});
app.post('/api/close',(req,res)=>{open=false;saveRound();io.emit('question-closed');publish();res.json({ok:true});});
app.post('/api/reset',(req,res)=>{teams.forEach(t=>t.score=0);round=0;questionIndex=0;token='';entries=[];history=[];open=false;io.emit('question-closed');publish();res.json({ok:true});});
// Không có endpoint chấm tay: máy chủ chấm 5,4,3,2,1 theo 5 đáp án đúng đến sớm nhất.
// Nếu người trả lời thứ 2 sai, người thứ 6 đúng sẽ tự lên vị trí thứ 5.
io.on('connection',socket=>{
 socket.emit('state',state());socket.emit('team-list',teams);
 socket.on('student-hello',()=>{socket.emit('team-list',teams);socket.emit('state',state());if(open)socket.emit('question-open',publicQuestion());});
 socket.on('student-join',data=>{const name=String(data?.name||'').trim().slice(0,40),team=Number(data?.team);if(!name||!Number.isInteger(team)||!teams[team])return socket.emit('student-ready',{error:'Tên hoặc đội không hợp lệ'});socket.data.profile={name,team};socket.emit('student-ready',{ok:true});if(open)socket.emit('question-open',publicQuestion());});
 socket.on('student-answer',data=>{
  const p=socket.data.profile;
  const reply=message=>socket.emit('answer-result',{message});
  if(!p)return reply('Hãy nhập tên và chọn đội trước.');
  if(!open||!current())return reply('Câu hỏi chưa mở hoặc đã kết thúc.');
  if(Number(data?.questionNo)!==questionIndex||Number(data?.round)!==round||String(data?.token||'')!==token)return reply('Mã QR cũ. Hãy quét mã QR mới của câu này.');
  const answer=Number(data?.answer);if(!Number.isInteger(answer)||answer<0||answer>3)return reply('Chọn một đáp án hợp lệ.');
  const key=`${p.team}:${p.name.toLocaleLowerCase('vi')}`;
  if(entries.some(e=>e.key===key))return reply('Tên này đã gửi đáp án ở câu này.');
  const correct=answer===current()[2],validCount=entries.filter(e=>e.correct).length;
  if(validCount>=5){open=false;return reply('Đã đủ 5 người trả lời đúng.');}
  const rank=correct?validCount+1:null,points=correct?6-rank:0;
  const entry={key,name:p.name,team:p.team,teamName:teams[p.team].name,answer:'ABCD'[answer],correct,rank,points,time:new Date().toISOString(),order:entries.length+1};
  entries.push(entry);if(correct)teams[p.team].score+=points;
  socket.emit('answer-result',{message:correct?`Chính xác! Hạng ${rank}, +${points} điểm cho ${teams[p.team].name}.`:'Chưa đúng. 0 điểm; người tiếp theo có cơ hội vào top 5.',correct,rank,points});
  if(entries.filter(e=>e.correct).length>=5){open=false;io.emit('question-closed');}
  saveRound();publish();
 });
});
server.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('QR Top 5 ready'));
