// Preview-only test shortcut must never work on the live site.
ok(JSON.stringify(testStart('idlepixeltower.duckdns.org','https:','?wave=19&px=400'))==='{}','live site ignores ?wave and ?px');
ok(JSON.stringify(testStart('preview.idlepixeltower.duckdns.org','https:','?wave=19&px=400&cores=5&chips=300&fast=1'))==='{"wave":19,"px":400,"cores":5,"chips":300,"fast":true}','preview honours wave, px, cores, chips, fast');
ok(JSON.stringify(testStart('preview.idlepixeltower.duckdns.org','https:','?wave=abc&px=-5&cores=1e9&fast=yes'))==='{"wave":0,"px":0,"cores":0,"chips":0,"fast":false}','junk values ignored');
ok(JSON.stringify(testStart('evil.com','https:','?wave=19'))==='{}','other hosts ignored');
skipTips();play();ok(S.wave===0&&S.px===0,'no params: normal start');
done();
