(function(){
var inp=document.getElementById('file');if(!inp)return;
var small=document.querySelector('label.drop[for=file] small');if(small)small.textContent='PDF (consigliato) o screenshot';
var orig=inp.onchange;
var MESI=['GENNAIO','FEBBRAIO','MARZO','APRILE','MAGGIO','GIUGNO','LUGLIO','AGOSTO','SETTEMBRE','OTTOBRE','NOVEMBRE','DICEMBRE'];
function carica(){return new Promise(function(ok,ko){if(window.Tesseract)return ok();var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=ok;s.onerror=function(){ko(new Error('lettore non scaricato'));};document.head.appendChild(s);});}
function inCanvas(f){return new Promise(function(ok,ko){var u=URL.createObjectURL(f),im=new Image();
 im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,k=2000/w;if(h*k>8000)k=8000/h;var c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c);};
 im.onerror=function(){ko(new Error('formato immagine non leggibile'));};im.src=u;});}
function num(s){if(s==null)return null;s=String(s).replace(/\s/g,'').replace(/[^\d.,-]/g,'');if(!s)return null;
 var c=s.lastIndexOf(','),p=s.lastIndexOf('.');
 if(c>p)s=s.replace(/\./g,'').replace(',','.');else if(p>c&&s.length-p===3&&c<0)s=s;else s=s.replace(/,/g,'');
 var v=parseFloat(s);return isNaN(v)?null:v;}
var IMP=/\d{1,3}(?:[.\s]?\d{3})*\s?[,.]\s?\d{2}(?!\d)/g;
function importi(l){return (l.match(IMP)||[]).map(num).filter(function(v){return v!=null;});}
function cerca(lines,re){for(var i=0;i<lines.length;i++){if(re.test(lines[i])){var a=importi(lines[i]);if(a.length)return a[a.length-1];
 for(var j=i+1;j<Math.min(lines.length,i+3);j++){var b=importi(lines[j]);if(b.length)return b[0];}}}return null;}
function completa(r,lines){
 var T=lines.join('\n').toUpperCase();
 if(!r.mese){for(var m=0;m<12;m++){var re=new RegExp(MESI[m]+'\\s*[\\/-]?\\s*(20\\d\\d)');var x=T.match(re);if(x){r.mese=MESI[m];r.meseNum=m+1;r.anno=+x[1];break;}}}
 if(r.netto==null)r.netto=cerca(lines,/NETTO/i);
 if(r.competenze==null)r.competenze=cerca(lines,/TOT\w*\.?\s*COMPETENZ|COMPETENZE/i);
 if(r.trattenute==null)r.trattenute=cerca(lines,/TOT\w*\.?\s*TRATTENUT|TRATTENUTE/i);
 r.voci=r.voci||[];return r;}
