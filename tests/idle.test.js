// Idle income: chips + starting pixels while away, after the first boss; capped at IDLE.hours.
skipTips();const H1=3600000,now=Date.now();
M.best=30;M.bk=0;M.chips=0;M.stash=0;M.seen=now-4*H1;ok(idleCheck(now)===null&&M.chips===0&&M.seen===now,'locked before the first finished run: nothing paid, clock reset');
M.bk=1;ok(runChips(30)===Array.from({length:29},(_,i)=>1+Math.floor((i+1)/5)).reduce((a,b)=>a+b),'full 4h = chips of a run to the best wave ('+runChips(30)+')');
M.seen=now-4*H1;let r=idleCheck(now);ok(r&&r.chips===runChips(30)&&M.chips===runChips(30)&&M.stash===300,'4h away: +'+r.chips+' chips and 300 px head start');
M.chips=0;M.seen=now-2*H1;r=idleCheck(now);ok(r.chips===Math.floor(runChips(30)/2)&&M.stash===300,'2h more: half the chips; the head start stays at the 4h cap');
M.chips=0;M.stash=0;M.seen=now-10*H1;r=idleCheck(now);ok(r.chips===runChips(30)&&M.stash===300,'10h away pays the same as 4h');
M.chips=0;M.seen=now-4*60000;ok(idleCheck(now)===null&&M.chips===0,'under 5 minutes: nothing');
ok(trackLog.some(e=>e.type==='idle'&&e.data.c===runChips(30)),'idle return is sent to stats');
// home card
M.seen=now-3*H1;M.stash=0;idleCheck(now);showHome();ok(shown($('idl'))&&/kept defending for 3h 0m: \+\d+ chips and 225 px head start/.test($('idlt').textContent),'home card: '+$('idlt').textContent);
ok($('hst').textContent.includes('idle '+runChips(30)+' chips / 4h'),'home shows the idle rate');
click($('idlk'));ok(!shown($('idl')),'card dismissed');
// head start spent at run start
click($('hplay'));ok(S.px===225&&M.stash===0&&S.ft.some(f=>/Head start \+225 px/.test(f.t)),'Play: starts with 225 px, stash emptied');
// hidden during a run never pays
M.chips=0;M.seen=now-4*H1;hidInRun=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});dispatchEvent(new Event('visibilitychange'));ok(M.chips===0,'coming back to a run does not pay idle');
// unlocked card after the first boss
S.start.idle=false;S.wave=21;endRun(false);ok($('gnl').textContent.includes('Idle income'),'the run that opens idle income lists it');
// saves
loadMeta({v:10,chips:1,lv:{},best:5,hist:[]});ok(M.v===SAVE_V&&M.stash===0&&Math.abs(M.seen-Date.now())<5000,'v10 save: idle clock starts now, no back pay');
done();
