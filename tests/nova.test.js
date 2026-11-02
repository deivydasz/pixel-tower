skipTips();play();
const nb=$('nova');
step(1);ui();ok(nb.textContent==='BLAST'&&!nb.disabled,'Blast ready at start (button says BLAST)');
S.en=[];S.left=0;S.lv.range=2;const R0=stat.range();  // range 66: tough (40 away) is inside, far (90 away) is outside
const weak=enemy(20,0,0,1),tough=enemy(0,-40,2,100),far=enemy(90,0,0,99),corner=enemy(-88,-118,0,1);
const px0=S.pt.length;
ok(nova(),'nova fires');
ok(!S.en.includes(weak)&&S.pt.length>px0,'weak enemy dies and drops pixels');
const t1=tough.t.sp;tough.t={...tough.t,sp:0};far.t={...far.t,sp:0};step(NOVA.kb+.05);  // let the knock-back slide finish (enemies frozen)
ok(S.en.includes(tough)&&Math.abs(Math.hypot(tough.x-CX,tough.y-CY)-R0)<.5&&tough.hp===100-novaDmg(),'enemy inside range damaged and knocked out to the edge of range ('+R0+')');
ok(far.hp===99-novaDmg()&&Math.abs(far.x-(CX+90))<.01,'enemy outside range is damaged but not pulled or pushed');
S.lv.range=6;const R1=stat.range();tough.x=CX;tough.y=CY-30;S.nova=0;nova();step(NOVA.kb+.05);ok(Math.abs(Math.hypot(tough.x-CX,tough.y-CY)-R1)<.5,'more Range = pushed further ('+R1+')');S.lv.range=0;tough.t.sp=t1;
ok(!S.en.includes(corner),'enemy in far corner hit');
ok(!nova(),'cannot fire again while charging');ui();
ok(nb.disabled&&nb.textContent==='Blast '+fmtTime(NOVA.cd),'button shows countdown');
S.en=[];step(10);ui();ok(nb.textContent==='Blast '+fmtTime(NOVA.cd-10),'countdown after 10s: '+nb.textContent);
S.nova=1;step(1.1);ui();ok(!nb.disabled&&nb.textContent==='BLAST','ready again after cooldown');
S.pause=true;ok(!nova(),'nova blocked while paused');S.pause=false;
S.nova=0;click($('c'));ok(S.nova===0,'tapping the play area does NOT fire Blast');
S.nova=0;key(' ','Space');ok(S.nova>NOVA.cd-1,'Space fires nova');
S.nova=0;ui();click(nb);ok(S.nova>NOVA.cd-1,'BLAST button fires Blast');
S.pause=true;click($('c'));ok(!S.pause,'tapping the play area still resumes from pause');
done();
