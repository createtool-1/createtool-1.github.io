// Lettore universale buste paga (qualsiasi programma) — lavora sulle posizioni del testo del PDF
(function(root){
var MESI=['GENNAIO','FEBBRAIO','MARZO','APRILE','MAGGIO','GIUGNO','LUGLIO','AGOSTO','SETTEMBRE','OTTOBRE','NOVEMBRE','DICEMBRE'];
var AMT=/^-?(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2,5}-?$/;
function num(s){s=String(s).replace(/[€\s]/g,'');var neg=/-/.test(s);var v=parseFloat(s.replace(/-/g,'').replace(/\./g,'').replace(',','.'));return isNaN(v)?null:(neg?-v:v);}
function righe(items){var rows=[];items.forEach(function(it){var s=(it.str||'').trim();if(!s)return;var x=it.transform[4],y=it.transform[5],w=it.width||s.length*4;
 s.split(/\s{2,}/).forEach(function(p,i,a){var px=x+(i?w*s.indexOf(p)/s.length:0),pw=w*p.length/s.length;var r=null;for(var k=0;k<rows.length;k++)if(Math.abs(rows[k].y-y)<3){r=rows[k];break;}
  if(!r){r={y:y,c:[]};rows.push(r);}r.c.push({s:p,x0:px,x1:px+pw,y:y});});});
 rows.sort(function(a,b){return b.y-a.y;});rows.forEach(function(r){r.c.sort(function(a,b){return a.x0-b.x0;});r.t=r.c.map(function(c){return c.s;}).join('  ');});return rows;}
function etichetta(rows,re){for(var i=0;i<rows.length;i++){var c=rows[i].c;for(var a=0;a<c.length;a++){var t='';for(var b=a;b<Math.min(c.length,a+5);b++){t+=(b>a?' ':'')+c[b].s;if(t.toUpperCase().search(re)===0)return {r:i,x0:c[a].x0,x1:c[b].x1,y:c[a].y,nx:b+1<c.length?c[b+1].x0:1e9};}}}return null;}
function valore(rows,L){if(!L)return null;var best=null,bd=1e9;
 rows.forEach(function(r,i){r.c.forEach(function(c){if(!AMT.test(c.s.replace(/[€\s]/g,'')))return;var dy=L.y-c.y,d;
  if(Math.abs(dy)<3&&c.x0>=L.x1-2)d=(c.x0-L.x1)+0.1;
  else if(dy>0&&dy<45&&c.x0>=L.x0-3&&c.x1<=L.nx+3)d=dy;
  else if(dy>0&&dy<45&&c.x1>L.x0-25&&c.x0<L.x1+25)d=dy*2+200;else return;if(d<bd){bd=d;best=c;}});});
 return best?num(best.s):null;}
function cerca(rows,res){for(var i=0;i<res.length;i++){var v=valore(rows,etichetta(rows,res[i]));if(v!=null)return v;}return null;}
function rigaNumeri(rows,re){for(var i=0;i<rows.length;i++){if(re.test(rows[i].t.toUpperCase())){var n=rows[i].c.map(function(c){return c.s.replace(/[€\s]/g,'');}).filter(function(s){return AMT.test(s);}).map(num);if(n.length)return n;}}return null;}
function decodifica(items){return items.map(function(it){var s=it.str||'';if(!/[-]/.test(s))return it;var o={};for(var k in it)o[k]=it[k];
 o.str=s.replace(/[-]/g,function(c){var k=c.charCodeAt(0)-0xF000;return String.fromCharCode(k>=160?288-k:k);});return o;});}
var MESIT=['GENNAIO','FEBBRAIO','MARZO','APRILE','MAGGIO','GIUGNO','LUGLIO','AGOSTO','SETTEMBRE','OTTOBRE','NOVEMBRE','DICEMBRE'];
function ranocchi(items){var rows=righe(items),T=rows.map(function(r){return r.t;}).join('\n');if(!/Ranocchi/i.test(T))return null;
 var r={mese:null,anno:null,meseNum:null,netto:null,competenze:null,trattenute:null,ferieResidue:null,rolResidui:null,tfrMese:null,tfrProgressivo:null,voci:[],formato:'Ranocchi'};
 var m=T.toUpperCase().match(new RegExp('\\b('+MESIT.join('|')+')\\s+(20\\d\\d)\\b'));if(m){r.mese=m[1];r.anno=+m[2];r.meseNum=MESIT.indexOf(m[1])+1;}
 function ultimo(y){for(var i=0;i<rows.length;i++)if(Math.abs(rows[i].y-y)<6){var n=rows[i].c.map(function(c){return c.s;}).filter(function(s){return AMT.test(s);});if(n.length)return num(n[n.length-1]);}return null;}
 r.competenze=ultimo(458);r.trattenute=ultimo(306);r.netto=ultimo(187);
 rows.forEach(function(row){if(row.y<470||row.y>620)return;var mm=row.t.match(/^\s*(\d{1,5})\s+([A-Za-z][^0-9]{2,}?)\s{2,}/);if(!mm)return;
  var n=row.c.map(function(c){return c.s;}).filter(function(s){return AMT.test(s);});r.voci.push({codice:mm[1],descrizione:mm[2].trim(),importo:n.length?num(n[n.length-1]):null});});
 return r.netto!=null?r:null;}
function leggi(items){
 var rows=righe(items),T=rows.map(function(r){return r.t;}).join('\n').toUpperCase();
 var r={mese:null,anno:null,meseNum:null,netto:null,competenze:null,trattenute:null,ferieResidue:null,rolResidui:null,tfrMese:null,tfrProgressivo:null,voci:[],formato:'universale'};
 var m=T.match(new RegExp('\\b('+MESI.join('|')+')\\s*[\\/-]?\\s*(20\\d\\d)\\b'));
 if(m){r.mese=m[1];r.anno=+m[2];r.meseNum=MESI.indexOf(m[1])+1;}
 else{var p=T.match(/(?:PERIODO|MESE|COMPETENZA|RETRIBUZIONE)[^\n]{0,40}?\b(0?[1-9]|1[0-2])\s*[\/-]\s*(20\d\d)\b/);if(p){r.meseNum=+p[1];r.mese=MESI[r.meseNum-1];r.anno=+p[2];}}
 r.netto=cerca(rows,[/NETTO\s*(IN\s*)?BUSTA/,/NETTO\s*(DEL\s*)?MESE/,/NETTO\s*(A|DA)\s*PAGARE/,/NETTO\s*PAGATO/,/NETTO\s*(IN\s*)?BUSTA\s*PAGA/,/^NETTO$/]);
 r.competenze=cerca(rows,[/TOT(ALE|\.)?\s*COMPETENZE/,/TOTALE\s*LORDO/,/TOT(ALE|\.)?\s*ASSEGNI/,/LORDO\s*(DEL\s*)?MESE/]);
 r.trattenute=cerca(rows,[/TOT(ALE|\.)?\s*TRATTENUTE/,/TOT(ALE|\.)?\s*RITENUTE/]);
 if(r.netto==null&&r.competenze!=null&&r.trattenute!=null)r.netto=Math.round((r.competenze-r.trattenute)*100)/100;
 var f=rigaNumeri(rows,/^\s*FERIE\b/);if(f)r.ferieResidue=f[f.length-1];else r.ferieResidue=cerca(rows,[/FERIE\s*RES/,/RESIDU\w*\s*FERIE/,/SALDO\s*FERIE/]);
 var p2=rigaNumeri(rows,/^\s*(PERMESSI|PERM\.|R\.?\s?O\.?\s?L\.?\b|EX\s*FEST)/);if(p2)r.rolResidui=p2[p2.length-1];else r.rolResidui=cerca(rows,[/PERM\.?\s*RES/,/ROL\s*RES/,/RESIDU\w*\s*(PERMESSI|ROL)/]);
 r.tfrMese=cerca(rows,[/TFR\s*(DEL\s*)?MESE/,/QUOTA\s*T\.?F\.?R/,/T\.?F\.?R\.?\s*MATURATO/]);
 var HV=rows.some(function(x){return /(VOCE|COD)\w*.*DESCRIZIONE/.test(x.t.toUpperCase());})?/(VOCE|COD)\w*.*DESCRIZIONE/:/DESCRIZIONE/;
 var dentro=false;rows.forEach(function(row){var U=row.t.toUpperCase();
  if(HV.test(U)&&!/CONTRIBUT/.test(U)){dentro=true;return;}
  if(/CONTRIBUT|IMPONIBILE|TOTALE\s*COMPETENZE|NETTO/.test(U))dentro=false;
  if(!dentro)return;var mm=row.t.match(/^\s*([A-Z]?\d{1,6})\s+(.*[A-Za-z].*)$/);if(!mm)return;
  var parti=mm[2].split(/\s{2,}/),d=parti[0].trim(),n=row.c.map(function(c){return c.s.replace(/[€\s]/g,'');}).filter(function(s){return /,\d{2}-?$/.test(s)&&AMT.test(s);});
  if(/[A-Za-z]{3}/.test(d))r.voci.push({codice:mm[1],descrizione:d,importo:n.length?num(n[n.length-1]):null});});
 return r;}
var api={leggi:leggi,decodifica:decodifica,ranocchi:ranocchi};
if(typeof module!=='undefined')module.exports=api;else root.BustaUniversale=api;
if(typeof document==='undefined')return;
var inp=document.getElementById('file');if(!inp)return;var orig=inp.onchange;
inp.onchange=async function(e){var f=e.target.files&&e.target.files[0];if(!f||!(/pdf/i.test(f.type)||/\.pdf$/i.test(f.name||'')))return orig(e);
 try{if(!window.pdfjsLib)return orig(e);pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise,items=[],lines=[];
  for(var p=1;p<=pdf.numPages;p++){var tc=await (await pdf.getPage(p)).getTextContent(),di=decodifica(tc.items);if(p===1)items=di;lines=lines.concat(BustaParser.itemsToLines(di));}
  var j=BustaParser.parse(lines);if(j.netto)return orig(e);
  var r=ranocchi(items)||leggi(items);if(r.netto==null)return orig(e);
  avviso('');$('risultato').classList.add('hide');$('salva').textContent='Salva nel mio archivio';ultimo=r;if(r.mese)$('salva').click();mostra(r);
 }catch(err){return orig(e);}};
})(this);
