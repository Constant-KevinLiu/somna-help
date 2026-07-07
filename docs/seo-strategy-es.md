# SEO en español: enlazado interno, GSC y enlaces externos

> Estrategia de «SEO小平» para la versión /es/ de somna. Todo el tráfico y los
> enlaces se quedan dentro del ecosistema en español; no se mezcla con la
> versión inglesa.

## 1. Enlazado interno (solo entre páginas en español)

### Reglas

- Todo enlace interno apunta a una ruta bajo `/es/`. **Nunca** a la raíz inglesa.
- El anchor siempre está en español y describe el destino (evitar «haz clic aquí»).
- Cada página enlaza al menos a 2 páginas relacionadas y a 1 página de producto.
- El footer incluye enlaces a las páginas pilar: `/es`, `/es/program`,
  `/es/calculator`, `/es/blog`, `/es/faq`, `/es/pricing`.

### Páginas pilar (orphan-free)

- `/es` — home
- `/es/program` — programa CBT-I
- `/es/calculator` — calculadora de ciclos
- `/es/insomnia-treatment` — tratamiento del insomnio
- `/es/cbt-i-guide` — guía CBT-I
- `/es/blog` — índice del blog
- `/es/faq` — FAQ

### Menús de navegación

- Header: Inicio · Programa · Test · Diario · Relajación · Calculadoras (desplegable) · Blog
- Footer: las páginas pilar + Privacidad · Términos

## 2. Google Search Console (GSC)

### Pasos

1. Añadir la propiedad `https://somna.help/es/` como prefijo de URL en GSC.
   (No mezclar con la propiedad de la raíz inglesa.)
2. Verificar la propiedad (registro TXT o etiqueta HTML; si ya está verificada
   la raíz con el mismo método, no hace falta re-verificar).
3. Enviar el sitemap `https://somna.help/sitemap.xml` (contiene ambas versiones
   con hreflang).
4. Revisar el informe de cobertura: confirmar que las URLs `/es/` se indexan y
   que las URLs inglesas no compiten con las españolas.
5. Monitorizar el informe de internacional → hreflang para detectar errores de
   etiquetas alternativas.
6. Tras 2-4 semanas, revisar consultas reales en español y ajustar títulos y
   meta descriptions según impresiones/CTR.

## 3. Enlaces externos (linkbuilding en español)

### Fuentes prioritarias (KD bajo, alta relevancia)

- **Foros y comunidades:** foros de salud en español (p. ej. secciones de
  sueño de foros generales), respondiendo con valor real, no spam.
- **Directorios de apps de salud:** listados en español de apps de bienestar.
- **Blogs colaborativos:** artículos invitados en blogs españoles de salud,
  psicología y bienestar, con autoría real y enlace contextual a `/es/blog`
  o a una página pilar.
- **Asociaciones de sueño:** si alguna asociación hispana de sueño o de
  psicología tiene directorios de recursos, solicitar inclusión.
- **Prensa local española:** notas sobre el insomnio en España, ofreciendo
  datos del estudio anual de sueño de somna (agregados y anónimos).

### Prácticas a evitar

- Comprar enlaces.
- Comentarios masivos en blogs con enlace exacto.
- Directorios de baja calidad o genéricos.
- Enlaces desde sitios no hispanos (diluyen la relevancia lingüística).

### Anchor sugerido (siempre en español)

- «programa CBT-I en español»
- «calculadora de ciclos de sueño»
- «diario de sueño online»
- «cómo dormir mejor» (a artículos del blog)

## 4. Contenido de autoridad (link magnet)

- **Estudio anual del sueño en España:** encuesta propia con datos agregados,
  publicada como artículo largo en `/es/blog/informe-sueno-espana-2026`. Es el
  contenido más citable y atrae enlaces de prensa y blogs.
- **Glossario del sueño:** glosario de términos (CBT-I, eficiencia, latencia,
  etc.) que otros blogs enlazarán como referencia.

## 5. Cadencia de publicación

- 2 artículos nuevos por semana durante las primeras 8 semanas.
- Después, 1 artículo semarial.
- Actualizar los 5 artículos con mejor tráfico cada 3 meses.
