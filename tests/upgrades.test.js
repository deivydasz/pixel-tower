// Six upgrades; only Damage and Tower HP at first, the rest unlock by best wave (mid-run too). Pixel magnet = more pixels per kill.
const b=k=>[...document.querySelectorAll('#ups button')][Object.keys(UP).indexOf(k)];
ok(Object.keys(UP).length===9&&document.querySelectorAll('#ups button').length===9&&META_UPS.length===7&&$('fyl').querySelectorAll('button').length===7,'nine in-run upgrades, seven of them in the Foundry');
skipTips();play();S.px=999;ui();
ok(!b('dmg').disabled&&!b('hp').disabled,'Damage and Tower HP available from the start');
const hpTxt=(tab('hp'),b('hp').innerText);tab('dmg');
ok(b('dmg').innerText.split('\n')[1]==='1 > 2'&&hpTxt.split('\n')[1]==='20 > 30','buttons show current > next (Damage 1 > 2, Tower HP 20 > 30)');
b('dmg').onclick();ui();ok(b('dmg').innerText.split('\n')[1]==='2 > 3','after buying: 2 > 3');S.lv.dmg=0;S.px=999;
ok(['rate','range','armor','magnet'].every(k=>b(k).disabled&&b(k).classList.contains('lkup')&&b(k).querySelector('svg')&&b(k).textContent.includes('Reach wave '+UP[k].w)),'others locked with lock icon and unlock wave');
b('rate').onclick();ok(S.lv.rate===0&&S.px===999,'locked upgrade cannot be bought');
// reaching wave 5 mid-run unlocks Fire rate with a banner
S.wave=4;S.left=0;S.en=[];S.paid=true;S.gap=0;step(.05);ui();
ok(S.wave===5&&!b('rate').disabled&&S.bt1==='NEW UPGRADE'&&S.bt==='Fire rate','wave 5 unlocks Fire rate mid-run with banner');
ok(b('range').disabled,'Range still locked at wave 5');
// Pixel magnet: more pixels per kill
M.best=16;ui();b('magnet').onclick();b('magnet').onclick();ok(Math.abs(stat.magnet()-.3)<1e-9,'Pixel magnet Lv2 = +30% pixels');
const rnd=Math.random;Math.random=()=>.99;S.pt=[];const gr=enemy(30,0,0,1);kill(gr);Math.random=rnd;
ok(S.pt.length===Math.floor(TYPES[0].px*1.3),'a Grunt drops '+Math.floor(TYPES[0].px*1.3)+' pixels instead of '+TYPES[0].px);
tab('magnet');ok(b('magnet').innerText.includes('+30% > +45%'),'button shows the bonus now > next: '+b('magnet').innerText.replace(/\n/g,' / '));
// Foundry respects unlocks (best wave, not the current run)
die();M.best=9;M.chips=999;click($('gof'));
const fb=[...$('fyl').querySelectorAll('button')],fi=k=>fb[Object.keys(UP).indexOf(k)];
ok(!fi('dmg').disabled&&!fi('rate').disabled&&!fi('range').disabled,'Foundry: unlocked by best wave 9 (dmg, hp, rate, range)');
ok(fi('armor').disabled&&fi('armor').textContent.includes('Reach wave 12')&&fi('magnet').disabled,'Foundry: absorber and magnet locked');
fi('armor').onclick();ok(M.lv.armor===0,'locked Foundry upgrade cannot be bought');
click($('fyc'));
loadMeta({v:4,chips:1,lv:{dmg:2}});ok(M.lv.magnet===0&&M.lv.dmg===2,'older saves get Pixel magnet level 0');
ok(UP.armor.n==='Dmg sponge'&&BITS.nova.n==='Blast tech','renamed: Dmg sponge, Blast tech');
done();
