// Game over lists what the run unlocked, with a shortcut to Bit Theory when relevant.
skipTips();const items=()=>[...$('gnl').children].map(li=>li.textContent);
// nothing new: card hidden
M.best=30;M.bk=0;play();S.wave=10;die();ok(!shown($('gnew'))&&!$('gbt').classList.contains('hl'),'no news: card hidden, no highlight');
// first run past wave 5 and 8
click($('gor'));M.best=3;S.start.best=3;S.wave=9;die();
ok(shown($('gnew'))&&items().join('|')==='New upgrade: Fire rate|New upgrade: Range','new upgrades listed');
ok($('gbt').disabled&&$('gbt').querySelector('svg'),'Bit Theory button locked before first boss');
// first boss ever: bosses tracker, core, Bit Theory unlocked + button
M.best=19;M.bk=0;M.cores=0;click($('gor'));S.wave=19;S.left=0;S.en=[];S.paid=true;S.gap=0;step(.05);step(.1);
const b=S.en.find(e=>e.boss);b.hp=1;b.x=CX+20;b.y=CY;S.pr=[{x:CX+20,y:CY,vx:0,vy:0,life:1}];step(.02);S.en=[];die();
ok(items().includes('Bosses unlocked: track them on the menu')&&items().includes('+1 boss core')&&items().includes('Bit Theory unlocked: study the pixels with your cores'),'first boss: bosses, core and Bit Theory listed: '+items().join(' / '));
ok(!$('gbt').disabled&&$('gbt').classList.contains('hl')&&$('gbt').textContent==='Bit TheoryNew!','Bit Theory button highlighted with New!');
click($('gbt'));ok(shown($('bt'))&&!shown($('go')),'Bit Theory opens from game over');click($('btc'));ok(shown($('go'))&&!shown($('bt')),'Back returns to game over');
// a research requirement met this run (3rd boss opens Spray and Pray once Piercing Lv2)
M.res.pierce=2;M.bk=2;M.best=40;play();M.bk=3;S.bosses=1;M.cores++;S.wave=41;die();
ok(items().includes('Spray and Pray can now be studied')&&$('gbt').classList.contains('hl'),'newly available research listed, Bit Theory highlighted');
// research finished during the run
let T=Date.now();clock.now=()=>T;click($('gor'));M.rq={k:'crit',end:T+1000};T+=2000;step(.05);S.wave=45;die();
ok(items().includes('Critical bits Lv 1 finished'),'research finished mid-run listed');
done();
