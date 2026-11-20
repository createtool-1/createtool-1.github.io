(function(){
var tool=document.currentScript.getAttribute('data-tool');
var KEY='tutorial_visto_'+tool;
try{if(localStorage.getItem(KEY))return;}catch(e){return;}
var ios=/iPhone|iPad|iPod/.test(navigator.userAgent)&&!window.navigator.standalone;
var passi={
 busta:[
  ['Carica la tua busta paga','Tocca il tasto per caricare e scegli il PDF della busta paga, quello che ti manda l\'azienda o il consulente.'],
  ['Capisci ogni voce','Ti mostriamo il netto, le tasse, i contributi, il TFR e le ferie e i permessi che ti restano, spiegati in parole semplici.'],
  ['Il tuo archivio, solo tuo','Ogni mese che carichi resta salvato qui, solo sul tuo telefono. Nessuno, nemmeno noi, vede i tuoi dati.']
 ],
 ore:[
  ['Segna la tua giornata','Ogni giorno inserisci entrata, uscita e pausa. La volta dopo ti riproponiamo gli orari dell\'ultima giornata.'],
  ['Straordinari automatici','Weekend, festivi e il giorno del patrono vengono contati da soli come straordinario.'],
  ['Ferie, malattia e rapportino','Puoi segnare ferie, permessi e malattia e salvare la foto del rapportino. Tutto resta solo sul tuo telefono.']
 ]
}[tool]||[];
passi.push(ios?['Tienilo come un\'app','Su iPhone tocca Condividi, poi "Aggiungi alla schermata Home". Così il tuo archivio non si cancella mai e ritrovi lo strumento come un\'app.']
 :['Non perdere i tuoi dati','I dati restano su questo telefono. Ogni tanto usa "Esporta archivio" nel menu e salva il file su Drive o via email: così non perdi niente se cambi telefono.']);
var i=0,css=document.createElement('style');
css.textContent='.tt-bg{position:fixed;inset:0;background:rgba(20,30,25,.55);z-index:9999;display:flex;align-items:flex-end;justify-content:center;font-family:Inter,system-ui,-apple-system,sans-serif}'+
'.tt-box{background:#fff;color:#1d2420;width:100%;max-width:440px;border-radius:18px 18px 0 0;padding:22px 20px 26px;box-shadow:0 -4px 20px rgba(0,0,0,.15)}'+
'@media(min-width:600px){.tt-bg{align-items:center}.tt-box{border-radius:18px}}'+
'.tt-n{font-size:12px;color:#2d6a52;font-weight:600;letter-spacing:.04em}.tt-t{font-size:20px;font-weight:700;margin:6px 0 8px}.tt-p{font-size:15px;line-height:1.5;color:#46514a;margin:0 0 20px}'+
'.tt-dots{display:flex;gap:6px;margin-bottom:18px}.tt-dots i{width:7px;height:7px;border-radius:50%;background:#d5ddd7}.tt-dots i.on{background:#2d6a52}'+
'.tt-row{display:flex;justify-content:space-between;align-items:center}.tt-skip{background:none;border:0;color:#7b867f;font-size:14px;padding:10px 4px;cursor:pointer}'+
'.tt-next{background:#2d6a52;color:#fff;border:0;border-radius:12px;font-size:15px;font-weight:600;padding:12px 22px;cursor:pointer}';
document.head.appendChild(css);
var bg=document.createElement('div');bg.className='tt-bg';
var box=document.createElement('div');box.className='tt-box';bg.appendChild(box);
function chiudi(){try{localStorage.setItem(KEY,'1');}catch(e){}bg.remove();}
function mostra(){
 box.innerHTML='';
 var n=document.createElement('div');n.className='tt-n';n.textContent='COME FUNZIONA · '+(i+1)+' di '+passi.length;
 var t=document.createElement('div');t.className='tt-t';t.textContent=passi[i][0];
 var p=document.createElement('p');p.className='tt-p';p.textContent=passi[i][1];
 var d=document.createElement('div');d.className='tt-dots';
 for(var k=0;k<passi.length;k++){var dot=document.createElement('i');if(k===i)dot.className='on';d.appendChild(dot);}
 var r=document.createElement('div');r.className='tt-row';
 var s=document.createElement('button');s.className='tt-skip';s.textContent='Salta';s.onclick=chiudi;
 var a=document.createElement('button');a.className='tt-next';a.textContent=i<passi.length-1?'Avanti':'Inizia';
 a.onclick=function(){if(i<passi.length-1){i++;mostra();}else chiudi();};
 r.appendChild(s);r.appendChild(a);
 box.appendChild(n);box.appendChild(t);box.appendChild(p);box.appendChild(d);box.appendChild(r);
}
mostra();
if(document.body)document.body.appendChild(bg);else document.addEventListener('DOMContentLoaded',function(){document.body.appendChild(bg);});
})();
