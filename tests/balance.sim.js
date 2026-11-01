// Balance simulation, not a pass/fail test. Run: VT=400000 tests/run.sh tests/balance.sim.js
// A bot buys the cheapest unlocked upgrade whenever it can (first runs start with only Damage and Tower HP), and fires Nova when 3+ enemies are near,
// at low HP, or when a shielded Warden is in range. Results vary a few waves / percent between runs.
skipTips();sfx=()=>{};play();
function run(meta,useNova){
  M.lv={dmg:meta,rate:meta,range:meta,hp:meta,armor:meta,magnet:meta};M.best=meta?99:0;reset();S.menu=false;S.pause=false;let novas=0,boss20=null;
  for(let t=0;t<60*3000&&!S.over;t++){
    const wv=S.wave,b=S.en.find(e=>e.boss);
    update(1/60);
    const k=openUps().sort((a,b)=>cost(a)-cost(b))[0];if(S.px>=cost(k)){S.px-=cost(k);S.lv[k]++;if(k==='hp')S.hp=Math.min(stat.max(),S.hp+10)}
    if(useNova&&S.nova===0){const near=S.en.filter(e=>Math.hypot(e.x-CX,e.y-CY)<30).length,wd=S.en.find(e=>e.boss&&e.t.shield&&e.shd<=0&&Math.hypot(e.x-CX,e.y-CY)<stat.range());
      if(near>=3||wd||(near>=1&&S.hp<.5*stat.max()))nova()&&novas++}
    if(b&&wv===20&&boss20===null&&(!S.en.includes(b)||S.over))boss20=b.hp<=0;
  }
  return {w:S.wave,novas,boss20};
}
function stats(name,meta,nv,n){const r=[];for(let i=0;i<n;i++)r.push(run(meta,nv));const w=r.map(x=>x.w).sort((a,b)=>a-b);
  const met=r.filter(x=>x.boss20!==null);
  RES.push('INFO '+name.padEnd(28)+'waves min '+w[0]+' median '+w[n>>1]+' max '+w[n-1]+(met.length?'  wave-20 boss beaten '+Math.round(100*met.filter(x=>x.boss20).length/met.length)+'% of '+met.length:''))}
stats('first run, no Nova',0,0,20);
stats('first run, Nova',0,1,20);
for(const L of [2,3,4,6])stats('foundry lv'+L+', Nova',L,1,12);
done();
