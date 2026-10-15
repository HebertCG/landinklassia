# Klassia Landing

Sitio público de Klassia construido con Astro y preparado como despliegue estático mediante Cloudflare Workers Static Assets.

## Desarrollo

Requiere Node.js 22.19 o posterior dentro de la rama 22.

```bash
npm ci
npm run dev
```

## Verificación de producción

```bash
npm run build
npm run preview
```

El build genera 17 páginas estáticas dentro de `dist/`, incluida la página 404.

### Rediseño visual

La versión previa al rediseño está guardada en el commit `9cce7a1`.
Se conservan el logo, los seis módulos, la información comercial y legal, las capturas reales
y los enlaces de contacto. La estructura se reconstruyó como un recorrido ilustrado: portada,
escena de conexiones, vistas por rol ligadas al scroll, explorador desplegable de módulos,
escena móvil y Klassia en vivo. Usa celeste, lima, coral y lavanda. Incluye paginación entre módulos
y un visor ampliable de capturas. Las animaciones respetan
`prefers-reduced-motion`; las tres experiencias permanecen visibles cuando JavaScript está deshabilitado.

Para repetir la revisión de interfaz, inicia la compilación local en una terminal:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4322
```

En otra terminal ejecuta `npm run audit:ui`. Usa el `playwright-core` ya instalado y Microsoft Edge
en modo headless; `UI_AUDIT_BROWSER` permite elegir otro canal instalado y `UI_AUDIT_URL` cambia
la dirección de prueba. Revisa las páginas en escritorio y móvil, los controles por teclado,
el visor de imágenes, cookies, navegación, recuperación 404, movimiento reducido y contenido sin
JavaScript. El recorrido ligado al scroll solo se activa en pantallas de al menos 1100 × 760 px
sin movimiento reducido; en el resto se usan pestañas y botones. Las capturas, trazas y resultados
quedan en `screenshots/` (ignorado por Git).
Esta comprobación no sustituye una revisión en Safari o Firefox.

La ilustración se generó con Imagegen y se sirve como WebP con transparencia (208 KB).
Su dirección artística y prompt están en `docs/visual-design.md`.

## Cloudflare Workers

Al conectar este repositorio a **Workers & Pages → Workers Builds**, utiliza:

- Rama de producción: `main`
- Comando de build: `npm run build`
- Comando de despliegue: `npm run deploy`
- Directorio de salida: `dist`
- Directorio raíz: `/`
- Versión de Node: se toma de `.node-version`

`wrangler.jsonc` apunta los recursos estáticos de Workers al directorio `dist`. El directorio `public/` incluye
los encabezados de seguridad y caché que Cloudflare copiará al despliegue.

Después del primer despliegue, agrega `klassia.lat` como dominio personalizado en Cloudflare Workers y
confirma que el dominio canónico coincida con el valor `site` de `astro.config.mjs`.

## Google Search Console

Cuando `https://klassia.lat/` ya muestre esta landing en producción:

1. Crea una propiedad de tipo **Dominio** para `klassia.lat` en Google Search Console.
2. Copia el registro TXT de verificación y agrégalo en el DNS de Cloudflare.
3. Envía `https://klassia.lat/sitemap-index.xml` desde la sección **Sitemaps**.
4. Inspecciona `https://klassia.lat/` y solicita su indexación.

El sitemap se genera automáticamente durante cada build. Para usar alternativamente la verificación
por etiqueta HTML, define `PUBLIC_GOOGLE_SITE_VERIFICATION` como variable de build en Cloudflare con
el valor entregado por Search Console y vuelve a desplegar.

## Contacto por WhatsApp

Los botones comerciales usan `PUBLIC_WHATSAPP_URL`. En **Workers & Pages → tu Worker → Settings →
Build → Build Variables and Secrets**, configura esa variable con una URL completa de `wa.me` y
vuelve a desplegar. El repositorio incluye el número público actual como valor predeterminado para
que los builds locales y de producción sigan funcionando si la variable todavía no existe.

```text
PUBLIC_WHATSAPP_URL=https://wa.me/51989453142?text=Hola%2C%20quiero%20solicitar%20una%20demostraci%C3%B3n%20de%20Klassia%20para%20mi%20academia.
```

## Comandos

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor local de desarrollo |
| `npm run check` | Validación de Astro y TypeScript |
| `npm run build` | Validación y build estático de producción |
| `npm run deploy` | Despliegue del directorio `dist` mediante Workers Static Assets |
| `npm run audit:seo` | Build y auditoría técnica de indexabilidad, metadatos, sitemap y enlaces |
| `npm run audit:ui` | Pruebas de interfaz contra la vista previa local en el puerto 4322 |
| `npm run preview` | Vista previa del directorio generado |
