// Home menu groups, locked modes and the next-unlock hook.
const lk=()=>[...document.querySelectorAll('#hlk .lk')];
showHome();
ok(lk().length===3&&lk().every(b=>b.disabled&&b.querySelector('svg')),'3 locked buttons, disabled, with lock icon');
ok(lk().map(b=>b.textContent).join('|')===LOCKED.map(m=>m.n+'Wave '+m.w).join('|'),'locked buttons show their unlock wave');
ok($('hookt').textContent==='Next unlock: '+LOCKED[0].n+'. Reach wave '+LOCKED[0].w+'.'&&$('hookb').style.width==='0%','new player hook points at first unlock');
ok($('hfyn').textContent==='0 chips','Foundry shows chips when nothing affordable');
const W0=LOCKED[0].w,W1=LOCKED[1].w;M.best=Math.round(W0*.8);M.chips=3;showHome();
ok($('hookt').textContent==='Next unlock: '+LOCKED[0].n+'. Reach wave '+W0+' (best '+M.best+').'&&Math.abs(parseFloat($('hookb').style.width)-100*M.best/W0)<.01,'hook shows progress toward first unlock');
ok($('hfyn').textContent==='Upgrade ready!','Foundry flags an affordable upgrade');
M.best=W0+2;showHome();
ok(!lk()[0].querySelector('svg')&&lk()[0].textContent===LOCKED[0].n+'Soon'&&lk()[1].querySelector('svg'),'first threshold unlocks first mode (Soon), others stay locked');
ok($('hookt').textContent.startsWith('Next unlock: '+LOCKED[1].n+'. Reach wave '+W1),'hook moves to next unlock');
M.best=LOCKED[2].w;showHome();
ok(lk().every(b=>!b.querySelector('svg'))&&$('hookt').textContent.startsWith('All modes unlocked')&&!shown($('hookb').parentNode),'all unlocked: no locks, no bar');
// best updates after a run and the menu reflects it
M.best=W0-1;skipTips();play();S.wave=W0;die();click($('gom'));
ok(lk()[0].textContent===LOCKED[0].n+'Soon','reaching the threshold in a run unlocks it on the menu');
done();
