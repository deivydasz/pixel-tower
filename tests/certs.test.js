// Enemy damage scaling, certificates, boss attempt rewards and the game over "so close" line.
skipTips();play();
ok(EN.hpGrow===1.11&&EN.dmgStep===.1,'balance: HP x1.11 per wave, +10% damage every 5 waves');
S.wave=4;ok(edmg(TYPES[2])===3,'Tank hits 3 before wave 5');S.wave=5;ok(Math.abs(edmg(TYPES[2])-3.3)<1e-9,'Tank hits 3.3 at wave 5');
S.wave=50;ok(Math.abs(edmg(TYPES[0])-2)<1e-9,'Grunt hits 2 at wave 50');S.lv.armor=10;ok(edmg(TYPES[0])===.2,'Dmg sponge still works (min 0.2)');S.lv.armor=0;
ui();ok($('leg').textContent.includes('Dmg 2'),'legend shows the grown damage');
// certificate on completing wave 10
const c0=M.chips;S.wave=9;S.en=[];S.left=0;S.paid=true;S.gap=0;step(.05);ok(S.wave===10,'wave 10 started');
S.left=0;S.en=[];step(.05);ok(M.cert===10&&M.claim===0&&M.chips===c0+3&&S.bt1==='CERTIFICATE: Pixel Apprentice'&&S.bt==='Collect it on the menu','completing wave 10 earns Pixel Apprentice, reward not paid yet');
ok(claimCert()===10&&M.chips===c0+3+certChips(10)&&M.claim===10&&claimCert()===0,'collecting pays +'+certChips(10)+' chips once');
const c1=M.chips;M.cert=10;S.wave=9;S.paid=true;S.gap=0;S.left=0;S.en=[];step(.05);S.left=0;S.en=[];step(.05);ok(M.cert===10&&M.chips===c1+3,'only once');
ok([10,20,30,50,100].map(certChips).join()==='8,20,38,88,300','certificate rewards grow with the wave');
ok([10,20,30,50,100].map(certNibs).join()==='0,0,6,10,20','certificates from wave 30 also pay packets (1 per 5 waves)');
{const n0=M.nib,c0=M.claim,k0=M.cert;M.cert=30;M.claim=20;claimCert();ok(M.nib===n0+6,'collecting the wave 30 certificate pays its packets');M.nib=n0;M.claim=c0;M.cert=k0}
// boss attempt reward
S.wave=20;S.en=[];const b=enemy(30,0,0,1000);b.boss=1;b.max=1000;b.hp=350;b.t=bossFor(20);const c2=M.chips;S.cert=0;
endRun(false);ok(S.btry&&Math.abs(S.btry.share-.65)<1e-9&&S.btry.chips===Math.round(bossChips(20)*.65)&&M.chips===c2+S.btry.chips,'dying at a boss pays chips for the damage dealt ('+S.btry.chips+')');
ok($('gnm').textContent.includes('Brute had 35% HP left')&&$('gnm').textContent.includes('chips for the damage'),'game over: '+$('gnm').textContent);
ok(M.cores===0,'no core without a kill');
// near-miss lines
reset();S.menu=false;M.best=30;M.cert=20;S.wave=28;endRun(false);ok($('gnm').textContent==='Only 2 waves short of your best (30).','near your best: '+$('gnm').textContent);
reset();S.menu=false;M.best=30;M.cert=20;S.wave=26;S.record=false;endRun(false);ok(/Complete wave 30 for the Byte Guard certificate/.test($('gnm').textContent),'near a certificate: '+$('gnm').textContent);
reset();S.menu=false;M.best=30;M.cert=20;S.wave=12;M.chips=mcost('dmg')-2;for(const k of META_UPS)M.lv[k]=k==='dmg'?0:9;endRun(false);ok(/Just 2 chips short of Damage Lv 1/.test($('gnm').textContent),'near an upgrade: '+$('gnm').textContent);
reset();S.menu=false;M.chips=0;for(const k of META_UPS)M.lv[k]=9;S.wave=12;M.best=50;M.cert=40;endRun(false);ok(!shown($('gnm'))||$('gnm').textContent==='','nothing close: no line');
// unlocked card and certificates screen
reset();S.menu=false;S.certs=[10];S.start={best:99,cores:0,res:Object.assign({},M.res),open:[],bt:true};S.wave=11;endRun(false);ok($('gnl').textContent.includes('Certificate: Pixel Apprentice'),'game over lists the certificate');
M.cert=20;M.claim=20;showHome();ok($('hcen').textContent==='2 earned','home shows 2 certificates earned');
click($('hce'));ok(shown($('ce'))&&$('cel').querySelectorAll('.on').length===2&&$('cel').querySelector('.nx').textContent.includes('Byte Guard'),'certificates screen: 2 earned, Byte Guard next');
click($('cec'));ok(shown($('home')),'Back to home');
// saves
loadMeta({v:9,chips:1,lv:{},best:47,hist:[]});ok(M.cert===40&&M.chips===1,'v9 save with best 47 gets certificates up to 40, no chips');
loadMeta({v:9,chips:1,lv:{},best:10,hist:[]});ok(M.cert===0,'best 10 = wave 10 not completed, no certificate');
loadMeta({v:10,chips:1,lv:{},best:47,cert:33,hist:[]});ok(M.cert===30,'odd cert value rounded down');
// collecting on the certificates screen
skipTips();M.cert=30;M.claim=10;M.chips=0;showHome();ok($('hcen').textContent==='Reward ready!'&&$('hcen').classList.contains('rdy'),'menu flags an uncollected certificate');
click($('hce'));const go=()=>$('cel').querySelector('.go');ok(go()&&go().textContent.includes('Bit Cadet')&&$('cel').querySelectorAll('.cl').length===2,'Bit Cadet is next to collect, 2 waiting');
click(go());ok(M.claim===20&&M.chips===certChips(20)&&$('cem').textContent.startsWith('Bit Cadet: +20 chips collected'),'tap collects Bit Cadet');
click(go());ok(M.claim===30&&$('cem').textContent.includes('Bug Hunt skins unlocked')&&!go(),'then Byte Guard with the Bug Hunt skins, nothing left');
ok(JSON.parse(localStorage.getItem('pixelTowerMeta')).claim===30,'collected certificates are saved');
click($('cec'));ok($('hcen').textContent==='3 earned','menu back to the earned count');
loadMeta({v:12,chips:1,lv:{},best:47,cert:40,hist:[]});ok(M.claim===40,'v12 save: certificates already paid count as collected');
done();
