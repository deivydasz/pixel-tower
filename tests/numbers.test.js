// Number formatting and Foundry current-stat display.
ok([5.3999999999999995,1.75,0.5,12.3456,99.95,154.6,1234.5,7].map(fmt).join('|')==='5.4|1.75|0.5|12.3|100|155|1235|7','fmt: <10 two decimals, <100 one, >=100 none');
ok([0,999,9999,10000,12345,99999,123456,999999,1234567,98765432].map(big).join('|')==='0|999|9999|10k|12.3k|100k|123k|1000k|1.23M|98.8M','big(): compact chip/pixel counts');
M.best=5;M.chips=10;M.cores=1;showHome();ok($('hst').textContent.endsWith('· 1 core'),'home: 1 core (singular)');M.cores=2;showHome();ok($('hst').textContent.endsWith('· 2 cores'),'home: 2 cores');M.cores=0;
M.chips=123456;showHome();ok($('hst').textContent.includes('123k chips'),'home shows compact chips');M.chips=0;
skipTips();play();S.lv.dmg=3;M.lv.dmg=3;M.lv.armor=7;ui();
const dmgBtn=[...document.querySelectorAll('#ups button')][0].innerText;
ok(/\n\d+(\.\d{1,2})? > \d+(\.\d{1,2})?\n/.test(dmgBtn),'in-run damage button rounded: '+dmgBtn.replace(/\n/g,' / '));
M.res.depth=3;ui();ok(!/\d\.\d{3}/.test($('ups').innerText),'no long decimals with Bit depth: '+[...document.querySelectorAll('#ups button')][0].innerText.replace(/\n/g,' / '));
M.res.depth=0;M.chips=500;M.best=20;die();click($('gof'));
const fd=$('fyl').querySelector('button').textContent;
ok(fd.includes('2.5 > 3')&&!fd.includes('Now'),'Foundry shows current > next damage, no "Now": '+fd);
ok($('fyl').textContent.includes('1.75 > 2'),'Foundry shows current > next absorb');
ok([...$('fyl').querySelectorAll('button')].every(b=>/\d\S* > \S*\d/.test(b.textContent)),'every Foundry upgrade shows current > next');
click($('fyc'));
S.px=45678;ui();ok($('px').textContent==='45.7k px','HUD shows compact pixels');
ok(getComputedStyle(document.documentElement).getPropertyValue('--gold').trim()!=='','theme accent colours defined');
done();
