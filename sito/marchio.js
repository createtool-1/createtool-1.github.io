/* Lavoro Chiaro: marchio, barra strumenti in basso, tema scuro */
(function(){
var NOME="Lavoro Chiaro";
var N=[["/sito/","Home",'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'],
["/sito/busta-paga/","Busta",'<path d="M6 3h9l3 3v15H6z"/><path d="M9 12h6M9 16h6"/>'],
["/sito/le-mie-ore/","Ore",'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
["/sito/lordo-netto/","Netto",'<path d="M4 7h16M4 12h10M4 17h6"/>'],
["/sito/naspi/","NASpI",'<path d="M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"/>']];
var p=location.pathname.replace(/index\.html$/,"");if(p.slice(-1)!=="/")p+="/";
function ic(d){return '<svg class="lc-ic" viewBox="0 0 24 24">'+d+'</svg>'}
function rd(k){try{return JSON.parse(localStorage.getItem(k))||{}}catch(e){return {}}}
function scuro(){var b=rd("busta_imp"),o=rd("ore_imp");if(b.scuro===undefined&&o.scuro===undefined)return !!(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches);return !!(b.scuro||o.scuro)}
function setScuro(v){["busta_imp","ore_imp"].forEach(function(k){var o=rd(k);o.scuro=v;try{localStorage.setItem(k,JSON.stringify(o))}catch(e){}});document.body.classList.toggle("lc-dark",v)}
var css=document.createElement("style");
css.textContent=".lc-ic{width:1.05em;height:1.05em;vertical-align:-.17em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}"+
".drawer{overflow-y:auto}"+
".lc-nav{position:fixed;left:0;right:0;bottom:0;height:calc(64px + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom);display:flex;background:rgba(255,255,255,.97);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-top:1px solid #e6e2d8;z-index:17}"+
".lc-nav a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font:600 .7rem Inter,system-ui,-apple-system,sans-serif;color:#727a75;text-decoration:none}"+
".lc-nav .lc-ic{width:23px;height:23px}.lc-nav a.on{color:#2d6a52}"+
"body{padding-bottom:calc(76px + env(safe-area-inset-bottom))!important}"+
"a[href*='wa.me']{bottom:calc(76px + env(safe-area-inset-bottom))!important}.toast{bottom:calc(80px + env(safe-area-inset-bottom))!important}"+
"body.dark .lc-nav,body.lc-dark .lc-nav{background:rgba(28,35,32,.97);border-color:#2c3631}body.dark .lc-nav a,body.lc-dark .lc-nav a{color:#9aa49e}body.dark .lc-nav a.on,body.lc-dark .lc-nav a.on{color:#7fb39b}"+
".lc-bar{position:fixed;top:0;left:0;right:0;height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;background:rgba(244,242,236,.92);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);z-index:18;border-bottom:1px solid #e6e2d8}"+
".lc-brand{font:700 1.05rem Inter,system-ui,sans-serif;color:#1b2420;letter-spacing:-.01em;text-decoration:none}"+
".lc-moon{width:40px;height:40px;border:1px solid #e6e2d8;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#1b2420;-webkit-appearance:none;padding:0}.lc-moon .lc-ic{width:20px;height:20px}"+
"body.lc-page{padding-top:58px;background:#f4f2ec}"+
"body.lc-page .box,body.lc-page a.card,body.lc-page .voce{border-radius:18px;border-color:#e6e2d8;box-shadow:0 1px 2px rgba(20,30,25,.05)}"+
"body.lc-page h1{letter-spacing:-.02em}"+
"body.lc-page.lc-dark{background:#121614;color:#e9eee9;color-scheme:dark}"+
"body.lc-dark .box,body.lc-dark a.card,body.lc-dark .voce,body.lc-dark input,body.lc-dark select,body.lc-dark #q{background:#1c2320!important;border-color:#2c3631!important;color:#e9eee9}"+
"body.lc-dark .sub,body.lc-dark small,body.lc-dark footer,body.lc-dark a.card span,body.lc-dark .big .s,body.lc-dark .tag{color:#9aa49e!important}"+
"body.lc-dark a,body.lc-dark a.card b,body.lc-dark .piu,body.lc-dark .big .n,body.lc-dark .es b{color:#7fb39b}body.lc-dark a.cta{color:#fff}"+
"body.lc-dark td{border-color:#2c3631}body.lc-dark .es{background:#232b27}body.lc-dark .voce p{color:#c9d1cc}"+
"body.lc-dark .lc-bar{background:rgba(18,22,20,.92);border-color:#2c3631}body.lc-dark .lc-moon{background:#1c2320;color:#e9eee9;border-color:#2c3631}body.lc-dark .lc-brand{color:#e9eee9}";
document.head.appendChild(css);
var nav=document.createElement("nav");nav.className="lc-nav";
nav.innerHTML=N.map(function(n){return '<a href="'+n[0]+'"'+(p===n[0]?' class="on"':'')+'>'+ic(n[2])+n[1]+'</a>'}).join("");
document.body.appendChild(nav);
var dr=document.getElementById("drawer");
if(dr){
 var tb=dr.querySelector("b");if(tb)tb.textContent=NOME;
}else{
 document.body.classList.add("lc-page");document.body.classList.toggle("lc-dark",scuro());
 var bar=document.createElement("div");bar.className="lc-bar";
 bar.innerHTML='<a class="lc-brand" href="/sito/">'+NOME+'</a><button class="lc-moon" aria-label="Tema scuro">'+ic('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>')+'</button>';
 document.body.appendChild(bar);
 bar.lastChild.onclick=function(){setScuro(!document.body.classList.contains("lc-dark"))};
 var back=document.querySelector('main > p > a[href="../"]');if(back&&back.parentNode)back.parentNode.remove();
}
})();
