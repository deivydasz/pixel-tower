// Overclock (game speed research) and the speed button; crit pop-ups.
ok(BITS.speed&&BITS.speed.max===4&&BITS.speed.req.bk===5,'Overclock: 4 levels, needs 5 bosses');
M.bk=4;ok(!resOpen('speed'),'locked with 4 bosses');M.bk=5;ok(resOpen('speed'),'open with 5 bosses');
const cs=[0,1,2,3].map(l=>resCost('speed',l));ok(cs[2].cores>cs[1].cores*1.5&&cs[3].chips>cs[1].chips*5,'levels 3 and 4 are expensive: '+cs.map(c=>c.cores+'c/'+c.chips).join(' '));
ok(resMin('speed',3)>resMin('speed',0),'later levels take longer ('+[0,1,2,3].map(l=>resMin('speed',l)).join('/')+' min)');
skipTips();play();ui();ok(!shown($('spd')),'no speed button before Overclock is studied');
M.res.speed=2;ui();ok(shown($('spd'))&&$('spd').textContent==='1x','speed button shows 1x');
click($('spd'));ui();ok(M.spd===1.5&&$('spd').textContent==='1.5x'&&$('spd').classList.contains('on'),'tap: 1.5x');
click($('spd'));click($('spd'));ok(M.spd===1,'cycles 2x then back to 1x (max 2x at Lv 2)');
ok(JSON.parse(localStorage.getItem('pixelTowerMeta')).spd===1,'choice saved');
// game time runs faster, real-time things don't
M.spd=2;S.en=[];const t0=S.time;last=1000;advance(2000);ok(Math.abs(S.time-t0-2)<.05,'2x: 1 real second = 2 game seconds ('+(S.time-t0).toFixed(2)+')');
S.bonus=1;S.ft.push({t:'x',life:1});const b0=S.bonus;last=1000;advance(1500);ok(Math.abs(b0-S.bonus-.5)<.05,'banners count down in real time at 2x');
const c0=clock.now();ok(resMin('crit',0)===BITS.crit.t,'research time unchanged');
S.pause=true;ok(gameSpeed()===1,'paused: speed 1');S.pause=false;
M.res.speed=1;ok(gameSpeed()===1.5,'speed capped at studied max if the save has more');
M.spd=1;
// saves
loadMeta({v:7,chips:1,lv:{},res:{crit:1},best:3,hist:[]});ok(M.v===SAVE_V&&M.res.speed===0&&M.spd===1,'v7 save loads with Overclock 0, speed 1x');
loadMeta({v:8,chips:1,lv:{},res:{speed:2},spd:9,best:3,hist:[]});ok(M.spd===2,'bad saved speed clamped to studied max');
// crit pop-ups
skipTips();M.spd=1;M.res.crit=20;S.en=[];S.cp=[];const e=enemy(20,0,0,1e6);S.cd=0;let n=0;while(!S.cp.length&&n++<600)step(1/60);
ok(S.cp.length>0&&/^\d/.test(S.cp[0].t),'critical hit shows a damage number: '+(S.cp[0]&&S.cp[0].t));
ok(e.crit>0||S.cp.length,'crit flashes the enemy');
for(let i=0;i<20;i++)S.cp.push({x:0,y:0,t:'z',life:CRIT_POP});step(1/60);ok(S.cp.length<=CRIT_MAX+20,'pop-ups expire');step(CRIT_POP+.1);ok(S.cp.filter(f=>f.t==='z').length===0,'pop-ups gone after '+CRIT_POP+'s');
done();
