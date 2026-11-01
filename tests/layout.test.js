// The HUD must not reflow when numbers grow (it used to wrap and push the game down on phones).
skipTips();play();
document.documentElement.style.setProperty('--mw','280px');   // narrowest phone layout
const pos=()=>{ui();const r=e=>e.getBoundingClientRect();return [r($('pb')).left,r($('pb')).top,r($('snd')).left,r($('c')).top,r($('hud')).height].map(Math.round).join(',')};
S.px=0;S.wave=1;M.chips=0;M.best=0;const a=pos();
S.px=12345;S.wave=99;M.chips=999;M.best=99;const b=pos();
S.px=7;S.wave=3;M.chips=12;M.best=8;const c=pos();
ok(a===b&&b===c,'HUD buttons and game stay put as numbers change ('+a+' / '+b+')');
ok($('hud').scrollWidth<=$('hud').clientWidth+1,'HUD does not overflow at 280px');
ok(document.title==='Idle Pixel Tower','page title is Idle Pixel Tower');
showHome();ok($('homeh').innerText.replace(/\s+/g,' ')==='IDLE PIXEL TOWER','home screen shows IDLE PIXEL TOWER');
done();
