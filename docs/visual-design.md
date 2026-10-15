# Klassia — recorrido visual

## Referencia y contenido

La referencia `guiadiseño.mp4` muestra una composición ilustrada, una gran forma curva que
conecta escenas y cambios asociados al desplazamiento. El rediseño usa estos principios
con la identidad celeste de Klassia, sin copiar las ilustraciones ni el contenido del sitio del video.

Los módulos, permisos, funcionamiento, pantallas reales, contactos y páginas legales provienen
del proyecto original. Las tres experiencias por rol mantienen sus textos y capturas.
No se añadieron clientes, testimonios, cifras de adopción ni funciones del producto inventadas.

## Movimiento y accesibilidad

- Entrada de título e ilustración; capas de la portada con desplazamiento y rotación ligados al scroll.
- Diagrama de conexión con órbita que responde al desplazamiento.
- Escena de producto fija durante tres capítulos en escritorio; pestañas, flechas y teclado disponibles.
- En móvil, ventanas bajas o movimiento reducido, navegación directa sin escena fijada.
- El teléfono rota suavemente con el desplazamiento. Los módulos se abren con controles nativos.
- Sin JavaScript, todas las experiencias por rol se muestran. Los módulos usan `details` nativo.
- El visor de capturas conserva el foco al cerrarse y distingue capturas móviles de escritorio.

## Ilustración generada

Herramienta: Imagegen integrada, con fondo transparente. El archivo de producción es
`public/brand/klassia-learning-scene.webp`, 1536 × 1024 px, con canal alfa; conversión WebP a
calidad 90 desde el PNG generado, sin cambiar la composición. La imagen es ilustrativa, no
una fotografía de clientes ni una captura del sistema.

Prompt inicial:

> Use case: illustration-story. Asset type: premium animated education website hero illustration,
> isolated transparent PNG. Create a wide horizontal lively editorial illustration of three young
> adult Peruvian students and a teacher collaborating and learning, with an oversized open laptop,
> books, a floating pencil and a small paper airplane. Playful sophisticated contemporary flat
> vector-like art, bold organic shapes, exaggerated expressive gestures, simple friendly faces,
> strong elegant silhouettes, subtly grain-free and crisp, thin dark navy detail lines only where
> useful. Full figures and all objects fully contained, no cropped limbs. Asymmetric dynamic
> composition spreading horizontally, people leaning and reaching across the laptop, suggesting
> connected learning. One female student in electric sky blue at left, a teacher with a warm coral
> sweater behind the center laptop, a student in lavender and lime trousers at right. Palette:
> vivid celeste #55c8f2 dominant, cobalt #2458dd accents, lime #d9fa68, peach coral #ff947c,
> lavender #b7a0eb, cream #fffdf1 and deep ink #142c38 outlines. This is for Klassia, an academic
> management system for pre-university academies, but do NOT write any text, logo, letters,
> numbers, watermark, dashboard UI, background scene, frame, border, ground plane or enclosing
> circle. Keep the surrounding background genuinely transparent, including gaps between people.
> Landscape aspect ratio about 3:2, high resolution. Professional art direction like a contemporary
> award-winning independent design studio, not corporate clipart, not 3D, not photorealistic.

Prompt final de edición de estilo sobre la primera imagen generada:

> Restyle this educational group as VERY FLAT, MINIMAL, GEOMETRIC EDITORIAL VECTOR-STYLE illustration
> for an award-winning animated website. Preserve the basic educational subject: group of students
> and teacher with laptop and books. Essential changes: completely remove ALL colored haze,
> ALL glows, ALL gradients, ALL shadows, ALL texture, and ALL anime/Disney features. Use entirely
> solid flat shapes, simple tiny dot eyes, small simple faces, oversized rounded hands, elongated
> playful limbs, fluid angular clothes with at most one flat color each. Thin spare dark contour
> lines, not thick outlines. More abstract, modern and quirky grown-up magazine editorial style,
> absolutely not rendered/realistic or cartoon TV style. Flat electric sky blue, cobalt, coral,
> lime, lavender and cream. Make the characters dynamic and organically arranged horizontally,
> fully contained, whole body visible. Transparent cutout background, absolutely no background
> pixels, colored light, backdrop or ground, including between figures. No text or logo.
