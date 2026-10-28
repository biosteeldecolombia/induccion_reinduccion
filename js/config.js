/* Configuración del sitio.
   endpoint: URL del flujo de Power Automate ("Cuando se recibe una solicitud HTTP") que agrega
   una fila al Excel de constancias. Si está vacío, la constancia solo se genera como PDF y no
   se envía ningún dato (ver docs/POWER_AUTOMATE.md). */
window.BS_CONFIG = {
  endpoint: '',
  timeoutMs: 15000
};
