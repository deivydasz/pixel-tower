// Test helpers, loaded after the game script. Game globals (S, M, update, nova, ...) are directly accessible.
const RES=[];
function ok(cond,msg){RES.push((cond?'PASS ':'FAIL ')+msg)}
// Advance the game deterministically by `sec` seconds at 60 fps.
function step(sec){for(let i=0;i<Math.round(sec*60);i++)update(1/60)}
function click(el){el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));el.click()}
function key(k,code){dispatchEvent(new KeyboardEvent('keydown',{key:k,code:code||k}))}
const $=id=>document.getElementById(id);
const shown=el=>getComputedStyle(el).display!=='none';
// Mark all first-play tips as seen so they don't pause the game.
function skipTips(){M.tips={start:1,buy:1,nova:1,foundry:1}}
function enemy(dx,dy,type,hp){const e={x:CX+dx,y:CY+dy,t:TYPES[type],hp,hit:0};S.en.push(e);return e}
// Make the tower die on the next frame.
function die(){S.hp=.1;enemy(3,0,0,5);step(.1)}
// Always call at the end: renders, records JS errors, writes results for run.sh.
function done(){ui();draw();ok(!__err.length,'no JS errors'+(__err.length?': '+__err.join(' | '):''));
  const p=document.createElement('pre');p.id='results';p.textContent=RES.join('\n');document.body.appendChild(p)}
