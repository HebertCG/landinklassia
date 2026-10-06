# Klassia Landing

Sitio público de Klassia construido con Astro y preparado como despliegue estático para Cloudflare Pages.

## Desarrollo

Requiere Node.js 22.16 o posterior dentro de la rama 22.

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

## Cloudflare Pages

Al importar este repositorio desde **Workers & Pages → Create application → Pages**, utiliza:

- Rama de producción: `main`
- Comando de build: `npm run build`
- Directorio de salida: `dist`
- Directorio raíz: `/`
- Versión de Node: se toma de `.node-version`

`wrangler.jsonc` contiene la configuración equivalente para Pages. El directorio `public/` incluye
los encabezados de seguridad y caché que Cloudflare copiará al despliegue.

Después del primer despliegue, agrega `klassia.lat` como dominio personalizado en Cloudflare Pages y
confirma que el dominio canónico coincida con el valor `site` de `astro.config.mjs`.

## Comandos

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor local de desarrollo |
| `npm run check` | Validación de Astro y TypeScript |
| `npm run build` | Validación y build estático de producción |
| `npm run preview` | Vista previa del directorio generado |
