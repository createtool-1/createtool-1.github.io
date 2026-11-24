/* Lavoro Chiaro: marchio, barra strumenti in basso, tema scuro */
(function(){
var NOME="Lavoro Chiaro";
var N=[["/sito/","Home",'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'],
["/sito/busta-paga/","Busta",'<path d="M6 3h9l3 3v15H6z"/><path d="M9 12h6M9 16h6"/>'],
["/sito/le-mie-ore/","Ore",'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
["/sito/lordo-netto/","Netto",'<path d="M4 5h16l-6 7v6l-4 2v-8z"/>'],
["/sito/naspi/","NASpI",'<path d="M17.5 6.5a7 7 0 1 0 0 11M4 10.5h9M4 13.5h9"/>']];
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

/* App installabile (PWA) */
function hd(t,a){var e=document.createElement(t);for(var k in a)e.setAttribute(k,a[k]);document.head.appendChild(e)}
if(!document.querySelector('link[rel="manifest"]'))hd("link",{rel:"manifest",href:"/sito/manifest.webmanifest"});
hd("link",{rel:"apple-touch-icon",href:"/sito/apple-icon.png"});hd("meta",{name:"theme-color",content:"#f4f2ec"});
hd("meta",{name:"apple-mobile-web-app-capable",content:"yes"});hd("meta",{name:"mobile-web-app-capable",content:"yes"});
hd("meta",{name:"apple-mobile-web-app-title",content:NOME});hd("meta",{name:"apple-mobile-web-app-status-bar-style",content:"default"});
if("serviceWorker" in navigator)navigator.serviceWorker.register("/sito/sw.js",{scope:"/sito/"}).catch(function(){});
var cs3=document.createElement("style");
cs3.textContent="@view-transition{navigation:auto}a,button,label{-webkit-tap-highlight-color:transparent}"+
"a.card,.lc-nav a,.btn,.drop,.mese,.lc-moon{transition:transform .12s ease}a.card:active,.lc-nav a:active,.btn:active,.drop:active,.mese:active,.lc-moon:active{transform:scale(.97)}"+
"html{-webkit-text-size-adjust:100%}body{overscroll-behavior-y:none}"+
".lc-inst{position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:21;background:#1b2420;color:#fff;border-radius:16px;padding:14px 14px 14px 16px;display:flex;gap:12px;align-items:center;box-shadow:0 6px 24px rgba(0,0,0,.25);font:500 .92rem Inter,system-ui,-apple-system,sans-serif;line-height:1.35}"+
".lc-inst img{width:42px;height:42px;border-radius:10px;flex:none}.lc-inst b{display:block;font-size:1rem}.lc-inst button{background:#7fb39b;color:#121614;border:0;border-radius:10px;padding:9px 12px;font:700 .9rem Inter,system-ui,sans-serif;flex:none}.lc-inst .x{background:none;color:#cfd8d2;padding:4px 6px;font-size:1.2rem}";
document.head.appendChild(cs3);
var std=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone;
var ios=/iPhone|iPad|iPod/.test(navigator.userAgent),dp=null,visto=false;try{visto=!!localStorage.getItem("lc_inst")}catch(e){}
function banner(){if(std||visto||document.querySelector(".lc-inst"))return;var b=document.createElement("div");b.className="lc-inst";
 b.innerHTML='<img src="/sito/apple-icon.png" alt=""><div style="flex:1"><b>Installa '+NOME+'</b>'+(ios?'Tocca <b style="display:inline">Condividi</b> e poi «Aggiungi alla schermata Home».':'Icona sul telefono, si apre come un\'app.')+'</div>'+(dp?'<button class="ok">Installa</button>':'')+'<button class="x" aria-label="Chiudi">✕</button>';
 document.body.appendChild(b);function via(){b.remove();try{localStorage.setItem("lc_inst","1")}catch(e){}}
 b.querySelector(".x").onclick=via;var ok=b.querySelector(".ok");if(ok)ok.onclick=function(){dp.prompt();dp.userChoice.then(via)}}
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();dp=e;setTimeout(banner,1500)});
if(ios)setTimeout(banner,2500);

/* Niente zoom: si comporta come un'app */
var vp=document.querySelector('meta[name="viewport"]');if(vp)vp.setAttribute("content","width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover");
var cs4=document.createElement("style");cs4.textContent="html,body{touch-action:manipulation}input,select,textarea{font-size:16px!important}";document.head.appendChild(cs4);
["gesturestart","gesturechange"].forEach(function(t){document.addEventListener(t,function(e){e.preventDefault()},{passive:false})});
document.addEventListener("touchmove",function(e){if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});

/* Stile app dentro gli strumenti (Netto, NASpI, dizionario) */
var cs5=document.createElement("style");
cs5.textContent="body.lc-page main{max-width:560px;padding:22px 18px 30px}"+
"body.lc-page h1{font-size:30px;line-height:1.1;letter-spacing:-.03em;margin:6px 0 8px}body.lc-page p.sub{font-size:15px;color:#727a75;margin:0 0 18px}"+
"body.lc-page .box{border-radius:22px!important;padding:18px}"+
"body.lc-page .box label:not(.chk){font-size:11.5px;text-transform:uppercase;letter-spacing:.07em;color:#727a75;font-weight:700;margin:14px 0 6px}"+
"body.lc-page .box input:not([type=checkbox]),body.lc-page .box select{border-radius:14px;background:#f7f6f2;border:1px solid #e6e2d8;padding:13px 14px;font-weight:600;-webkit-appearance:none;appearance:none}"+
"body.lc-page .box select{background-image:linear-gradient(45deg,transparent 50%,#727a75 50%),linear-gradient(135deg,#727a75 50%,transparent 50%);background-position:calc(100% - 18px) 55%,calc(100% - 13px) 55%;background-size:5px 5px;background-repeat:no-repeat;padding-right:32px}"+
"body.lc-page label.chk{font-size:15px;font-weight:500}"+
"body.lc-page #out.big{background:#1b2420;color:#fff;border-color:#1b2420;padding:22px 18px}body.lc-page #out.big .s{color:#a9b5ae}body.lc-page #out.big .n{color:#fff;font-size:40px;letter-spacing:-.02em;margin:4px 0}"+
"body.lc-page #out.no .n{color:#ffb4a8;font-size:21px}"+
"body.lc-page .cta{border-radius:18px;padding:17px}body.lc-page h2{font-size:20px;letter-spacing:-.02em;margin:28px 0 8px}"+
"body.lc-page td{padding:9px 0}"+
"body.lc-dark .box input:not([type=checkbox]),body.lc-dark .box select{background:#161c19!important}"+
"body.lc-dark #out.big{background:#e9eee9!important;color:#121614}body.lc-dark #out.big .s{color:#4d5a53!important}body.lc-dark #out.big .n{color:#121614!important}body.lc-dark #out.no .n{color:#a33!important}";
document.head.appendChild(cs5);

/* Rifiniture strumenti */
var cs6=document.createElement("style");
cs6.textContent="body.lc-page a[href*='wa.me']{position:static!important;display:block!important;width:max-content;margin:22px auto 0;box-shadow:none!important}"+
"body.lc-page .box .row>div:has(#mens){flex:.62}body.lc-page .box select{font-weight:500}";
document.head.appendChild(cs6);
})();
