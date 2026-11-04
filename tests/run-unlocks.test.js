// Game over lists what the run unlocked, with a shortcut to Bit Theory when relevant.
skipTips();const items=()=>[...$('gnl').children].map(li=>li.textContent);
// very first run: new upgrades, plus Bit Theory and idle income open (reasons to come back on day one)
M.best=3;M.bk=0;M.cores=0;play();S.start.best=3;S.wave=9;die();
ok(shown($('gnew'))&&items().join('|')==='New upgrade: Fire rate|New upgrade: Range|Idle income: your tower now earns chips and starting pixels while you are away|Bit Theory unlocked: your first study is free, and it keeps running while you are away','first run: upgrades, idle income and Bit Theory listed: '+items().join(' / '));
ok(!$('gbt').disabled&&$('gbt').classList.contains('hl')&&$('gbt').textContent==='Bit TheoryNew!','Bit Theory button highlighted with New!');
// nothing new: card hidden
M.chips=0;click($('gor'));S.wave=7;die();ok(!shown($('gnew'))&&!$('gbt').classList.contains('hl'),'no news: card hidden, no highlight');
// first boss ever: bosses tracker and core
M.best=BOSS.first-1;M.bk=0;M.cores=0;click($('gor'));S.wave=BOSS.first-1;S.left=0;S.en=[];S.paid=true;S.gap=0;step(.05);step(.1);
const b=S.en.find(e=>e.boss);b.hp=1;b.x=CX+20;b.y=CY;S.pr=[{x:CX+20,y:CY,vx:0,vy:0,life:1}];step(.02);S.en=[];die();
ok(items().includes('Bosses unlocked: track them on the menu')&&items().includes('+1 boss core'),'first boss: bosses and core listed: '+items().join(' / '));
click($('gbt'));ok(shown($('bt'))&&!shown($('go')),'Bit Theory opens from game over');click($('btc'));ok(shown($('go'))&&!shown($('bt')),'Back returns to game over');
// a research requirement met this run (3rd boss opens Spray and Pray once Piercing Lv2)
M.res.pierce=2;M.bk=2;M.best=40;play();M.bk=3;S.bosses=1;M.cores++;S.wave=41;die();
ok(items().includes('Spray and Pray can now be studied')&&$('gbt').classList.contains('hl'),'newly available research listed, Bit Theory highlighted');
// research finished during the run
let T=Date.now();clock.now=()=>T;click($('gor'));M.rq={k:'crit',end:T+1000};T+=2000;step(.05);S.wave=45;die();
ok(items().includes('Critical bits Lv 1 finished'),'research finished mid-run listed');
done();
