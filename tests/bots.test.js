// Bitbots: unlock, nibbles from Daily runs, building/upgrading, the three bots in runs (Cache, Lag, Debug), saves.
skipTips();
const zbTile=()=>$('hrb'),zbL=()=>[...$('rbl').querySelectorAll('button')];
M.best=DAILY.w-1;showHome();ok(!zbTile()&&[...document.querySelectorAll('#hlk .lk')][2].textContent==='BitbotsWave '+DAILY.w,'Bitbots locked until wave '+DAILY.w);
M.best=40;M.nib=0;showHome();ok(zbTile()&&zbTile().textContent==='Bitbots0 nibblesFrom Daily runs','menu tile says where nibbles come from');
click(zbTile());ok(shown($('rb'))&&!shown($('home'))&&zbL().length===3&&zbL().every(b=>b.disabled),'Bitbots screen: three bots, nothing affordable');
ok(zbL().map(b=>b.querySelector('b span').textContent).join()==='Cache Bot,Lag Bot,Debug Bot'&&zbL()[0].textContent.includes('Build: '+BOT.cost(0)+' nibbles'),'names and build cost');
click($('rbc'));ok(shown($('home')),'Back returns to the menu');
// nibbles from Daily runs: paid as today's best improves, more past the boss, streak bonus
ok(dailyNibs(DAILY.top,1)===BOT.nib&&dailyNibs(Math.round(DAILY.top/2),1)===Math.round(BOT.nib*Math.round(DAILY.top/2)/DAILY.top)&&dailyNibs(DAILY.top+2*BOT.nibPer,1)===BOT.nib+2,'nibble reward: '+BOT.nib+' for the boss, +1 per '+BOT.nibPer+' waves after');
ok(dailyNibs(DAILY.top,3)===Math.round(BOT.nib*streakMul(3)),'streak bonus counts for nibbles');
click(zbTile());click($('rbc'));showDaily();click($('dyp'));ok(S.daily&&S.bots.length===0,'Daily runs have no bots');
S.wave=8;die();const zbN1=M.nib;ok(zbN1===dailyNibs(8,1)&&S.dnib===zbN1&&$('gnm').textContent.includes('+'+zbN1+' nibble'),'daily run pays nibbles: '+$('gnm').textContent);
ok(trackLog.filter(e=>e.type==='daily').pop().data.nb===zbN1,'daily stats event includes nibbles');
click($('gor'));S.wave=5;die();ok(M.nib===zbN1&&S.dnib===0,'a worse retry pays no nibbles');
click($('gor'));S.wave=DAILY.top+BOT.nibPer;die();ok(M.nib===dailyNibs(DAILY.top+BOT.nibPer,1)&&M.daily.np===M.nib,'a better retry tops up: '+M.nib);
ok(shown($('grb'))&&$('grb').textContent.includes('build ready')&&!shown($('gdl')),'daily game over: Bitbots shortcut when a bot can be built');
click($('grb'));ok(shown($('rb'))&&!shown($('go')),'shortcut opens the Bitbots screen');click($('rbc'));
// build and upgrade
showHome();ok(zbTile().textContent.includes('Build ready!'),'menu tile says Build ready!');
click(zbTile());const zbNib=M.nib;click(zbL()[1]);
ok(M.bots.lag===1&&M.nib===zbNib-BOT.cost(0)&&zbL()[1].textContent.includes('Lv 1'),'building the Lag Bot costs '+BOT.cost(0)+' nibbles');
ok(trackLog.filter(e=>e.type==='bot').pop().data.k==='lag','bot stats event sent');
M.nib=0;showBots();click(zbL()[1]);ok(M.bots.lag===1,'no upgrade without nibbles');
M.nib=1e4;M.bots.lag=BOT.max-1;showBots();click(zbL()[1]);ok(M.bots.lag===BOT.max&&zbL()[1].disabled&&zbL()[1].textContent.includes('Max level'),'max level '+BOT.max);
click($('rbc'));
// in a normal run
M.bots={cache:3,lag:5,debug:2};play();ok(S.bots.map(b=>b.k+b.lv).join()==='cache3,lag5,debug2','normal run: all built bots fly with the tower');
M.bots={cache:0,lag:2,debug:0};M.tips.bots=0;play();ok(S.bots.length===1&&S.bots[0].k==='lag','only built bots');
step(2.5);ok(M.tips.bots&&shown($('tip'))&&$('tip').textContent.includes('Bitbots are flying')&&!S.pause,'a one-time toast introduces the bots');closeTip();S.toast=0;
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
M.bots={cache:0,lag:0,debug:4};play();S.left=0;S.gap=99;S.lv.range=0;const zbD=S.bots[0];
const zbHit=(inside)=>{S.en=[];S.pr=[];const e=enemy(20,0,0,1e6);zbD.x=inside?e.x:CX-60;zbD.y=inside?e.y:CY+60;zbD.rt=99;zbD.tg=null;S.cd=0;
  for(let i=0;i<60&&e.hp===1e6;i++){update(1/60);if(!inside){zbD.x=CX-60;zbD.y=CY+60}}return 1e6-e.hp};
