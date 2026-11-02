// In-run upgrades in tabs: Attack / Survival / Economy; the grid keeps its height so the game screen never moves.
skipTips();M.best=99;M.res.crit=1;play();S.wave=40;S.px=0;ui();
const vis=()=>[...document.querySelectorAll('#ups button')].filter(x=>shown(x)).map(x=>x.querySelector('b').textContent);
const tb=[...document.querySelectorAll('#upt button')];
ok(tb.map(x=>x.textContent).join('|')==='Power|Survival|Economy'&&tb[0].classList.contains('on'),'three tabs, Power selected');
ok(vis().join('|')==='Damage|Fire rate|Range|Crit power','Power: Damage, Fire rate, Range, Crit power');
click(tb[1]);ok(vis().join('|')==='Tower HP|Dmg sponge|Heavy rounds'&&tb[1].classList.contains('on'),'Survival: Tower HP, Dmg sponge, Heavy rounds');
click(tb[2]);ok(vis().join('|')==='Pixel magnet','Economy: Pixel magnet');
// height never changes between tabs
const hs=[];for(const x of tb){click(x);hs.push(Math.round($('ups').getBoundingClientRect().height))}ok(new Set(hs).size===1,'grid height the same on every tab ('+hs.join(',')+')');
const cy=()=>Math.round($('c').getBoundingClientRect().top);const c0=cy();click(tb[0]);const c1=cy();click(tb[2]);ok(c0===cy()&&c1===c0,'game screen does not move when switching tabs');
// dot on other tabs with something affordable
click(tb[0]);S.px=25;ui();ok(tb[1].classList.contains('has')&&!tb[0].classList.contains('has'),'dot on Survival when an upgrade there is affordable');
S.px=0;ui();ok(!tb[1].classList.contains('has'),'no dot when nothing affordable');
done();
