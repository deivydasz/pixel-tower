// Enemy sprites: every type has two frames with even rows, all colour states render, and drawing works at any zoom.
skipTips();play();
for(const t of [...TYPES,...BOSSES]){const fr=ESPR[t.n];
  ok(fr&&fr.length===2,t.n+' has two frames');
  ok(fr.every(f=>f.every(r=>r.length===f[0].length)),t.n+' rows are even');
  ok(t.s<=fr[0][0].length&&fr[0][0].length<=t.s+4,t.n+' sprite stays close to its hitbox size');
  for(const st of ['','h','x'])ok(sprCanvas(t,0,st).width===fr[0][0].length,t.n+' renders state "'+st+'"')}
S.en.push({x:CX+20,y:CY,t:TYPES[2],hp:5,max:5,hit:0});S.en.push({x:CX-20,y:CY,t:BOSSES[2],hp:5,max:5,hit:0,boss:1,shd:0});
S.zoom=1;draw();S.zoom=.5;draw();S.zoom=1;
ok(window.__err.length===0,'drawing enemies at zoom 1 and 0.5 throws nothing');
// tower: grows with Tower HP bought this run, one barrel per Spray and Pray bullet
S.lv.hp=0;ok(towerN()===11,'tower starts 11 px');S.lv.hp=1;ok(towerN()===13,'HP 1 grows the base');S.lv.hp=12;ok(towerN()===17,'HP 12 gives the full fortress');
ok([0,1,2,3].every(t=>towerGrid(t).every(r=>r.length===11+2*t)),'tower grids are square');
const barrels=()=>{const n0=[];const fr=g.fillRect.bind(g);let c=0;g.fillRect=(x,y,w,h)=>{if(g.fillStyle==='#ffffff')c++;fr(x,y,w,h)};S.mf=0;draw();g.fillRect=fr;return c};
M.res.spray=0;const b1=barrels();M.res.spray=2;const b3=barrels();M.res.spray=0;
ok(b3===3*b1,'Spray and Pray 2 draws three barrels ('+b1+' / '+b3+' tip pixels)');
ui();ok([...$('leg').querySelectorAll('i canvas')].length===TYPES.length,'legend shows a sprite icon per enemy type');
ok(getComputedStyle($('leg').querySelector('i canvas')).outlineStyle==='none','legend icons have no frame');
done();
