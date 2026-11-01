// Balance simulation, not a pass/fail test. Run: VT=150000 tests/run.sh tests/balance.sim.js
// A bot buys the cheapest upgrade whenever it can and fires Nova when 3+ enemies are near (or 1+ at low HP).
skipTips();play();sfx=()=>{};
function run(buy,useNova,meta){
  M.lv={dmg:meta,rate:meta,range:meta,hp:meta,armor:meta};reset();let novas=0;
  for(let t=0;t<60*1500&&!S.over;t++){
    update(1/60);
    if(buy){const k=Object.keys(UP).sort((a,b)=>cost(a)-cost(b))[0];if(S.px>=cost(k)){S.px-=cost(k);S.lv[k]++;if(k==='hp')S.hp=Math.min(stat.max(),S.hp+10)}}
    if(useNova&&S.nova===0){const near=S.en.filter(e=>Math.hypot(e.x-CX,e.y-CY)<30).length;if(near>=3||(near>=1&&S.hp<.5*stat.max()))nova()&&novas++}
  }
  return [S.wave,novas];
}
function stats(name,buy,nv,meta){const w=[],n=[];for(let i=0;i<20;i++){const [a,b]=run(buy,nv,meta);w.push(a);n.push(b)}
  w.sort((a,b)=>a-b);n.sort((a,b)=>a-b);
  RES.push('INFO '+name.padEnd(30)+'waves min '+w[0]+' median '+w[10]+' max '+w[19]+(nv?'  novas ~'+n[10]:''))}
stats('first run, no upgrades',0,0,0);
stats('first run, upgrades',1,0,0);
stats('first run, upgrades + Nova',1,1,0);
stats('foundry lv3, upgrades + Nova',1,1,3);
done();
