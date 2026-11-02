// Run-only late upgrades: Heavy rounds (wave 30 in this run), Crit power (wave 35 in this run, needs Critical bits).
skipTips();M.best=99;M.res.crit=1;play();const b=k=>[...document.querySelectorAll('#ups button')][Object.keys(UP).indexOf(k)];
S.px=1e6;ui();
ok(b('heavy').disabled&&b('heavy').innerText.includes('Run wave 30')&&b('critx').innerText.includes('Run wave 35'),'locked at the start of a run, even with best wave 99');
S.wave=29;S.left=0;S.en=[];S.paid=true;S.gap=0;step(.05);ui();
ok(S.wave===30&&!b('heavy').disabled&&S.bt1==='NEW UPGRADE'&&S.bt==='Heavy rounds','wave 30 in this run: Heavy rounds appears with a banner');
ok(b('critx').disabled,'Crit power still locked at wave 30');
S.wave=34;S.left=0;S.en=[];S.paid=true;S.gap=0;step(.05);ui();ok(!b('critx').disabled&&S.bt==='Crit power','wave 35: Crit power appears');
// Crit power raises the crit multiplier
ok(stat.critx()===3,'crit x3 by default');b('critx').onclick();b('critx').onclick();ok(stat.critx()===4,'Crit power Lv2: crits x4');
ui();ok(b('critx').innerText.split('\n')[1]==='x4 > x4.5','button shows x4 > x4.5');
S.en=[];S.left=99;S.sp=99;const e1=enemy(30,0,0,1000);S.pr=[{x:e1.x,y:e1.y,vx:0,vy:0,life:1,crit:true,hits:[],pierce:0}];step(1/60);
ok(Math.abs(1000-e1.hp-stat.dmg()*4)<1e-6,'crit bullets deal x4 damage');
// Heavy rounds knock Tanks back, not other enemies
b('heavy').onclick();b('heavy').onclick();S.en=[];const tk=enemy(40,0,2,1e6),gr=enemy(-40,0,0,1e6);
S.cd=99;const tx0=tk.x,gx0=gr.x;S.pr=[{x:tk.x,y:tk.y,vx:0,vy:0,life:1,hits:[],pierce:0},{x:gr.x,y:gr.y,vx:0,vy:0,life:1,hits:[],pierce:0}];step(1/60);
// one frame: both walk in (speed/60), then the hit pushes only the Tank out
ok(Math.abs(tk.x-(tx0-TYPES[2].sp/60+stat.heavy()))<1e-6&&Math.abs(gr.x-(gx0+TYPES[0].sp/60))<1e-6,'Heavy rounds Lv2 pushes a Tank back '+stat.heavy()+'px per hit, not a Grunt');
// a new run starts without them; needs Critical bits
die();click($('gor'));ui();ok(b('heavy').disabled&&b('critx').disabled&&S.lv.heavy===0&&S.lv.critx===0,'next run: both locked again, levels reset');
M.res.crit=0;S.wave=40;S.px=1e6;ui();ok(b('critx').disabled&&b('critx').innerText.includes('Needs crits')&&!b('heavy').disabled,'Crit power needs Critical bits research');
// not in the Foundry or suggestions
ok(![...$('fyl').querySelectorAll('button')].some(x=>/Heavy rounds|Crit power/.test(x.textContent)),'not in the Foundry');
done();
