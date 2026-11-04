/**
 * Recibe la constancia desde el sitio de Inducción y Reinducción y la envía por correo
 * a Gestión Humana, desde la cuenta de Gmail que publica este script.
 *
 * El destinatario está fijado aquí, en el servidor. El sitio NO decide a quién se envía
 * (si no, cualquiera podría usar esta cuenta para mandar correo a terceros).
 *
 * Publicación: ver docs/ENVIO_CORREO.md.
 */

var DESTINATARIO = 'gestionhumana@biosteeldecolombia.com';
// Ojo con la cuota: Gmail gratuito permite 100 destinatarios por día. Con copia, cada constancia cuenta 2.
var COPIA = '';
var NOMBRE_REMITENTE = 'Inducción y Reinducción Biosteel';
var MAX_PDF_BYTES = 1500000;   // un PDF normal pesa ~100 KB
var MAX_POR_MINUTO = 20;       // freno general contra abuso

function doPost(e) {
  var lock = LockService.getScriptLock(), locked = false;
  try {
    lock.waitLock(15000); locked = true;

    var d = JSON.parse(e.postData.contents);
    var err = validar_(d);
    if (err) return salida_({ ok: false, error: err });

    var cache = CacheService.getScriptCache();
    if (cache.get('c_' + d.cedula)) return salida_({ ok: false, error: 'duplicado' });
    var kMin = 'r_' + Math.floor(Date.now() / 60000), n = Number(cache.get(kMin) || 0);
    if (n >= MAX_POR_MINUTO) return salida_({ ok: false, error: 'demasiadas_solicitudes' });
    if (MailApp.getRemainingDailyQuota() < (COPIA ? 2 : 1)) return salida_({ ok: false, error: 'cuota_diaria' });

    var bytes = Utilities.base64Decode(d.pdf);
    if (bytes.length > MAX_PDF_BYTES) return salida_({ ok: false, error: 'pdf_grande' });
    // Los primeros bytes de un PDF son "%PDF"
    if (!(bytes[0] === 37 && bytes[1] === 80 && bytes[2] === 68 && bytes[3] === 70)) return salida_({ ok: false, error: 'pdf_invalido' });
    var adjunto = Utilities.newBlob(bytes, 'application/pdf', 'Constancia_Induccion_' + d.codigo + '.pdf');

    var nombre = d.nombres + ' ' + d.apellidos;
    var cuerpo = [
      'Se recibió una constancia de inducción y reinducción desde el portal.',
      '',
      'Nombre: ' + nombre,
      'Cédula: ' + d.cedula,
      'Cargo: ' + d.cargo,
      'Correo: ' + d.correo,
      'Módulos confirmados: ' + d.modulos,
      'Fecha y hora: ' + d.fechaHora + ' (hora de Colombia, según el reloj del dispositivo)',
      'Código de la constancia: ' + d.codigo,
      d.comentarios ? 'Comentarios: ' + d.comentarios : 'Comentarios: (ninguno)',
      '',
      'El PDF firmado va adjunto. Si respondes este correo, la respuesta llega a la persona.'
    ].join('\n');

    var opciones = {
      to: DESTINATARIO,
      replyTo: d.correo,
      subject: 'Constancia de inducción y reinducción - ' + nombre + ' (C.C. ' + d.cedula + ')',
      body: cuerpo,
      name: NOMBRE_REMITENTE,
      attachments: [adjunto]
    };
    if (COPIA) opciones.cc = COPIA;
    MailApp.sendEmail(opciones);

    cache.put('c_' + d.cedula, '1', 60);
    cache.put(kMin, String(n + 1), 120);
    return salida_({ ok: true });
  } catch (ex) {
    console.error(ex);
    return salida_({ ok: false, error: 'interno' });
  } finally {
    if (locked) lock.releaseLock();
  }
}

/** Abrir la URL en el navegador solo comprueba que el script está publicado. */
function doGet() { return salida_({ ok: true, servicio: 'constancias' }); }

function validar_(d) {
  if (!d || typeof d !== 'object') return 'datos';
  var texto = function (v, max) { return typeof v === 'string' && v.length > 0 && v.length <= max && !/[\r\n]/.test(v); };
  if (!texto(d.nombres, 80) || !texto(d.apellidos, 80) || !texto(d.cargo, 100)) return 'datos';
  if (typeof d.cedula !== 'string' || !/^\d{5,12}$/.test(d.cedula)) return 'cedula';
  if (typeof d.correo !== 'string' || d.correo.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo)) return 'correo';
  if (typeof d.codigo !== 'string' || !/^[0-9A-F]{8}$/.test(d.codigo)) return 'codigo';
  if (typeof d.modulos !== 'string' || d.modulos.length > 300) return 'datos';
  if (typeof d.fechaHora !== 'string' || d.fechaHora.length > 80) return 'datos';
  if (typeof d.comentarios !== 'string' || d.comentarios.length > 600) return 'datos';
  if (typeof d.pdf !== 'string' || d.pdf.length === 0 || d.pdf.length > MAX_PDF_BYTES * 1.4) return 'pdf';
  return '';
}

function salida_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
