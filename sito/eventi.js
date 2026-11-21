/* Conteggio anonimo azioni (GoatCounter, nessun dato personale) */
(function(){
function ev(n){try{if(window.goatcounter&&goatcounter.count)goatcounter.count({path:n,title:n,event:true})}catch(e){}}
window.ctEv=ev;
var t=document.currentScript.getAttribute("data-tool")||"x",att=false,tm=null;
var f=document.getElementById("file");
if(f)f.addEventListener("change",function(){if(f.files&&f.files[0]){ev(t+"-carica");att=true}});
if(typeof window.mostra==="function"){var m=window.mostra;window.mostra=function(){if(att){att=false;clearTimeout(tm);ev(t+"-letta")}return m.apply(this,arguments)}}
if(typeof window.avviso==="function"){var a=window.avviso;window.avviso=function(x){if(x&&att){clearTimeout(tm);tm=setTimeout(function(){if(att){att=false;ev(t+"-errore")}},5000)}return a.apply(this,arguments)}}
document.addEventListener("click",function(e){var el=e.target&&e.target.closest?e.target.closest("a,button"):null;if(!el)return;if(/wa\.me/.test(el.href||""))ev(t+"-whatsapp");else if(el.tagName==="BUTTON"&&/Tutorial/.test(el.textContent||""))ev(t+"-tutorial")},true);
})();
