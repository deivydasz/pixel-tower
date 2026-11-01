skipTips();
const rows=()=>$('hil').querySelectorAll('.hr:not(.hh)');
const cells=r=>[...r.children].map(c=>c.textContent);
click($('hhi'));ok(shown($('hi'))&&rows().length===0&&$('hil').textContent.includes('No runs yet'),'empty history message');
click($('hic'));ok(shown($('home')),'Back returns home');
// run 1: wave 3, uses nova twice, killed by a Grunt
play();step(1);nova();S.nova=0;nova();S.wave=3;S.earn=4;S.left=99;S.sp=99;die();
let h=M.hist[0];
ok(M.hist.length===1&&h.w===3&&h.k==='Grunt'&&h.c===4&&h.n===2&&h.d>=1&&!h.r,'run saved: wave, killer, chips, novas, duration');
ok(JSON.parse(localStorage.getItem('pixelTowerMeta')).hist.length===1,'history persisted in save');
// run 2: new record
click($('gor'));S.wave=6;die();ok(M.hist.length===2&&M.hist[0].w===6&&M.hist[0].r===1,'newest first, record flagged');
click($('gom'));click($('hhi'));
ok(rows().length===2&&cells(rows()[0])[1]==='6'&&rows()[0].classList.contains('rec')&&shown($('hin')),'newest run first, record row highlighted with note');
ok(cells($('hil').querySelector('.hh')).join('|')==='When|Wave|Killer|Chips|Time|Novas','table has column headers');
ok(cells(rows()[1]).slice(1).join('|').startsWith('3|Grunt|+4|0:0')&&cells(rows()[1])[5]==='2'&&!rows()[1].classList.contains('rec'),'older run cells: '+cells(rows()[1]).join('|'));
ok($('his').textContent==='2 runs · best wave 6 · average 4.5','summary line: '+$('his').textContent);
click($('hic'));
// cap at HIST_MAX
for(let i=0;i<HIST_MAX+5;i++){play();S.wave=1;die()}
ok(M.hist.length===HIST_MAX,'history capped at '+HIST_MAX);
// old saves and odd data
loadMeta({v:2,chips:1,lv:{dmg:2},best:4,tips:{start:1}});ok(Array.isArray(M.hist)&&M.hist.length===0&&M.v===SAVE_V&&M.lv.rate===0&&M.lv.dmg===2,'v2 save loads with empty history');
loadMeta({v:3,chips:0,lv:{},hist:'broken'});ok(Array.isArray(M.hist)&&M.hist.length===0,'corrupt history ignored');
M.hist=[{t:Date.now(),w:2,k:'<img src=x onerror=alert(1)>',c:1,d:65,n:1}];showHistory();
ok(!$('hil').querySelector('img')&&cells(rows()[0])[4]==='1:05'&&cells(rows()[0])[2].includes('<img'),'history text escaped, time formatted');
ok(!shown($('hin')),'record note hidden when no record rows');
done();
