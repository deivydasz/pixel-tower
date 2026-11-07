// Bit Theory: unlock, costs, one study at a time, real-time completion, effects, saves.
skipTips();let T=1e12;clock.now=()=>T;
showHome();ok($('hbt').disabled&&$('hbtn').textContent==='Finish a run'&&$('hbt').querySelector('svg'),'locked until the first run is finished');
M.cores=3;M.bk=1;M.chips=1000;showHome();
ok(!$('hbt').disabled&&$('hbtn').textContent==='Ready to study','unlocked after a boss, says Ready to study');
const btn=k=>$('btl').querySelector('[data-k="'+k+'"]'),btn_=btn;
click($('hbt'));ok(shown($('bt'))&&!shown($('home')),'opens Bit Theory screen');
ok(!btn_('crit').disabled&&!btn_('pierce').disabled,'Critical and Piercing bits open right away');
ok(btn_('spray').classList.contains('lkd')&&btn_('spray').textContent.includes('Piercing bits Lv 2 (0/2)')&&btn_('spray').textContent.includes('3 bosses beaten (1/3)'),'Spray and Pray locked, shows its requirements with progress');
ok(btn_('nova').textContent.includes('Best wave 35 (0/35)')&&btn_('depth').textContent.includes('Critical bits Lv 3 (0/3)')&&btn_('depth').textContent.includes('5 bosses beaten (1/5)'),'Nova tech and Bit depth show requirements');
ok(btn_('spray').querySelector('small.met')===null&&!resCanAfford('spray')&&!startResearch('spray'),'locked research cannot be started');
M.bk=2;M.best=40;click($('btc'));click($('hbt'));ok(!btn_('nova').classList.contains('lkd')&&!btn_('nova').disabled&&btn_('nova').textContent.includes(RES_FIRST+' chips'),'Blast tech opens at best wave 35 + 2 bosses (shows cost)');
M.bk=1;M.best=0;click($('btc'));click($('hbt'));
ok($('btl').querySelectorAll('button').length===BIT_KEYS.length&&!shown($('btq')),'lists all researches, nothing running');
ok(btn('crit').textContent.includes('Lv 0/10')&&btn('crit').lastChild.textContent==='0% crit > 10% crit · Free · 15m 00s'&&btn('crit').textContent.includes('0% crit > 10% crit'),'first Critical bits study is free and gives 10%: '+btn('crit').lastChild.textContent);
ok(btn('pierce').lastChild.textContent==='pierce 0 > pierce 1 · 10 chips · 10m 00s','other level 1 studies cost 10 chips, no cores');
// start a study
click(btn('crit'));
ok(M.rq&&M.rq.k==='crit'&&M.cores===3&&M.chips===1000&&M.rq.end===T+15*60000,'starting deducts cost and sets a 15 min timer');
ui();ok(shown($('btq'))&&$('btqt').textContent==='Studying Critical bits Lv 1 · 15m 00s left','progress card shows time left');
ok([...$('btl').querySelectorAll('button')].every(b=>b.disabled),'only one study at a time');
ok(!startResearch('pierce'),'startResearch refuses while busy');
T+=5*60000;ui();ok($('btqt').textContent.endsWith('10m 00s left')&&Math.abs(parseFloat($('btqb').style.width)-33.33)<.1,'timer and bar advance with real time');
JSON.parse(localStorage.getItem('pixelTowerMeta')).rq.k==='crit'?ok(true,'running study is saved'):ok(false,'running study is saved');
// completes while away (time jumps), applied on next check
T+=11*60000;ui();ok(M.res.crit===1&&!M.rq,'study completes after its time, level applied');
ok(btn('crit').textContent.includes('Lv 1/10')&&!btn('crit').disabled,'screen refreshes after completion');
// effects
ok(Math.abs(critChance()-.1)<1e-9&&btn('crit').textContent.includes('10% crit > 15% crit'),'Critical bits Lv1 = 10% crit chance, then +5%');
M.res.depth=2;ok(Math.abs(stat.dmg()/((1+S.lv.dmg+.5*M.lv.dmg))-1.44)<1e-9,'Bit depth Lv2 = x1.44 damage');
M.res.nova=4;ok(novaCd()===60,'Nova tech Lv4 = 60s cooldown');M.res.nova=0;M.res.depth=0;
// spray + pierce + crit in combat
click($('btc'));play();S.en=[];S.left=99;S.sp=99;M.res.spray=2;M.res.pierce=1;M.res.crit=10;
const a=enemy(30,0,0,99),b=enemy(40,0,0,99);S.cd=0;const rnd=Math.random;Math.random=()=>0;step(1/60);Math.random=rnd;
ok(S.pr.length===3,'Spray and Pray Lv2 fires 3 bullets');
const ang=p=>Math.atan2(p.vy,p.vx),aim=Math.atan2(a.y-CY,a.x-CX),angs=S.pr.map(ang).sort((x,y)=>x-y);
ok(Math.abs(ang(S.pr[0])-aim)<1e-9,'first bullet flies straight at the target');
ok(Math.abs(angs[1]-aim)<1e-9&&angs[0]<aim&&angs[2]>aim,'3 bullets: the middle one is on target, one each side');
ok(S.pr.every(p=>p.crit),'a roll under the crit chance makes a crit bullet');
ok(Math.abs(critChance()-.55)<1e-9,'Critical bits Lv10 = 55% chance');
const dmg0=stat.dmg();step(.35);
ok(a.hp<99&&b.hp<99,'piercing bullet hits two enemies in a line');
ok(Math.abs((99-a.hp)%(dmg0*3))<1e-6,'crit bullets deal x3 damage');
// 2 bullets: one on target, one beside it (never two straddling a small enemy)
S.pr=[];M.res.spray=1;S.cd=0;step(1/60);const a2=S.pr.map(ang),aim2=Math.atan2(S.target.y-CY,S.target.x-CX);
ok(S.pr.length===2&&a2.some(x=>Math.abs(x-aim2)<1e-9),'2 bullets: one is exactly on target');
S.pr=[];M.res.spray=4;S.cd=0;step(1/60);const a5=S.pr.map(ang).sort((x,y)=>x-y),aim5=Math.atan2(S.target.y-CY,S.target.x-CX);
ok(S.pr.length===5&&Math.abs(a5[2]-aim5)<1e-9,'5 bullets: the middle one is on target');
M.res={spray:0,pierce:0,crit:0,nova:0,depth:0};
// max level, saves, migration
M.rq=null;M.res.spray=BITS.spray.max;M.res.pierce=2;M.bk=5;M.cores=99;M.chips=1e6;showHome();click($('hbt'));
ok(btn('spray').disabled&&btn('spray').textContent.includes('Fully studied'),'max level cannot be studied further');
loadMeta({v:4,chips:5,lv:{},cores:2,bk:1});ok(M.v===SAVE_V&&M.res.depth===0&&M.rq===null&&M.cores===2,'v4 save loads with no research');
loadMeta({v:5,chips:5,lv:{},res:{crit:99,depth:-3},rq:{k:'hack',end:5}});ok(M.res.crit===10&&M.res.depth===0&&M.rq===null,'bad research data is clamped and ignored');
ok(fmtDur(3725)==='1h 2m'&&fmtDur(65)==='1m 05s'&&fmtDur(9)==='9s','duration format');
done();