const zbOut=zbHit(false),zbIn=zbHit(true);
ok(Math.abs(zbIn/zbOut-(1+BOTS.debug.v(4)))<.02,'Debug Bot: +'+Math.round(100*BOTS.debug.v(4))+'% damage in its field ('+fmt(zbOut)+' > '+fmt(zbIn)+')');
// Cache Bot: more pixels from kills in its field
M.bots={cache:6,lag:0,debug:0};play();S.left=0;S.gap=99;const zbC=S.bots[0];
const zbPx=inside=>{S.pt=[];const e=enemy(40,0,2,1);zbC.x=inside?e.x:CX-60;zbC.y=inside?e.y:CY+60;const r=Math.random;Math.random=()=>.999;kill(e);Math.random=r;S.en=[];return S.pt.length};
const zbP0=zbPx(false),zbP1=zbPx(true);
ok(zbP1===Math.floor(zbP0*(1+BOTS.cache.v(6))+1e-9)||zbP1===Math.floor(TYPES[2].px*(1+stat.magnet())*(1+skinB('e'))*(1+BOTS.cache.v(6))),'Cache Bot: more pixels from kills in its field ('+zbP0+' > '+zbP1+')');
// drawing with bots and frozen enemies
M.bots={cache:1,lag:1,debug:1};play();enemy(25,0,0,50).stun=1;step(.5);draw();ok(S.bots.length===3,'draws bots, fields and frozen enemies');
setPause(true);ui();ok($('pzd').textContent==='Bitbots: Cache Bot Lv 1, Lag Bot Lv 1, Debug Bot Lv 1','pause panel lists the bots');setPause(false);
// bots stay on screen even when their target is outside it
S.en=[];const zbF=enemy(0,-200,2,1e6);zbF.t={...TYPES[2],sp:0};for(const b of S.bots){b.tg=zbF;b.rt=99}step(6);
ok(S.bots.every(b=>{const[x,y]=toScreen(b.x,b.y);return x>=0&&x<=W&&y>=0&&y<=H}),'bots stay on the screen');S.en=[];
// saves
loadMeta({v:14,chips:5,lv:{},best:30,daily:{d:5,best:7,paid:9,streak:2,last:5,top:11}});ok(M.v===SAVE_V&&M.nib===0&&JSON.stringify(M.bots)==='{"cache":0,"lag":0,"debug":0}'&&M.daily.np===0,'v14 saves: no nibbles, no bots');
loadMeta({v:15,chips:5,lv:{},best:30,nib:12,bots:{cache:2,lag:99,debug:'x'}});ok(M.nib===12&&M.bots.cache===2&&M.bots.lag===BOT.max&&M.bots.debug===0,'v15 save loads; junk levels cleaned');
done();
