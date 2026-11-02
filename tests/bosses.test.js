// Bosses: schedule, rotation, rewards, escapes, Warden shield, Queen spawns, UI, saves.
ok([19,20,21,40,50,60,80,90,100,105,110,120].map(isBossWave).join()==='false,true,false,true,false,true,true,false,true,false,true,true','boss waves: 20/40/60/80, then every 10 from 100');
ok([20,40,60,80,100,110].map(w=>bossFor(w).n).join()==='Brute,Swarm Queen,Warden,Brute,Swarm Queen,Warden','boss types rotate');
M.tips={start:1,buy:1,nova:1,foundry:1};play();
S.wave=19;S.left=0;S.en=[];S.gap=0;S.paid=true;step(.05);
ok(S.wave===20&&S.boss&&S.bt1==='BOSS WAVE','wave 20 announced as boss wave');
step(.1);let b=S.en.find(e=>e.boss);
ok(b&&b.t.n==='Brute'&&b.hp===bossHp(b.t,20)&&b.max===b.hp,'Brute spawns first with HP '+(b&&b.hp));
ok(S.tip==='boss'&&S.pause,'first boss shows boss tip');click($('tipok'));
ui();ok(shown($('bb'))&&$('bbt').textContent.startsWith('BRUTE')&&$('stage').classList.contains('bossup'),'boss HP bar shown, legend moved down');
// Blast on a boss inside range: pushed only part of the way to the edge
S.nova=0;b.x=CX+20;b.y=CY;const sp0=b.t;b.t={...b.t,sp:0};nova();step(NOVA.kb+.05);const d1=Math.hypot(b.x-CX,b.y-CY);b.t=sp0;
ok(Math.abs(d1-(20+(stat.range()-20)*BOSS.push))<.5,'Blast pushes bosses only '+BOSS.push*100+'% of the way to the range edge');
// kill it
const c0=M.chips,k0=M.cores;b.hp=1;b.x=CX+20;b.y=CY;S.pr=[{x:CX+20,y:CY,vx:0,vy:0,life:1}];step(.02);
ok(!S.en.includes(b)&&M.cores===k0+1&&M.bk===1&&M.chips===c0+bossChips(20)&&S.bosses===1,'killing the boss gives a core and '+bossChips(20)+' chips');
ok(S.bt1==='BOSS DOWN!'&&JSON.parse(localStorage.getItem('pixelTowerMeta')).cores===k0+1,'BOSS DOWN banner, core saved');
ui();ok(!shown($('bb')),'boss bar hidden after kill');
// only one boss per wave
step(3);ok(S.en.filter(e=>e.boss).length===0,'no second boss in the same wave');
// a boss reaching the tower stays and keeps hitting (no escapes)
S.en=[];S.left=99;S.sp=99;S.hp=1e6;S.lv.hp=0;const t=bossFor(80);const atk={x:CX+30,y:CY,t,hp:1e9,max:1e9,hit:0,boss:1,shd:0,st:99};S.en.push(atk);S.pr=[];S.cd=99;
const hp0=S.hp;step(8);
ok(S.en.includes(atk)&&Math.abs(Math.hypot(atk.x-CX,atk.y-CY)-(t.s/2+7))<.6,'boss stops at the tower instead of vanishing');
const hits=Math.round((hp0-S.hp)/Math.max(.2,t.d-stat.armor()));
ok(hits>=2&&S.killer===t,'boss keeps hitting the tower ('+hits+' hits)');
ok(S.bt1==='BOSS ATTACKS!','BOSS ATTACKS! banner when it reaches the tower');
const k1=M.cores;atk.hp=1;S.cd=0;step(.5);ok(!S.en.includes(atk)&&M.cores===k1+1,'killing it at the tower still gives the core');
// Warden shield
S.en=[];const wt=bossFor(60);const w={x:CX+30,y:CY,t:wt,hp:1000,max:1000,hit:0,boss:1,shd:0,st:0};S.en.push(w);
step(1/60);ok(S.tip==='warden'&&S.pause&&$('tip').textContent.includes('BLAST'),'first Warden shows shield tip (mentions BLAST)');click($('tipok'));ui();ok($('bbt').textContent==='WARDEN 1000 SHIELD','boss bar shows shield up: '+$('bbt').textContent);w.hp=1000;
S.pr=[{x:w.x,y:w.y,vx:0,vy:0,life:1}];step(1/60);
ok(Math.abs(1000-w.hp-stat.dmg()*wt.shield)<.01,'Warden shield cuts bullet damage to '+wt.shield*100+'%');
S.nova=0;const h1=w.hp;nova();ok(w.shd===BOSS.shieldDown&&w.hp===h1-novaDmg(),'Nova breaks the shield for '+BOSS.shieldDown+'s');
const h2=w.hp;S.pr=[{x:w.x,y:w.y,vx:0,vy:0,life:1}];step(1/60);ok(Math.abs(h2-w.hp-stat.dmg())<.01,'full damage while shield is down');
ui();ok($('bbt').textContent.endsWith('EXPOSED'),'boss bar shows shield is down');
// Swarm Queen spawns runners
S.en=[];const qt=bossFor(40);const q={x:CX+100,y:CY,t:qt,hp:1e6,max:1e6,hit:0,boss:1,shd:0,st:qt.spawn};S.en.push(q);
step(qt.spawn+.05);ok(S.en.some(e=>e.t===TYPES[1]),'Swarm Queen spawns a Runner every '+qt.spawn+'s');
// history and saves
S.en=[];die();ok(M.hist[0].b===2,'history records bosses beaten this run');
loadMeta({v:3,chips:2,lv:{},best:30,hist:[]});ok(M.cores===0&&M.bk===0&&M.v===SAVE_V,'v3 save loads with 0 cores');
done();
