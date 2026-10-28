(function () {
  'use strict';

  /* ───────── Utilidades ───────── */
  var CONTACT = Constancia.CONTACT;
  var STORE = 'bs-induccion-v1';
  var LINKS = {
    video: 'https://biosteeldecolombia-my.sharepoint.com/:v:/p/valeria_florez/IQCh2APM8vsAQYRiFhoNWgPaAQ6e99ZgC8AIJQP93mFNR4k?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=MbJfbE',
    videoEmbed: 'https://biosteeldecolombia-my.sharepoint.com/personal/valeria_florez_biosteeldecolombia_com/_layouts/15/embed.aspx?UniqueId=cc03d8a1-fbf2-4100-8462-161a0d5a03da&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create',
    sagrilaftEval: 'https://forms.office.com/r/Th21S6saBh',
    tecno: 'https://biosteeldecolombia.github.io/capacitacion_tecnovigilancia/'
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (n, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var tip = function (t, d) { return '<span class="tip" tabindex="0" data-tip="' + esc(d) + '">' + t + '</span>'; };

  /* Definiciones de los tooltips: las de la empresa vienen de sus diapositivas;
     las generales (ARL, COPASST, SST, UIAF) están pendientes de aprobación de Gestión Humana. */
  var T = {
    reinduccion: tip('reinducción', 'Repaso de los contenidos de la inducción para quienes ya trabajan en la empresa, con el fin de reforzarlos y actualizarlos.'),
    induccion: tip('inducción', 'Primer recorrido por la empresa que hace una persona al ingresar: quiénes somos, cómo trabajamos, cómo cuidarse y qué conducta se espera.'),
    constancia: tip('constancia', 'Documento firmado en el que dejas registro de que revisaste los tres temas de la inducción.'),
    sst: tip('SST', 'Seguridad y Salud en el Trabajo: acciones para prevenir accidentes y enfermedades relacionados con el trabajo.'),
    sgsst: tip('SG-SST', 'Sistema de Gestión de la Seguridad y Salud en el Trabajo: el sistema con el que la empresa planea, aplica y controla la prevención de riesgos laborales.'),
    arl: tip('ARL', 'Administradora de Riesgos Laborales: entidad a la que se reportan los accidentes de trabajo. La ARL de Biosteel es SURA.'),
    copasst: tip('COPASST', 'Comité Paritario de Seguridad y Salud en el Trabajo: espacio con representantes de la empresa y de los trabajadores para promover la prevención de riesgos.'),
    sagrilaft: tip('SAGRILAFT', 'Sistema de autocontrol y gestión del riesgo de lavado de activos y financiación del terrorismo, que busca prevenir, controlar y mitigar ese riesgo (no puede eliminarlo del todo).'),
    lasft: tip('LA/FT/FPADM', 'LA: lavado de activos. FT: financiación del terrorismo. FPADM: financiación de la proliferación de armas de destrucción masiva.'),
    pep: tip('PEP', 'Persona Expuesta Políticamente: servidores públicos con ciertas funciones definidas en el Decreto 830 de 2021. La debida diligencia intensificada alcanza también a su familia y asociados cercanos.'),
    uiaf: tip('UIAF', 'Unidad de Información y Análisis Financiero: entidad a la que se reportan las operaciones sospechosas. En Biosteel solo lo hace el Oficial de Cumplimiento.'),
    oficial: tip('Oficial de Cumplimiento', 'Persona que supervisa y dirige el diseño, la implementación y el funcionamiento del sistema SAGRILAFT en la empresa.'),
    dd: tip('debida diligencia', 'Medidas razonables para identificar a la contraparte, conocer a su beneficiario final y entender el propósito de la relación comercial.'),
    icontec: tip('ICONTEC', 'Instituto Colombiano de Normas Técnicas y Certificación, organismo que certifica los sistemas de gestión de la empresa.'),
    invima: tip('INVIMA', 'Instituto Nacional de Vigilancia de Medicamentos y Alimentos: la autoridad sanitaria de Colombia.'),
    ccaa: tip('CCAA', 'Certificado de Capacidad de Almacenamiento y/o Acondicionamiento de dispositivos médicos, otorgado por el INVIMA.'),
    iso9001: tip('ISO 9001:2015', 'Norma internacional de Sistemas de Gestión de Calidad.'),
    iso13485: tip('ISO 13485:2016', 'Norma internacional de sistemas de gestión de calidad para dispositivos médicos.')
  };

  /* ───────── Piezas reutilizables ───────── */
  function tile(icon, title, text, cls) {
    return '<div class="tile' + (cls ? ' ' + cls : '') + '"><div class="tile__icon">' + ic(icon) + '</div><h3>' + title + '</h3><p>' + text + '</p></div>';
  }
  function li(icon, text) { return '<li>' + ic(icon) + '<span>' + text + '</span></li>'; }
  function pull(text) { return '<div class="pull">' + ic('quote') + '<p>' + text + '</p></div>'; }
  function slideFig(n, alt, cap) {
    var p = n < 10 ? '0' + n : '' + n;
    return '<figure class="slide-fig"><img src="assets/slides/ind-' + p + '.jpg" alt="' + esc(alt) + '" loading="lazy" width="1280" height="720">' +
      '<figcaption>' + cap + '</figcaption></figure>';
  }
  function bullets(arr) { return '<ul class="checklist">' + arr.map(function (t) { return li('check', t); }).join('') + '</ul>'; }
  function numbered(arr, warnIdx) {
    return '<ol class="numbered">' + arr.map(function (a, i) { return '<li' + (i === warnIdx ? ' class="warn"' : '') + '><strong>' + a[0] + '</strong>' + a[1] + '</li>'; }).join('') + '</ol>';
  }
  function checkBtn(i, s, label, pressed) {
    return '<button class="check" data-action="toggle-declare" data-s="' + s + '" data-i="' + i + '" aria-pressed="' + pressed + '"><span class="check__box">' + ic('check') + '</span>' + label + '</button>';
  }

  /* ───────── Presentaciones (visor) ───────── */
  var DECKS = {
    ind: { n: 31, title: 'Inducción y Reinducción Biosteel', pdf: 'assets/pdf/induccion-reinduccion-biosteel.pdf' },
    sag: { n: 23, title: 'Capacitación SAGRILAFT', pdf: 'assets/pdf/capacitacion-sagrilaft-biosteel.pdf' }
  };

  /* ───────── Contenido por etapas ───────── */
  var G1 = 'Inducción general', G2 = 'Seguridad y Salud en el Trabajo', G3 = 'Código de Ética y Conducta';

  var STAGES = [
    { n: 1, title: 'Inducción general', icon: 'book', deck: 'ind',
      summary: 'Conoce Biosteel, cuida tu seguridad y salud en el trabajo y entiende el Código de Ética y Conducta.',
      sub: 'Tres temas en una sola etapa: inducción general, seguridad y salud en el trabajo, y código de ética y conducta.',
      closing: 'Has completado el estudio de la inducción.', closingText: 'El siguiente paso es firmar tu constancia.',
      steps: [
        { g: G1, t: 'Quiénes somos', ic: 'building', slide: 3, html: function () { return '' +
          '<p class="prose-lg">Biosteel de Colombia S.A.S. es una empresa con más de 18 años de experiencia dedicada al servicio de la salud.</p>' +
          '<p class="prose">Brindamos suministro de una alta gama de dispositivos médicos de última generación que permiten mejorar la calidad del servicio asistencial a pacientes y su calidad de vida.</p>' +
          '<h3>Nuestros principios fundamentales</h3>' +
          '<div class="meta">' + ['Ética', 'Servicio', 'Responsabilidad', 'Trabajo en equipo', 'Compromiso', 'Comunicación', 'Calidad'].map(function (p) { return '<span class="badge">' + ic('check') + p + '</span>'; }).join('') + '</div>'; } },
        { g: G1, t: 'Misión y visión', ic: 'target', slide: 4, html: function () { return '' +
          '<div class="grid2">' +
          tile('target', 'Misión', 'Somos una empresa dedicada a la importación, comercialización y distribución de dispositivos médicos de óptima calidad con el respaldo de las mejores casas fabricantes nacionales e internacionales. Ofrecemos servicio oportuno con un recurso humano competente y calificado para satisfacer las necesidades de especialistas e instituciones del área de la salud, restaurando así la calidad de vida de los usuarios.') +
          tile('eye', 'Visión', 'En el 2027 seremos reconocidos como aliados estratégicos en el sector salud a nivel nacional, suministrando dispositivos médicos en traumatología con altos estándares de calidad, brindando asesoría quirúrgica integral y oportunidad en el servicio logístico.', 'tile--navy') +
          '</div>'; } },
        { g: G1, t: 'Certificaciones de calidad', ic: 'shield-check', slide: 5, html: function () { return '' +
          '<p class="prose-lg">Nuestros sistemas de gestión están certificados por ' + T.icontec + ' y por el ' + T.invima + '.</p>' +
          '<div class="grid3">' +
          tile('shield-check', T.iso9001, 'Sistema de Gestión de Calidad. Otorgado por ICONTEC.<br><b>Registro:</b> SC-CER419795') +
          tile('shield-check', T.iso13485, 'Dispositivos médicos, Sistema de Gestión de Calidad. Otorgado por ICONTEC.<br><b>Registro:</b> DM-CER419796') +
          tile('file-check', 'INVIMA · ' + T.ccaa, 'Certificado de Capacidad de Almacenamiento y/o Acondicionamiento de dispositivos médicos.') +
          '</div>'; } },
        { g: G1, t: 'Aliados estratégicos y marcas', ic: 'users', slide: 6, html: function () { return '' +
          '<p class="prose-lg">Trabajamos de la mano de instituciones de salud en distintas ciudades y con el respaldo de grandes marcas.</p>' +
          '<div class="grid2">' +
          tile('building', 'Barranquilla', 'Fundación Campbell') + tile('building', 'Santa Marta', 'Clínica Bahía – Inversiones Azalud S.A.S.') +
          tile('building', 'Cartagena', 'Clínica Barú – Especialistas en Traumatología') + tile('building', 'Cali', 'ValleSalud') +
          '</div>' +
          slideFig(7, 'Logos de las marcas que respaldan a Biosteel de Colombia', 'Nos respaldan grandes marcas. Diapositiva original.'); } },
        { g: G1, t: 'Líneas de producto', ic: 'box', slide: 8, html: function () { return '' +
          '<div class="grid3">' +
          tile('wrench', 'Ortopedia', 'Placas, tornillos y clavos de titanio para fijación ósea.') +
          tile('target', 'Neuro-Maxilofacial', 'Sistemas especializados para neurocirugía y cirugía cráneo-maxilofacial.') +
          tile('refresh', 'Reemplazos Articulares', 'Prótesis de cadera, rodilla y hombro de última generación.') +
          tile('heart-pulse', 'Línea Deportiva', 'Materiales para artroscopia y cirugía ortopédica deportiva.') +
          tile('layers', 'Biológicos', 'Injertos y sustitutos óseos para regeneración tisular.') +
          tile('shield', 'Columna', 'Sistemas de fijación y fusión vertebral de alta precisión.') +
          '</div>'; } },
        { g: G1, t: 'Organigrama', ic: 'users', slide: 9, html: function () {
          var n = function (a, b, c) { return '<div class="org__node' + (c ? ' org__node--top' : '') + '"><b>' + a + '</b><span>' + b + '</span></div>'; };
          return '<p class="prose-lg">Así se organiza el equipo de Biosteel.</p><div class="org">' +
            n('Natalia Tovar', 'Gerencia General', 1) + '<div class="org__line"></div>' + n('Alejandro Aguilar', 'Gerente Financiero') + '<div class="org__line"></div>' + n('Karina Rueda', 'Directora Técnica') +
            '<div class="org__row">' + n('Andreina Cequea', 'Líder Facturación') + n('Martha Orozco', 'Líder Contabilidad') + n('Heisa Buelvas', 'Coord. Sistemas de Gestión') + n('Silia Díaz', 'Coord. Logística') + n('Jesny Lombo', 'Coord. Asistencia Técnica') + '</div></div>'; } },
        { g: G1, t: 'Red de procesos', ic: 'layers', slide: 10, html: function () { return '' +
          '<p class="prose-lg">Todo lo que hacemos busca responder a la expectativa del cliente: dispositivos médicos, asistencia técnica especializada, entrega final y seguimiento.</p>' +
          '<div class="grid2">' +
          tile('flag', 'Procesos estratégicos', '<b>Gerencia General:</b> define objetivos, metas estratégicas y políticas operativas y administrativas.<br><b>Gerencia Administrativa:</b> define estrategias para optimizar recursos, personal e instalaciones, y negociaciones con clientes.') +
          tile('box', 'Procesos misionales', '<b>Almacén:</b> recepción, acondicionamiento, almacenamiento y despacho de dispositivos médicos.<br><b>Asistencia Técnica:</b> soporte técnico por personal idóneo en procesos de cirugías.<br><b>Dirección Técnica:</b> controla que se mantengan los procesos del SGC y asegura el cumplimiento de requisitos sanitarios.') +
          tile('users', 'Procesos de apoyo', 'Facturación, Contabilidad, Gestión Humana, Higiene de Seguridad Industrial, Compras e Innovación.') +
          tile('target', 'Medición, análisis y mejora', '<b>Gestión de Calidad:</b> auditorías, seguimiento a indicadores y actualización de documentación.<br><b>SST:</b> prevención de riesgos laborales.') +
          '</div>' +
          slideFig(10, 'Red de procesos de Biosteel de Colombia: expectativa del cliente, procesos estratégicos, misionales, de apoyo y de medición, análisis y mejora', 'Diagrama completo. Puedes ampliarlo desde “Diapositiva original”.'); } },
        { g: G1, t: 'Reseña histórica', ic: 'clock', slide: 11, html: function () {
          var ev = [['2008', 'Constitución de Biosteel de Colombia S.A. en Barranquilla.'], ['2011', 'Certificado CCAA (INVIMA) para almacenamiento de dispositivos médicos.'], ['2015', 'Certificación ISO 9001:2008 e ISO 13485:2003 (ICONTEC).'], ['2016', 'Renovación CCAA (INVIMA) y cambio de representante legal.'], ['2018', 'Renovación ISO 9001:2015 e ISO 13485:2016 (ICONTEC).'], ['2019', 'Implementación del SG-SST.'], ['2020', 'Cambio de representante legal: Ingrid Natalia Tovar. Facturación electrónica.'], ['2021', 'Renovación ISO 9001:2015 e ISO 13485:2016 y certificado sanitario DADIS.'], ['2021', 'Renovación de la certificación CCAA otorgada por el INVIMA, el 2 de diciembre de 2021.'], ['2022', 'Biosteel de Colombia S.A. se encuentra en implementación del SAGRILAFT.'], ['2021', 'Cambio de representante legal: Alejandro Aguilar.'], ['2025', 'Renovación y actualización de la certificación ISO 9001:2015 e ISO 13485:2016 (ICONTEC) y cambio de razón social: Biosteel de Colombia S.A.S.']];
          return '<p class="prose-lg">Los hitos que han marcado nuestro camino, tal como aparecen en la presentación de inducción.</p><ol class="timeline">' +
            ev.map(function (e) { return '<li><b>' + e[0] + '</b><span>' + e[1] + '</span></li>'; }).join('') + '</ol>'; } },
        { g: G1, t: 'Procesos de Gestión Humana', ic: 'users', slide: 12, html: function () { return '' +
          '<p class="prose-lg">Los trámites más frecuentes y cómo realizarlos.</p>' +
          '<div class="grid2">' +
          tile('alert', 'Reporte de accidentes', 'Si sufres un accidente de trabajo, repórtalo de inmediato. Consulta los tres pasos en la etapa de ' + T.sst + ' (paso “Reporte de accidente de trabajo”). Línea de la ' + T.arl + ' SURA: <b>01 800 051 1414</b>.') +
          tile('file-check', 'Incapacidades', 'Presenta el certificado médico a Gestión Humana dentro de los 2 primeros días hábiles.') +
          tile('calendar', 'Solicitud de vacaciones', 'Solicítalas con al menos 15 días de anticipación a través de Gestión Humana.') +
          tile('clipboard', 'Solicitud de permisos', 'Informa a tu jefe inmediato y formaliza con Gestión Humana según la política interna.') +
          '</div>'; } },
        { g: G1, t: 'Sanciones disciplinarias', ic: 'scale', slide: 13, html: function () { return '' +
          '<p class="prose-lg">Consecuencias del incumplimiento del Código de Ética y Conducta, en orden creciente de gravedad.</p>' +
          '<ol class="numbered">' +
          '<li><strong>Llamados de atención</strong>Biosteel puede dirigir a sus trabajadores llamados de atención verbales o escritos cuando lo estime conveniente. No se consideran sanciones en ningún caso.</li>' +
          '<li><strong>Memorandos</strong>Comunicación escrita sobre la conducta que debe corregirse.</li>' +
          '<li><strong>Sanciones</strong>Artículo 88 del Reglamento Interno de Trabajo. Escala de sanciones, que se aplica en forma correlativa a la gravedad de la falta y la reincidencia: multas; suspensión en el trabajo hasta por ocho (8) días; suspensión en el trabajo hasta por dos (2) meses.</li>' +
          '</ol>'; } },
        { g: G1, t: 'Auditorías de calidad', ic: 'search', slide: 14, html: function () { return '' +
          '<p class="prose-lg">Nuestro sistema de gestión se revisa de tres maneras. Las certificaciones las otorga ' + T.icontec + '.</p>' +
          '<div class="grid3">' + tile('search', 'Interna', 'La realiza la propia empresa.') + tile('building', 'Externa', 'La realiza un tercero.') + tile('refresh', 'Recertificación o seguimiento', 'Verifica que se mantenga la certificación.') + '</div>'; } },

        { g: G2, t: 'Sistema General de Riesgos Laborales', ic: 'shield', slide: 16, html: function () { return '' +
          '<p class="prose-lg">El Sistema General de Riesgos Laborales es el encargado de promover la seguridad y la salud en el trabajo y de divulgar medidas para prevenir y controlar los accidentes de trabajo y las enfermedades de origen laboral.</p>' +
          '<p class="prose">El Estado, a través del Ministerio de Trabajo, dirige, coordina y vigila su funcionamiento.</p>' +
          '<div class="callout callout--alert">' + ic('bell') + '<div><h3>Nuestra ' + T.arl + ': SURA</h3><p>Línea de atención gratuita: <b>01 800 051 1414</b>. Disponible 24/7 para reportes de accidentes de trabajo.</p></div></div>'; } },
        { g: G2, t: 'Obligaciones en el SG-SST', ic: 'file-check', slide: 17, html: function () { return '' +
          '<div class="grid2">' +
          '<div class="tile tile--navy"><div class="tile__icon">' + ic('building') + '</div><h3>Del empleador</h3><ul class="alert-list">' + ['Procurar el cuidado integral de la salud de los trabajadores y de los ambientes de trabajo.', 'Programar, ejecutar y controlar el cumplimiento del Sistema de Gestión SST.', 'Notificar a la ARL SURA los accidentes de trabajo y enfermedades laborales.', 'Facilitar la capacitación en materia de SST.'].map(function (x) { return '<li style="color:var(--bs-text-dark)">' + x + '</li>'; }).join('') + '</ul></div>' +
          '<div class="tile"><div class="tile__icon">' + ic('users') + '</div><h3>Del trabajador</h3><ul class="alert-list">' + ['Procurar el cuidado integral de su propia salud.', 'Suministrar información clara, veraz y completa sobre su estado de salud.', 'Cumplir los estándares, reglamentos e instrucciones del SG-SST.', 'Participar en la prevención de riesgos a través del ' + T.copasst + '.'].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
          '</div>'; } },
        { g: G2, t: 'Accidente e incidente de trabajo', ic: 'alert', slide: 18, html: function () { return '' +
          '<div class="vs">' +
          '<div class="tile tile--blue"><h3>Accidente de trabajo</h3><p>Todo suceso repentino que sobrevenga por causa o con ocasión del trabajo.</p><p>Produce lesión orgánica, perturbación funcional, invalidez o muerte.</p><p>Incluye eventos durante la ejecución de órdenes del empleador.</p></div>' +
          '<div class="vs__mid" aria-hidden="true">VS</div>' +
          '<div class="tile tile--blue"><h3>Incidente de trabajo</h3><p>Eventos anormales con riesgo potencial de lesiones o daños materiales.</p><p>No producen lesiones, pero tienen alto potencial de causarlas.</p><p>Deben investigarse para prevenir condiciones y comportamientos inseguros.</p></div>' +
          '</div>'; } },
        { g: G2, t: 'Peligro y riesgo', ic: 'flag', slide: 19, html: function () { return '' +
          '<div class="vs">' +
          '<div class="tile tile--blue"><h3>Peligro</h3><p>Fuente, situación o acto con potencial de daño en términos de enfermedad o lesión a las personas (NTC-OHSAS 18001).</p></div>' +
          '<div class="vs__mid" aria-hidden="true">VS</div>' +
          '<div class="tile tile--blue"><h3>Riesgo</h3><p>Combinación de la probabilidad de que ocurra un evento peligroso y la severidad de la lesión o enfermedad que puede ser causada.</p></div>' +
          '</div>'; } },
        { g: G2, t: 'Tipos de riesgo laboral', ic: 'alert', slide: 20, html: function () { return '' +
          '<div class="grid3">' +
          tile('users', 'Psicosocial', 'Estrés, carga laboral, relaciones interpersonales.') + tile('bell', 'Eléctrico', 'Contacto con energía eléctrica, cortos circuitos.') + tile('eye', 'Físico', 'Ruido, temperatura extrema, iluminación, vibraciones.') +
          tile('refresh', 'Químico', 'Exposición a sustancias químicas y vapores peligrosos.') + tile('heart-pulse', 'Biológico', 'Contacto con virus, bacterias, hongos y fluidos.') + tile('wrench', 'Mecánico', 'Maquinaria, herramientas, superficies cortantes.') +
          tile('layers', 'Biomecánico', 'Postura incorrecta, movimientos repetitivos, sobreesfuerzo.') +
          '</div>' + pull('La prisa genera accidentes.'); } },
        { g: G2, t: 'Brigadas de emergencia', ic: 'shield-check', slide: 21, html: function () { return '' +
          '<p class="prose-lg">Organizar y desarrollar un plan de emergencia teniendo en cuenta tres ramas.</p>' +
          '<div class="grid3">' +
          tile('shield', 'Rama preventiva', 'Aplicación de las normas legales y técnicas sobre combustibles, equipos eléctricos, fuentes de calor y sustancias peligrosas propias de la actividad económica de la empresa.') +
          tile('building', 'Rama pasiva o estructural', 'Diseño y construcción de edificaciones con materiales resistentes, vías de salida suficientes y adecuadas para la evacuación, de acuerdo con los riesgos existentes y el número de trabajadores.') +
          tile('bell', 'Rama activa o control de emergencias', 'Conformación y organización de brigadas (selección, capacitación, planes de emergencia y evacuación), sistema de detección, alarma, comunicación, selección y distribución de equipos de control, inspección, señalización y mantenimiento de los sistemas de control.') +
          '</div>'; } },
        { g: G2, t: 'Equipo de Seguridad y Salud en el Trabajo', ic: 'users', slide: 22, html: function () { return '' +
          '<div class="grid3">' +
          tile('users', 'Heisa Buelvas Luna', '<b>Analista SST.</b> Coordinadora de Sistemas de Gestión, psicóloga especialista en SST.') +
          tile('eye', 'Martha Orozco', '<b>Vigía SST.</b> Responsable de la vigilancia en seguridad y salud en el trabajo.') +
          tile('users', 'Andreina Cequea', '<b>Comité de Convivencia Laboral.</b> ' + T.copasst + '.') +
          '</div>'; } },
        { g: G2, t: 'Reporte de accidente de trabajo', ic: 'alert', slide: 23, html: function () { return '' +
          '<p class="prose-lg">Si tienes un accidente de trabajo, sigue estos tres pasos.</p>' +
          numbered([
            ['Llamada a ARL SURA', 'Línea gratuita <b>01 800 051 1414</b>. Reporta de inmediato.'],
            ['Reporte al líder inmediato', 'Informa al coordinador o jefe directo sobre el evento ocurrido.'],
            ['Reporte escrito', 'Descripción amplia y detallada de lo sucedido, de forma manuscrita.']
          ]); } },

        { g: G3, t: 'Nuestro compromiso ético', ic: 'scale', slide: 25, html: function () { return '' +
          '<p class="prose-lg">Biosteel de Colombia S.A.S. está comprometida a realizar su trabajo con integridad, honradez y transparencia.</p>' +
          '<p class="prose">Todos los colaboradores de la compañía se comprometen a acatar las normas de ética y conducta que salvaguarden el buen nombre de la institución. <b>Este código aplica dentro y fuera de las instalaciones de la empresa.</b></p>' +
          pull('El actuar con ética no es solo un requerimiento, es parte de nuestra identidad como equipo.'); } },
        { g: G3, t: 'Conflicto de intereses y empleo externo', ic: 'flag', slide: 26, html: function () { return '' +
          '<div class="grid2">' +
          tile('scale', 'Conflicto de intereses', 'Las decisiones empresariales deben basarse en las necesidades de la empresa y no en intereses personales, familiares o de amigos.<br>No se deben tomar decisiones con el fin de obtener beneficios personales.') +
          tile('building', 'Empleo fuera de la empresa', 'Antes de aceptar empleos externos, contempla si se puede generar un conflicto de intereses.<br>El nuevo empleo no debe afectar tu desempeño ni tu disponibilidad en Biosteel.') +
          '</div>'; } },
        { g: G3, t: 'Principios de conducta', ic: 'check', slide: 27, html: function () { return '' +
          '<p class="prose-lg">Once principios que guían nuestro comportamiento en el trabajo.</p>' +
          '<div class="grid3">' + [
            ['check', 'Honestidad', 'Actuar con honestidad dentro y fuera de la empresa en todo momento.'], ['scale', 'Sin conflictos', 'Evitar situaciones de conflicto entre intereses personales y los de la empresa.'], ['clock', 'Puntualidad', 'Presentarse al lugar de trabajo a la hora normal de inicio de jornada.'],
            ['users', 'Respeto', 'No pelear, hacer bromas pesadas ni tener conductas escandalosas.'], ['clipboard', 'Disciplina', 'Acatar instrucciones del superior siempre que se ajusten a la normatividad.'], ['flag', 'Responsabilidad', 'No abandonar el puesto sin justa causa ni sin informar al jefe inmediato.'],
            ['ban', 'Sin sustancias', 'No presentarse bajo la influencia del alcohol o sustancias psicoactivas.'], ['help', 'Lenguaje respetuoso', 'No usar lenguaje amenazador u ofensivo al dirigirse a compañeros.'], ['eye', 'Presentación personal', 'Mantener una excelente presentación personal en todo momento.'],
            ['shield', 'Sin armas', 'No ingresar armas de fuego ni de ningún tipo a las instalaciones.'], ['lock', 'Confidencialidad', 'Proteger la información de propiedad intelectual y comercial de Biosteel.']
          ].map(function (p) { return tile(p[0], p[1], p[2]); }).join('') + '</div>'; } },
        { g: G3, t: 'Trabajamos juntos hacia la excelencia', ic: 'target', slide: 29, html: function () { return '' +
          '<p class="prose-lg">Trabajamos en un entorno positivo buscando <b>equidad</b> para todos, guiados por el trabajo en equipo hacia la <b>excelencia</b> en cada acción.</p>' +
          '<div class="callout">' + ic('mail') + '<div><h3>Contacto de Gestión Humana</h3><p><b>Heisa Buelvas Luna</b>, psicóloga y coordinadora de Sistemas de Gestión.<br>Celular: 316 832 9899 · Teléfono: 605-363 1909 ext. 103<br>' + CONTACT + '</p></div></div>'; } }
      ] },

    { n: 2, title: 'Firma de constancia', icon: 'pen',
      summary: 'Firma tu constancia: el registro de que revisaste los tres temas de la inducción.',
      sub: 'Diligencia el formulario, genera tu constancia en PDF y envíala a Gestión Humana.',
      closing: 'Constancia lista.', closingText: 'Sigue con el módulo SAGRILAFT.',
      steps: [
        { t: 'Antes de firmar', ic: 'clipboard', html: function () { return '' +
          '<p class="prose-lg">La ' + T.constancia + ' deja registro de que revisaste los tres temas de la etapa 1.</p>' +
          '<ul class="checklist">' + li('book', '<b>Módulo 1:</b> Inducción General.') + li('shield', '<b>Módulo 2:</b> Seguridad y Salud en el Trabajo.') + li('scale', '<b>Módulo 3:</b> Código de Ética y Conducta.') + '</ul>' +
          '<p class="prose">Si aún no los has estudiado, hazlo primero: <a href="#/etapa/1/0">ir a la etapa 1</a>.</p>' +
          '<h3>Ten a la mano</h3>' + bullets(['Tu número de cédula.', 'Tu cargo en Biosteel y tu correo electrónico.', 'Un mouse, tu dedo o un lápiz digital para dibujar tu firma.']) +
          '<div class="note">' + ic('lock') + '<span>Los datos que escribas se quedan en tu navegador. No se guardan en este sitio ni se envían a ningún servidor.</span></div>'; } },
        { t: 'Diligencia y firma', ic: 'pen', gate: true, html: function () { return Constancia.render(); },
          after: function (root) { Constancia.bind(root, { onGenerated: function () { markDone(2, 1); paint(); } }); } },
        { t: 'Envía tu constancia', ic: 'mail', declare: 'Ya envié mi constancia en PDF a Gestión Humana', html: function (done) { return '' +
          '<p class="prose-lg">Tu constancia es el PDF que descargaste. Este sitio no lo envía por ti.</p>' +
          numbered([
            ['Abre tu correo', 'Escribe a <b>' + CONTACT + '</b>. Gestión Humana y Calidad reciben las constancias.'],
            ['Adjunta el PDF', 'El enlace de correo no puede adjuntar archivos por sí solo: adjunta tú el PDF descargado antes de enviar.'],
            ['Envía y marca el paso', 'Cuando lo hayas enviado, marca la casilla de abajo para que cuente en tu avance.']
          ]) +
          '<div class="form__actions"><a class="btn btn--primary" href="mailto:' + CONTACT + '?cc=calidad@biosteeldecolombia.com&subject=Constancia%20de%20Inducci%C3%B3n%20y%20Reinducci%C3%B3n">' + ic('mail') + 'Abrir correo</a></div>' +
          checkBtn(2, 2, 'Ya envié mi constancia en PDF a Gestión Humana', done) +
          '<p class="hint">' + ic('help') + 'Este sitio no puede comprobar que el correo haya llegado: tu avance es de autodeclaración.</p>'; } }
      ] },

    { n: 3, title: 'Módulo SAGRILAFT', icon: 'shield-check', deck: 'sag',
      summary: 'Mira el video del módulo y presenta la evaluación. Necesitas mínimo 4 puntos para aprobar.',
      sub: 'Prevención del riesgo de lavado de activos y financiación del terrorismo en Biosteel.',
      closing: 'Módulo SAGRILAFT completado.', closingText: 'Falta la capacitación en Tecnovigilancia.',
      steps: [
        { t: 'Mira el video', ic: 'play', html: function () { return '' +
          '<p class="prose-lg">Abre y escucha con atención el video del módulo ' + T.sagrilaft + '.</p>' +
          '<div class="video"><iframe src="' + LINKS.videoEmbed + '" title="Capacitación SAGRILAFT Compras Biosteel" allowfullscreen loading="lazy"></iframe></div>' +
          '<div class="video-actions"><a class="btn btn--secondary btn--sm" href="' + LINKS.video + '" target="_blank" rel="noopener noreferrer">' + ic('external') + 'Abrir el video en una pestaña nueva</a>' +
          '<span class="hint">' + ic('help') + 'Si el video no carga aquí, ábrelo con el botón. Puede pedirte iniciar sesión con tu cuenta de Biosteel.</span></div>'; } },
        { t: 'Repasa lo esencial', ic: 'book', slide: 3, html: function () { return '' +
          '<p class="prose-lg">Un resumen de la presentación del módulo. La encuentras completa en “Ver diapositivas”.</p>' +
          '<div class="grid2">' +
          tile('shield-check', '¿Qué es el ' + T.sagrilaft + '?', 'Un sistema que busca prevenir, controlar y mitigar el riesgo de lavado de activos, financiación del terrorismo y financiación de la proliferación de armas de destrucción masiva (' + T.lasft + '). No puede eliminar el riesgo por completo.') +
          tile('alert', 'Por qué importa', 'El ' + T.lasft + ' genera consecuencias negativas para la economía y produce riesgos operacionales, legales, reputacionales y de contagio.') +
          tile('users', 'Tu rol como colaborador', 'Apoyar al ' + T.oficial + ' en la gestión del riesgo, asistir a las capacitaciones, reportarle señales de alerta u operaciones inusuales y guardar reserva sobre los reportes.') +
          tile('search', 'Conocer a la contraparte', 'Aplicar ' + T.dd + ': identificar a clientes, proveedores, empleados y asociados, y verificar su información. Si es una ' + T.pep + ', se aplica debida diligencia intensificada.') +
          '</div>' +
          '<h3>Operación inusual y operación sospechosa</h3>' +
          '<div class="grid2">' +
          '<div class="tile tile--blue"><h3>Operación inusual</h3><p>Por su número, cantidad o características no guarda relación con la actividad económica de los clientes o contrapartes, o se sale de los parámetros de normalidad establecidos.</p></div>' +
          '<div class="tile tile--blue"><h3>Operación sospechosa</h3><p>No se enmarca en las prácticas normales de los negocios y no ha podido ser razonablemente justificada. Se reporta a la ' + T.uiaf + '. Únicamente el Oficial de Cumplimiento hace el reporte.</p></div>' +
          '</div>' +
          '<h3>Señales de alerta</h3><p class="prose">Circunstancias particulares que llaman la atención y justifican un mayor análisis. Algunos ejemplos:</p>' +
          '<div class="grid2"><div><h3 style="font-size:var(--bs-text-base);margin-bottom:8px">Personas naturales o jurídicas</h3><ul class="alert-list">' + ['Actúan a nombre de terceros intentando ocultar la identidad de los beneficiarios reales.', 'Fraccionan transacciones para evitar la entrega de documentos o declaraciones de operaciones en efectivo.', 'Tienen la misma dirección o teléfono de otras personas con las que no tienen una relación aparente.', 'No pueden soportar una operación y se niegan a actualizar sus datos.'].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
          '<div><h3 style="font-size:var(--bs-text-base);margin-bottom:8px">Empleados o funcionarios</h3><ul class="alert-list">' + ['Realizan operaciones con excepciones e intentan evadir los controles establecidos.', 'Su estilo de vida no guarda relación con su asignación salarial.', 'No toman vacaciones o se niegan a cambiar de actividad dentro de la empresa.', 'Asesores comerciales que no soportan debidamente la información de sus clientes.'].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div></div>'; } },
        { t: 'Presenta la evaluación', ic: 'clipboard', declare: 'Ya presenté la evaluación y obtuve 4 puntos o más', html: function (done) { return '' +
          '<p class="prose-lg">Completa la evaluación del módulo SAGRILAFT.</p>' +
          '<div class="link-card"><div class="link-card__icon">' + ic('clipboard') + '</div><div><h3>Evaluación del módulo SAGRILAFT</h3><p>Se abre en Microsoft Forms, en una pestaña nueva.</p></div>' +
          '<a class="btn btn--light" href="' + LINKS.sagrilaftEval + '" target="_blank" rel="noopener noreferrer">Abrir evaluación' + ic('external') + '</a></div>' +
          '<div class="score"><b>4</b><span>puntos mínimos para aprobar</span></div>' +
          checkBtn(3, 2, 'Ya presenté la evaluación y obtuve 4 puntos o más', done) +
          '<p class="hint">' + ic('help') + 'Este sitio no puede ver tu resultado en Microsoft Forms: marca la casilla solo cuando hayas aprobado.</p>'; } }
      ] },

    { n: 4, title: 'Módulo de Tecnovigilancia', icon: 'heart-pulse',
      summary: 'Evaluación inicial, estudio de las diapositivas y evaluación final, en el sitio de capacitación en Tecnovigilancia.',
      sub: 'La capacitación completa vive en su propio sitio. Aquí te llevamos hasta allá.',
      closing: 'Has completado el proceso.', closingText: 'Gracias por dedicar tiempo a tu inducción y reinducción.',
      steps: [
        { t: 'Capacitación en Tecnovigilancia', ic: 'heart-pulse', html: function () { return '' +
          '<p class="prose-lg">Este módulo tiene tres momentos: la evaluación inicial (diagnóstica), el estudio del material y la evaluación final.</p>' +
          '<div class="link-card"><div class="link-card__icon">' + ic('heart-pulse') + '</div><div><h3>Sitio de capacitación en Tecnovigilancia</h3><p>Se abre en una pestaña nueva. Elige los módulos que corresponden a tu rol (asistencial o almacén).</p></div>' +
          '<a class="btn btn--light" href="' + LINKS.tecno + '" target="_blank" rel="noopener noreferrer">Ir a la capacitación' + ic('external') + '</a></div>' +
          numbered([
            ['Evaluación inicial', 'Responde la evaluación diagnóstica para medir tus conocimientos previos.'],
            ['Estudia el material', 'Revisa las diapositivas de capacitación en Tecnovigilancia.'],
            ['Evaluación final', 'Presenta la evaluación del módulo para validar lo aprendido.']
          ]); } },
        { t: 'Confirma tu avance', ic: 'check', declare: 'Ya completé la capacitación en Tecnovigilancia y sus evaluaciones', html: function (done) { return '' +
          '<p class="prose-lg">Cuando termines el módulo en el otro sitio, vuelve aquí y confirma.</p>' +
          checkBtn(4, 1, 'Ya completé la capacitación en Tecnovigilancia y sus evaluaciones', done) +
          '<p class="hint">' + ic('help') + 'El avance es de autodeclaración: este sitio no puede ver tus resultados en el sitio de Tecnovigilancia.</p>'; } }
      ] }
  ];

  /* ───────── Estado ───────── */
  var state = load();
  function load() {
    try { var s = JSON.parse(localStorage.getItem(STORE)); if (s && s.done) return s; } catch (e) {}
    return { done: {}, last: null };
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }
  var key = function (s, i) { return 's' + s + '-' + i; };
  var isDone = function (s, i) { return !!state.done[key(s, i)]; };
  function markDone(s, i) { state.done[key(s, i)] = true; save(); }
  function stagePct(st) { var d = 0; st.steps.forEach(function (_, i) { if (isDone(st.n, i)) d++; }); return Math.round(d / st.steps.length * 100); }
  function totalPct() {
    var d = 0, t = 0;
    STAGES.forEach(function (st) { t += st.steps.length; st.steps.forEach(function (_, i) { if (isDone(st.n, i)) d++; }); });
    return t ? Math.round(d / t * 100) : 0;
  }
  function nextPending() {
    for (var a = 0; a < STAGES.length; a++) for (var i = 0; i < STAGES[a].steps.length; i++) if (!isDone(STAGES[a].n, i)) return { s: STAGES[a].n, i: i };
    return null;
  }

  /* ───────── Vistas ───────── */
  function viewHome() {
    var np = nextPending(), started = Object.keys(state.done).length > 0, pct = totalPct();
    var href = np ? '#/etapa/' + np.s + '/' + np.i : '#/etapa/1/0';
    var txt = !np ? 'Repasar la inducción' : started ? 'Continuar donde quedé' : 'Comenzar';
    return '' +
    '<section class="hero"><div class="wrap hero__grid"><div>' +
      '<p class="eyebrow">Gestión Humana · Biosteel de Colombia S.A.S.</p>' +
      '<h1>Inducción y Reinducción</h1>' +
      '<p class="lead">Conoce Biosteel, sus normas y sus riesgos, y deja constancia de que lo revisaste. Recorre las cuatro etapas en orden y al terminar firma tu constancia.</p>' +
      '<div class="hero__cta"><a class="btn btn--light" href="' + href + '">' + txt + ic('arrow-right') + '</a><a class="btn btn--ghost-light" href="#etapas" data-action="scroll" data-to="etapas">Ver las 4 etapas</a></div>' +
      '<div class="hero__facts"><span>' + ic('layers') + '4 etapas</span><span>' + ic('pen') + 'Constancia firmada en PDF</span><span>' + ic('lock') + 'Tus datos se quedan en tu navegador</span></div>' +
    '</div><div class="hero__art hero__art--logo"><img src="assets/img/logo-biosteel.png" alt="BioSteel de Colombia S.A." width="320" height="130"></div></div>' +
    '<svg class="hero__wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0,40 C240,95 480,95 720,55 C960,15 1200,5 1440,45 L1440,90 L0,90 Z" fill="#fff"/></svg></section>' +

    '<section class="section"><div class="wrap">' +
      '<p class="eyebrow">Para empezar</p><h2 class="section-title">¿Inducción o reinducción?</h2><div class="divider"></div>' +
      '<div class="grid2">' +
        tile('users', 'Inducción', 'Es el primer recorrido por Biosteel: quiénes somos, cómo trabajamos, cómo cuidar tu seguridad y salud en el trabajo y qué conducta se espera de ti. Aplica cuando ingresas a la empresa.') +
        tile('refresh', 'Reinducción', 'Es el repaso de esos mismos contenidos para quienes ya trabajan en Biosteel, para reforzarlos y conocer lo que cambió. Gestión Humana te indica cuándo te corresponde repetirla.') +
      '</div></div></section>' +

    '<section class="section section--surface" id="etapas"><div class="wrap">' +
      '<p class="eyebrow">Tu ruta</p><h2 class="section-title">Cuatro etapas, en orden</h2><div class="divider"></div>' +
      '<div class="resume"><div><h3>Tu avance</h3><p>Se guarda solo en este navegador. Es de autodeclaración: el sitio no puede comprobar que aprobaste una evaluación de Microsoft Forms ni que Gestión Humana recibió tu constancia.</p>' +
        '<a class="btn btn--primary btn--sm" href="' + href + '">' + txt + ic('arrow-right') + '</a></div>' +
        '<div class="resume__side"><div class="ring" style="--p:' + pct + '" role="img" aria-label="Avance total ' + pct + ' por ciento"><span>' + pct + '%<small>completado</small></span></div></div></div>' +
      '<div class="cards cards--4">' + STAGES.map(stageCard).join('') + '</div></div></section>' +

    '<div class="quote-band">' + ic('quote') + '<p>El actuar con ética no es solo un requerimiento, es parte de nuestra identidad como equipo.</p></div>' +
    contactBand();
  }
  function stageCard(st) {
    var p = stagePct(st), started = p > 0;
    return '<article class="card"><div class="card__head"><span>Etapa ' + st.n + '</span>' + ic(st.icon) + '</div>' +
      '<div class="card__body"><h3 class="card__title">' + st.title + '</h3><p class="card__text">' + st.summary + '</p>' +
      '<div class="meta"><span class="badge">' + ic('layers') + st.steps.length + ' pasos</span></div>' +
      '<div style="margin-top:auto"><div class="bar-label"><span>Progreso</span><span>' + p + '%</span></div><div class="bar"><span style="width:' + p + '%"></span></div></div></div>' +
      '<div class="card__foot"><a class="btn btn--' + (p === 100 ? 'secondary' : 'primary') + ' btn--sm" href="#/etapa/' + st.n + '/0">' + (p === 100 ? 'Repasar' : started ? 'Continuar' : 'Comenzar') + ic('arrow-right') + '</a></div></article>';
  }

  function viewStage(n, si) {
    var st = STAGES[n - 1];
    if (!st) return viewHome();
    si = Math.max(0, Math.min(st.steps.length - 1, si));
    state.last = { s: n, i: si }; save();
    var step = st.steps[si], total = st.steps.length, p = stagePct(st), last = si === total - 1, doneNow = isDone(n, si);

    var lastGroup = null;
    var list = st.steps.map(function (s, i) {
      var head = '';
      if (s.g && s.g !== lastGroup) { head = '<li class="group" role="presentation">' + s.g + '</li>'; lastGroup = s.g; }
      return head + '<li><button class="step' + (isDone(n, i) ? ' is-done' : '') + '" data-action="goto" data-s="' + n + '" data-i="' + i + '"' + (i === si ? ' aria-current="step"' : '') + '>' +
        '<span class="step__dot">' + (isDone(n, i) ? ic('check') : i + 1) + '</span><span class="step__label">' + s.t + '</span></button></li>';
    }).join('');

    var body = step.html(doneNow);
    if (last) body += '<div class="finish"><img src="assets/img/logo-biosteel-ojo.png" alt="BioSteel de Colombia" width="220" height="131"><h3>' + st.closing + '</h3><p class="prose" style="margin:0 auto">' + st.closingText + '</p></div>';

    var nextStage = STAGES[n];
    var nextBtn;
    if (step.gate) {
      nextBtn = '<button class="btn btn--primary" id="nextBtn" data-action="next" data-s="' + n + '" data-i="' + si + '"' + (doneNow ? '' : ' disabled') + '>' + (doneNow ? 'Siguiente' : 'Genera tu constancia para continuar') + ic('arrow-right') + '</button>';
    } else if (!last) {
      nextBtn = '<button class="btn btn--primary" data-action="next" data-s="' + n + '" data-i="' + si + '">' + (doneNow || step.declare ? 'Siguiente' : 'Marcar como visto y continuar') + ic('arrow-right') + '</button>';
    } else {
      nextBtn = '<a class="btn btn--primary" href="' + (nextStage ? '#/etapa/' + nextStage.n + '/0' : '#/') + '" data-action="finish" data-s="' + n + '" data-i="' + si + '">' +
        (nextStage ? 'Continuar con la etapa ' + nextStage.n : 'Volver al inicio') + ic(nextStage ? 'arrow-right' : 'home') + '</a>';
    }

    var deck = st.deck ? DECKS[st.deck] : null;
    return '' +
    '<section class="mod-hero"><div class="mod-hero__num" aria-hidden="true">' + n + '</div><div class="wrap">' +
      '<nav class="crumbs" aria-label="Ruta"><a href="#/">Inicio</a>' + ic('chevron-right') + '<span>Etapa ' + n + ' de ' + STAGES.length + '</span></nav>' +
      '<h1>' + st.title + '</h1><p>' + st.sub + '</p></div></section>' +
    '<div class="wrap"><div class="lesson">' +
      '<aside class="steps" id="steps" aria-label="Pasos de la etapa"><div class="steps__head"><h2>Tu progreso</h2>' +
        '<div class="bar-label"><span id="stageLbl">Paso ' + (si + 1) + ' de ' + total + '</span><span id="stagePct">' + p + '%</span></div><div class="bar"><span id="stageBar" style="width:' + p + '%"></span></div></div>' +
        '<button class="steps__toggle" data-action="toggle-steps" aria-expanded="false">Ver todos los pasos' + ic('chevron-right') + '</button>' +
        '<ol>' + list + '</ol>' +
        (deck ? '<div class="steps__foot"><button class="btn btn--secondary btn--sm" data-action="viewer-open" data-deck="' + st.deck + '" data-slide="1">' + ic('image') + 'Ver diapositivas</button>' +
          '<a class="btn btn--ghost btn--sm" href="' + deck.pdf + '" download>' + ic('download') + 'Descargar PDF</a></div>' : '') +
      '</aside>' +
      '<article class="panel"><header class="panel__head"><p class="eyebrow">' + (step.g ? step.g + ' · ' : '') + 'Paso ' + (si + 1) + ' de ' + total + '</p><h2>' + step.t + '</h2></header>' +
        '<div class="panel__body" id="stepBody">' + body + '</div>' +
        '<footer class="panel__nav"><div class="grow">' +
          (si > 0 ? '<a class="btn btn--ghost" href="#/etapa/' + n + '/' + (si - 1) + '">' + ic('chevron-left') + 'Anterior</a>' : (n > 1 ? '<a class="btn btn--ghost" href="#/etapa/' + (n - 1) + '/0">' + ic('chevron-left') + 'Etapa anterior</a>' : '<span></span>')) +
          (step.slide && deck ? '<button class="btn btn--secondary" data-action="viewer-open" data-deck="' + st.deck + '" data-slide="' + step.slide + '">' + ic('image') + 'Diapositiva original</button>' : '') +
        '</div>' + nextBtn + '</footer>' +
      '</article>' +
    '</div></div>' + contactBand();
  }

  function contactBand() {
    return '<section class="section section--surface" id="dudas"><div class="wrap"><div class="contact">' +
      '<div class="contact__icon">' + ic('help') + '</div>' +
      '<div><h2>¿Tienes dudas?</h2><p>Escríbele a <b>Gestión Humana</b> de Biosteel de Colombia S.A.S. Con gusto resolverán tus preguntas sobre el proceso de inducción y reinducción.</p></div>' +
      '<a class="btn btn--light" href="mailto:' + CONTACT + '?subject=Duda%20sobre%20la%20inducci%C3%B3n%20y%20reinducci%C3%B3n">' + ic('mail') + CONTACT + '</a>' +
    '</div></div></section>';
  }

  /* Actualiza barras, pasos y botones sin volver a pintar la vista (no borra el formulario). */
  function paint() {
    var h = parseHash();
    $('#navBar').style.width = totalPct() + '%';
    if (h.r !== 'etapa') return;
    var st = STAGES[h.n - 1]; if (!st) return;
    $$('.step').forEach(function (b) {
      var i = +b.dataset.i, d = isDone(st.n, i);
      b.classList.toggle('is-done', d);
      $('.step__dot', b).innerHTML = d ? ic('check') : (i + 1);
    });
    var p = stagePct(st);
    if ($('#stageBar')) { $('#stageBar').style.width = p + '%'; $('#stagePct').textContent = p + '%'; }
    var step = st.steps[Math.max(0, Math.min(st.steps.length - 1, h.i))], nb = $('#nextBtn');
    if (nb && step.gate && isDone(st.n, h.i)) { nb.disabled = false; nb.firstChild.textContent = 'Siguiente'; }
  }

  /* ───────── Router ───────── */
  var app = $('#app');
  function parseHash() {
    var p = location.hash.replace(/^#\/?/, '').split('/');
    return { r: p[0] || '', n: parseInt(p[1], 10) || 1, i: parseInt(p[2], 10) || 0 };
  }
  function route() {
    var h = parseHash(), html, nav = 'home', title = 'Inducción y Reinducción', step = null;
    if (h.r === 'etapa') {
      html = viewStage(h.n, h.i); nav = 'e' + h.n;
      var st = STAGES[h.n - 1]; if (st) { step = st.steps[Math.max(0, Math.min(st.steps.length - 1, h.i))]; title = 'Etapa ' + h.n + ' · ' + st.title; }
    } else if (h.r === 'dudas') { html = viewHome(); nav = 'dudas'; title = 'Dudas'; }
    else html = viewHome();
    app.innerHTML = html;
    document.title = title + ' | Biosteel de Colombia';
    $$('.nav__links a').forEach(function (a) { a.removeAttribute('aria-current'); if (a.dataset.route === nav) a.setAttribute('aria-current', 'page'); });
    $('#navLinks').classList.remove('is-open'); $('#navToggle').setAttribute('aria-expanded', 'false');
    $('#navBar').style.width = totalPct() + '%';
    if (h.r === 'dudas') { var el = $('#dudas'); if (el) setTimeout(function () { el.scrollIntoView(); }, 30); }
    else window.scrollTo(0, 0);
    if (step && step.after) step.after(app);
  }
  window.addEventListener('hashchange', route);

  /* ───────── Visor de diapositivas ───────── */
  var vd = 'ind', vs = 1, dlg = $('#viewer');
  function showSlide() {
    var d = DECKS[vd], pad = vs < 10 ? '0' + vs : '' + vs;
    $('#viewerImg').src = 'assets/slides/' + vd + '-' + pad + '.jpg';
    $('#viewerImg').alt = 'Diapositiva ' + vs + ' de ' + d.n + ' · ' + d.title;
    $('#viewerCount').textContent = 'Diapositiva ' + vs + ' de ' + d.n;
    $('#viewerTitle').textContent = d.title;
    $('#viewerPdf').href = d.pdf;
  }
  function openViewer(d, s) { vd = d; vs = s || 1; showSlide(); if (!dlg.open) dlg.showModal(); }
  function stepSlide(d) { vs = Math.max(1, Math.min(DECKS[vd].n, vs + d)); showSlide(); }
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  document.addEventListener('keydown', function (e) {
    if (!dlg.open) return;
    if (e.key === 'ArrowRight') stepSlide(1); else if (e.key === 'ArrowLeft') stepSlide(-1);
  });
  var termsDlg = $('#termsDlg');
  termsDlg.addEventListener('click', function (e) { if (e.target === termsDlg) termsDlg.close(); });

  /* ───────── Eventos ───────── */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]'); if (!t) return;
    var a = t.dataset.action, s = +t.dataset.s, i = +t.dataset.i;
    if (a === 'goto') { location.hash = '#/etapa/' + s + '/' + i; }
    else if (a === 'next') {
      var st = STAGES[s - 1];
      if (!st.steps[i].declare && !st.steps[i].gate) markDone(s, i);
      location.hash = '#/etapa/' + s + '/' + (i + 1);
    }
    else if (a === 'finish') { var sf = STAGES[s - 1].steps[i]; if (!sf.declare && !sf.gate) markDone(s, i); }
    else if (a === 'toggle-declare') {
      var k = key(s, i); if (state.done[k]) delete state.done[k]; else state.done[k] = true; save();
      t.setAttribute('aria-pressed', !!state.done[k]); paint();
    }
    else if (a === 'toggle-steps') { var p = $('#steps'); var o = p.classList.toggle('is-open'); t.setAttribute('aria-expanded', o); }
    else if (a === 'scroll') { e.preventDefault(); var el = document.getElementById(t.dataset.to); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
    else if (a === 'viewer-open') openViewer(t.dataset.deck, +t.dataset.slide);
    else if (a === 'viewer-close') dlg.close();
    else if (a === 'viewer-prev') stepSlide(-1);
    else if (a === 'viewer-next') stepSlide(1);
    else if (a === 'terms-open') { $('#termsBody').innerHTML = Constancia.termsHtml(); termsDlg.showModal(); }
    else if (a === 'terms-close') termsDlg.close();
    else if (a === 'reset') { if (confirm('¿Reiniciar tu progreso en este navegador?')) { state = { done: {}, last: null }; save(); route(); } }
  });
  $('#navToggle').addEventListener('click', function () {
    var o = $('#navLinks').classList.toggle('is-open'); this.setAttribute('aria-expanded', o);
  });

  route();
})();
