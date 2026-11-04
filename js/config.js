/* Configuración del sitio.
   endpoint: URL de la aplicación web de Google Apps Script que recibe la constancia y la envía
   por correo a Gestión Humana (ver docs/ENVIO_CORREO.md). Si está vacío, la constancia solo se
   genera como PDF y no se envía ningún dato. */
window.BS_CONFIG = {
  endpoint: 'https://script.google.com/macros/s/AKfycbwnpvsuX3UECKRPURlieTBjZtmPjxoZ4AsgSZYQR_yukydgnJ2GZrO_MtS3QeCJnSd4/exec',
  timeoutMs: 30000
};
