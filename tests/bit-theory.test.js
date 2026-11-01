// Bit Theory: unlock, costs, one study at a time, real-time completion, effects, saves.
skipTips();let T=1e12;clock.now=()=>T;
showHome();ok($('hbt').disabled&&$('hbtn').textContent==='Beat a boss'&&$('hbt').querySelector('svg'),'locked until a boss is beaten');
M.cores=3;M.bk=1;M.chips=1000;showHome();
ok(!$('hbt').disabled&&$('hbtn').textContent==='Ready to study','unlocked after a boss, says Ready to study');
click($('hbt'));ok(shown($('bt'))&&!shown($('home')),'opens Bit Theory screen');
const btn=k=>$('btl').querySelector('[data-k="'+k+'"]');
ok($('btl').querySelectorAll('button').length===BIT_KEYS.length&&!shown($('btq')),'lists all researches, nothing running');
ok(btn('crit').textContent.includes('1 core · 25 chips · 15m 00s'),'shows cost and time: '+btn('crit').lastChild.textContent);
// start a study
click(btn('crit'));
ok(M.rq&&M.rq.k==='crit'&&M.cores===2&&M.chips===975&&M.rq.end===T+15*60000,'starting deducts cost and sets a 15 min timer');
ui();ok(shown($('btq'))&&$('btqt').textContent==='Studying Critical bits Lv 1 · 15m 00s left','progress card shows time left');
ok([...$('btl').querySelectorAll('button')].every(b=>b.disabled),'only one study at a time');
ok(!startResearch('spray'),'startResearch refuses while busy');
T+=5*60000;ui();ok($('btqt').textContent.endsWith('10m 00s left')&&Math.abs(parseFloat($('btqb').style.width)-33.33)<.1,'timer and bar advance with real time');
JSON.parse(localStorage.getItem('pixelTowerMeta')).rq.k==='crit'?ok(true,'running study is saved'):ok(false,'running study is saved');
// completes while away (time jumps), applied on next check
T+=11*60000;ui();ok(M.res.crit===1&&!M.rq,'study completes after its time, level applied');
ok(btn('crit').textContent.includes('Lv 1/10')&&!btn('crit').disabled,'screen refreshes after completion');
// effects
ok(Math.abs(critChance()-.05)<1e-9,'Critical bits Lv1 = 5% crit chance');
M.res.depth=2;ok(Math.abs(stat.dmg()/((1+S.lv.dmg+.5*M.lv.dmg))-1.44)<1e-9,'Bit depth Lv2 = x1.44 damage');
M.res.nova=4;ok(novaCd()===60,'Nova tech Lv4 = 60s cooldown');M.res.nova=0;M.res.depth=0;
// spray + pierce + crit in combat
click($('btc'));play();S.en=[];S.left=99;S.sp=99;M.res.spray=2;M.res.pierce=1;M.res.crit=10;
const a=enemy(30,0,0,99),b=enemy(40,0,0,99);S.cd=0;const rnd=Math.random;Math.random=()=>0;step(1/60);Math.random=rnd;
ok(S.pr.length===3,'Spray and Pray Lv2 fires 3 bullets');
ok(S.pr.every(p=>p.crit),'a roll under the crit chance makes a crit bullet');
ok(Math.abs(critChance()-.5)<1e-9,'Critical bits Lv10 = 50% chance');
const dmg0=stat.dmg();step(.35);
ok(a.hp<99&&b.hp<99,'piercing bullet hits two enemies in a line');
ok(Math.abs((99-a.hp)%(dmg0*3))<1e-6,'crit bullets deal x3 damage');
M.res={spray:0,pierce:0,crit:0,nova:0,depth:0};
// max level, saves, migration
M.rq=null;M.res.spray=BITS.spray.max;M.cores=99;M.chips=1e6;showHome();click($('hbt'));
ok(btn('spray').disabled&&btn('spray').textContent.includes('Fully studied'),'max level cannot be studied further');
loadMeta({v:4,chips:5,lv:{},cores:2,bk:1});ok(M.v===SAVE_V&&M.res.depth===0&&M.rq===null&&M.cores===2,'v4 save loads with no research');
loadMeta({v:5,chips:5,lv:{},res:{crit:99,depth:-3},rq:{k:'hack',end:5}});ok(M.res.crit===10&&M.res.depth===0&&M.rq===null,'bad research data is clamped and ignored');
ok(fmtDur(3725)==='1h 2m'&&fmtDur(65)==='1m 05s'&&fmtDur(9)==='9s','duration format');
done();
