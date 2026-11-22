/* Lavoro Chiaro: marchio + menu comune a tutti gli strumenti */
(function(){
var NOME="Lavoro Chiaro";
var T=[["/sito/","Home",'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'],
["/sito/busta-paga/","Busta paga",'<path d="M6 3h9l3 3v15H6z"/><path d="M9 12h6M9 16h6"/>'],
["/sito/le-mie-ore/","Le mie ore",'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
["/sito/lordo-netto/","Da lordo a netto",'<path d="M4 7h16M4 12h10M4 17h6"/>'],
["/sito/naspi/","Calcolo NASpI",'<path d="M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"/>']];
var p=location.pathname.replace(/index\.html$/,"");if(p.slice(-1)!=="/")p+="/";
function ic(d){return '<svg class="lc-ic" viewBox="0 0 24 24">'+d+'</svg>'}
function voci(x){return T.filter(function(t){return !(x&&p===t[0])}).map(function(t){return '<a class="lc-a'+(p===t[0]?' on':'')+'" href="'+t[0]+'">'+ic(t[2])+t[1]+'</a>'}).join("")}
var css=document.createElement("style");
css.textContent=".lc-ic{width:1.05em;height:1.05em;vertical-align:-.17em;margin-right:10px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}"+
".lc-a{display:flex;align-items:center;padding:11px 14px;border-radius:10px;font:600 .98rem Inter,system-ui,-apple-system,sans-serif;color:var(--ink,#1b2420);text-decoration:none}"+
".lc-a.on{background:var(--acc,#2d6a52);color:#fff}"+
".lc-l{font:600 .72rem Inter,system-ui,sans-serif;color:var(--mute,#727a75);padding:14px 14px 4px;text-transform:uppercase;letter-spacing:.06em}"+
".drawer{overflow-y:auto}"+
".lc-bar{position:fixed;top:0;left:0;right:0;height:62px;display:flex;align-items:center;gap:12px;padding:0 12px;background:rgba(244,242,236,.92);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);z-index:18;border-bottom:1px solid #e6e2d8}"+
".lc-burger{width:42px;height:42px;border:1px solid #e6e2d8;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#1b2420;-webkit-appearance:none;padding:0}"+
".lc-burger .lc-ic{margin:0}.lc-brand{font:700 1.05rem Inter,system-ui,sans-serif;color:#1b2420;letter-spacing:-.01em;text-decoration:none}"+
".lc-velo{position:fixed;inset:0;background:rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:opacity .25s;z-index:19}.lc-velo.open{opacity:1;pointer-events:auto}"+
".lc-drawer{position:fixed;top:0;left:0;bottom:0;width:260px;background:#fff;box-shadow:2px 0 24px rgba(0,0,0,.12);transform:translateX(-105%);transition:transform .25s;z-index:20;padding:24px 14px;display:flex;flex-direction:column;gap:4px;overflow-y:auto}.lc-drawer.open{transform:none}"+
".lc-drawer b{padding:4px 14px 14px;font:700 1.1rem Inter,system-ui,sans-serif;color:#1b2420}"+
"body.lc-page{padding-top:62px;background:#f4f2ec}"+
"body.lc-page .box,body.lc-page a.card,body.lc-page .voce{border-radius:18px;border-color:#e6e2d8;box-shadow:0 1px 2px rgba(20,30,25,.05)}"+
"body.lc-page h1{letter-spacing:-.02em}"+
".lc-t{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding:12px 14px;font:600 .95rem Inter,system-ui,sans-serif;color:inherit}.lc-t input{width:22px;height:22px;accent-color:#2d6a52}"+
"body.lc-page.lc-dark{background:#121614;color:#e9eee9;color-scheme:dark}"+
"body.lc-dark .box,body.lc-dark a.card,body.lc-dark .voce,body.lc-dark input,body.lc-dark select,body.lc-dark #q{background:#1c2320!important;border-color:#2c3631!important;color:#e9eee9}"+
"body.lc-dark .sub,body.lc-dark small,body.lc-dark footer,body.lc-dark a.card span,body.lc-dark .big .s,body.lc-dark .tag{color:#9aa49e!important}"+
"body.lc-dark a,body.lc-dark a.card b,body.lc-dark .piu,body.lc-dark .big .n,body.lc-dark .es b{color:#7fb39b}body.lc-dark a.cta{color:#fff}"+
"body.lc-dark td{border-color:#2c3631}body.lc-dark .es{background:#232b27}body.lc-dark .voce p{color:#c9d1cc}"+
"body.lc-dark .lc-bar{background:rgba(18,22,20,.92);border-color:#2c3631}body.lc-dark .lc-burger,body.lc-dark .lc-drawer{background:#1c2320;color:#e9eee9;border-color:#2c3631}body.lc-dark .lc-brand,body.lc-dark .lc-drawer b,body.lc-dark .lc-a{color:#e9eee9}body.lc-dark .lc-a.on{color:#fff}";
function rd(k){try{return JSON.parse(localStorage.getItem(k))||{}}catch(e){return {}}}
function scuro(){var b=rd("busta_imp"),o=rd("ore_imp");if(b.scuro===undefined&&o.scuro===undefined)return !!(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches);return !!(b.scuro||o.scuro)}
function setScuro(v){["busta_imp","ore_imp"].forEach(function(k){var o=rd(k);o.scuro=v;try{localStorage.setItem(k,JSON.stringify(o))}catch(e){}});document.body.classList.toggle("lc-dark",v)}
document.head.appendChild(css);
var N=[["/sito/","Home",0],["/sito/busta-paga/","Busta",1],["/sito/le-mie-ore/","Ore",2],["/sito/lordo-netto/","Netto",3],["/sito/naspi/","NASpI",4]];
var cs2=document.createElement("style");
cs2.textContent=".lc-nav{position:fixed;left:0;right:0;bottom:0;height:calc(64px + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom);display:flex;background:rgba(255,255,255,.97);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-top:1px solid #e6e2d8;z-index:17}"+
".lc-nav a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font:600 .7rem Inter,system-ui,-apple-system,sans-serif;color:#727a75;text-decoration:none}"+
".lc-nav .lc-ic{margin:0;width:23px;height:23px}.lc-nav a.on{color:#2d6a52}"+
"body{padding-bottom:calc(76px + env(safe-area-inset-bottom))!important}"+
"a[href*='wa.me']{bottom:calc(76px + env(safe-area-inset-bottom))!important}.toast{bottom:calc(80px + env(safe-area-inset-bottom))!important}"+
"body.dark .lc-nav,body.lc-dark .lc-nav{background:rgba(28,35,32,.97);border-color:#2c3631}body.dark .lc-nav a,body.lc-dark .lc-nav a{color:#9aa49e}body.dark .lc-nav a.on,body.lc-dark .lc-nav a.on{color:#7fb39b}";
document.head.appendChild(cs2);
var nav=document.createElement("nav");nav.className="lc-nav";
nav.innerHTML=N.map(function(n){return '<a href="'+n[0]+'"'+(p===n[0]?' class="on"':'')+'>'+ic(T[n[2]][2])+n[1]+'</a>'}).join("");
document.body.appendChild(nav);
var dr=document.getElementById("drawer");
if(dr){
 var tb=dr.querySelector("b");if(tb)tb.textContent=NOME;
 var imp=document.getElementById("tImp")||document.getElementById("mImp");
 var tgt=imp&&imp.previousElementSibling&&/Tutorial/.test(imp.previousElementSibling.textContent)?imp.previousElementSibling:imp;
 var box=document.createElement("div");box.innerHTML='<div class="lc-l">Altri strumenti</div>'+voci(1);var dz=document.getElementById("tDiz");var an=document.getElementById("tAnno");if(dz&&an)dr.insertBefore(dz,an.nextSibling);
 while(box.firstChild){tgt?dr.insertBefore(box.firstChild,tgt):dr.appendChild(box.firstChild)}
 if(tgt&&tgt!==imp){tgt.style.marginTop="12px"}
}else{
 document.body.classList.add("lc-page");
 var bar=document.createElement("div");bar.className="lc-bar";
 bar.innerHTML='<button class="lc-burger" aria-label="Menu">'+ic('<path d="M4 7h16M4 12h16M4 17h16"/>')+'</button><a class="lc-brand" href="/sito/">'+NOME+'</a>';
 var velo=document.createElement("div");velo.className="lc-velo";
 var d=document.createElement("nav");d.className="lc-drawer";d.innerHTML="<b>"+NOME+"</b>"+voci()+'<label class="lc-t">Tema scuro<input type="checkbox"></label>';
 document.body.appendChild(bar);document.body.appendChild(velo);document.body.appendChild(d);
 function m(o){d.classList.toggle("open",o);velo.classList.toggle("open",o)}
 bar.firstChild.onclick=function(){m(true)};
 var ck=d.querySelector(".lc-t input");ck.checked=scuro();document.body.classList.toggle("lc-dark",ck.checked);ck.onchange=function(){setScuro(ck.checked)};velo.onclick=function(){m(false)};
 var back=document.querySelector('main > p > a[href="../"]');if(back&&back.parentNode)back.parentNode.remove();
}
})();
