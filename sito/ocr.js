(function(){
var inp=document.getElementById('file');if(!inp)return;
var small=document.querySelector('label.drop[for=file] small');if(small)small.textContent='PDF (consigliato) o screenshot';
var orig=inp.onchange;
function carica(){return new Promise(function(ok,ko){if(window.Tesseract)return ok();var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=ok;s.onerror=function(){ko(new Error('lettore non scaricato'));};document.head.appendChild(s);});}
inp.onchange=async function(e){
 var f=e.target.files[0];if(!f)return;
 if(!/^image\//.test(f.type))return orig(e);
 avviso('Sto leggendo lo screenshot... la prima volta può servire fino a un minuto.');$('risultato').classList.add('hide');
 try{
  await carica();
  var res=await Tesseract.recognize(f,'ita');
  var lines=(res.data.lines&&res.data.lines.length?res.data.lines.map(function(l){return l.text;}):res.data.text.split('\n')).map(function(s){return s.trim();}).filter(Boolean);
  var r=BustaParser.parse(lines);
  if(!r.netto&&!r.voci.length){avviso('Non riesco a leggere questo screenshot. Prova con uno più nitido e con tutta la busta paga visibile, oppure carica il PDF.');return;}
  ultimo=r;$('salva').click();mostra(r);
  setTimeout(function(){var t=document.getElementById('titolo');if(t&&!document.getElementById('ocrNota')){var n=document.createElement('p');n.id='ocrNota';n.style.cssText='font-size:13px;color:#8a5a00;background:#fff6e0;padding:8px 10px;border-radius:8px';n.textContent='Letta da screenshot: controlla che i numeri siano giusti. Con il PDF la lettura è sempre esatta.';t.parentNode.insertBefore(n,t.nextSibling);}},50);
 }catch(err){avviso('Non sono riuscito a leggere lo screenshot ('+(err&&err.message||err)+'). Prova con il PDF.');}
};
document.addEventListener('paste',function(e){
 var d=e.clipboardData;if(!d)return;var f=null,it=d.items||[];
 for(var j=0;j<it.length;j++)if(it[j].kind==='file'&&/^image\//.test(it[j].type)){f=it[j].getAsFile();break;}
 if(!f)return;e.preventDefault();e.stopImmediatePropagation();
 try{if(window.vai)window.vai('Carica');}catch(x){}
 inp.onchange({target:{files:[f]}});
},true);
})();
