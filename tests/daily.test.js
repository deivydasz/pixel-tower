// Daily run: unlock, screen, fresh tower + twist, seeded spawns, rewards paid as today's best improves, streak, day change, saves.
skipTips();
const zdCard=()=>$('hdl');
M.best=DAILY.w-1;showHome();ok(!zdCard()&&[...document.querySelectorAll('#hlk .lk')][1].textContent==='Daily runWave '+DAILY.w,'Daily run locked until wave '+DAILY.w);
M.best=50;M.lv.dmg=10;M.lv.hp=10;M.res.depth=5;M.res.spray=3;M.cert=70;M.claim=70;M.skin={e:1,t:1,b:1};M.chips=0;showHome();
const zdMod=DAILY_MODS[dailyModIx(today())];
ok(zdCard()&&!zdCard().disabled&&zdCard().textContent.includes('New today!')&&zdCard().textContent.includes(zdMod.n),'card open: New today! and the twist ('+zdMod.n+')');
click(zdCard());ok(shown($('dy'))&&!shown($('home'))&&$('dyt').textContent.includes(zdMod.n)&&$('dyt').textContent.includes('New twist in'),'Daily screen shows today\'s twist and the countdown');
ok($('dyr').textContent.includes('up to '+dailyChips(DAILY.top,1)+' chips for beating the wave '+BOSS.first+' boss'),'screen shows the reward: '+$('dyr').textContent);
// fresh tower: Foundry, research and skin bonuses off (use a twist without stat changes)
TEST.twist=5;click($('dyp'));
ok(S.daily&&S.daily.n==='Blast party'&&!shown($('dy'))&&S.bt1==='DAILY RUN'&&S.bt==='Blast party','Play starts the daily run with a banner');
ok(stat.dmg()===1&&stat.max()===20&&S.hp===20&&RL('spray')===0&&critChance()===0,'fresh tower: Foundry, research and skins do not count');
ok(Math.abs(novaCd()-NOVA.cd/3)<1e-9,'Blast party: Blast recharges 3x faster');
ui();ok($('bw').textContent==='Daily','HUD says Daily');
ok(shown($('tip'))&&$('tip').className==='toast dl'&&$('tip').textContent.includes('Blast recharges 3x faster')&&!S.pause,'a toast explains the twist without pausing');
step(4.5);ok(!shown($('tip')),'twist toast goes away by itself');
dailyToast();setPause(true);ok(!shown($('tip')),'pausing hides the twist toast');ui();ok(shown($('pz'))&&$('pzd').textContent==='Daily run · Blast party: Blast recharges 3x faster','pause panel shows the twist');S.pause=false;ui();
// no chips or certificate at a wave clear
const zdC0=M.chips;S.wave=9;S.left=0;S.en=[];S.paid=false;S.gap=9;step(.05);
ok(M.chips===zdC0&&S.bt==='+'+Math.round(5+9*2)+' px','wave clear pays pixels only');
S.wave=10;S.paid=false;M.cert=0;M.claim=0;step(.05);ok(M.cert===0,'no certificate in daily runs');M.cert=70;M.claim=70;
S.wave=12;die();
ok(M.best===50,'daily run never changes the best wave');
ok(M.daily.best===12&&M.daily.streak===1&&M.daily.last===today()&&M.chips===dailyChips(12,1)&&S.dpay===dailyChips(12,1),'pays chips for wave 12: '+S.dpay);
const zdEv=trackLog.filter(e=>e.type==='daily').pop();ok(zdEv&&zdEv.data.w===12&&zdEv.data.x==='Blast party'&&zdEv.data.c===S.dpay&&!trackLog.some(e=>e.type==='run'&&e.data.w===12),'sends a daily stats event, not a run');
ok(M.hist[0].dl===1&&M.hist[0].w===12&&M.hist[0].c===S.dpay,'saved to History as a daily run');
ok(shown($('go'))&&$('goh').textContent==='Daily run over'&&$('gor').textContent==='Try again'&&!shown($('goal'))&&$('gnm').textContent.includes('+'+S.dpay+' chips'),'game over shows the daily result');
ok(!shown($('gnew')),'no "Unlocked this run" card');
// retry: lower wave pays nothing, higher wave pays the difference
click($('gor'));ok(S.daily&&S.wave===0,'Try again starts another daily run');S.wave=8;die();
ok(S.dpay===0&&M.chips===dailyChips(12,1)&&M.daily.best===12,'worse retry pays nothing');
click($('gor'));S.wave=DAILY.top+5;ui();ok($('bw').textContent==='Daily best!','HUD flags beating today\'s best');die();
ok(M.chips===dailyChips(DAILY.top,1)&&M.daily.top===DAILY.top+5&&$('goh').textContent==='Daily best!','better retry tops up to the full reward (capped at wave '+DAILY.top+')');
// home card after playing
click($('gom'));ok(zdCard().textContent.includes('Done: wave '+(DAILY.top+5)),'card shows today\'s best, done once the full reward is earned');
click(zdCard());ok($('dyr').textContent.includes('(full reward)')&&$('dyp').textContent==='Try again','screen says the full reward is earned');click($('dyc'));
// next day: streak grows, best resets
// normal game over offers today's daily run until it is played
play();die();ok(!shown($('gdl')),'no daily shortcut once played today');click($('gom'));
const zdNow=clock.now;clock.now=()=>zdNow()+864e5;play();die();
ok(shown($('gdl'))&&$('gdl').textContent==='Daily run ready: '+DAILY_MODS[dailyModIx(today())].n,'normal game over offers the new daily run');
click($('gdl'));ok(shown($('dy'))&&!shown($('go')),'shortcut opens the Daily screen');click($('dyc'));
// the open Daily screen rolls over at midnight
clock.now=zdNow;showDaily();const zdOld=$('dyt').textContent;clock.now=()=>zdNow()+864e5;ui();
ok($('dyt').textContent!==zdOld||DAILY_MODS[dailyModIx(today())].n===DAILY_MODS[dailyModIx(today()-1)].n,'open Daily screen updates after midnight');click($('dyc'));
ok(M.daily.best===0&&zdCard().textContent.includes('New today!'),'a new day resets today\'s best');
M.chips=0;click(zdCard());ok($('dyr').textContent.includes('Streak: 1 day (+10% chips)'),'screen shows the streak bonus: '+$('dyr').textContent);
click($('dyp'));S.wave=10;die();ok(M.daily.streak===2&&S.dpay===dailyChips(10,2)&&dailyChips(10,2)===Math.round(dailyFull()*10/DAILY.top*1.1),'day 2 of a streak: +10%');
clock.now=()=>zdNow()+3*864e5;ok(streakNow()===0&&streakNext()===1,'missing a day breaks the streak');
M.daily.streak=9;M.daily.last=today()-1;ok(streakMul(streakNext())===1+DAILY.streak*DAILY.streakMax,'streak bonus capped at +'+100*DAILY.streak*DAILY.streakMax+'%');
clock.now=zdNow;
// the normal run afterwards uses the whole Foundry again
click($('gom'));play();ok(!S.daily&&stat.dmg()>1&&RL('spray')===3,'normal run: Foundry and research back');ui();ok($('bw').textContent===''&&$('bw').className==='','HUD back to normal');
// twists
const zdT=i=>{TEST.twist=i+1;reset(true);return S};
zdT(0);ok(stat.dmg()===2&&stat.max()===10,'Glass cannon: x2 damage, half HP');
zdT(1);startWave();ok(S.left===2*(4+2),'Swarm: twice the enemies');
zdT(2);S.wave=1;spawn();ok(S.en[0].t===TYPES[0]||S.en[0].t===TYPES[1],'Rush hour: Runners can spawn on wave 1');
zdT(3);ok(RL('spray')===2,'Spray day: three bullets');
zdT(5);ok(cost('dmg')===Math.round(UP.dmg.base*.6),'Bargain bin: cheaper upgrades');
zdT(6);ok(Math.abs(critChance()-.2)<1e-9,'Lucky bits: 20% crits');
TEST.twist=0;
// same spawns for everyone today, different tomorrow
const zdSp=()=>{reset(true);S.wave=6;const o=[];for(let i=0;i<6;i++){spawn();const e=S.en[S.en.length-1];o.push(e.t.n+Math.round(e.x)+','+Math.round(e.y))}return o.join(' ')};
const zdA=zdSp(),zdB=zdSp();clock.now=()=>zdNow()+864e5;const zdC=zdSp();clock.now=zdNow;
ok(zdA===zdB&&zdA!==zdC,'daily spawns are seeded by the date');
// twist order: each block shows every twist once, never twice in a row
const zdL=DAILY_MODS.length,zdD0=today(),zdIx=[...Array(zdL*12)].map((_,i)=>dailyModIx(zdD0+i));
ok(zdIx.every((v,i)=>i===0||v!==zdIx[i-1]),'no twist two days in a row');
ok([0,1,2].every(b=>{const st=Math.floor((zdD0+zdL)/zdL)*zdL+b*zdL-zdD0;return new Set(zdIx.slice(st,st+zdL)).size===zdL}),'every twist once per '+zdL+' days');
// saves
loadMeta({v:13,chips:5,lv:{},best:30});ok(M.daily&&M.daily.best===0&&M.daily.streak===0&&M.daily.top===0,'v13 saves get an empty daily record');
loadMeta({v:14,chips:5,lv:{},best:30,daily:{d:5,best:7,paid:9,streak:2,last:5,top:11,np:4}});ok(JSON.stringify(M.daily)==='{"d":5,"best":7,"paid":9,"streak":2,"last":5,"top":11,"np":4}','daily record survives a reload');
loadMeta({v:14,chips:5,lv:{},best:30,daily:{best:-3,streak:'x'}});ok(M.daily.best===0&&M.daily.streak===0,'junk daily values cleaned');
// history marks daily runs and leaves them out of the average
loadMeta({v:14,chips:5,lv:{},best:30,hist:[{t:Date.now(),w:10,k:'Grunt',c:3,d:60,n:0,dl:1},{t:Date.now(),w:30,k:'Tank',c:3,d:60,n:0}]});showHistory();
ok($('his').textContent.includes('2 runs (1 daily)')&&$('his').textContent.includes('average 30')&&$('hil').querySelector('.hr.dl small').textContent==='Daily','History marks daily runs: '+$('his').textContent);
done();
