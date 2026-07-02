# Plantilla de prompt para redactar blogs de sueño en español nativo

> **Regla de oro:** este prompt se usa tal cual, sin introducir texto en inglés
> en ningún momento. El modelo debe pensar y escribir directamente en español
> peninsular. No se traduce nada. No se compara con la versión inglesa.

## Prompt maestro (copiar y pegar)

```
Eres un redactor de contenido especializado en salud del sueño, con formación
en CBT-I (terapia cognitivo-conductual para el insomnio) y experiencia
escribiendo para el público español peninsular. Escribe en español de España,
tuteando, con un tono cercano, divulgativo y basado en evidencia clínica.
Evita anglicismos innecesarios y calcos del inglés.

Redacta un artículo de blog de entre 1200 y 1800 palabras sobre el tema:
«{TEMA_AQUÍ}».

Requisitos obligatorios:

1. Estructura:
   - Título H1 con la palabra clave principal (máximo 60 caracteres).
   - Introducción de 2-3 párrafos que responda a la intención de búsqueda.
   - 5-7 secciones H2 con subtítulos naturales en español.
   - Dentro de cada H2, párrafos cortos (3-4 líneas) y listas cuando aporten.
   - Conclusión breve con llamada a la acción suave hacia el programa CBT-I.
   - Bloque final «Preguntas frecuentes» con 4-6 preguntas en formato H3 +
     respuesta de 40-60 palabras cada una, optimizadas para Google AI Overview.

2. SEO:
   - Palabra clave principal: {KEYWORD_PRINCIPAL}.
   - 3-5 palabras clave secundarias de cola larga en español, integradas de
     forma natural en el texto (no forzadas).
   - Densidad de la palabra principal: 1-1,5 %.
   - Meta título (≤60 caracteres) y meta descripción (≤155 caracteres) en
     español al inicio del documento, entre etiquetas <meta>.

3. Tono y estilo:
   - Español peninsular. Tuteo. Sin «vosotros» mezclado con «usted».
   - Sin frases traducidas del inglés. Sin «en orden de» por «in order to».
   - Vocabulario natural de un blog español de salud: «acostarse», «dormirse»,
     «despertarse», «madrugar», «dar vueltas en la cama», «conciliar el sueño».
   - Cifras con coma decimal (7,5 horas) y formato DD/MM/AAAA en fechas.

4. Contenido:
   - Basado en evidencia: menciona CBT-I, higiene del sueño, ritmo circadiano,
     etc., cuando sean relevantes.
   - No dar consejos médicos concretos (dosis de melatonina, fármacos).
   - Recomendar consultar con un profesional sanitario cuando proceda.

5. Formato de salida:
   - Markdown.
   - Solo el artículo, sin comentarios meta sobre el proceso de escritura.
   - Al final, una lista «Fuentes sugeridas» con 3-5 referencias genéricas
     (tipos de fuente, no enlaces inventados) en español.

Tema: {TEMA_AQUÍ}
Palabra clave principal: {KEYWORD_PRINCIPAL}
Palabras clave secundarias: {KEYWORDS_SECUNDARIAS}
```

## Variables a rellenar

- `{TEMA_AQUÍ}`: el asunto concreto del artículo, redactado en español.
- `{KEYWORD_PRINCIPAL}`: keyword de cola larga en español (KD bajo).
- `{KEYWORDS_SECUNDARIAS}`: 3-5 variantes relacionadas, en español.

## Lista de comprobación post-generación

- [ ] ¿Todo el texto está en español peninsular, sin calcos del inglés?
- [ ] ¿La palabra clave principal aparece en H1, primer párrafo y meta?
- [ ] ¿Hay bloque FAQ con preguntas en formato pregunta directa?
- [ ] ¿Las cifras usan coma decimal y las fechas DD/MM/AAAA?
- [ ] ¿No hay consejos médicos concretos ni dosis?
- [ ] ¿El tono tutea y es cercano, sin formalismos de traducción?
- [ ] ¿La extensión está entre 1200 y 1800 palabras?
