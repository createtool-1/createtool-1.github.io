// Parser busta paga — formato JOB (Sistemi S.p.A.). Lavora su righe di testo.
(function (root) {
  const MESI = ['GENNAIO','FEBBRAIO','MARZO','APRILE','MAGGIO','GIUGNO','LUGLIO','AGOSTO','SETTEMBRE','OTTOBRE','NOVEMBRE','DICEMBRE'];
  const AMT = /-?\d{1,3}(?:\.\d{3})*,\d{2,5}-?/g;

  function num(s) {
    if (!s) return null;
    const neg = s.includes('-');
    const v = parseFloat(s.replace(/-/g, '').replace(/\./g, '').replace(',', '.'));
    return isNaN(v) ? null : (neg ? -v : v);
  }
  function amounts(line) { return (line.match(AMT) || []).map(num); }
  function money2(line) { return (line.match(/\d{1,3}(?:\.\d{3})*,\d{2}(?!\d)/g) || []).map(num); }
  function nextNumLine(lines, i, min) {
    for (let j = i + 1; j < Math.min(lines.length, i + 6); j++) {
      if (amounts(lines[j]).length >= (min || 1)) return lines[j];
    }
    return '';
  }

  // Ferie/ROL: residuo anno prec., maturate, godute, residue (le colonne vuote non compaiono)
  function quattro(n) {
    const r2 = x => Math.round(x * 100) / 100;
    if (n.length >= 4) return { ap: n[0], mat: n[1], god: n[2], res: n[n.length - 1] };
    if (n.length === 3) {
      const [a, b, c] = n;
      if (Math.abs(a - b - c) < 0.05) return { ap: 0, mat: a, god: b, res: c };
      return { ap: a, mat: b, god: Math.max(0, r2(a + b - c)), res: c };
    }
    if (n.length === 2) return { ap: 0, mat: n[0], god: Math.max(0, r2(n[0] - n[1])), res: n[1] };
    return { ap: 0, mat: null, god: null, res: n[0] };
  }

  function parse(lines) {
    const r = { mese: null, anno: null, meseNum: null, netto: null, competenze: null, trattenute: null,
      ferieResidue: null, rolResidui: null, tfrMese: null, tfrProgressivo: null, voci: [], formato: 'sconosciuto' };
    const all = lines.join('\n');
    if (/JOB\s*-\s*Copyright Sistemi/i.test(all)) r.formato = 'JOB (Sistemi)';

    for (const l of lines) {
      const m = l.match(new RegExp('\\b(' + MESI.join('|') + ')\\s+(20\\d\\d)\\b'));
      if (m) { r.mese = m[1]; r.anno = +m[2]; r.meseNum = MESI.indexOf(m[1]) + 1; break; }
    }

    let inVoci = false;
    lines.forEach((l, i) => {
      const u = l.toUpperCase();
      if (u.includes('NETTO IN BUSTA')) {
        const n = amounts(nextNumLine(lines, i, 2));
        if (n.length) { r.netto = n[n.length - 1]; r.competenze = n[0]; r.trattenute = n.length > 2 ? n[1] : null; }
      }
      if (/^\s*FERIE\b/.test(u)) { const n = amounts(l); if (n.length) { r.ferieResidue = n[n.length - 1]; r.ferie = quattro(n); } }
      if (u.includes('PERMESSI (R.O.L.)') || /^\s*R\.?O\.?L\.?\b/.test(u)) { const n = amounts(l); if (n.length) { r.rolResidui = n[n.length - 1]; r.rol = quattro(n); } }
      if (u.includes('TFR MESE')) {
        const n = money2(nextNumLine(lines, i, 2));
        if (n.length >= 4) { r.tfrMese = n[2]; r.tfrProgressivo = n[3]; }
      }
      if (u.includes('VOCE') && u.includes('DESCRIZIONE')) { inVoci = true; return; }
      if (u.includes('DESCRIZIONE CONTRIBUTO')) inVoci = false;
      if (inVoci) {
        const m = l.match(/^\s*(\d{1,5})\s+(.+)$/);
        if (m) {
          const parts = m[2].split(/\s{2,}/);
          const descr = parts[0].trim();
          const imp = money2(m[2]);
          if (descr && /[A-Za-z]/.test(descr)) r.voci.push({ codice: m[1], descrizione: descr, importo: imp.length ? imp[imp.length - 1] : null });
        }
      }
    });
    return r;
  }

  // Dal testo estratto da pdf.js (items con x,y) alle righe
  function itemsToLines(items) {
    const rows = [];
    items.forEach(it => {
      if (!it.str || !it.str.trim()) return;
      const x = it.transform[4], y = it.transform[5];
      let row = rows.find(r => Math.abs(r.y - y) < 3);
      if (!row) { row = { y, parts: [] }; rows.push(row); }
      row.parts.push({ x, w: it.width || 0, s: it.str });
    });
    rows.sort((a, b) => b.y - a.y);
    return rows.map(r => {
      r.parts.sort((a, b) => a.x - b.x);
      let out = '', end = null;
      r.parts.forEach(p => {
        if (end !== null) out += (p.x - end > 6) ? '   ' : (p.x - end > 1 ? ' ' : '');
        out += p.s; end = p.x + p.w;
      });
      return out;
    });
  }

  const api = { parse, itemsToLines, MESI };
  if (typeof module !== 'undefined') module.exports = api; else root.BustaParser = api;
})(this);
