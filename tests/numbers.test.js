// Number formatting and Foundry current-stat display.
ok([5.3999999999999995,1.75,0.5,12.3456,99.95,154.6,1234.5,7].map(fmt).join('|')==='5.4|1.75|0.5|12.3|100|155|1235|7','fmt: <10 two decimals, <100 one, >=100 none');
skipTips();play();S.lv.dmg=3;M.lv.dmg=3;M.lv.armor=7;ui();
const dmgBtn=[...document.querySelectorAll('#ups button')][0].textContent;
ok(/Dmg \d+(\.\d{1,2})? ·/.test(dmgBtn),'in-run damage button rounded: '+dmgBtn);
M.res.depth=3;ui();ok(!/\d\.\d{3}/.test($('ups').textContent),'no long decimals with Bit depth: '+[...document.querySelectorAll('#ups button')][0].textContent);
M.res.depth=0;M.chips=500;die();click($('gof'));
const fd=$('fyl').querySelector('button').textContent;
ok(fd.includes('Now 2.5 > 3 damage'),'Foundry shows current and next damage: '+fd);
ok($('fyl').textContent.includes('Now 1.75 > 2 absorb'),'Foundry shows current and next absorb');
ok([...$('fyl').querySelectorAll('button')].every(b=>/Now .+ > .+/.test(b.textContent)),'every Foundry upgrade shows Now > Next');
click($('fyc'));ok([...$('gos').querySelectorAll('button')].every(b=>b.textContent.includes('Now ')),'game over suggestions show Now > Next');
done();
