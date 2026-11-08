// Pixel bank: interest on unspent pixels at each wave clear, capped per wave; Foundry version; unlock at best wave 20.
skipTips();M.best=19;play();const b=k=>[...document.querySelectorAll('#ups button')][Object.keys(UP).indexOf(k)];
tab('bank');S.px=1e4;ui();ok(b('bank').disabled&&b('bank').innerText.includes('Reach wave 20'),'locked until wave 20');
M.best=25;ui();ok(!b('bank').disabled,'unlocked from best wave 20');
const clear=px=>{S.en=[];S.left=0;S.paid=false;S.gap=9;S.px=px;S.ft=[];const w=S.wave,before=S.px;step(1/60);return S.px-before-(5+w*2)};
S.wave=10;ok(clear(1000)===0,'no bank level: no interest');
b('bank').onclick();S.wave=10;ok(clear(400)===12&&S.ft.some(f=>f.t==='Bank +12 px'),'Lv1: 3% of 400 unspent = +12 px, shown as Bank +12 px');
S.wave=10;ok(clear(5000)===25,'capped at +25 px per level per wave');
b('bank').onclick();S.wave=10;ok(clear(400)===24&&stat.bankCap()===50,'Lv2: 6% (+24 px), cap 50');
ui();ok(b('bank').innerText.split('\n')[1]==='6% > 9%','button shows 6% > 9%');
// Foundry version: half strength
die();click($('gof'));const fb=[...$('fyl').querySelectorAll('button')].find(x=>x.textContent.startsWith('Pixel bank'));
ok(fb&&fb.textContent.includes('0% > 3%'),'Firmware: Pixel bank 0% > 3%');click($('fyc'));
loadMeta({v:6,chips:1,lv:{dmg:1}});ok(M.lv.bank===0&&M.v===SAVE_V,'older saves: Pixel bank level 0, save v7');
done();
