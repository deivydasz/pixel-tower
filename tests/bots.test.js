// Drivers (code: bots): unlock, packets from Daily runs, building, Size and Power upgrades, the three drivers in runs (Cache, Lag, Debug), saves.
const zbM=(c,l,d)=>{const f=x=>Array.isArray(x)?{s:x[0],p:x[1]}:{s:x,p:x};return {cache:f(c),lag:f(l),debug:f(d)}};
skipTips();
const zbTile=()=>$('hrb'),zbL=()=>[...$('rbl').querySelectorAll('button')],zbCard=k=>$('rbl').querySelector('.dc[data-k="'+k+'"]'),zbBtn=(k,t)=>zbCard(k).querySelector('button[data-t="'+t+'"]');
M.best=DAILY.w-1;showHome();ok(!zbTile()&&[...document.querySelectorAll('#hlk .lk')][2].textContent==='DriversWave '+DAILY.w,'Drivers locked until wave '+DAILY.w);
M.best=40;M.nib=0;showHome();ok(zbTile()&&zbTile().textContent==='Drivers0 packetsFrom Daily runs','menu tile says where packets come from');
click(zbTile());ok(shown($('rb'))&&!shown($('home'))&&zbL().length===3&&zbL().every(b=>b.disabled),'Drivers screen: three drivers to build, nothing affordable');
ok([...$('rbl').querySelectorAll('.dh b span:first-child')].map(b=>b.textContent).join()==='Cache Driver,Lag Driver,Debug Driver'&&zbL()[0].textContent.includes('Build: Size 1, Power 1')&&zbL()[0].textContent.includes(BOT.build+' packets'),'names and build cost');
click($('rbc'));ok(shown($('home')),'Back returns to the menu');
// packets from Daily runs: paid as today's best improves, more past the boss, streak bonus
ok(dailyNibs(DAILY.top,1)===BOT.nib&&dailyNibs(Math.round(DAILY.top/2),1)===Math.round(BOT.nib*Math.round(DAILY.top/2)/DAILY.top)&&dailyNibs(DAILY.top+2*BOT.nibPer,1)===BOT.nib+2,'packet reward: '+BOT.nib+' for the boss, +1 per '+BOT.nibPer+' waves after');
ok(dailyNibs(DAILY.top,3)===Math.round(BOT.nib*streakMul(3)),'streak bonus counts for packets');
click(zbTile());click($('rbc'));showDaily();click($('dyp'));ok(S.daily&&S.bots.length===0,'Daily runs have no bots');
S.wave=8;die();const zbN1=M.nib;ok(zbN1===dailyNibs(8,1)&&S.dnib===zbN1&&$('gnm').textContent.includes('+'+zbN1+' packet'),'daily run pays packets: '+$('gnm').textContent);
ok(trackLog.filter(e=>e.type==='daily').pop().data.nb===zbN1,'daily stats event includes packets');
click($('gor'));S.wave=5;die();ok(M.nib===zbN1&&S.dnib===0,'a worse retry pays no packets');
click($('gor'));S.wave=DAILY.top+BOT.nibPer;die();ok(M.nib===dailyNibs(DAILY.top+BOT.nibPer,1)&&M.daily.np===M.nib,'a better retry tops up: '+M.nib);
ok(shown($('grb'))&&$('grb').textContent.includes('upgrade ready')&&!shown($('gdl')),'daily game over: Drivers shortcut when a bot can be built');
click($('grb'));ok(shown($('rb'))&&!shown($('go')),'shortcut opens the Drivers screen');click($('rbc'));
// build and upgrade
showHome();ok(zbTile().textContent.includes('Upgrade ready!'),'menu tile says Upgrade ready!');
click(zbTile());const zbNib=M.nib;click(zbBtn('lag','s'));
ok(M.bots.lag.s===1&&M.bots.lag.p===1&&M.nib===zbNib-BOT.build&&zbCard('lag').textContent.includes('S1 P1')&&zbBtn('lag','s')&&zbBtn('lag','p'),'building the Lag Driver costs '+BOT.build+' packets; then Size and Power buttons');
ok(trackLog.filter(e=>e.type==='bot').pop().data.t==='b','build stats event sent');
M.nib=50;showBots();click(zbBtn('lag','p'));ok(M.bots.lag.p===2&&M.bots.lag.s===1&&M.nib===50-BOT.cost(1),'Power upgrades on its own ('+BOT.cost(1)+' packets)');
click(zbBtn('lag','s'));ok(M.bots.lag.s===2&&M.bots.lag.p===2,'Size upgrades on its own');
M.nib=0;showBots();click(zbBtn('lag','p'));ok(M.bots.lag.p===2&&zbBtn('lag','p').disabled,'no upgrade without packets');
M.nib=1e4;M.bots.lag.s=BOT.max-1;showBots();click(zbBtn('lag','s'));ok(M.bots.lag.s===BOT.max&&zbBtn('lag','s').disabled&&zbBtn('lag','s').textContent.includes('Max level'),'max level '+BOT.max);
click($('rbc'));
// in a normal run
M.bots=zbM([3,1],[5,2],[2,4]);play();ok(S.bots.map(b=>b.k+b.s+b.p).join()==='cache31,lag52,debug24','normal run: all built drivers fly with the tower');
M.bots=zbM(0,2,0);M.tips.bots=0;play();ok(S.bots.length===1&&S.bots[0].k==='lag','only built bots');
step(2.5);ok(M.tips.bots&&shown($('tip'))&&$('tip').textContent.includes('Drivers are flying')&&!S.pause,'a one-time toast introduces the bots');closeTip();S.toast=0;
// bots orbit the tower when there is nothing to do, and fly to a target
S.en=[];S.left=0;S.gap=99;step(3);const zbB=S.bots[0];ok(Math.abs(Math.hypot(zbB.x-CX,zbB.y-CY)-BOT.orbit)<2,'idle bots orbit the tower');
// Lag Bot: freezes enemies in its field
zbB.cd=99;const zbE=enemy(30,0,0,999);zbE.t=TYPES[0];zbB.x=zbE.x;zbB.y=zbE.y;zbB.cd=0;step(1/60);
ok(zbE.stun>0&&Math.abs(zbE.stun-BOTS.lag.v(2))<.05,'Lag Bot freezes an enemy in its field for '+fmt(BOTS.lag.v(2))+'s');
ok(Math.abs(zbB.cd-BOTS.lag.cd(2))<.05,'then recharges for '+fmt(BOTS.lag.cd(2))+'s');
const zbX=zbE.x;step(.4);ok(zbE.x===zbX,'a frozen enemy does not move');
step(BOTS.lag.v(2));ok(!(zbE.stun>0)&&zbE.x<zbX,'it moves again when the lag passes');
S.en=[];zbB.cd=0;S.wave=BOSS.first;const zbBo={x:CX+30,y:CY,t:BOSSES[0],hp:1e6,max:1e6,hit:0,boss:1,shd:0,st:0};S.en.push(zbBo);zbB.x=zbBo.x;zbB.y=zbBo.y;step(1/60);
ok(Math.abs(zbBo.stun-BOTS.lag.v(2)/2)<.05,'bosses freeze half as long');
// a frozen boss at the tower does not hit
zbBo.x=CX+zbBo.t.s/2+7;zbBo.y=CY;zbBo.stun=5;zbBo.at=1;zbBo.atk=0;S.hp=50;step(1);ok(S.hp===50,'a frozen boss does not hit the tower');
S.en=[];
// Debug Bot: more damage from shots in its field
M.bots=zbM(0,0,[1,4]);play();S.left=0;S.gap=99;S.lv.range=0;const zbD=S.bots[0];
const zbHit=(inside)=>{S.en=[];S.pr=[];const e=enemy(20,0,0,1e6);zbD.x=inside?e.x:CX-60;zbD.y=inside?e.y:CY+60;zbD.rt=99;zbD.tg=null;S.cd=0;
  for(let i=0;i<60&&e.hp===1e6;i++){update(1/60);if(!inside){zbD.x=CX-60;zbD.y=CY+60}}return 1e6-e.hp};
