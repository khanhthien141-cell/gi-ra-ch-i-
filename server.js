const express=require('express');
const http=require('http');
const path=require('path');
const QRCode=require('qrcode');
const {Server}=require('socket.io');
const app=express(),server=http.createServer(app),io=new Server(server);
const PORT=process.env.PORT||3000;
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
const questions=[
['Hàm số y = f(x) đồng biến trên K khi với mọi x₁ < x₂ thì điều gì đúng?',['f(x₁) > f(x₂)','f(x₁) < f(x₂)','f(x₁) = f(x₂)','f(x₁) ≤ f(x₂)'],1],
["Nếu f'(x) > 0 trên (a; b), hàm số có tính chất gì?",['Nghịch biến','Không đổi','Đồng biến','Đạt cực tiểu tại mọi điểm'],2],
['Đường thẳng y = y₀ là tiệm cận ngang nếu giới hạn nào bằng y₀?',['lim khi x → x₀ f(x)','lim khi x → +∞ hoặc −∞ f(x)','lim khi x → y₀ f(x) = +∞','f(y₀) = 0'],1],
['Hai vectơ khác vectơ-không cùng phương khi giá của chúng thế nào?',['Vuông góc','Cắt nhau tại một điểm','Chéo nhau','Song song hoặc trùng nhau'],3],
['Thể loại văn học dân gian kể về thần linh để giải thích tự nhiên và đời sống là gì?',['Truyện cổ tích','Thần thoại','Truyền thuyết','Truyện cười'],1],
['Bố cục cơ bản của bài văn nghị luận xã hội gồm mấy phần?',['2 phần','4 phần','3 phần: Mở bài, Thân bài, Kết bài','5 phần'],2],
['Biện pháp tu từ dùng từ ngữ chỉ hoạt động, tính chất con người để gán cho vật là gì?',['Nhân hóa','So sánh','Ẩn dụ','Hoán dụ'],0],
['Phương thức biểu đạt kể chuỗi sự việc có mở đầu, diễn biến, kết thúc là gì?',['Miêu tả','Nghị luận','Biểu cảm','Tự sự'],3],
['Which tense expresses a general truth, a habit, or a daily routine?',['Present Simple','Present Continuous','Past Simple','Future Simple'],0],
['What is the correct past simple form of “go”?',['goed','gone','went','going'],2],
['Choose the correct pronoun: “Lan is a diligent student. ____ always finishes her homework on time.”',['He','She','They','It'],1],
['Which word has a different stress pattern from the others?',['Teacher','Student','Doctor','Decide'],3],
['Ester đơn chức, mạch hở no có công thức tổng quát nào?',['CₙH₂ₙ₊₂O₂','CₙH₂ₙO₂ (n ≥ 2)','CₙH₂ₙ₋₂O₂','CₙH₂ₙO'],1],
['Thủy phân ester trong môi trường kiềm khi đun nóng gọi là phản ứng gì?',['Xà phòng hóa','Tráng bạc','Trùng hợp','Ngưng tụ'],0],
['Chất nào thuộc loại monosaccharide?',['Saccharose','Tinh bột','Cellulose','Glucose'],3],
['Glucose tạo lớp bạc với AgNO₃/NH₃ chứng tỏ có nhóm chức nào?',['Ester','Aldehyde (–CHO)','Carboxyl (–COOH)','Ketone'],1],
['Nhiệt dung riêng là nhiệt lượng cần để làm cho bao nhiêu chất tăng thêm 1°C (hoặc 1 K)?',['1 kg chất đó','10 kg chất đó','1 mol chất đó nóng chảy','1 kg chất đó hóa hơi'],0],
['Công thức gần đúng đổi từ Celsius t sang Kelvin T là gì?',['T = t + 273','T = t − 273','T = 273 − t','T = 273 × t'],0],
['Theo bộ câu hỏi, biểu thức Định luật I Nhiệt động lực học là gì?',['ΔU = A − Q','ΔU = Q − A','ΔU = A + Q','ΔU = A / Q'],2],
['Chuyển từ thể rắn sang thể lỏng gọi là gì?',['Ngưng kết','Nóng chảy','Hóa hơi','Đông đặc'],1],
['Đơn phân cấu tạo nên phân tử ADN là gì?',['Amino acid','Glucose','Nucleotide','Fatty acid'],2],
['Các nucleotide của ADN khác nhau chủ yếu ở thành phần nào?',['Nhóm phosphate','Base nitrogen (A, T, G, C)','Đường deoxyribose','Liên kết hydro'],1],
['Tổng hợp ARN từ khuôn mẫu ADN gọi là gì?',['Phiên mã','Dịch mã','Nhân đôi','Tự sao'],0],
['ADN quấn quanh protein histone ở tế bào nhân thực tạo cấu trúc nào?',['Ti thể','Nhiễm sắc thể','Lưới nội chất','Bộ máy Golgi'],1],
['Đột biến gen thường liên quan đến biến đổi nào?',['Một hoặc một số cặp nucleotide','Số lượng nhiễm sắc thể','Hình dạng tế bào','Toàn bộ hình thái cơ thể'],0],
['Hệ thống kỹ thuật liên kết và tương tác nhằm mục đích gì?',['Thực hiện một nhiệm vụ/chức năng xác định','Chỉ phục vụ giải trí','Chỉ lưu dữ liệu cá nhân','Ghi lại sự kiện lịch sử'],0],
['Cấu trúc chung của hệ thống kỹ thuật gồm ba phần nào?',['Đầu vào, xử lý & điều khiển, đầu ra','Lập trình, chạy thử, nghiệm thu','Cơ khí, điện tử, phần mềm','Thiết kế, sản xuất, tiêu thụ'],0],
['Công nghệ nào thuộc lĩnh vực cơ khí?',['Gia công cắt gọt','Truyền thông không dây','Công nghệ sinh học','Điện mặt trời'],0],
['Mục đích chính của ứng dụng công nghệ hiện đại là gì?',['Tăng năng suất, chất lượng và cải thiện đời sống','Gia tăng chất thải','Giảm nhu cầu giao tiếp','Thay thế hoàn toàn tư duy'],0]
];
let teams=[{name:'Đội Mặt Trời',color:'#e4b84b',score:0},{name:'Đội Mặt Trăng',color:'#83b4df',score:0},{name:'Đội Sao Băng',color:'#d17a71',score:0},{name:'Đội Cầu Vồng',color:'#83b98b',score:0}];
let round=0,questionIndex=-1,open=false,winner=null,answered=false;
function state(){return {teams,round,questionIndex,question:questionIndex<0?null:{text:questions[questionIndex][0],answers:questions[questionIndex][1]},open,winner,answered,total:questions.length};}
function broadcast(){io.emit('state',state());}
app.get('/api/state',(req,res)=>res.json(state()));
app.get('/api/qr',async(req,res)=>{const url=req.query.url||`${req.protocol}://${req.get('host')}/join.html`;res.type('png').send(await QRCode.toBuffer(url,{width:360,margin:2}));});
app.post('/api/teams',(req,res)=>{if(!Array.isArray(req.body.teams)||req.body.teams.length!==4)return res.status(400).json({error:'Cần 4 đội'});teams=teams.map((t,i)=>({...t,name:String(req.body.teams[i]?.name||t.name).trim().slice(0,35)||t.name}));broadcast();res.json({ok:true});});
app.post('/api/open',(req,res)=>{const n=Number(req.body.index);if(!Number.isInteger(n)||n<0||n>=questions.length)return res.status(400).json({error:'Câu không hợp lệ'});questionIndex=n;round++;open=true;winner=null;answered=false;broadcast();res.json({ok:true});});
app.post('/api/close',(req,res)=>{open=false;broadcast();res.json({ok:true});});
app.post('/api/score',(req,res)=>{if(!winner||answered)return res.status(400).json({error:'Chưa có đội giành quyền hoặc đã chấm điểm'});const delta=Number(req.body.delta);if(![5,-5].includes(delta))return res.status(400).json({error:'Điểm không hợp lệ'});teams[winner.team].score+=delta;answered=true;open=false;broadcast();res.json({ok:true});});
app.post('/api/reset',(req,res)=>{teams=teams.map(t=>({...t,score:0}));round++;questionIndex=-1;open=false;winner=null;answered=false;broadcast();res.json({ok:true});});
io.on('connection',socket=>{socket.emit('state',state());socket.on('buzz',(p,ack)=>{const reply=typeof ack==='function'?ack:()=>{};if(!open||winner)return reply({ok:false,message:winner?'Đã có đội giành quyền trước.':'MC chưa mở lượt tranh quyền.'});const team=Number(p?.team),name=String(p?.name||'').trim().slice(0,40);if(!Number.isInteger(team)||team<0||team>=4||!name)return reply({ok:false,message:'Nhập tên và chọn đội hợp lệ.'});winner={team,name,teamName:teams[team].name};open=false;broadcast();reply({ok:true,message:`${teams[team].name} đã giành quyền trả lời!`});});});
server.listen(PORT,'0.0.0.0',()=>console.log(`Server listening on ${PORT}`));
