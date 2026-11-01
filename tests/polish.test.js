// Polish: icon, banner placement, no stray canvas text, no needless DOM writes.
ok(!!document.querySelector('link[rel="icon"][href^="data:image/svg+xml"]')&&!!document.querySelector('link[rel="apple-touch-icon"][href^="data:image/png;base64,"]'),'favicon and home-screen icon embedded');
skipTips();play();step(2);S.pause=true;ui();  // paused, so real animation frames do not change anything either
// no DOM changes when nothing changed
let muts=0;const mo=new MutationObserver(l=>muts+=l.length);for(const id of ['hud','stage','ups'])mo.observe($(id),{subtree:true,childList:true,characterData:true,attributes:true});
for(let i=0;i<20;i++)ui();
setTimeout(()=>{
  mo.disconnect();ok(muts===0,'20 idle ui() frames make no DOM changes (made '+muts+')');
  // values still update when they change
  S.px+=7;ui();ok($('px').textContent===S.px+' px','changed value still updates');S.pause=false;
  // banner draws above the tower, clear of the top bars
  const calls=[];const ft=g.fillText.bind(g);g.fillText=(t,x,y)=>{calls.push([t,y]);ft(t,x,y)};
  S.bonus=1;S.bt1='Wave 3 clear';S.bt='+11 px +1 chips';draw();g.fillText=ft;
  const b=calls.find(c=>c[0]==='Wave 3 clear');ok(b&&b[1]>CY+20&&b[1]<H-60,'banner drawn below the tower, above the NOVA button (y='+(b&&b[1])+')');
  // game over: canvas no longer draws its own text, tapping the canvas does not restart
  const c2=[];g.fillText=(t,x,y)=>c2.push(t);S.bonus=0;die();draw();g.fillText=ft;
  ok(!c2.some(t=>/GAME OVER|Tap to restart/.test(t)),'no stray canvas game over text');
  const w=S.wave;click($('c'));ok(S.over&&S.wave===w,'tapping the canvas behind game over does nothing');
  // legend fades while an enemy is under it
  click($('gor'));S.en=[];S.left=99;S.sp=99;legBox.n=0;ui();ok(!leg.classList.contains('fade'),'legend solid with no enemy under it');
  enemy((legBox.x0+legBox.x1)/2-CX,(legBox.y0+legBox.y1)/2-CY,0,99);ui();ok(leg.classList.contains('fade'),'legend fades with an enemy under it');
  S.en=[];ui();ok(!leg.classList.contains('fade'),'legend returns when the enemy leaves');
  // NOVA button sits in the bottom-right corner, not over the middle
  const nr=$('nova').getBoundingClientRect(),cr=$('c').getBoundingClientRect();ok(nr.right>cr.right-12&&nr.left>cr.left+cr.width/2,'NOVA button in the bottom-right corner');
  done();
},0);
