// Background music: on by default, Music On/Off buttons (home + pause), saved; scheduler fills ~1s ahead and stops when muted.
ok(M.music===true,'music on by default');
ok([...document.querySelectorAll('.mus')].length===2&&[...document.querySelectorAll('.mus')].every(b=>b.textContent==='Music On'),'Music On buttons on home menu and pause panel');
click($('hmus'));ok(M.music===false&&JSON.parse(localStorage.getItem('pixelTowerMeta')).music===false,'toggle off, saved');
ok([...document.querySelectorAll('.mus')].every(b=>b.textContent==='Music Off'),'both buttons say Music Off');
click($('hmus'));ok(M.music===true,'toggle back on');
loadMeta({v:5,chips:1,lv:{}});ok(M.music===true&&M.v===SAVE_V,'older saves: music on');
loadMeta({v:6,chips:1,lv:{},music:false});ok(M.music===false,'saved music off is kept');M.music=true;
// the song: 8-bar sections in a varied order, chords change every 2 bars, all sections get used
const seq=[],chords=[];for(let i=0;i<400;i++){const {c}=musicStep();chords.push(c);if(music.sbar===1)seq.push(music.sec)}
ok(new Set(seq).size===4,'all four sections are played ('+seq.slice(0,12).join('')+'...)');
ok(new Set(chords).size>=7,'at least 7 different chords used ('+new Set(chords).size+')');
let same=0;for(let i=0;i+8<seq.length;i++)if(seq.slice(i,i+4).join()===seq.slice(i+4,i+8).join())same++;ok(same<seq.length/3,'section order rarely repeats exactly');
ok(chords[0]===chords[1]&&chords[2]===chords[3],'chords change every 2 bars');
Object.assign(music,{sec:'A',sbar:0,arp:0});
// scheduler with a stand-in audio device that counts notes
let notes=0;const node=()=>({connect(x){return x||node()},gain:{value:1,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},frequency:{value:0,setValueAtTime(){}},start(){},stop(){},type:'',buffer:null});
AC={state:'running',currentTime:10,sampleRate:22050,createOscillator(){notes++;return node()},createGain:node,createBiquadFilter:node,createBufferSource:node,createBuffer:(c,n)=>({getChannelData:()=>new Float32Array(n)})};MB=node();M.mute=false;music.next=0;
musicTick();const n1=notes;ok(n1>=10&&music.next>10&&music.next<=10.2+BAR,'first tick schedules a bar ('+n1+' notes)');
musicTick();ok(notes===n1,'nothing extra while the next bar is far enough ahead');
AC.currentTime=10+BAR;musicTick();ok(notes>n1,'next bar scheduled as time passes');
M.mute=true;const n2=notes;AC.currentTime+=BAR*2;musicTick();ok(notes===n2&&music.next===0,'muted: no music scheduled');M.mute=false;
M.music=false;AC.currentTime+=BAR*2;musicTick();ok(notes===n2,'music off: none scheduled');M.music=true;
AC=null;MB=null;
done();
