const CFG={name:'skins',runs:60};
// Campaign simulation (balance, not pass/fail). A "smart" bot plays many runs in a row like a new player:
// in-run it buys the upgrade with the best value for its price (damage per second, survival weighted by how much
// damage it is taking, economy early), uses Blast on crowds, then spends chips in the Foundry and studies Bit Theory
// between runs. Research timers run on game time plus a 10 minute break per run.
// Configure with a CFG object defined before this file (see tests/README.md), e.g.
//   const CFG={name:'today',runs:40,en:{hpGrow:1.12,dmgStep:0},bot:'smart'};
// Prints per-run waves and hook metrics (new-best rate, longest dry streak, run length, first boss).
skipTips();sfx=()=>{};buzz=()=>{};play();
const C=Object.assign({name:'default',runs:40,en:{},bot:'smart',mode:'campaign',setups:[]},typeof CFG==='object'?CFG:{});
Object.assign(EN,C.en);
if(C.boss)Object.assign(BOSS,C.boss);
if(C.patch)C.patch();

// ---- in-run buying
const dps=()=>stat.dmg()*stat.rate()*(1+critChance()*(stat.critx()-1))*(1+.6*M.res.spray)*(1+.3*M.res.pierce);
function gainOf(k,threat){
  const lv=S.lv[k],d0=dps(),r0=stat.range(),h0=stat.max(),a0=stat.armor();
  const mix=[TYPES[0],TYPES[1],TYPES[2]].filter(t=>S.wave>=t.min);
  const hit=()=>mix.reduce((s,t)=>s+edmg(t),0)/mix.length;const hb=hit();
  S.lv[k]++;let g=0;
  if(k==='dmg'||k==='rate'||k==='critx')g=dps()/d0-1;
  else if(k==='range')g=.7*(stat.range()/r0-1)*(r0<W/2+10?1:.4);
  else if(k==='hp')g=threat*(stat.max()/h0-1)+(S.hp<.45*h0?threat*.25:0);
  else if(k==='armor')g=threat*1.2*(1-hit()/hb);
  else if(k==='magnet')g=S.wave<25?.5*MAGNET.run/(1+stat.magnet()):0;
  else if(k==='bank')g=S.wave<30?.35*Math.min(BANK.capRun,S.px*BANK.run)/(10+S.wave*2):0;
  else if(k==='heavy')g=.3*threat*(S.wave>=5?1:0);
  S.lv[k]=lv;return g;
}
let T={lost:0,hp0:0,wave:0,threat:.4},certChipsTotal=0,tryChips=0;
function smartBuy(){
  if(S.wave!==T.wave){const f=T.lost/Math.max(1,stat.max());T.threat=Math.max(.15,Math.min(3,.5*T.threat+.5*f*5));T.lost=0;T.wave=S.wave}
  if(S.hp<T.hp0)T.lost+=T.hp0-S.hp;T.hp0=S.hp;
  const ks=openUps();let best=null,bv=0;
  for(const k of ks){const v=gainOf(k,T.threat)/cost(k);if(v>bv){bv=v;best=k}}
  if(best&&S.px>=cost(best)){S.px-=cost(best);S.lv[best]++;if(best==='hp')S.hp=Math.min(stat.max(),S.hp+10);T.hp0=S.hp}
}
function cheapBuy(){const k=openUps().sort((a,b)=>cost(a)-cost(b))[0];if(k&&S.px>=cost(k)){S.px-=cost(k);S.lv[k]++;if(k==='hp')S.hp=Math.min(stat.max(),S.hp+10)}}
function useBlast(){
  if(S.nova>0)return;
  const near=S.en.filter(e=>Math.hypot(e.x-CX,e.y-CY)<30).length,wd=S.en.find(e=>e.boss&&e.t.shield&&e.shd<=0&&Math.hypot(e.x-CX,e.y-CY)<stat.range());
  if(near>=3||wd||(near>=1&&S.hp<.5*stat.max()))nova();
}
// one run with the current save; returns what happened
function playRun(bot){
  reset();S.menu=false;S.pause=false;T={lost:0,hp0:S.hp,wave:0,threat:.4};const k0=M.bk,c0=M.chips;
  for(let t=0;t<60*7200&&!S.over;t++){update(1/60);(bot==='cheap'?cheapBuy:smartBuy)();useBlast()}
  if(!S.over)endRun(true);
  if(S.btry)tryChips+=S.btry.chips;for(const w of S.certs||[])certChipsTotal+=certChips(w);
  return {w:S.wave,min:S.time/60,bosses:M.bk-k0,chips:M.chips-c0,killer:S.killer?S.killer.n:'-'};
}
// ---- between runs: Foundry and Bit Theory
const FW={dmg:1,rate:1,range:.6,hp:.7,armor:.6,magnet:.5,bank:.2};
function foundry(){
  for(let n=0;n<200;n++){let best=null,bv=0;
    for(const k of META_UPS){if(!upOpen(k))continue;const v=FW[k]/(1+.15*M.lv[k])/mcost(k);if(v>bv){bv=v;best=k}}
    if(!best||M.chips<mcost(best))return;M.chips-=mcost(best);M.lv[best]++}
}
const RES_ORDER=['crit','pierce','depth','spray','nova','speed'];
let resClock=0;  // seconds of research progress available
function research(sec){
  resClock+=sec;
  for(let n=0;n<20;n++){
    if(M.rq){const need=resMin(M.rq.k,M.res[M.rq.k])*60;if(resClock<need)return;resClock-=need;M.res[M.rq.k]++;M.rq=null}
    const k=RES_ORDER.find(k=>k!=='speed'&&resCanAfford(k));if(!k){resClock=Math.min(resClock,3600);return}
    const c=resCost(k,M.res[k]);M.cores-=c.cores;M.chips-=c.chips;M.rq={k,end:0};
  }
}
const fmtR=r=>r.w;
if(C.mode==='compare'){
  // fixed setups, smart vs cheap bot: [label, foundry level for every upgrade, research levels, best wave]
  for(const [label,L,res,best] of C.setups){
    for(const bot of ['cheap','smart']){const w=[];
      for(let i=0;i<C.n;i++){M.lv={dmg:L,rate:L,range:L,hp:L,armor:L,magnet:L,bank:0};M.res=Object.assign({spray:0,pierce:0,crit:0,nova:0,depth:0,speed:0},res);M.best=best;w.push(playRun(bot).w)}
      w.sort((a,b)=>a-b);RES.push('INFO '+(label+' '+bot).padEnd(30)+'min '+w[0]+' median '+w[w.length>>1]+' max '+w[w.length-1])}}
}else{
  localStorage.clear();loadMeta({v:SAVE_V,chips:0,lv:{},hist:[]});M.tips={start:1,buy:1,nova:1,foundry:1,boss:1,warden:1};if(C.noCert)M.cert=1e6;  // turn certificates off to measure them
  const runs=[];let best=0,news=0,dry=0,maxDry=0,firstBoss=0;
  for(let i=0;i<C.runs;i++){
    const r=playRun(C.bot);runs.push(r);
    if(r.w>best){best=r.w;news++;dry=0}else{dry++;maxDry=Math.max(maxDry,dry)}
    if(!firstBoss&&M.bk>0)firstBoss=i+1;
    foundry();research(r.min*60+600);foundry();
  }
  const ws=runs.map(r=>r.w),mins=runs.map(r=>r.min);
  const at=n=>Math.max(...ws.slice(0,n));
  RES.push('INFO ['+C.name+'] waves: '+ws.join(' '));
  RES.push('INFO ['+C.name+'] best after run 1/3/5/10/20/'+C.runs+': '+[1,3,5,10,20,C.runs].map(at).join(' / ')+
    ' | new best in '+news+'/'+C.runs+' runs, longest dry streak '+maxDry+' | first boss beaten on run '+(firstBoss||'never')+
    ' | run length min/median/max '+[Math.min(...mins),mins.slice().sort((a,b)=>a-b)[mins.length>>1],Math.max(...mins)].map(x=>x.toFixed(1)).join('/')+' min'+
    ' | total play '+(mins.reduce((a,b)=>a+b,0)/60).toFixed(1)+'h | research '+RES_ORDER.map(k=>k+M.res[k]).join(' ')+' | foundry '+META_UPS.map(k=>k+M.lv[k]).join(' '));
  RES.push('INFO ['+C.name+'] chips from certificates '+certChipsTotal+', from boss attempts '+tryChips+' (all chips earned '+runs.reduce((a,r)=>a+r.chips,0)+')');
  RES.push('INFO ['+C.name+'] killers: '+Object.entries(runs.reduce((o,r)=>(o[r.killer]=(o[r.killer]||0)+1,o),{})).map(([k,v])=>k+' '+v).join(', '));
}
done();
