// Game over screen: styled like the home menu, with run stats, Play again, goal and suggestions.
skipTips();M.best=4;M.chips=5;play();step(2);S.wave=3;S.earn=4;S.left=99;S.sp=99;die();
const cells=()=>[...$('gst').children].map(c=>c.firstChild.textContent+'='+c.lastChild.textContent).join('|');
ok(shown($('go'))&&$('goh').textContent==='Game over'&&$('goh').className==='','game over header');
ok($('gop').textContent==='Killed by a Grunt on wave 3.','reason line');
ok(/^Wave=3\|Killer=Grunt\|Chips=\+4\|Time=0:0\d\|Blasts=0\|Best=4$/.test(cells()),'stats card: '+cells());
ok($('gor').textContent==='Play again','primary button says Play again');
ok($('goalt').textContent.includes('wave '+LOCKED[0].w),'next-unlock goal shown: '+$('goalt').textContent);
ok($('gsl').textContent==='Suggested upgrades · you have '+M.chips+' chips','suggestions label shows chips');
ok($('gos').querySelectorAll('button').length===2,'two suggested upgrades');
const c0=M.chips,b=[...$('gos').querySelectorAll('button')].find(x=>!x.disabled);
if(b){b.click();ok(M.chips<c0&&$('gsl').textContent.includes(M.chips+' chips'),'buying a suggestion updates chips')}else ok(true,'no affordable suggestion (skipped)');
click($('gor'));ok(!shown($('go'))&&!S.over&&S.wave===0,'Play again starts a new run');
S.wave=9;die();ok($('goh').textContent==='New record!'&&$('goh').className==='rec'&&$('gop').textContent==='You beat your best of wave 4 by 5 waves!','record header and reason');
click($('gor'));S.wave=10;die();ok($('gop').textContent==='You beat your best of wave 9 by 1 wave!','singular: by 1 wave');
done();
