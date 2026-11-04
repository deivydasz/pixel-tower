const hs=()=>shown($('home'));
// a brand-new player goes straight into a run: the start tip card pauses it until the first tap
step(.05);ok(!hs()&&!S.menu&&S.tip==='start'&&S.pause&&shown($('tip')),'first ever load starts a run with the start tip');
// returning players get the menu
M.hist=[{t:Date.now(),w:3,k:'Grunt',c:1,d:30,n:0}];M.tips={};reset();showHome();M.hist=[];M.best=0;showHome();
ok(hs()&&S.menu&&S.pause,'returning player: game opens on home menu, not running');
const w0=S.wave;step(3);ok(S.wave===w0&&!S.en.length,'nothing happens behind the menu');
ok(!shown($('tip')),'no tip card behind the menu');
ok($('hst').textContent.startsWith('Defend'),'new player sees intro line');
key('p');ok(S.pause&&S.menu,'P key does not unpause the menu');
S.nova=0;key(' ','Space');ok(S.nova===0,'Space does not fire Nova on the menu');
click($('hhow'));ok(shown($('how'))&&!hs(),'How to play opens');
click($('howc'));ok(hs(),'Back returns to menu');
click($('hfy'));ok(shown($('fy'))&&!hs(),'Foundry opens from menu');
click($('fyc'));ok(hs()&&!shown($('go')),'Foundry Back returns to menu (not game over)');
play();step(.05);ok(!hs()&&!S.menu&&S.tip==='start','Play starts a run and shows the start tip');
click($('tipok'));skipTips();step(2);ok(S.wave>=1,'run is playing');
die();ok(shown($('go')),'game over menu');
click($('gom'));ok(hs()&&!shown($('go'))&&$('hst').textContent.startsWith('Best wave'),'Main menu button returns home with best wave');
click($('hfy'));click($('fyc'));ok(hs(),'foundry from home after a run returns home');
play();ok(!S.over&&S.wave===0&&!hs(),'Play after game over starts a fresh run');
die();click($('gof'));click($('fyc'));ok(shown($('go')),'foundry from game over still returns to game over');
done();
