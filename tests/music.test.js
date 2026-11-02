// Background music: on by default, Music On/Off buttons (home + pause), saved; scheduler fills ~1s ahead and stops when muted.
ok(M.music===true,'music on by default');
ok([...document.querySelectorAll('.mus')].length===2&&[...document.querySelectorAll('.mus')].every(b=>b.textContent==='Music On'),'Music On buttons on home menu and pause panel');
click($('hmus'));ok(M.music===false&&JSON.parse(localStorage.getItem('pixelTowerMeta')).music===false,'toggle off, saved');
ok([...document.querySelectorAll('.mus')].every(b=>b.textContent==='Music Off'),'both buttons say Music Off');
click($('hmus'));ok(M.music===true,'toggle back on');
loadMeta({v:5,chips:1,lv:{}});ok(M.music===true&&M.v===SAVE_V,'older saves: music on');
loadMeta({v:6,chips:1,lv:{},music:false});ok(M.music===false,'saved music off is kept');M.music=true;
ok([0,1,2,3,4,5,6,7,8].map(musicChord).join('')==='001122330','4 chords, 2 bars each, looping');
// scheduler with a stand-in audio device that counts notes
let notes=0;const node=()=>({connect(x){return x||node()},gain:{value:1,setValueAtTime(){},linearRampToValueAtTime(){}},frequency:{setValueAtTime(){}},start(){},stop(){},type:''});
AC={state:'running',currentTime:10,createOscillator(){notes++;return node()},createGain:node};MB=node();M.mute=false;music.next=0;
musicTick();const n1=notes;ok(n1>=10&&music.next>10&&music.next<=10.2+BAR,'first tick schedules a bar ('+n1+' notes)');
musicTick();ok(notes===n1,'nothing extra while the next bar is far enough ahead');
AC.currentTime=10+BAR;musicTick();ok(notes>n1,'next bar scheduled as time passes');
M.mute=true;const n2=notes;AC.currentTime+=BAR*2;musicTick();ok(notes===n2&&music.next===0,'muted: no music scheduled');M.mute=false;
M.music=false;AC.currentTime+=BAR*2;musicTick();ok(notes===n2,'music off: none scheduled');M.music=true;
AC=null;MB=null;
done();
