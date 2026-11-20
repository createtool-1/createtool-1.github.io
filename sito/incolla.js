(function(){
var inp=document.getElementById('file');if(!inp)return;
var lab=document.querySelector('label.drop[for=file]');
var nota=document.createElement('div');
nota.style.cssText='margin:8px 2px 0;font-size:13px;color:#6b766f;line-height:1.45';
function avviso(t){nota.textContent=t;}
function usa(f){
 if(!f)return false;
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name||'')){avviso('Per ora serve il PDF della busta paga, non una foto.');return true;}
 try{if(window.vai)window.vai('Carica');}catch(e){}
 inp.onchange({target:{files:[f]}});return true;
}
function daLista(d){
 if(!d)return null;
 var fs=d.files||[];for(var i=0;i<fs.length;i++)return fs[i];
 var it=d.items||[];for(var j=0;j<it.length;j++)if(it[j].kind==='file')return it[j].getAsFile();
 return null;
}
document.addEventListener('paste',function(e){var f=daLista(e.clipboardData);if(f&&usa(f))e.preventDefault();});
if(!lab)return;
var b=document.createElement('button');b.type='button';b.textContent='Incolla la busta paga copiata';
b.style.cssText='display:block;width:100%;margin:10px 0 0;padding:14px;border-radius:12px;border:1.5px dashed #2d6a52;background:transparent;color:#2d6a52;font:600 15px Inter,system-ui,sans-serif;cursor:pointer';
var box=document.createElement('div');box.contentEditable='true';box.hidden=true;
box.style.cssText='margin-top:8px;padding:16px;border:1px solid #cfd8d2;border-radius:12px;text-align:center;color:#6b766f;font-size:14px;min-height:20px';
box.textContent='Tieni premuto qui e scegli «Incolla»';
box.addEventListener('input',function(){box.textContent='Tieni premuto qui e scegli «Incolla»';});
b.onclick=async function(){
 try{if(navigator.clipboard&&navigator.clipboard.read){var its=await navigator.clipboard.read();
  for(var k=0;k<its.length;k++){var t=its[k].types.find(function(x){return x==='application/pdf';});
   if(t){var bl=await its[k].getType(t);usa(new File([bl],'busta-paga.pdf',{type:t}));return;}}}}catch(e){}
 box.hidden=false;box.focus();
 avviso('Se hai copiato il PDF, tieni premuto nel riquadro e scegli «Incolla». Da WhatsApp: tieni premuto il PDF, Condividi, «Salva su File», poi usa «Carica la tua busta paga».');
};
lab.parentNode.insertBefore(nota,lab.nextSibling);
lab.parentNode.insertBefore(box,nota);
lab.parentNode.insertBefore(b,box);
})();