function eu(v){return v==null?'':String(v).replace('.',',');}
function pannello(r){
 var t=document.getElementById('titolo');if(!t)return;var old=document.getElementById('ocrBox');if(old)old.remove();
 var b=document.createElement('div');b.id='ocrBox';b.style.cssText='background:#fff6e0;border-radius:12px;padding:12px 12px 14px;margin:10px 0;font-size:14px;color:#5a4300';
 var h=document.createElement('div');h.style.cssText='font-weight:600;margin-bottom:8px';h.textContent='Non sono riuscito a leggere tutto: completa i dati mancanti';b.appendChild(h);
 function riga(lab,el){var d=document.createElement('label');d.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:10px;margin:6px 0';var s=document.createElement('span');s.textContent=lab;d.appendChild(s);el.style.cssText='width:55%;padding:8px;border:1px solid #e0cf9e;border-radius:8px;font:inherit;background:#fff';d.appendChild(el);b.appendChild(d);}
 var sm=document.createElement('select');MESI.forEach(function(n,i){var o=new Option(n.charAt(0)+n.slice(1).toLowerCase(),i+1);sm.appendChild(o);});sm.value=r.meseNum||new Date().getMonth()+1;riga('Mese',sm);
 function campo(v){var i=document.createElement('input');i.inputMode='decimal';i.value=eu(v);return i;}
 var an=campo(r.anno||new Date().getFullYear());an.inputMode='numeric';riga('Anno',an);
 var ne=campo(r.netto),co=campo(r.competenze),tr=campo(r.trattenute);riga('Netto (€)',ne);riga('Totale competenze (€)',co);riga('Totale trattenute (€)',tr);
 var ok=document.createElement('button');ok.type='button';ok.textContent='Conferma e salva';ok.style.cssText='margin-top:8px;width:100%;padding:12px;border:0;border-radius:10px;background:#2d6a52;color:#fff;font:600 15px Inter,system-ui,sans-serif';
 ok.onclick=function(){var mn=+sm.value;r.meseNum=mn;r.mese=MESI[mn-1];r.anno=parseInt(an.value,10)||new Date().getFullYear();r.netto=num(ne.value);r.competenze=num(co.value);r.trattenute=num(tr.value);
  ultimo=r;$('salva').click();mostra(r);pannello(r);var bx=document.getElementById('ocrBox');if(bx){bx.style.background='#e8f3ec';bx.firstChild.textContent='Salvata. Puoi ancora correggere i numeri se serve.';}};
 b.appendChild(ok);t.parentNode.insertBefore(b,t.nextSibling);}
inp.onchange=async function(e){
 var f=e.target.files[0];if(!f)return;
 if(/pdf/i.test(f.type)||/\.pdf$/i.test(f.name||''))return orig(e);
 avviso('Sto leggendo lo screenshot... la prima volta può servire fino a un minuto.');$('risultato').classList.add('hide');
 try{
  await carica();
  var img=await inCanvas(f);
  avviso('Sto leggendo lo screenshot... quasi fatto.');
  var res=await Tesseract.recognize(img,'ita');
  var D=res.data,H=img.height,items=[],hs=[];(D.lines||[]).forEach(function(L){(L.words||[]).forEach(function(w){hs.push(w.bbox.y1-w.bbox.y0);});});hs.sort(function(a,b){return a-b;});var k=8/(hs[Math.floor(hs.length/2)]||20);
  (D.lines||[]).forEach(function(L){var yb=(L.baseline&&L.baseline.y0!=null)?Math.max(L.baseline.y0,L.baseline.y1):L.bbox.y1;
   (L.words||[]).forEach(function(w){items.push({str:w.text,transform:[1,0,0,1,w.bbox.x0*k,(H-yb)*k],width:(w.bbox.x1-w.bbox.x0)*k});});});
  var righe=items.length?BustaParser.itemsToLines(items):[];
  var testo=(D.text||'').split('\n').map(function(s){return s.trim();}).filter(Boolean);
  var r=null;try{r=BustaParser.parse(righe);}catch(x){}
  if(!r||(!r.netto&&!(r.voci&&r.voci.length))){try{r=BustaParser.parse(testo);}catch(x){r={voci:[]};}}
  r=completa(r,righe.length?righe:testo);
  avviso('');ultimo=r;if(r.mese)$('salva').click();mostra(r);
  if(!r.mese||r.netto==null)pannello(r);
 }catch(err){avviso('Non sono riuscito a leggere lo screenshot ('+(err&&err.message||err)+'). Prova con il PDF.');}
};
document.addEventListener('paste',function(e){
 var d=e.clipboardData;if(!d)return;var f=null,it=d.items||[];
 for(var j=0;j<it.length;j++)if(it[j].kind==='file'&&!/pdf/i.test(it[j].type)){f=it[j].getAsFile();break;}
 if(!f)return;e.preventDefault();e.stopImmediatePropagation();
 try{if(window.vai)window.vai('Carica');}catch(x){}
 inp.onchange({target:{files:[f]}});
},true);
})();
