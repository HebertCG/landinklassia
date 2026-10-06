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

El build genera 15 rutas estáticas dentro de `dist/`.

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

## Comandos

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor local de desarrollo |
| `npm run check` | Validación de Astro y TypeScript |
| `npm run build` | Validación y build estático de producción |
| `npm run deploy` | Despliegue del directorio `dist` mediante Workers Static Assets |
| `npm run audit:seo` | Build y auditoría técnica de indexabilidad, metadatos, sitemap y enlaces |
| `npm run preview` | Vista previa del directorio generado |
