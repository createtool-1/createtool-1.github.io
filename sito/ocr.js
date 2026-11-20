(function(){
var inp=document.getElementById('file');if(!inp)return;
var small=document.querySelector('label.drop[for=file] small');if(small)small.textContent='PDF (consigliato) o screenshot';
var orig=inp.onchange;
var MESI=['GENNAIO','FEBBRAIO','MARZO','APRILE','MAGGIO','GIUGNO','LUGLIO','AGOSTO','SETTEMBRE','OTTOBRE','NOVEMBRE','DICEMBRE'];
function carica(){return new Promise(function(ok,ko){if(window.Tesseract)return ok();var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.crossOrigin='anonymous';s.integrity='sha384-GJqSu7vueQ9qN0E9yLPb3Wtpd7OrgK8KmYzC8T1IysG1bcvxvIO4qtYR/D3A991F';s.onload=ok;s.onerror=function(){ko(new Error('lettore non scaricato'));};document.head.appendChild(s);});}
function inCanvas(f){return new Promise(function(ok,ko){var u=URL.createObjectURL(f),im=new Image();
 im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,k=2600/w;if(h*k>9000)k=9000/h;var c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);pulisci(c);ok(c);};
 im.onerror=function(){ko(new Error('formato immagine non leggibile'));};im.src=u;});}
function pulisci(c){var W=c.width,H=c.height,x=c.getContext('2d'),id=x.getImageData(0,0,W,H),p=id.data,n=W*H,g=new Uint8Array(n),sum=0,i;
 for(i=0;i<n;i++){var v=(p[i*4]*0.299+p[i*4+1]*0.587+p[i*4+2]*0.114)|0;g[i]=v;sum+=v;}
 var t=sum/n*0.75,d=new Uint8Array(n);for(i=0;i<n;i++)d[i]=g[i]<t?1:0;var o=d.slice(),L=(W/30)|0,y,xx,s0;
 for(y=0;y<H;y++){xx=0;while(xx<W){if(d[y*W+xx]){s0=xx;while(xx<W&&d[y*W+xx])xx++;if(xx-s0>L){for(var yy=Math.max(0,y-1);yy<=Math.min(H-1,y+1);yy++)for(var q=s0;q<xx;q++)o[yy*W+q]=0;}}else xx++;}}
 for(xx=0;xx<W;xx++){y=0;while(y<H){if(d[y*W+xx]){s0=y;while(y<H&&d[y*W+xx])y++;if(y-s0>L){for(var q2=s0;q2<y;q2++)for(var xq=Math.max(0,xx-1);xq<=Math.min(W-1,xx+1);xq++)o[q2*W+xq]=0;}}else y++;}}
 for(i=0;i<n;i++){var c2=o[i]?0:255;p[i*4]=p[i*4+1]=p[i*4+2]=c2;p[i*4+3]=255;}x.putImageData(id,0,0);}
function norm(l){
 l=l.replace(/^[\s|\[\]{}‘'"°:;,.\-_=îÈ]+/,'');
 l=l.replace(/NETTO\W+\w{0,3}\W*[BD8]?USTA/i,'NETTO IN BUSTA');
 l=l.replace(/^FER\w*\b/i,'FERIE');
 if(/^PERMESS/i.test(l)&&!/RETRIBUIT/i.test(l))l=l.replace(/^PERMESS\w*\s*\S*\s*\S*?(?=\s{2,}|\s+\d)/i,'PERMESSI (R.O.L.)');
 l=l.replace(/(\d)\.(\d{2})(?!\d)/g,'$1,$2');
 var voce=/^\d{1,4}\s+[A-Za-z]/.test(l),fr=/^(FERIE|PERMESSI \()/.test(l);
 if(voce||fr)l=l.replace(/(^|\s)(\d{3,6})(?=\s|$)/g,function(m,s,d,o){if(voce&&o<4)return m;if(/^(19|20)\d\d$/.test(d))return m;var i=d.slice(0,-2).replace(/\B(?=(\d{3})+(?!\d))/g,'.');return s+i+','+d.slice(-2);});
 return l;}
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
 for(var z=0;z<lines.length;z++){var U=lines[z].toUpperCase();if(/COMPETENZ/.test(U)&&/TRATTENUT/.test(U)){for(var y=z+1;y<Math.min(lines.length,z+4);y++){var a=importi(lines[y]);if(a.length>=3){r.competenze=a[0];r.trattenute=a[1];r.netto=a[a.length-1];break;}}break;}}
 if(r.netto==null)r.netto=cerca(lines,/NETTO/i);
 if(r.competenze==null)r.competenze=cerca(lines,/TOT\w*\.?\s*COMPETENZ/i);
 if(r.trattenute==null)r.trattenute=cerca(lines,/TOT\w*\.?\s*TRATTENUT/i);
 r.voci=r.voci||[];return r;}
function eu(v){return v==null?'':String(v).replace('.',',');}
function pannello(r){
 var t=document.getElementById('titolo');if(!t)return;var old=document.getElementById('ocrBox');if(old)old.remove();
 var b=document.createElement('div');b.id='ocrBox';b.style.cssText='background:#fff6e0;border-radius:12px;padding:12px 12px 14px;margin:10px 0;font-size:14px;color:#5a4300';
 var h=document.createElement('div');h.style.cssText='font-weight:600;margin-bottom:8px';h.textContent='Non sono riuscito a leggere tutto: completa i dati mancanti';b.appendChild(h);
 function riga(lab,el){var d=document.createElement('label');d.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:10px;margin:6px 0';var s=document.createElement('span');s.textContent=lab;d.appendChild(s);el.style.cssText='width:55%;padding:8px;border:1px solid #e0cf9e;border-radius:8px;font:inherit;background:#fff;color:#1d2420;-webkit-text-fill-color:#1d2420';d.appendChild(el);b.appendChild(d);}
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
  var wk=await Tesseract.createWorker('ita');await wk.setParameters({tessedit_pageseg_mode:'6'});var res=await wk.recognize(img);await wk.terminate();
  var D=res.data,H=img.height,items=[],hs=[];(D.lines||[]).forEach(function(L){(L.words||[]).forEach(function(w){hs.push(w.bbox.y1-w.bbox.y0);});});hs.sort(function(a,b){return a-b;});var k=8/(hs[Math.floor(hs.length/2)]||20);
  (D.lines||[]).forEach(function(L){var yb=(L.baseline&&L.baseline.y0!=null)?Math.max(L.baseline.y0,L.baseline.y1):L.bbox.y1;
   (L.words||[]).forEach(function(w){items.push({str:w.text,transform:[1,0,0,1,w.bbox.x0*k,(H-yb)*k],width:(w.bbox.x1-w.bbox.x0)*k});});});
  var righe=items.length?BustaParser.itemsToLines(items).map(norm):[];
  var testo=(D.text||'').split('\n').map(function(s){return s.trim();}).filter(Boolean);
  var r=null;try{r=BustaParser.parse(righe);}catch(x){}
  if(!r||(!r.netto&&!(r.voci&&r.voci.length))){try{r=BustaParser.parse(testo);}catch(x){r={voci:[]};}}
  r=completa(r,righe.length?righe:testo);
  if(r.netto!=null&&r.trattenute!=null&&r.competenze!=null){var df=Math.abs(r.competenze-r.trattenute-r.netto);if(df>0.2&&df<5)r.competenze=Math.round((r.netto+r.trattenute)*100)/100;}
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
