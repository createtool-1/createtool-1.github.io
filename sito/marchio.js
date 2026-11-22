/* Lavoro Chiaro: marchio + menu comune a tutti gli strumenti */
(function(){
var NOME="Lavoro Chiaro";
var T=[["/sito/","Home",'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'],
["/sito/busta-paga/","Busta paga",'<path d="M6 3h9l3 3v15H6z"/><path d="M9 12h6M9 16h6"/>'],
["/sito/le-mie-ore/","Le mie ore",'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
["/sito/lordo-netto/","Da lordo a netto",'<path d="M4 7h16M4 12h10M4 17h6"/>'],
["/sito/naspi/","Calcolo NASpI",'<path d="M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"/>'],
["/sito/dizionario/","Dizionario",'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>']];
var p=location.pathname.replace(/index\.html$/,"");if(p.slice(-1)!=="/")p+="/";
function ic(d){return '<svg class="lc-ic" viewBox="0 0 24 24">'+d+'</svg>'}
function voci(){return T.map(function(t){return '<a class="lc-a'+(p===t[0]?' on':'')+'" href="'+t[0]+'">'+ic(t[2])+t[1]+'</a>'}).join("")}
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
"body.lc-page h1{letter-spacing:-.02em}";
document.head.appendChild(css);
var dr=document.getElementById("drawer");
if(dr){
 var tb=dr.querySelector("b");if(tb)tb.textContent=NOME;
 var imp=document.getElementById("tImp")||document.getElementById("mImp");
 var tgt=imp&&imp.previousElementSibling&&/Tutorial/.test(imp.previousElementSibling.textContent)?imp.previousElementSibling:imp;
 var box=document.createElement("div");box.innerHTML='<div class="lc-l">Altri strumenti</div>'+voci();
 while(box.firstChild){tgt?dr.insertBefore(box.firstChild,tgt):dr.appendChild(box.firstChild)}
 if(tgt&&tgt!==imp){tgt.style.marginTop="12px"}
}else{
 document.body.classList.add("lc-page");
 var bar=document.createElement("div");bar.className="lc-bar";
 bar.innerHTML='<button class="lc-burger" aria-label="Menu">'+ic('<path d="M4 7h16M4 12h16M4 17h16"/>')+'</button><a class="lc-brand" href="/sito/">'+NOME+'</a>';
 var velo=document.createElement("div");velo.className="lc-velo";
 var d=document.createElement("nav");d.className="lc-drawer";d.innerHTML="<b>"+NOME+"</b>"+voci();
 document.body.appendChild(bar);document.body.appendChild(velo);document.body.appendChild(d);
 function m(o){d.classList.toggle("open",o);velo.classList.toggle("open",o)}
 bar.firstChild.onclick=function(){m(true)};velo.onclick=function(){m(false)};
 var back=document.querySelector('main > p > a[href="../"]');if(back&&back.parentNode)back.parentNode.remove();
}
})();
