(function(){
var inp=document.getElementById('file');if(!inp)return;
var small=document.querySelector('label.drop[for=file] small');if(small)small.textContent='PDF (consigliato) o screenshot';
var orig=inp.onchange;
function carica(){return new Promise(function(ok,ko){if(window.Tesseract)return ok();var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=ok;s.onerror=function(){ko(new Error('lettore non scaricato'));};document.head.appendChild(s);});}
function inCanvas(f){return new Promise(function(ok,ko){var u=URL.createObjectURL(f),im=new Image();
 im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,k=2000/w;if(h*k>8000)k=8000/h;var c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c);};
 im.onerror=function(){ko(new Error('formato immagine non leggibile'));};im.src=u;});}
inp.onchange=async function(e){
 var f=e.target.files[0];if(!f)return;
 if(/pdf/i.test(f.type)||/\.pdf$/i.test(f.name||''))return orig(e);
 avviso('Sto leggendo lo screenshot... la prima volta può servire fino a un minuto.');$('risultato').classList.add('hide');
 try{
  await carica();
  var img=await inCanvas(f);
  avviso('Sto leggendo lo screenshot... quasi fatto.');
  var res=await Tesseract.recognize(img,'ita');
  var lines=(res.data.lines&&res.data.lines.length?res.data.lines.map(function(l){return l.text;}):res.data.text.split('\n')).map(function(s){return s.trim();}).filter(Boolean);
  var r=BustaParser.parse(lines);
  if(!r.netto&&!r.voci.length){avviso('Non riesco a leggere questo screenshot. Prova con uno più nitido e con tutta la busta paga visibile, oppure carica il PDF.');return;}
  ultimo=r;$('salva').click();mostra(r);
  setTimeout(function(){var t=document.getElementById('titolo');if(t&&!document.getElementById('ocrNota')){var n=document.createElement('p');n.id='ocrNota';n.style.cssText='font-size:13px;color:#8a5a00;background:#fff6e0;padding:8px 10px;border-radius:8px';n.textContent='Letta da screenshot: controlla che i numeri siano giusti. Con il PDF la lettura è sempre esatta.';t.parentNode.insertBefore(n,t.nextSibling);}},50);
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
