// Preview-only test shortcut must never work on the live site.
ok(JSON.stringify(testStart('idlepixeltower.duckdns.org','https:','?wave=19&px=400'))==='{}','live site ignores ?wave and ?px');
ok(JSON.stringify(testStart('preview.idlepixeltower.duckdns.org','https:','?wave=19&px=400'))==='{"wave":19,"px":400}','preview honours ?wave=19&px=400');
ok(JSON.stringify(testStart('preview.idlepixeltower.duckdns.org','https:','?wave=abc&px=-5'))==='{"wave":0,"px":0}','junk values ignored');
ok(JSON.stringify(testStart('evil.com','https:','?wave=19'))==='{}','other hosts ignored');
skipTips();play();ok(S.wave===0&&S.px===0,'no params: normal start');
done();
