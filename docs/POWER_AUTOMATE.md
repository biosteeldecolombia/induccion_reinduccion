# Registrar las constancias en Excel con Power Automate

El sitio puede enviar los datos de cada constancia a un flujo de Power Automate que agrega una fila a un Excel. Mientras `endpoint` esté vacío en `js/config.js`, el sitio no envía nada y la constancia es solo el PDF.

Se envía: código, nombres, apellidos, cédula, cargo, correo, módulos confirmados, comentarios y fecha y hora. **No se envía la firma**: queda solo en el PDF.

## 1. Preparar el Excel

1. Guarda el libro en un sitio de equipo de SharePoint (por ejemplo, Gestión Humana), no en una cuenta personal, para que no dependa de una sola persona.
2. En una hoja, escribe estos encabezados en la fila 1 y conviértelos en tabla (Insertar, Tabla): `codigo`, `nombres`, `apellidos`, `cedula`, `cargo`, `correo`, `modulos`, `comentarios`, `fechaHora`, `fechaIso`.

## 2. Crear el flujo

Cuenta de Microsoft de Biosteel, Power Automate, Crear, Flujo de nube instantáneo.

1. **Disparador:** *Cuando se recibe una solicitud HTTP*. En "Quién puede desencadenar el flujo", elige *Cualquiera*. Este disparador es un conector premium: confirma que la licencia lo incluye.
2. **Analizar JSON:** contenido `json(triggerBody())`. Esquema:
   ```json
   {
     "type": "object",
     "properties": {
       "codigo": {"type": "string"}, "nombres": {"type": "string"}, "apellidos": {"type": "string"},
       "cedula": {"type": "string"}, "cargo": {"type": "string"}, "correo": {"type": "string"},
       "modulos": {"type": "string"}, "comentarios": {"type": "string"},
       "fechaHora": {"type": "string"}, "fechaIso": {"type": "string"}
     }
   }
   ```
   El sitio envía `text/plain` a propósito, para evitar la petición previa de CORS que Power Automate no responde.
3. **Condición (recomendada):** continuar solo si `cedula` tiene solo dígitos y `codigo`, `nombres` y `correo` no están vacíos. Reduce filas basura.
4. **Excel Online (Business), Agregar una fila a una tabla:** ubicación, biblioteca, archivo y tabla del paso 1, y asigna cada columna con el campo de Analizar JSON.
5. **Respuesta** (al final, también en la rama "no"): código de estado `200` si se guardó, o `400` si no. Encabezados:
   - `Access-Control-Allow-Origin`: `https://biosteeldecolombia.github.io`
   - Cuerpo: `{"ok": true}`

   Sin este encabezado el navegador no puede leer la respuesta y el sitio avisará que no pudo confirmar el registro.

## 3. Conectar el sitio

1. Guarda el flujo y copia la *URL HTTP POST* que aparece en el disparador.
2. Pégala en `js/config.js`, campo `endpoint`, y haz commit.
3. El aviso del formulario cambia solo: pasa a decir que los datos también se envían al registro de Gestión Humana.

## Riesgos

- La URL del flujo queda visible en el código público: cualquiera podría enviarle filas falsas. La condición del paso 3 lo limita, pero no lo elimina. Si hay abuso, genera una URL nueva en el flujo y actualiza `config.js`.
- El Excel contiene cédulas y correos: limita su acceso a Gestión Humana y Calidad.
- El sitio solo dice "registrado" si el flujo responde 2xx. Aun así, el PDF con la firma sigue siendo la constancia.
- Falta el texto de la política de tratamiento de datos de Biosteel (Ley 1581 de 2012). El aviso del formulario describe solo el funcionamiento técnico.
