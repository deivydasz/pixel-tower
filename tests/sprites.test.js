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
done();
