// Stima della tredicesima dai dati della busta paga (resta tutto sul dispositivo)
(function(root){
var AMT=/^-?(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2,5}$/,DATA=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
function num(s){var v=parseFloat(String(s).replace(/\./g,'').replace(',','.'));return isNaN(v)?null:v;}
function celle(items){var c=[];items.forEach(function(it){var s=(it.str||'').trim();if(!s)return;var x=it.transform[4],y=it.transform[5],w=it.width||s.length*4;
 s.split(/\s{2,}/).forEach(function(p,i){var px=x+(i?w*s.indexOf(p)/s.length:0);c.push({s:p,x0:px,x1:px+w*p.length/s.length,y:y});});});return c;}
function sotto(c,re,test){var L=null;for(var i=0;i<c.length;i++)if(re.test(c[i].s.toUpperCase())){L=c[i];break;}if(!L)return null;
 var best=null,bd=1e9;c.forEach(function(v){if(!test(v.s))return;var dy=L.y-v.y;if(dy<=0||dy>40)return;if(v.x1<L.x0-10||v.x0>L.x1+70)return;var d=dy+Math.abs(v.x0-L.x0)/10;if(d<bd){bd=d;best=v;}});return best&&best.s;}
function base(items){var c=celle(items),r={};
 var m=sotto(c,/RETRIBUZIONE\s*MENSILE|RETRIB\w*\.?\s*MENSILE|TOTALE\s*RETRIBUZIONE/,function(s){return /^(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2}$/.test(s);});if(m)r.retr=num(m);
 var a=sotto(c,/^ASSUNZIONE|DATA\s*ASSUNZIONE|ASSUNTO\s*IL/,function(s){return DATA.test(s);});if(a){var d=a.match(DATA);r.ass=[+d[3],+d[2],+d[1]];}
 for(var i=0;i<c.length;i++)if(/^INPS$/i.test(c[i].s)){var y=c[i].y;c.forEach(function(v){if(Math.abs(v.y-y)<3&&/^\d{1,2},\d{2,3}$/.test(v.s)){var p=num(v.s);if(p>5&&p<12)r.inps=p;}});break;}
 return r;}
function stima(b,anno){if(!b||!b.retr)return null;var mesi=12;
 if(b.ass&&b.ass[0]===anno){var m0=b.ass[1];if(b.ass[2]>15)m0++;mesi=Math.max(0,12-m0+1);}else if(b.ass&&b.ass[0]>anno)mesi=0;
 var lordo=b.retr*mesi/12,inps=(b.inps||9.19)/100,imp=lordo*(1-inps),ann=b.retr*13*(1-inps),al=ann<=28000?0.23:(ann<=50000?0.33:0.43);
 return {mesi:mesi,lordo:Math.round(lordo*100)/100,netto:Math.round(imp*(1-al)*100)/100,aliquota:al*100};}
var api={base:base,stima:stima};
if(typeof module!=='undefined')module.exports=api;else root.Tredicesima=api;
if(typeof document==='undefined')return;
function eur(v){return v.toLocaleString('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';}
function leggiB(){try{return JSON.parse(localStorage.getItem('base13')||'null');}catch(e){return null;}}
function card(dove,prima){var b=leggiB();if(!b||!dove)return;var anno=b.anno||new Date().getFullYear(),s=stima(b,anno);if(!s||!s.mesi)return;
 var old=dove.querySelector('.tred13');if(old)old.remove();
 var d=document.createElement('div');d.className='tred13';d.style.cssText='border:1.5px solid #2d6a52;border-radius:14px;padding:14px 16px;margin:12px 0;background:rgba(45,106,82,.06)';
 var t=document.createElement('div');t.style.cssText='font-size:13px;font-weight:600;color:#2d6a52;letter-spacing:.03em';t.textContent='LA TUA TREDICESIMA '+anno+' (STIMA)';
 var n=document.createElement('div');n.style.cssText='font-size:26px;font-weight:700;margin:4px 0';n.textContent='circa '+eur(s.netto)+' netti';
 var p=document.createElement('div');p.style.cssText='font-size:13.5px;line-height:1.5;opacity:.8';
 p.textContent='Lordo '+eur(s.lordo)+' per '+s.mesi+(s.mesi===1?' mese':' mesi')+' lavorati nel '+anno+'. Arriva con la busta di dicembre. Stima: contributi INPS e IRPEF al '+s.aliquota+'%, senza detrazioni né addizionali, quindi il netto reale può essere un po\' diverso.';
 d.appendChild(t);d.appendChild(n);d.appendChild(p);if(prima&&prima.parentNode)prima.parentNode.insertBefore(d,prima);else dove.insertBefore(d,dove.children[1]||null);}
var inp=document.getElementById('file');if(inp){var prev=inp.onchange;
 inp.onchange=async function(e){var res=prev?prev(e):null;try{await res;}catch(x){}
  var f=e.target.files&&e.target.files[0];if(!f||!(/pdf/i.test(f.type)||/\.pdf$/i.test(f.name||''))||!window.pdfjsLib)return;
  try{var pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise,tc=await (await pdf.getPage(1)).getTextContent(),b=base(tc.items);
   if(b.retr){b.anno=(window.ultimo&&ultimo.anno)||(typeof ultimo!=='undefined'&&ultimo&&ultimo.anno)||new Date().getFullYear();
    var old=leggiB();if(!old||!old.anno||b.anno>=old.anno)localStorage.setItem('base13',JSON.stringify(b));
    setTimeout(function(){card(document.getElementById('risultato'),document.getElementById('voci'));},300);}}catch(x){}};}
if(typeof window.mostra==='function'){var m0=window.mostra;window.mostra=function(r){m0(r);setTimeout(function(){card(document.getElementById('risultato'),document.getElementById('voci'));},50);};}
if(typeof window.mostraDash==='function'){var a0=window.mostraDash;window.mostraDash=function(){a0.apply(this,arguments);card(document.getElementById('vDash'));};}
card(document.getElementById('vDash'));
})(this);
