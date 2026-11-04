# Enviar las constancias por correo (Gmail + Google Apps Script)

Un sitio en GitHub Pages no puede enviar correo por sí solo, y **nunca se debe poner la contraseña de Gmail en el código**: el repositorio es público. Por eso el envío lo hace un pequeño script de Google Apps Script, que corre con la cuenta de Gmail y recibe la constancia desde el sitio.

```
Navegador de la persona ──► Apps Script (cuenta Gmail no-reply) ──► gestionhumana@biosteeldecolombia.com
   genera el PDF            valida y envía el correo con el PDF adjunto
```

Mientras `endpoint` esté vacío en `js/config.js`, el sitio no envía nada: genera el PDF y la persona lo envía a mano.

## Qué recibe Gestión Humana
Un correo con el asunto `Constancia de inducción y reinducción - Nombre Apellido (C.C. 123...)`, los datos en el cuerpo y el PDF firmado adjunto. El correo sale de la cuenta de Gmail; al responderlo, la respuesta llega a la persona (campo *Reply-To*).

## Publicar el script

1. Entra con la cuenta de Gmail que enviará los correos a <https://script.google.com> y crea un **Proyecto nuevo**. Ponle el nombre `Constancias Inducción`.
2. Borra el contenido de `Código.gs` y pega todo [`docs/apps-script/Codigo.gs`](apps-script/Codigo.gs).
3. Revisa las primeras líneas: `DESTINATARIO` (a quién llegan las constancias) y `COPIA` (vacía por defecto, ver *Cuota*).
4. **Implementar, Nueva implementación**, tipo **Aplicación web**:
   - *Ejecutar como:* **Yo** (la cuenta de Gmail).
   - *Quién tiene acceso:* **Cualquier usuario**.
5. Google pide autorizar el envío de correo. Acepta con la misma cuenta. Si aparece "Google no verificó esta app", usa *Configuración avanzada, Ir a Constancias Inducción*: es tu propio script.
6. Copia la **URL de la aplicación web** (termina en `/exec`).
7. Pégala en `js/config.js`, campo `endpoint`, y sube el cambio a GitHub.

Si modificas el script más adelante, hay que hacer **Implementar, Administrar implementaciones, editar, Nueva versión**. La URL no cambia.

## Probar
1. Abre la URL `/exec` en el navegador: debe mostrar `{"ok":true,"servicio":"constancias"}`.
2. Llena la constancia en el sitio con datos de prueba. Debe aparecer "Tu constancia fue enviada a Gestión Humana" y el correo debe llegar con el PDF adjunto.
3. Avisa a Gestión Humana de que ese correo es de prueba.

## Cuota y límites
- Gmail gratuito permite **100 destinatarios por día** (Google Workspace, 1.500). Con `COPIA` activa, cada constancia cuenta como 2.
- Si se llega al tope, el sitio dice que no pudo enviar y ofrece enviar el PDF a mano. Las constancias no se pierden: la persona conserva su PDF.
- Para que Calidad también reciba las constancias sin gastar cuota, pon una regla de reenvío en el buzón de Gestión Humana.

## Seguridad
- **El destinatario lo fija el script**, no el sitio. Así nadie puede usar la cuenta para escribir a terceros.
- El script rechaza datos inválidos, PDF que no sean PDF o pesen más de 1,5 MB, una segunda constancia de la misma cédula en el mismo minuto, y más de 20 envíos por minuto.
- La URL es pública (está en el código del sitio). Alguien podría enviar constancias falsas con datos válidos; el límite de 20 por minuto y la cuota diaria lo acotan, pero no lo eliminan. Si hay abuso, genera una nueva implementación (URL nueva) y actualiza `js/config.js`.
- El PDF contiene cédula, correo y firma, y pasa por los servidores de Google. Falta el texto de la política de tratamiento de datos de Biosteel (Ley 1581 de 2012): el aviso del formulario solo describe el funcionamiento.
- Nada se guarda en el sitio ni en el script. El único registro son los correos en las bandejas de la cuenta de Gmail (carpeta *Enviados*) y de Gestión Humana. Conviene borrar el *Enviados* de la cuenta con cierta frecuencia, o dejar el registro en un Excel desde Gestión Humana.
