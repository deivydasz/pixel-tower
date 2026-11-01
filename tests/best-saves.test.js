skipTips();play();
const bw=()=>{ui();return $('bw').textContent},goh=()=>$('goh').textContent;
ok(bw()==='Best -','fresh player: Best -');
S.wave=3;die();ok(M.best===3&&goh()==='Game over'&&!S.record,'first run sets best 3 without "New record"');
const saved=JSON.parse(localStorage.getItem('pixelTowerMeta'));
ok(saved.best===3&&saved.v===SAVE_V,'best saved with current save version');
click($('gor'));S.wave=2;ok(bw()==='Best 3','below record: Best 3');
S.wave=5;ok(bw()==='Best 5','passing record mid-run shows live');
die();ok(S.record&&goh()==='New record!'&&M.best===5,'beating record shows New record!');
ok($('gop').textContent.startsWith('You beat your best of wave 3'),'message mentions old best');
click($('gor'));S.wave=4;die();ok(!S.record&&goh()==='Game over'&&M.best===5,'worse run keeps best');
// loading older save formats
loadMeta({chips:4,lv:{dmg:1},mute:true});
ok(M.best===0&&M.chips===4&&M.mute&&M.v===SAVE_V&&JSON.stringify(M.tips)==='{}','v0 save loads with defaults');
loadMeta({v:1,chips:2,lv:{},mute:false});ok(M.best===0&&M.lv.armor===0&&M.chips===2,'v1 save loads with defaults');
loadMeta(null);ok(M.chips===2,'missing save keeps defaults');
done();
