// Visual effects: sparks and rings are spawned by hits, kills, Blast and bosses, fade out on real time and stay capped.
skipTips();play();S.wave=5;
const e=enemy(20,0,0,1);kill(e);ok(S.fx.some(f=>f.k==='r')&&S.fx.filter(f=>!f.k).length===4,'a kill pops a ring and 4 sparks');
S.fx=[];S.nova=0;nova();ok(S.sfl>0&&S.fx.length>=28,'Blast flashes and throws debris');
step(1);ok(S.fx.length===0&&S.sfl===0,'effects are gone after a second');
for(let i=0;i<100;i++)kill(enemy(20,0,0,1));ok(S.fx.length<=FX_MAX,'effects capped at '+FX_MAX+' ('+S.fx.length+')');
S.fx=[];S.en=[];S.boss=true;S.bossDone=false;S.wave=20;spawn();ok(S.bin>0&&S.en.some(e=>e.boss),'a boss arrival starts the red warning');
const b=S.en.find(e=>e.boss);S.fx=[];kill(b);ok(S.fx.filter(f=>f.k==='r').length===2&&S.fx.length>30&&S.shake>0,'a boss kill explodes with two rings and many sparks');
S.fx=[];S.over=true;sparks(CX,CY,5,'#fff',40,.3);step(.5);ok(S.fx.length===0,'effects still finish after game over');S.over=false;
// drawing with effects on screen
S.fx=[];sparks(CX,CY,10,'#fff',40,.3);ring(CX,CY,3,6,'#fff',.3);S.sfl=.1;S.bin=1;S.pr=[{x:CX+10,y:CY,vx:130,vy:0,life:1,crit:false,hits:[]}];
S.zoom=1;draw();S.zoom=.5;draw();S.zoom=1;ok(window.__err.length===0,'drawing effects at zoom 1 and 0.5 throws nothing');
done();
