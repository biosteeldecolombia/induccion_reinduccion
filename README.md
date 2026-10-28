# Inducción y Reinducción · Biosteel de Colombia S.A.S.

Sitio estático (HTML, CSS y JavaScript, sin servidor) para el proceso de inducción y reinducción. Está pensado para GitHub Pages desde la rama `main`, carpeta raíz.

## Etapas

1. **Inducción general:** diapositivas de Inducción General, Seguridad y Salud en el Trabajo y Código de Ética y Conducta, reconstruidas como pasos.
2. **Firma de constancia:** formulario propio con firma dibujada. Genera la constancia en PDF en el navegador de la persona.
3. **SAGRILAFT:** video (incrustado, con botón de respaldo), repaso y evaluación en Microsoft Forms (mínimo 4 puntos).
4. **Tecnovigilancia:** enlace a <https://biosteeldecolombia.github.io/capacitacion_tecnovigilancia/>.

## Cómo se maneja la información

- No hay servidor. Por defecto, nada de lo que se escribe en la constancia se guarda ni se envía: se queda en el navegador y termina en un PDF que la persona descarga y envía a Gestión Humana.
- Opcional: con una URL de Power Automate en `js/config.js`, los datos (sin la firma) también se registran en un Excel de Gestión Humana. Ver `docs/POWER_AUTOMATE.md`.
- `localStorage` guarda solo los pasos completados (clave `bs-induccion-v1`), nunca datos del formulario.
- El avance es de autodeclaración. El sitio no puede comprobar que alguien aprobó un formulario de Microsoft Forms ni que Gestión Humana recibió su constancia.

## Estructura

```
index.html          Página única; rutas por hash (#/, #/etapa/N/I)
css/styles.css      Estilos (tokens de marca Biosteel)
js/app.js           Contenido de las etapas, progreso, router, visor de diapositivas
js/config.js        URL opcional del flujo de Power Automate
js/constancia.js    Formulario, lienzo de firma, validación y PDF
vendor/             jsPDF 4.2.1 (MIT), guardado localmente, sin CDN
assets/slides/      Diapositivas exportadas (ind-XX = inducción, sag-XX = SAGRILAFT)
assets/pdf/         Presentaciones completas en PDF
```

## Publicar

1. En GitHub: Settings, Pages, Source: *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
2. El archivo `.nojekyll` ya está incluido.

## Mantenimiento

- **Enlaces** (video, evaluación SAGRILAFT, Tecnovigilancia): objeto `LINKS` al inicio de `js/app.js`.
- **Registro en Excel:** `endpoint` en `js/config.js` (ver `docs/POWER_AUTOMATE.md`).
- **Correos de contacto:** `CONTACT` y `CC` al inicio de `js/constancia.js`.
- **Texto de términos y condiciones:** objeto `TERMS` en `js/constancia.js`. Es el texto entregado por Gestión Humana.
- **Probar en local:** `python -m http.server 8790` y abrir <http://localhost:8790>.
