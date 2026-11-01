// Purchase feedback: button flash + floating label, fades out; Foundry buttons flash too.
skipTips();M.best=30;play();S.px=999;ui();
const bt=[...document.querySelectorAll('#ups button')][0];bt.click();
ok(bt.classList.contains('bought')&&S.ft.length===1&&S.ft[0].t==='+1 dmg','buying Damage flashes the button and floats +1 dmg');
const hb=[...document.querySelectorAll('#ups button')][1];ui();hb.click();ok(S.ft.map(f=>f.t).join()==='+1 dmg,+10 HP','labels stack per purchase');
const calls=[];const ft=g.fillText.bind(g);g.fillText=(t,x,y)=>{calls.push(t);ft(t,x,y)};draw();g.fillText=ft;
ok(calls.includes('+1 dmg')&&calls.includes('+10 HP'),'labels drawn on the canvas');
step(1.1);ok(S.ft.length===0,'labels fade out after a second');
die();M.chips=999;click($('gof'));const fb=$('fyl').querySelector('button');fb.click();
ok($('fyl').querySelector('button').classList.contains('bought'),'Foundry purchase flashes the button');
done();