const zbOut=zbHit(false),zbIn=zbHit(true);
ok(Math.abs(zbIn/zbOut-(1+BOTS.debug.v(4)))<.02,'Debug Bot: +'+Math.round(100*BOTS.debug.v(4))+'% damage in its field ('+fmt(zbOut)+' > '+fmt(zbIn)+')');
// Cache Bot: more pixels from kills in its field
M.bots=zbM([1,6],0,0);play();S.left=0;S.gap=99;const zbC=S.bots[0];
const zbPx=inside=>{S.pt=[];const e=enemy(40,0,2,1);zbC.x=inside?e.x:CX-60;zbC.y=inside?e.y:CY+60;const r=Math.random;Math.random=()=>.999;kill(e);Math.random=r;S.en=[];return S.pt.length};
const zbP0=zbPx(false),zbP1=zbPx(true);
ok(zbP1===Math.floor(zbP0*(1+BOTS.cache.v(6))+1e-9)||zbP1===Math.floor(TYPES[2].px*(1+stat.magnet())*(1+skinB('e'))*(1+BOTS.cache.v(6))),'Cache Bot: more pixels from kills in its field ('+zbP0+' > '+zbP1+')');
// drawing with bots and frozen enemies
M.bots=zbM(1,1,1);play();enemy(25,0,0,50).stun=1;step(.5);draw();ok(S.bots.length===3,'draws bots, fields and frozen enemies');
setPause(true);ui();ok($('pzd').textContent==='Drivers: Cache (size 1, power 1), Lag (size 1, power 1), Debug (size 1, power 1)','pause panel lists the bots');setPause(false);
// bots stay on screen even when their target is outside it
S.en=[];const zbF=enemy(0,-200,2,1e6);zbF.t={...TYPES[2],sp:0};for(const b of S.bots){b.tg=zbF;b.rt=99}step(6);
ok(S.bots.every(b=>{const[x,y]=toScreen(b.x,b.y);return x>=0&&x<=W&&y>=0&&y<=H}),'bots stay on the screen');S.en=[];
// saves
loadMeta({v:14,chips:5,lv:{},best:30,daily:{d:5,best:7,paid:9,streak:2,last:5,top:11}});ok(M.v===SAVE_V&&M.nib===0&&JSON.stringify(M.bots)==='{"cache":{"s":0,"p":0},"lag":{"s":0,"p":0},"debug":{"s":0,"p":0}}'&&M.daily.np===0,'v14 saves: no packets, no bots');
loadMeta({v:15,chips:5,lv:{},best:30,nib:12,bots:{cache:{s:2,p:5},lag:{s:99,p:1},debug:{s:'x',p:3}}});ok(M.nib===12&&M.bots.cache.s===2&&M.bots.cache.p===5&&M.bots.lag.s===BOT.max&&M.bots.debug.s===0&&M.bots.debug.p===0,'v15 save loads; junk levels cleaned');
loadMeta({v:15,chips:5,lv:{},best:30,bots:{cache:3}});ok(M.bots.cache.s===3&&M.bots.cache.p===3,'early preview saves (one level per driver) become Size and Power');
// Size widens the field, Power strengthens the effect
M.bots=zbM([1,1],0,0);play();const zbS1=S.bots[0];M.bots=zbM([5,1],0,0);play();ok(BOT.field(S.bots[0].s)>BOT.field(zbS1.s)&&S.bots[0].p===1,'Size: bigger field ('+fmt(BOT.field(1))+' > '+fmt(BOT.field(5))+')');
done();
