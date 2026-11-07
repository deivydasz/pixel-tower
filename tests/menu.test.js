// Home menu groups, locked modes and the next-unlock hook.
const lk=()=>[...document.querySelectorAll('#hlk .lk')];
showHome();
ok(lk().length===LOCKED.length&&LOCKED.length===4&&lk().every(b=>b.disabled&&b.querySelector('svg')),'4 locked buttons, disabled, with lock icon');
ok(lk().map(b=>b.textContent).join('|')===LOCKED.map(m=>(m.boss?'???':m.n)+'Wave '+m.w).join('|'),'locked buttons show their unlock wave (bosses are ???)');
ok(document.body.classList.contains('noboss')&&!shown(document.querySelector('#how .bx')),'boss text hidden until the first boss is met');
ok(resReqs('spray').some(q=>q.t==='??? at wave '+BOSS.first),'Bit Theory requirement says ??? instead of bosses');
ok($('hookt').textContent==='Something is waiting for you at wave '+LOCKED[0].w+'...'&&$('hookb').style.width==='0%','new player hook points at first unlock');
ok($('hfy').textContent==='Foundry0 chips'&&!$('hfy').classList.contains('rdy'),'Foundry shows chips when nothing affordable');
const W0=LOCKED[0].w,W1=LOCKED[1].w;M.best=Math.round(W0*.8);M.chips=3;showHome();
ok($('hookt').textContent==='Something is waiting for you at wave '+W0+' (best '+M.best+')...'&&Math.abs(parseFloat($('hookb').style.width)-100*M.best/W0)<.01,'hook shows progress toward first unlock');
ok($('hfy').textContent==='FoundryUpgrade ready!'&&$('hfy').classList.contains('rdy'),'Foundry is highlighted when an upgrade is affordable');
M.best=W0+2;showHome();ok(!document.body.classList.contains('noboss'),'boss text shown once wave '+W0+' is reached');
ok(!lk()[0].querySelector('svg')&&lk()[0].textContent==='Bosses0 beaten0 cores'&&lk()[0].classList.contains('tr')&&lk()[1].querySelector('svg'),'wave 20 turns the first slot into the boss tracker, others stay locked');
ok($('hookt').textContent.startsWith('Next unlock: '+LOCKED[1].n+'. Reach wave '+W1),'hook moves to next unlock');
M.best=LOCKED[2].w;M.cert=50;M.claim=50;showHome();
M.bk=3;M.cores=1;showHome();ok(lk()[0].textContent==='Bosses3 beaten1 core','tracker counts bosses and cores (singular core)');
ok(lk().every(b=>!b.querySelector('svg'))&&$('hsk')&&!$('hsk').disabled&&$('hookt').textContent.startsWith('All modes unlocked')&&!shown($('hookb').parentNode),'all unlocked: no locks, no bar');
// best updates after a run and the menu reflects it
M.best=W0-1;skipTips();play();S.wave=W0;die();click($('gom'));
ok(lk()[0].classList.contains('tr'),'reaching wave 20 in a run unlocks the boss tracker');
done();
