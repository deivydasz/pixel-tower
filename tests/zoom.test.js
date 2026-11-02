// Zoom out so the range ring always fits; enemies still spawn off-screen; HUD stays full size.
skipTips();M.best=99;play();S.en=[];S.left=99;S.sp=99;
ok(zoomTarget()===1&&S.zoom===1,'normal range: no zoom');
S.lv.range=10;const r=stat.range();step(4);
ok(Math.abs(S.zoom-zoomTarget())<.01&&zoomTarget()<1&&r*zoomTarget()<=W/2-5.9,'range '+r+': zoomed out to '+zoomTarget().toFixed(2)+' so the ring fits the width');
S.lv.range=0;S.zoom=1;S.lv.range=10;step(.2);ok(S.zoom<1&&S.zoom>zoomTarget(),'zoom eases in smoothly, not a jump');
S.lv.range=100;ok(zoomTarget()===ZOOM_MIN,'zoom never goes below '+ZOOM_MIN);S.lv.range=10;step(4);
// spawns stay outside the visible area at any zoom
let inside=0;for(let i=0;i<72;i++){const a=i/72*Math.PI*2,d=spawnDist(a),[x,y]=toScreen(CX+Math.cos(a)*d,CY+Math.sin(a)*d);if(x>0&&x<W&&y>0&&y<H)inside++}
ok(inside===0&&spawnDist(0)>=140,'zoomed out: every spawn point is just off-screen');
// drawing: world shrinks (tower drawn smaller), HUD-like labels and the cat do not
const rects=[];const fr=g.fillRect.bind(g);g.fillRect=(x,y,w,h)=>{rects.push([x,y,w,h]);fr(x,y,w,h)};draw();g.fillRect=fr;
ok(rects.some(q=>q[2]===Math.max(1,Math.round(11*S.zoom))&&q[3]===q[2]),'tower drawn at zoomed size');
catStart('walk');cat.dir=1;for(let i=0;i<20;i++)catTick(.05);draw();ok(cat.box&&cat.box.h===catH(CAT_SPR.walk[0]),'cat stays full size when zoomed');catEnd();
done();
