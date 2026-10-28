/* Constancia de Inducción y Reinducción.
   Todo ocurre en el navegador de la persona: no hay servidor, no se guarda nada
   (ni en localStorage) y la constancia se entrega como PDF descargable. */
(function () {
  'use strict';

  var CONTACT = 'gestionhumana@biosteeldecolombia.com';
  var CC = 'calidad@biosteeldecolombia.com';
  var MODULOS = [
    'Módulo 1: Inducción General',
    'Módulo 2: Seguridad y Salud en el Trabajo',
    'Módulo 3: Código de Ética y Conducta'
  ];

  /* Texto proporcionado por Biosteel (Gestión Humana). No editar sin su aprobación. */
  var TERMS = {
    intro: 'Yo, el/la colaborador/a cuyos datos aparecen registrados en este formulario, declaro bajo la gravedad de juramento que:',
    items: [
      { t: 'He revisado y comprendido en su totalidad los contenidos del proceso de Inducción y Reinducción de Biosteel de Colombia S.A.S., que comprende los siguientes módulos:',
        sub: [
          'Módulo 1 — Inducción General: historia, misión, visión, estructura organizacional, líneas de producto y aliados estratégicos de Biosteel de Colombia S.A.S.',
          'Módulo 2 — Seguridad y Salud en el Trabajo (SST): Sistema General de Riesgos Laborales, obligaciones del empleador y del trabajador, identificación de peligros y riesgos, tipos de accidentes e incidentes, brigadas de emergencia y protocolos de reporte.',
          'Módulo 3 — Código de Ética y Conducta: principios éticos, manejo de conflictos de interés, normas de conducta, confidencialidad de la información y consecuencias disciplinarias por incumplimiento.'
        ] },
      { t: 'Me comprometo a aplicar los lineamientos, políticas y normas establecidos en los módulos anteriores en el ejercicio de mis funciones dentro de la empresa.' },
      { t: 'Entiendo que cualquier incumplimiento a las disposiciones contenidas en este proceso de inducción podrá dar lugar a las acciones disciplinarias establecidas en el Reglamento Interno de Trabajo de Biosteel de Colombia S.A.S.' },
      { t: 'Autorizo a Biosteel de Colombia S.A.S. para conservar y utilizar esta constancia como evidencia de mi participación en el proceso de inducción, de conformidad con la Ley 1581 de 2012 (Ley de Protección de Datos Personales).' }
    ],
    close: 'La presente firma electrónica tiene plena validez legal y probatoria conforme a la Ley 527 de 1999 y equivale, para todos los efectos, a una firma manuscrita.'
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (n) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };

  /* ───────── HTML ───────── */
  function termsHtml() {
    return '<p>' + esc(TERMS.intro) + '</p><ol style="padding-left:20px;display:grid;gap:10px">' +
      TERMS.items.map(function (it) {
        return '<li>' + esc(it.t) + (it.sub ? '<ul>' + it.sub.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' : '') + '</li>';
      }).join('') + '</ol><p><b>' + esc(TERMS.close) + '</b></p>';
  }

  function field(id, label, input, hint) {
    return '<div class="field" data-field="' + id + '"><label for="f-' + id + '">' + label + ' <span class="req" aria-hidden="true">*</span></label>' + input +
      (hint ? '<span class="field__hint" id="h-' + id + '">' + hint + '</span>' : '') +
      '<p class="field__err" id="e-' + id + '">' + ic('alert') + '<span></span></p></div>';
  }

  function render() {
    var mods = MODULOS.map(function (m, i) {
      return '<label class="opt"><input type="checkbox" name="mod" value="' + i + '"> <span>' + m + '</span></label>';
    }).join('');
    return '' +
      '<div class="form-head"><img src="assets/img/logo-biosteel-white.png" alt="BioSteel de Colombia S.A." width="150" height="42">' +
        '<h3>Constancia de Inducción y Reinducción — Biosteel de Colombia S.A.S.</h3></div>' +
      '<div class="privacy">' + ic('lock') + '<p><b>Tus datos se quedan en tu navegador.</b> Lo que escribas aquí (cédula, correo, firma) no se guarda en este sitio ni se envía a ningún servidor. Al terminar se crea un PDF en tu equipo, que tú descargas y envías a Gestión Humana. Si sales de esta página antes de generarlo, tendrás que volver a llenar el formulario.</p></div>' +
      '<form class="form" id="cForm" novalidate>' +
        '<div class="form-errors" id="cErrors" role="alert" tabindex="-1"></div>' +
        '<div class="form__row">' +
          field('nombres', 'Nombres', '<input type="text" id="f-nombres" name="nombres" autocomplete="given-name" placeholder="Tus nombres" aria-describedby="e-nombres" required>') +
          field('apellidos', 'Apellidos', '<input type="text" id="f-apellidos" name="apellidos" autocomplete="family-name" placeholder="Tus apellidos" aria-describedby="e-apellidos" required>') +
        '</div>' +
        field('cedula', 'Cédula', '<input type="text" id="f-cedula" name="cedula" inputmode="numeric" autocomplete="off" placeholder="Número de Identificación" aria-describedby="h-cedula e-cedula" required>', 'Solo números, sin puntos ni espacios.') +
        field('cargo', 'Cargo', '<input type="text" id="f-cargo" name="cargo" autocomplete="organization-title" placeholder="Puesto de trabajo en Biosteel" aria-describedby="e-cargo" required>') +
        field('correo', 'Correo electrónico', '<input type="email" id="f-correo" name="correo" autocomplete="email" placeholder="Ingrese su correo" aria-describedby="e-correo" required>') +
        '<fieldset class="checks" data-field="modulos" aria-describedby="e-modulos"><legend>Confirmo que revisé los tres módulos <span class="req" aria-hidden="true">*</span></legend>' + mods +
          '<p class="field__err" id="e-modulos">' + ic('alert') + '<span></span></p></fieldset>' +
        '<fieldset class="checks" data-field="terminos" aria-describedby="e-terminos"><legend class="sr-only">Términos y condiciones</legend>' +
          '<label class="opt"><input type="checkbox" name="terminos" id="f-terminos"> <span>Acepto los <button type="button" class="linklike" data-action="terms-open">términos y condiciones</button> <span class="req" aria-hidden="true">*</span></span></label>' +
          '<p class="field__err" id="e-terminos">' + ic('alert') + '<span></span></p></fieldset>' +
        '<div class="field" data-field="comentarios"><label for="f-comentarios">Comentarios (opcional)</label><textarea id="f-comentarios" name="comentarios" rows="3" maxlength="600"></textarea></div>' +
        '<div class="sign" data-field="firma"><p class="legend" id="signLegend" style="font:600 var(--bs-text-sm) var(--bs-font-body);color:var(--bs-navy)">Firma <span class="req" aria-hidden="true">*</span></p>' +
          '<div class="sign__pad" id="signPad"><canvas id="signCanvas" tabindex="0" role="img" aria-labelledby="signLegend" aria-describedby="signHint e-firma"></canvas><div class="sign__ph" id="signPh">Firma aquí con el mouse, el dedo o un lápiz digital</div></div>' +
          '<div class="sign__tools"><span class="field__hint" id="signHint">Dibuja tu firma dentro del recuadro.</span><button type="button" class="btn btn--ghost btn--sm" id="signClear">' + ic('trash') + 'Borrar</button></div>' +
          '<p class="field__err" id="e-firma">' + ic('alert') + '<span></span></p></div>' +
        '<div class="form__actions"><button type="submit" class="btn btn--primary">' + ic('file-check') + 'Generar constancia en PDF</button></div>' +
      '</form>' +
      '<div id="cResult" aria-live="polite"></div>';
  }

  /* ───────── Lienzo de firma ───────── */
  function SignaturePad(canvas, onChange) {
    var ctx = canvas.getContext('2d'), strokes = [], cur = null, w = 0, h = 0;
    var ink = (getComputedStyle(document.documentElement).getPropertyValue('--bs-navy') || '#203562').trim();

    function size() {
      var r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      if (!r.width) return;
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    }
    function style(c) { c.lineWidth = 2.6; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = ink; c.fillStyle = ink; }
    function drawStroke(c, s, W, H) {
      style(c);
      if (s.length === 1) { c.beginPath(); c.arc(s[0][0] * W, s[0][1] * H, 1.4, 0, Math.PI * 2); c.fill(); return; }
      c.beginPath(); c.moveTo(s[0][0] * W, s[0][1] * H);
      for (var i = 1; i < s.length - 1; i++) {
        var mx = (s[i][0] + s[i + 1][0]) / 2 * W, my = (s[i][1] + s[i + 1][1]) / 2 * H;
        c.quadraticCurveTo(s[i][0] * W, s[i][1] * H, mx, my);
      }
      var l = s[s.length - 1]; c.lineTo(l[0] * W, l[1] * H); c.stroke();
    }
    function redraw() { ctx.clearRect(0, 0, w, h); strokes.forEach(function (s) { drawStroke(ctx, s, w, h); }); }
    function pt(e) { var r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; }

    canvas.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault(); canvas.setPointerCapture(e.pointerId);
      cur = [pt(e)]; strokes.push(cur); redraw(); onChange();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!cur) return;
      var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      (evs.length ? evs : [e]).forEach(function (ev) { cur.push(pt(ev)); });
      redraw();
    });
    function end() { if (cur) { cur = null; onChange(); } }
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('lostpointercapture', end);
    window.addEventListener('resize', size);

    size();
    return {
      clear: function () { strokes = []; cur = null; redraw(); onChange(); },
      /* Cuenta como firma un trazo de al menos ~40 px en total. */
      hasInk: function () {
        var len = 0;
        strokes.forEach(function (s) { for (var i = 1; i < s.length; i++) len += Math.hypot((s[i][0] - s[i - 1][0]) * w, (s[i][1] - s[i - 1][1]) * h); });
        return len >= 40;
      },
      /* PNG sobre fondo blanco, recortado a la tinta, para el PDF. */
      toPng: function () {
        var xs = [], ys = [];
        strokes.forEach(function (s) { s.forEach(function (p) { xs.push(p[0] * w); ys.push(p[1] * h); }); });
        var pad = 10, x0 = Math.max(0, Math.min.apply(null, xs) - pad), y0 = Math.max(0, Math.min.apply(null, ys) - pad);
        var x1 = Math.min(w, Math.max.apply(null, xs) + pad), y1 = Math.min(h, Math.max.apply(null, ys) + pad);
        var sc = 3, cw = Math.round((x1 - x0) * sc), ch = Math.round((y1 - y0) * sc);
        var c = document.createElement('canvas'); c.width = cw; c.height = ch;
        var cx = c.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cw, ch);
        cx.setTransform(sc, 0, 0, sc, -x0 * sc, -y0 * sc);
        strokes.forEach(function (s) { drawStroke(cx, s, w, h); });
        return { data: c.toDataURL('image/png'), ratio: cw / ch };
      }
    };
  }

  /* ───────── PDF ───────── */
  function latin(s) {
    var map = { '—': '-', '–': '-', '“': '"', '”': '"', '‘': "'", '’': "'", '•': '-', '…': '...' };
    return String(s).normalize('NFC').split('').map(function (ch) {
      if (map[ch]) return map[ch];
      if (ch.charCodeAt(0) < 256) return ch;
      var b = ch.normalize('NFD')[0];
      return b.charCodeAt(0) < 128 ? b : '?';
    }).join('');
  }
  function loadImg(src) {
    return new Promise(function (ok) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src; });
  }
  function stamp() {
    return new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }

  async function buildPdf(d, sig) {
    var J = window.jspdf && window.jspdf.jsPDF;
    if (!J) throw new Error('No se cargó la librería de PDF.');
    var doc = new J({ unit: 'mm', format: 'a4', compress: true }), W = 210, M = 18, y = 0, navy = [32, 53, 98], blue = [0, 74, 152], dark = [26, 39, 68], mid = [74, 96, 128];
    var logo = await loadImg('assets/img/logo-biosteel-white.png');

    doc.setFillColor.apply(doc, navy); doc.rect(0, 0, W, 30, 'F');
    if (logo) { try { var lh = 15, lw = lh * logo.naturalWidth / logo.naturalHeight; doc.addImage(logo, 'PNG', M, 7.5, lw, lh, undefined, 'FAST'); } catch (e) { logo = null; } }
    if (!logo) { doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text('BioSteel de Colombia S.A.', M, 17); }
    y = 44;
    doc.setTextColor.apply(doc, navy); doc.setFont('helvetica', 'bold'); doc.setFontSize(17);
    doc.text('Constancia de Inducción y Reinducción', M, y); y += 7;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor.apply(doc, mid);
    doc.text('Biosteel de Colombia S.A.S.', M, y); y += 4;
    doc.setDrawColor.apply(doc, blue); doc.setLineWidth(0.8); doc.line(M, y, M + 16, y); y += 9;

    function need(h) { if (y + h > 284) { doc.addPage(); y = 20; } }
    function heading(t) { need(14); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor.apply(doc, blue); doc.text(latin(t).toUpperCase(), M, y); y += 6; }
    function row(k, v) {
      var lines = doc.splitTextToSize(latin(v), W - 2 * M - 42); need(lines.length * 5 + 2);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor.apply(doc, mid); doc.text(latin(k), M, y);
      doc.setFont('helvetica', 'normal'); doc.setTextColor.apply(doc, dark); doc.text(lines, M + 42, y); y += lines.length * 5 + 2;
    }
    function para(t, size, indent, bold) {
      doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor.apply(doc, dark);
      var lines = doc.splitTextToSize(latin(t), W - 2 * M - indent); var lh2 = size * 0.42 + 0.9;
      lines.forEach(function (l) { need(lh2); doc.text(l, M + indent, y); y += lh2; }); y += 1.5;
    }

    heading('Datos del colaborador');
    row('Nombre completo', d.nombres + ' ' + d.apellidos); row('Cédula', d.cedula); row('Cargo', d.cargo); row('Correo electrónico', d.correo);
    if (d.comentarios) row('Comentarios', d.comentarios);
    y += 3;

    heading('Módulos confirmados');
    MODULOS.forEach(function (m) { para('[X]  ' + m, 10, 0); });
    y += 2;

    heading('Declaración aceptada');
    para(TERMS.intro, 8.5, 0);
    TERMS.items.forEach(function (it, i) {
      para((i + 1) + '. ' + it.t, 8.5, 0);
      (it.sub || []).forEach(function (s) { para('- ' + s, 8, 6); });
    });
    para(TERMS.close, 8.5, 0, true);
    y += 2;

    need(54);
    heading('Firma y fecha');
    row('Fecha y hora', stamp() + ' (hora de Colombia)');
    y += 1;
    var sw = 70, sh = Math.min(24, sw / sig.ratio); sw = Math.min(sw, sh * sig.ratio);
    doc.addImage(sig.data, 'PNG', M, y, sw, sh, undefined, 'FAST'); y += sh + 1;
    doc.setDrawColor.apply(doc, dark); doc.setLineWidth(0.3); doc.line(M, y, M + 80, y); y += 4.5;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor.apply(doc, dark);
    doc.text(latin(d.nombres + ' ' + d.apellidos + '  -  C.C. ' + d.cedula), M, y); y += 4.5;
    doc.setFontSize(7.5); doc.setTextColor.apply(doc, mid);
    doc.text('Fecha y hora tomadas del reloj del dispositivo del firmante.', M, y);

    var n = doc.getNumberOfPages();
    for (var p = 1; p <= n; p++) {
      doc.setPage(p); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, mid);
      doc.text('Documento generado en el navegador del firmante. Biosteel de Colombia S.A.S. - Gestión Humana', M, 290);
      doc.text('Página ' + p + ' de ' + n, W - M, 290, { align: 'right' });
    }
    return doc;
  }

  /* ───────── Validación y enlace ───────── */
  function bind(root, opts) {
    var form = $('#cForm', root); if (!form) return;
    var pad = SignaturePad($('#signCanvas', root), function () {
      $('#signPad', root).classList.toggle('is-signed', pad && pad.hasInk());
      if (pad && pad.hasInk()) setErr('firma', '');
    });
    var errors = {}, lastDoc = null, lastName = '';
    $('#signClear', root).addEventListener('click', function () { pad.clear(); });

    var wrap = function (id) { return $('[data-field="' + id + '"]', form); };
    function setErr(id, msg) {
      var w = wrap(id), p = $('#e-' + id, root); if (!w || !p) return;
      var inp = $('input[type="text"], input[type="email"]', w);
      if (msg) { errors[id] = msg; w.classList.add('has-error'); $('span', p).textContent = msg; if (inp) inp.setAttribute('aria-invalid', 'true'); }
      else { delete errors[id]; w.classList.remove('has-error'); $('span', p).textContent = ''; if (inp) inp.removeAttribute('aria-invalid'); }
    }
    var val = function (n) { return (form.elements[n].value || '').replace(/\s+/g, ' ').trim(); };
    var nameRe = /^[\p{L}][\p{L}\s'’.-]*$/u;

    var rules = {
      nombres: function () { var v = val('nombres'); return !v ? 'Escribe tus nombres.' : !nameRe.test(v) ? 'Usa solo letras en los nombres.' : ''; },
      apellidos: function () { var v = val('apellidos'); return !v ? 'Escribe tus apellidos.' : !nameRe.test(v) ? 'Usa solo letras en los apellidos.' : ''; },
      cedula: function () {
        var v = form.elements.cedula.value.trim();
        return !v ? 'Escribe tu número de cédula.' : /\D/.test(v) ? 'La cédula debe tener solo números, sin puntos, comas ni espacios.' : (v.length < 5 || v.length > 12) ? 'La cédula debe tener entre 5 y 12 dígitos.' : '';
      },
      cargo: function () { var v = val('cargo'); return v.length < 2 ? 'Escribe tu cargo.' : ''; },
      correo: function () { var v = form.elements.correo.value.trim(); return !v ? 'Escribe tu correo electrónico.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'Escribe un correo válido, por ejemplo nombre@empresa.com.' : ''; },
      modulos: function () { return $$checked('mod') < 3 ? 'Marca los tres módulos para poder firmar.' : ''; },
      terminos: function () { return form.elements.terminos.checked ? '' : 'Debes aceptar los términos y condiciones.'; },
      firma: function () { return pad.hasInk() ? '' : 'Dibuja tu firma en el recuadro.'; }
    };
    function $$checked(name) { return Array.prototype.filter.call(form.elements[name], function (c) { return c.checked; }).length; }
    var ORDER = ['nombres', 'apellidos', 'cedula', 'cargo', 'correo', 'modulos', 'terminos', 'firma'];
    var LABEL = { nombres: 'Nombres', apellidos: 'Apellidos', cedula: 'Cédula', cargo: 'Cargo', correo: 'Correo', modulos: 'Módulos', terminos: 'Términos', firma: 'Firma' };

    function focusField(id) {
      var el = id === 'firma' ? $('#signCanvas', root) : id === 'modulos' ? form.elements.mod[0] : id === 'terminos' ? form.elements.terminos : form.elements[id];
      if (el) { el.focus(); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    }
    function validate() {
      var first = null;
      ORDER.forEach(function (id) { var m = rules[id](); setErr(id, m); if (m && !first) first = id; });
      var box = $('#cErrors', root), bad = ORDER.filter(function (id) { return errors[id]; });
      if (bad.length) {
        box.innerHTML = '<b>Revisa ' + bad.length + (bad.length === 1 ? ' campo' : ' campos') + ' antes de continuar:</b> ' + bad.map(function (id) { return LABEL[id]; }).join(', ') + '.';
        box.classList.add('is-on');
      } else { box.classList.remove('is-on'); box.textContent = ''; }
      return first;
    }
    ['nombres', 'apellidos', 'cedula', 'cargo', 'correo'].forEach(function (id) {
      form.elements[id].addEventListener('input', function () { if (errors[id]) setErr(id, rules[id]()); });
    });
    form.addEventListener('change', function (e) {
      if (e.target.name === 'mod' && errors.modulos) setErr('modulos', rules.modulos());
      if (e.target.name === 'terminos' && errors.terminos) setErr('terminos', rules.terminos());
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var first = validate();
      if (first) { focusField(first); return; }
      var btn = $('button[type="submit"]', form); btn.disabled = true;
      var d = { nombres: val('nombres'), apellidos: val('apellidos'), cedula: form.elements.cedula.value.trim(), cargo: val('cargo'), correo: form.elements.correo.value.trim(), comentarios: val('comentarios') };
      try {
        lastDoc = await buildPdf(d, pad.toPng());
        lastName = 'Constancia_Induccion_Biosteel_' + new Date().toISOString().slice(0, 10) + '.pdf';
        lastDoc.save(lastName);
        showResult(root);
        if (opts && opts.onGenerated) opts.onGenerated();
      } catch (err) {
        $('#cErrors', root).innerHTML = '<b>No se pudo generar el PDF.</b> ' + esc(err.message || 'Intenta de nuevo.') + ' Si el problema continúa, escribe a ' + CONTACT + '.';
        $('#cErrors', root).classList.add('is-on'); $('#cErrors', root).focus();
      } finally { btn.disabled = false; }
    });

    function showResult(r) {
      var subj = encodeURIComponent('Constancia de Inducción y Reinducción');
      var body = encodeURIComponent('Buen día. Adjunto mi constancia de inducción y reinducción en PDF.');
      $('#cResult', r).innerHTML = '<div class="result"><h3>Tu constancia se generó como PDF</h3>' +
        '<p>Se descargó el archivo <b>' + esc(lastName) + '</b> en tu equipo. Este sitio no lo envía ni lo guarda: <b>debes enviarlo tú</b> a Gestión Humana.</p>' +
        '<p>El botón abre tu programa de correo con el mensaje listo, pero <b>no puede adjuntar el PDF</b>: adjúntalo tú antes de enviar.</p>' +
        '<div class="form__actions"><a class="btn btn--primary" href="mailto:' + CONTACT + '?cc=' + CC + '&subject=' + subj + '&body=' + body + '">' + ic('mail') + 'Abrir correo para enviarla</a>' +
        '<button type="button" class="btn btn--secondary" id="cAgain">' + ic('download') + 'Descargar de nuevo</button></div></div>';
      $('#cAgain', r).addEventListener('click', function () { if (lastDoc) lastDoc.save(lastName); });
      $('#cResult .result', r).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  window.Constancia = { render: render, bind: bind, termsHtml: termsHtml, CONTACT: CONTACT };
})();
