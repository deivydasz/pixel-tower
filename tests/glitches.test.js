// Glitches: pick 1 of 3 run-only boosts at wave 5, 15, 25...; the game waits for the pick; effects; stacking; save state.
GLITCH.auto=false;skipTips();M.best=30;play();
const zgClear=w=>{S.wave=w;S.left=0;S.en=[];S.paid=false;S.gap=9;step(.05)};
zgClear(GLITCH.first-1);ok(!S.gpick,'no glitch before wave '+GLITCH.first);ui();
ok($('w').textContent==='Wave '+(GLITCH.first-1)&&[...$('bits').children].filter(b=>b.className==='on').length===GLITCH.first-1,'byte meter: '+(GLITCH.first-1)+' of 8 bits lit');
zgClear(GLITCH.first);ui();
ok(S.gpick&&S.gpick.length===3&&new Set(S.gpick).size===3&&S.gpick.every(k=>GLITCHES[k]),'wave '+GLITCH.first+' clear offers three different glitches: '+S.gpick);
ok([...$('bits').children].every(b=>b.className==='on')&&$('bits').classList.contains('byte')&&S.bt1==='BYTE 1','all 8 bits lit: a byte (banner BYTE 1)');
ok(shown($('gl'))&&$('glo').querySelectorAll('button').length===3&&$('glo').textContent.includes(GLITCHES[S.gpick[0]].n),'the Glitch panel shows them');
const zgT=S.time;step(1);ok(S.time===zgT,'the game waits for the pick');
ok(!nova(),'no Blast while picking');setPause(true);ok(!S.pause,'no pause while picking');
const zgK=S.gpick[1];click($('glo').querySelectorAll('button')[1]);ui();
ok(S.gl[zgK]===1&&!S.gpick&&!shown($('gl'))&&S.bt1==='GLITCH'&&S.bt===GLITCHES[zgK].n,'tapping one keeps it: '+zgK);
step(1);ok(S.time>zgT,'the run goes on');
S.gap=0;step(.05);ui();ok(S.wave===GLITCH.first+1&&[...$('bits').children].every(b=>b.className==='')&&!$('bits').classList.contains('byte'),'next wave: the byte meter starts again');
zgClear(GLITCH.first+1);ok(!S.gpick,'nothing between glitch waves');
zgClear(GLITCH.first+GLITCH.every);ok(S.gpick,'next offer at wave '+(GLITCH.first+GLITCH.every));
const zgK2=S.gpick[2];key('3');ok(S.gl[zgK2]>=1&&!S.gpick,'number keys pick too');
// stacking, and maxed glitches are not offered
S.gl={};for(const k of GL_KEYS)S.gl[k]=GLITCHES[k].max;S.gl.sharp=0;S.gl.wide=0;S.gl.rain=GLITCHES.rain.max-1;
ok(glitchOffer().sort().join()==='rain,sharp,wide','only glitches below their max are offered');
S.gl={sharp:1};S.gpick=['sharp','wide','rain'];pickGlitch(0);ok(S.gl.sharp===2&&S.bt==='Sharp Pixels x2','picking it again stacks it');
for(const k of GL_KEYS)S.gl[k]=GLITCHES[k].max;S.gpick=null;zgClear(GLITCH.first+2*GLITCH.every);ok(!S.gpick,'no offer when everything is maxed');
// effects
S.gl={};S.lv.hp=0;const zg0={dmg:stat.dmg(),rate:stat.rate(),range:stat.range(),max:stat.max(),cr:critChance(),cd:novaCd(),c:cost('dmg'),e:edmg(TYPES[2])};
S.gl={sharp:2,turbo:1,wide:1,scan:1,dither:1,refresh:1,zip:1,alias:1};
ok(Math.abs(stat.dmg()-zg0.dmg*(1+2*GLITCHES.sharp.v))<1e-9&&Math.abs(stat.rate()-zg0.rate*(1+GLITCHES.turbo.v))<1e-9&&stat.range()===zg0.range+GLITCHES.wide.v,'Sharp Pixels, Turbo Bit, Widescreen');
ok(Math.abs(stat.max()-zg0.max*(1+GLITCHES.scan.v))<1e-9&&Math.abs(critChance()-zg0.cr-GLITCHES.dither.v)<1e-9&&Math.abs(novaCd()-zg0.cd*(1-GLITCHES.refresh.v))<1e-9,'Scanlines, Dither Shot, Refresh Rate');
ok(cost('dmg')===Math.round(UP.dmg.base*Math.pow(1.6,S.lv.dmg)*(1-GLITCHES.zip.v))&&edmg(TYPES[2])<zg0.e,'Compression, Anti-Aliasing');
S.gl={};S.hp=10;S.gpick=['scan'];pickGlitch(0);ok(Math.abs(S.hp-(10+stat.max()-stat.max()/(1+GLITCHES.scan.v)))<1e-9,'Scanlines adds the new HP right away');
// Pixel Rain and Stray Bit
S.gl={rain:1};const zgR=Math.random;Math.random=()=>.99;S.pt=[];kill(enemy(30,0,0,1));Math.random=zgR;
ok(S.pt.length===Math.floor(TYPES[0].px*(1+stat.magnet())*(1+skinB('e'))*(1+GLITCHES.rain.v)),'Pixel Rain: more pixels per kill');
S.gl={stray:1};S.en=[];S.pr=[];enemy(20,0,0,999);S.cd=0;step(1/60);ok(S.pr.length===2+RL('spray'),'Stray Bit: one more bullet');
// Save State
S.gl={save:1};S.en=[];S.hp=.1;enemy(3,0,0,5);step(.1);ok(!S.over&&S.hp===stat.max()*GLITCHES.save.v&&S.bt1==='SAVE STATE LOADED','Save State survives a killing blow once');
S.hp=.1;enemy(3,0,0,5);step(.1);ok(S.over,'but only once');
ok(trackLog.filter(e=>e.type==='run').pop().data.gl.save===1,'run stats include the glitches');
// pause panel lists them; a new run clears them
click($('gor'));ok(JSON.stringify(S.gl)==='{}','a new run starts without glitches');
S.gl={sharp:2,save:1};setPause(true);ui();ok($('pzd').textContent==='Glitches: Sharp Pixels x2, Save State','pause panel lists the glitches');setPause(false);
// hidden tab: picks by itself so the run keeps going
zgClear(GLITCH.first);ok(S.gpick,'offer waiting');Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});step(.05);
Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});ok(!S.gpick&&GL_KEYS.some(k=>S.gl[k]),'auto-picked while the tab was hidden');
// daily runs: same offers for everyone that day
const zgD=()=>{reset(true);S.menu=false;S.pause=false;zgClear(GLITCH.first);const o=S.gpick.join();S.gpick=null;return o};
ok(zgD()===zgD(),'daily run glitch offers are seeded');
done();
