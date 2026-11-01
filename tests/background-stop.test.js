// The run keeps going when the tab is hidden (catch-up on return), and can be stopped via Pause > Stop run.
skipTips();play();step(1);
document.dispatchEvent(new Event('visibilitychange'));ok(!S.pause,'hiding the tab does not pause');
// catch-up: simulate coming back after 60s away
let loud=0;const realUpdate=update;update=dt=>{if(!quiet)loud++;realUpdate(dt)};
S.hp=1e9;const t0=S.time,w0=S.wave;advance(last+60000);
ok(Math.abs(S.time-t0-60)<.1&&S.wave>w0,'60s away: game advanced 60s (wave '+w0+' -> '+S.wave+')');
ok(loud===0,'sounds and vibration muted during catch-up');
ok(!quiet,'sound back on after catch-up');
loud=0;advance(last+20);ok(loud>=1&&!quiet,'normal frame plays with sound on');
const t1=S.time;advance(last+5*3600e3);ok(S.time-t1<=CATCHUP_MAX+.1,'catch-up capped at '+CATCHUP_MAX/60+' min');
update=realUpdate;
// pause panel and stop confirmation
S.hp=stat.max();click($('pb'));ui();ok(shown($('pz'))&&!shown($('cf'))&&S.pause,'Pause opens pause panel');
click($('pzr'));ui();ok(!S.pause&&!shown($('pz')),'Resume closes panel');
click($('pb'));click($('pzs'));ui();ok(shown($('cf'))&&!shown($('pz'))&&S.pause,'Stop run asks for confirmation');
click($('cfk'));ui();ok(shown($('pz'))&&!shown($('cf'))&&!S.over,'Keep playing returns to pause panel');
click($('pzs'));key('Escape');ui();ok(!S.pause&&!shown($('cf'))&&!S.confirm,'Escape on confirmation resumes the run');
const n=M.hist.length,w=S.wave;
click($('pb'));click($('pzs'));click($('cfs'));ui();
ok(S.over&&S.stopped&&shown($('go'))&&!shown($('cf'))&&!shown($('pz')),'confirming ends the run and shows game over');
ok(M.hist.length===n+1&&M.hist[0].k==='Stopped'&&M.hist[0].w===w,'stopped run saved to history as Stopped');
ok($('gop').textContent==='You stopped the run on wave '+w+'.'&&$('gst').textContent.includes('Stopped'),'game over says the run was stopped');
click($('gor'));ok(!S.over&&!S.stopped&&!S.pause,'Play again after a stop starts a clean run');
done();
