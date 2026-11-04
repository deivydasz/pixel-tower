// Game over screen: styled like the home menu, with run stats, Play again, goal, and a highlighted Foundry button when an upgrade is affordable.
skipTips();M.best=4;M.chips=5;play();step(2);S.wave=3;S.earn=4;S.left=99;S.sp=99;die();
const cells=()=>[...$('gst').children].map(c=>c.firstChild.textContent+'='+c.lastChild.textContent).join('|');
ok(shown($('go'))&&$('goh').textContent==='Game over'&&$('goh').className==='','game over header');
ok($('gop').textContent==='Killed by a Grunt on wave 3.','reason line');
ok(/^Wave=3\|Killer=Grunt\|Chips=\+4\|Time=0:0\d\|Blasts=0\|Best=4$/.test(cells()),'stats card: '+cells());
ok($('gor').textContent==='Play again','primary button says Play again');
ok($('goalt').textContent.includes('wave '+LOCKED[0].w),'next-unlock goal shown: '+$('goalt').textContent);
ok(!$('gos')&&!$('gsl'),'no suggested upgrades on game over (players go to the Foundry)');
ok($('gof').classList.contains('rdy')===fyReady()&&$('gof').textContent===(fyReady()?'FoundryUpgrade ready!':'Foundry'+M.chips+' chips'),'Foundry button highlighted when chips buy something: '+$('gof').textContent);
M.chips=0;showGO();ok(!$('gof').classList.contains('rdy')&&$('gof').textContent==='Foundry0 chips','not highlighted without enough chips');
M.chips=999;showGO();ok($('gof').classList.contains('rdy'),'highlighted with enough chips');
click($('gor'));ok(!shown($('go'))&&!S.over&&S.wave===0,'Play again starts a new run');
S.wave=9;die();ok($('goh').textContent==='New record!'&&$('goh').className==='rec'&&$('gop').textContent==='You beat your best of wave 4 by 5 waves!','record header and reason');
click($('gor'));S.wave=10;die();ok($('gop').textContent==='You beat your best of wave 9 by 1 wave!','singular: by 1 wave');
done();
