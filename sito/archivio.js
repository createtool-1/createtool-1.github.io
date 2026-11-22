/* Archivio buste: elenco di tutte le buste salvate (solo mese e anno) */
(function(){
var dr=document.getElementById("drawer"),dash=document.getElementById("tDash");if(!dr||!dash||typeof window.vai!=="function")return;
var sec=document.createElement("section");sec.className="card hide";sec.id="vArc";
sec.innerHTML='<h2>Archivio buste</h2><div id="arcL"></div>';
var d=document.getElementById("vDash");d.parentNode.insertBefore(sec,d.nextSibling);
var bt=document.createElement("button");bt.id="tArc";
bt.innerHTML='<svg class="ic" viewBox="0 0 24 24"><path d="M3 7h18v13H3zM3 7l2-3h14l2 3M9 11h6"/></svg>Archivio buste';
bt.onclick=function(){window.vai("Arc")};dr.insertBefore(bt,dash.nextSibling);
function cap(s){s=String(s||"");return s.charAt(0)+s.slice(1).toLowerCase()}
function lista(){var a=(typeof archivioLeggi==="function"?archivioLeggi():null)||[];
 a.sort(function(x,y){return (y.anno-x.anno)||(y.meseNum-x.meseNum)});window._arch=a;
 var L=document.getElementById("arcL");
 if(!a.length){L.innerHTML='<p style="color:var(--mute)">Ancora vuoto. Carica la tua prima busta paga: finisce qui da sola.</p>';return}
 L.innerHTML=a.map(function(b,i){return '<div class="mese" data-i="'+i+'"><div><b>'+cap(b.mese)+" "+b.anno+'</b></div><div style="display:flex;align-items:center;gap:6px"><button class="link" data-del="'+i+'" style="margin:0">Elimina</button><span class="go">›</span></div></div>'}).join("");
 L.onclick=function(e){var del=e.target.closest("[data-del]");
  if(del){e.stopPropagation();var b=a[+del.dataset.del];if(b&&confirm("Eliminare la busta di "+cap(b.mese)+" "+b.anno+"?")){var all=archivioLeggi()||[];archivioScrivi(all.filter(function(x){return !(x.mese===b.mese&&x.anno===b.anno)}));lista()}return}
  var r=e.target.closest("[data-i]");if(r){window._arch=a;apri(+r.dataset.i)}};}
var orig=window.vai;
window.vai=function(v,back){
 if(v!=="Arc"){sec.classList.add("hide");bt.classList.remove("on");return orig.apply(this,arguments)}
 orig.call(this,"Dash",back);document.getElementById("vDash").classList.add("hide");var t=document.getElementById("tDash");if(t)t.classList.remove("on");
 sec.classList.remove("hide");bt.classList.add("on");var ti=document.getElementById("tit");if(ti)ti.textContent="Archivio buste";lista();window.scrollTo({top:0});};
})();
