/* Sicurezza: ripulisce testo da PDF, archivi importati e memoria del telefono prima che venga mostrato */
(function(){
function str(v){return v.replace(/[<>\x60]/g,"").replace(/'/g,"’").replace(/"/g,"”")}
function pul(v,d){if(d>8)return v;if(typeof v==="string")return str(v);if(Array.isArray(v))return v.map(function(x){return pul(x,d+1)});
 if(v&&typeof v==="object"){var o={};for(var k in v){if(Object.prototype.hasOwnProperty.call(v,k))o[str(k)]=pul(v[k],d+1)}return o}return v}
window.lcPulisci=function(v){return pul(v,0)};
var DK=/^\d{4}-\d{2}-\d{2}$/;
function giorni(o){var r={};if(o&&typeof o==="object")for(var k in o){if(DK.test(k))r[k]=o[k]}return r}
var KEYS={busta_archivio:1,busta_imp:1,ore_giorni:1,ore_imp:1,ore_norm:1};
var si=Storage.prototype.setItem;
Storage.prototype.setItem=function(k,v){if(KEYS[k]){try{var j=pul(JSON.parse(v),0);if(k==="ore_giorni")j=giorni(j);v=JSON.stringify(j)}catch(e){}}return si.call(this,k,v)};
for(var k in KEYS){try{var s=localStorage.getItem(k);if(s!=null)localStorage.setItem(k,s)}catch(e){}}
if(typeof window.mostra==="function"){var m=window.mostra;window.mostra=function(r){if(r&&typeof r==="object"){var c=pul(r,0);for(var x in c)r[x]=c[x]}return m.apply(this,arguments)}}
if(typeof window.importa==="function"){var im=window.importa;window.importa=function(f){if(!f||typeof f.text!=="function")return im.apply(this,arguments);var self=this;
 return f.text().then(function(t){var j;try{j=pul(JSON.parse(t),0)}catch(e){return im.call(self,f)}if(j&&j.giorni)j.giorni=giorni(j.giorni);
  return im.call(self,new File([JSON.stringify(j)],f.name||"archivio.json",{type:"application/json"}))})}}
})();
