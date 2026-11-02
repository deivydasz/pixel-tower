// Skins: certificates at 30/50/70 unlock sets; every owned skin's bonus counts whatever is worn; worn look is saved.
skipTips();
ok(SKINS.length===4&&SKINS.slice(1).map(x=>x.w).join()==='30,50,70','sets at wave 30, 50, 70 certificates');
M.cert=20;M.claim=20;ok(skinBonus('e')===0&&skinBonus('t')===0&&skinBonus('b')===0,'no bonus before wave 30');
M.skin={e:2,t:2,b:2};ok(sk('e')===0&&sk('t')===0,'a locked skin is never worn (falls back to Classic)');
M.cert=50;M.claim=50;ok(Math.abs(skinBonus('e')-.15)<1e-9&&Math.abs(skinBonus('t')-.09)<1e-9&&Math.abs(skinBonus('b')-.15)<1e-9,'owned bonuses stack (30+50)');
M.skin={e:0,t:0,b:0};ok(Math.abs(skinBonus('t')-.09)<1e-9,'bonus counts while wearing Classic');
// damage bonus in stats
play();const d0=(1+S.lv.dmg+.5*M.lv.dmg)*Math.pow(1.2,M.res.depth);ok(Math.abs(stat.dmg()-d0*1.09)<1e-9,'tower skins add damage');
// wave clear pixels and chips: +15% with carry so small chip amounts still gain over time
M.cert=0;M.claim=0;reset();S.menu=false;S.pause=false;S.wave=11;S.left=0;S.en=[];S.paid=false;S.px=0;let c0=M.chips;step(1/60);const base={px:S.px,ch:M.chips-c0};
M.cert=50;M.claim=50;reset();S.menu=false;S.pause=false;S.wave=11;S.left=0;S.en=[];S.paid=false;S.px=0;c0=M.chips;step(1/60);
ok(S.px===Math.round(base.px*1.15),'background skins add wave clear pixels ('+base.px+' > '+S.px+')');
let tot=0;for(let i=0;i<20;i++){S.paid=false;S.left=0;S.en=[];S.wave=11;const c=M.chips;step(1/60);tot+=M.chips-c}
ok(Math.abs(tot-20*base.ch*1.15)<=1,'chips per wave clear average +15% ('+tot+' over 20 clears)');
// kill drops: pixels per kill
M.cert=70;M.claim=70;reset();S.menu=false;S.pause=false;let n=0;for(let i=0;i<400;i++){S.pt=[];kill({t:TYPES[2],x:CX+50,y:CY});n+=S.pt.length}
const exp=400*TYPES[2].px*(1+stat.magnet())*1.3;ok(Math.abs(n-exp)<exp*.03,'enemy skins add pixels per kill ('+n+' vs '+Math.round(exp)+')');
// save: v12 keeps the worn skin, old saves get Classic
M.skin={e:3,t:1,b:2};save();loadMeta(JSON.parse(localStorage.getItem('pixelTowerMeta')));ok(M.v===SAVE_V&&M.skin.e===3&&M.skin.t===1&&M.skin.b===2,'worn skins survive save and load');
loadMeta({v:11,chips:5,lv:{},hist:[],best:40,cert:30});ok(M.skin.e===0&&M.skin.t===0&&M.skin.b===0&&skinOwned(1)&&!skinOwned(2),'v11 save: Classic worn, wave 30 set already owned');
// home card and screen
M.cert=0;M.claim=0;showHome();ok($('hsk')===null&&[...document.querySelectorAll('#hlk .lk')][1].textContent.includes('Wave 30'),'Skins locked on the menu until the wave 30 certificate');
M.cert=30;M.claim=30;showHome();ok($('hsk')&&$('hsk').textContent.includes('3 of 9'),'Skins card opens with the first set (3 of 9)');
click($('hsk'));ok(shown($('sk')),'Skins screen opens');
const bs=[...document.querySelectorAll('#skl button')];ok(bs.length===12&&bs.filter(b=>b.disabled).length===6,'12 skins shown, Neon and Crystal locked');
click(bs[1]);ok(M.skin.e===1&&JSON.parse(localStorage.getItem('pixelTowerMeta')).skin.e===1,'tapping a skin wears and saves it');
ok($('skb').textContent.includes('+5%'),'screen shows the owned bonus');
click($('skc'));ok(shown($('home'))&&!shown($('sk')),'Back returns to the menu');
// certificate at wave 30 announces skins and lists them on game over
skipTips();M.cert=20;M.claim=20;M.best=29;reset();S.menu=false;S.pause=false;S.start=S.start||{best:29,bk:0,bt:false,open:[],res:Object.assign({},M.res)};S.wave=30;S.left=0;S.en=[];S.paid=false;step(1/60);
ok(S.bt1==='CERTIFICATE: Byte Guard'&&M.cert===30&&!skinOwned(1),'wave 30 certificate earned, skins not owned until collected');
ok(runNews().items.some(t=>t.includes('Collect +38 chips and the Bug Hunt skins')),'game over says to collect the certificate and skins');
const cc0=M.chips;claimCert();ok(skinOwned(1)&&M.chips===cc0+38,'collecting the wave 30 certificate gives the skins');
done();
