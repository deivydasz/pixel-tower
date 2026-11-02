// Anonymous stats events (sent to server/stats.py on live/preview; local files only log them).
ok(/^[0-9a-f]{16}$/.test(M.uid),'save has a random 16-hex player ID');
ok(JSON.parse(localStorage.getItem('pixelTowerMeta')).uid===M.uid,'ID saved on first load');
ok(trackLog[0]&&trackLog[0].type==='open'&&trackLog[0].id===M.uid&&trackLog[0].data.m.res,'page load sends an open event with progress');
ok(TRACK_ENV==='','nothing is sent from local files (or preview: live host only)');
const id=M.uid;loadMeta(JSON.parse(localStorage.getItem('pixelTowerMeta')));ok(M.uid===id,'ID kept across loads');
loadMeta({v:8,chips:1,lv:{},best:3,hist:[]});ok(M.v===SAVE_V&&/^[0-9a-f]{16}$/.test(M.uid),'v8 save gets an ID');
loadMeta({v:9,chips:1,lv:{},uid:'<b>bad</b>',hist:[]});ok(/^[0-9a-f]{16}$/.test(M.uid),'bad ID replaced');
const lastEv=t=>trackLog.filter(e=>e.type===t).pop();
skipTips();play();S.wave=12;S.bosses=0;step(.1);die();
const r=lastEv('run');ok(r&&r.data.w===12&&r.data.k&&typeof r.data.d==='number'&&r.data.up&&r.data.m.best===12,'run end sends wave, killer, time, upgrades, progress');
M.chips=999;M.res.crit=0;M.bk=1;M.cores=5;M.rq=null;startResearch('crit');const q=lastEv('research');ok(q&&q.data.k==='crit'&&q.data.lv===1,'research start sends key and level');
showHome();M.chips=999;click($('hfy'));const fb=$('fyl').querySelector('button:not(:disabled)');click(fb);const f=lastEv('foundry');ok(f&&f.data.k&&f.data.lv===1&&f.data.c>0,'Foundry buy sends upgrade, level and price');
done();
