const rnd0=Math.random;
// The cat lives inside the game screen: peeks from the side edges, walks (and sits) along the bottom,
// every 15-30s. Tap = a cat word + hearts (10% +5 HP, else 30% +1 HP); taps never fire Blast. Never pauses the game.
skipTips();M.best=30;play();step(1);S.en=[];S.left=99;S.sp=99;
const tickTo=t=>{while(cat.kind&&cat.t<t)catTick(.05);draw()};
ok(!cat.kind,'no cat at the start of a run');
catStart('peek');cat.dir=1;tickTo(1.5);let b=cat.box;
ok(b&&b.x<0&&b.x+b.w>0&&b.x+b.w<=b.w*0.85,'peek: cat partly in from the left edge of the game screen');
catStart('peek');cat.dir=-1;tickTo(1.5);b=cat.box;ok(b&&b.x<W&&b.x+b.w>W,'peek: or from the right edge');
ok(!S.pause&&!S.over,'cat never pauses the game');
ok(catPeekBlink(1.35)&&catPeekBlink(2.65)&&!catPeekBlink(2),'peek: blinks twice while fully in view');
tickTo(99);ok(!cat.kind&&cat.next>=15&&cat.next<=30,'visit ends, next one in 15-30s ('+cat.next.toFixed(1)+'s)');
catStart('walk');cat.dir=1;cat.sit=true;tickTo(1);b=cat.box;ok(b&&Math.abs(b.y+b.h-(H-1))<=1,'walk: along the bottom edge of the game screen');
const x1=b.x;tickTo(2);ok(cat.box.x>x1,'walk: moves across');
tickTo(5.5);ok(cat.box.h===catH(CAT_SPR.sit[0]),'walk: sits down part way');
tickTo(99);ok(!cat.kind,'walk ends off screen');
catStart('peek');cat.dir=1;tickTo(1.5);b=cat.box;
const kinds=new Set();for(let i=0;i<40;i++){const c={...cat};cat.kind=null;cat.next=0;catTick(.01);kinds.add(cat.kind);Object.assign(cat,c)}ok([...kinds].sort().join()==='peek,walk','only peek and walk visits (no hanging)');
// tap on the cat meows, shows hearts, and does not fire Blast
S.nova=0;const r=cv.getBoundingClientRect(),sx=r.width/W;
cv.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.left+(b.x+b.w/2)*sx,clientY:r.top+(b.y+b.h/2)*sx}));
ok(cat.meow===1&&S.nova===0&&CAT_WORDS.some(w=>w[0]===cat.say),'tap on the cat: it answers ('+cat.say+'), no Blast');
catTick(.3);ok(cat.hearts.length>=4,'hearts float up');
const calls=[];const ft=g.fillText.bind(g);g.fillText=(t,x,y)=>{calls.push(t);ft(t,x,y)};draw();g.fillText=ft;ok(calls.includes(cat.say),'speech bubble drawn ('+cat.say+')');
tickTo(99);ok(!cat.kind,'cat leaves after the meow');
// a tap elsewhere does nothing (Blast is button-only)
S.nova=0;cv.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.left+CX*sx,clientY:r.top+CY*sx}));ok(S.nova===0,'tap away from the cat does not fire Blast');
// 30% chance to heal 1 HP: roll under the chance heals, over does not, full HP never overheals
const heal=(roll,hp)=>{catStart('peek');cat.dir=1;tickTo(1.5);S.hp=hp;S.ft=[];Math.random=()=>roll;catTap();Math.random=rnd0;return S.hp};
ok(heal(.1,5)===6&&S.ft.some(f=>f.t==='+1 HP'),'lucky tap (30%): +1 HP with a +1 HP label');
const lab=S.ft.find(f=>f.t==='+1 HP'),cb=cat.box;ok(lab&&Math.abs(lab.x-Math.min(W-22,Math.max(22,cb.x+cb.w/2)))<1&&lab.y<cb.y,'+1 HP pops up from the cat, not the tower');
ok(heal(.5,5)===5&&!S.ft.some(f=>f.t==='+1 HP'),'unlucky tap: just a meow');
ok(heal(.1,stat.max())===stat.max(),'no overheal at full HP');catEnd();
ok(heal(.05,5)===10&&S.ft.some(f=>f.t==='+5 HP'&&f.big)&&cat.hearts.length>=8,'lucky tap (10%): +5 HP in gold with extra hearts');catEnd();
ok(heal(.05,stat.max()-2)===stat.max(),'+5 HP never overheals');catEnd();
ok(heal(.39,5)===6&&heal(.41,5)===5,'chances: under 10% big, 10-40% small, rest nothing');catEnd();
// tapping a walking cat: it stops and sits where it is (no jump), then walks on
catStart('walk');cat.dir=1;cat.sit=false;while(cat.t<2)catTick(.05);draw();const bx=cat.box.x;catTap();catTick(.5);draw();
ok(Math.abs(cat.box.x-bx)<=(catW(CAT_SPR.walk[0])-catW(CAT_SPR.sit[0]))/2+1&&cat.box.h===catH(CAT_SPR.sit[0]),'tapped walking cat sits where it is (no teleport)');
catTick(1.3);catTick(.5);draw();ok(cat.kind==='walk'&&cat.box.x>bx,'then walks on');catEnd();
// words: weighted variety, all from the list
const said=new Set();for(let i=0;i<300;i++)said.add(catWord()[0]);ok(said.size===CAT_WORDS.length,'all cat words get used ('+[...said].join(' ')+')');
// idle talk: a sitting cat sometimes yawns or purrs by itself, a peeking one asks Mrrp?
catStart('walk');cat.dir=1;cat.sit=true;cat.idle='*yawn*';cat.meow=0;while(cat.t<5)catTick(.05);const c2=[];g.fillText=(t,x,y)=>{c2.push(t);ft(t,x,y)};draw();g.fillText=ft;
ok(c2.includes('*yawn*'),'sitting cat yawns by itself');catEnd();
catStart('peek');cat.dir=1;cat.idle='Mrrp?';while(cat.t<.5)catTick(.05);const c3=[];g.fillText=(t,x,y)=>{c3.push(t);ft(t,x,y)};draw();g.fillText=ft;
ok(!c3.includes('Mrrp?'),'peeking cat waits until it is in view');while(cat.t<1.5)catTick(.05);const c4=[];g.fillText=(t,x,y)=>{c4.push(t);ft(t,x,y)};draw();g.fillText=ft;ok(c4.includes('Mrrp?'),'then asks Mrrp?');catEnd();
// visits come by themselves during play, not on menus
catEnd();cat.next=.1;catTick(.2);ok(!!cat.kind,'cat appears by itself during a run');catEnd();
showHome();cat.next=.1;catTick(.2);ok(!cat.kind,'no cat visits while on the menu');
ok(!document.getElementById('cat'),'no separate cat element: drawn inside the game screen');
done();
