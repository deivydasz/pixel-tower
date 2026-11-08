// Firmware (between-run upgrades, code: Foundry / M.lv / mcost): each level counts as a full in-run level; cost grows FW.grow per level.
skipTips();
M.best=99;play();
const zfSame=k=>{S.lv[k]=0;M.lv[k]=3;const a=stat[k]();M.lv[k]=0;S.lv[k]=3;const b=stat[k]();S.lv[k]=0;return Math.abs(a-b)<1e-9};
ok(['dmg','rate','range','armor','magnet','bank','bankCap'].every(zfSame),'a Firmware level gives the same as an in-run level');
S.lv.hp=0;M.lv.hp=3;const zfH=stat.max();M.lv.hp=0;S.lv.hp=3;ok(zfH===stat.max(),'Tower HP too');S.lv.hp=0;
M.lv.dmg=2;S.lv.dmg=1;ok(Math.abs(stat.dmg()/Math.pow(1.2,RL('depth'))/(1+skinB('t'))-4)<1e-9,'Firmware and in-run levels add up');M.lv.dmg=0;S.lv.dmg=0;
M.lv.rate=0;ok(mcost('rate')===FW.base,'level 1 costs '+FW.base+' chips');
M.lv.rate=10;ok(mcost('rate')===Math.round(FW.base*Math.pow(FW.grow,10)),'cost grows x'+FW.grow+' per level (level 11: '+mcost('rate')+' chips)');M.lv.rate=0;
// daily runs still ignore Firmware
M.lv.dmg=5;showDaily();click($('dyp'));ok(S.daily&&stat.dmg()===1*dmod('dmg')*(1+gv('sharp')),'Daily runs ignore Firmware');M.lv.dmg=0;
// screen name and wording
die();click($('gom'));ok($('hfy').textContent.startsWith('Firmware'),'home tile says Firmware');
click($('hfy'));ok(shown($('fy'))&&$('fyh').textContent.startsWith('Firmware: '),'screen title: Firmware');
ok(!/foundry/i.test(document.body.innerText),'no "Foundry" left anywhere on screen');
done();
