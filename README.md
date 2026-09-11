# indemniza.me

Sitio estático de captación para un despacho especializado en la defensa del propietario expropiado. Sin framework, sin build, sin dependencias: HTML, CSS y un archivo JS. Se despliega en Vercel tal cual.

---

## ⚠️ Antes de publicar

El sitio está completo a nivel técnico, pero contiene marcadores de posición que **debe sustituir**. Búsquelos con:

```bash
grep -rn "600 00 00 00\|+34600000000\|\[TITULAR\|\[NÚMERO\|\[CIUDAD\|\[PROVINCIA\|TU_ID_DE_FORMSPREE\|0\.000 €" . --include=*.html
```

| Marcador | Dónde | Qué poner |
|---|---|---|
| `+34600000000` y `600 00 00 00` | Todas las páginas | Su teléfono real |
| `TU_ID_DE_FORMSPREE` | `index.html` | El ID de su formulario (ver abajo) |
| `[TITULAR DEL DESPACHO]`, `[NÚMERO]`, `[CIUDAD]` | Pie de todas las páginas | Nombre, número de colegiado y colegio |
| `0.000 €`, `[TIPO DE OBRA]`, `[PROVINCIA]`, `[FASE]` | Sección de caso en `index.html` | **Su expediente real o eliminar la sección** |
| `CIUDAD`, `DIRECCIÓN`, `00000` | JSON-LD de `index.html` | Domicilio profesional |
| Campos entre corchetes | `aviso-legal/`, `politica-privacidad/` | Sus datos |

### Sobre el correo electrónico

El sitio no muestra ninguna dirección de correo: los únicos canales públicos son el **teléfono** y el **formulario**.

Dos consecuencias a tener presentes:

1. **El formulario sí necesita un buzón de destino.** Formspree le pedirá una dirección a la que entregar los envíos. Puede ser una cuenta personal suya; no aparece en ninguna parte del sitio.
2. **Protección de datos.** El interesado debe poder ejercer sus derechos de acceso, rectificación y supresión. La política de privacidad está redactada ahora para canalizarlos **por escrito al domicilio profesional y por teléfono**, que es válido, pero menos cómodo y más fácil de incumplir en plazo. En cuanto pueda, dé de alta un buzón en el dominio y actualícelo.

### Tres avisos que conviene no saltarse

1. **El caso destacado es un marcador de relleno.** Sustitúyalo por su expediente real. No publique resultados que no pueda acreditar. Si prefiere no enseñar ninguno todavía, borre la sección `id="casos"` entera: la sección siguiente, `id="como-trabajamos"`, sostiene la credibilidad por sí sola y la página no se resiente.
2. **El contenido jurídico del blog debe revisarlo usted.** Está redactado sobre el régimen general de la Ley de Expropiación Forzosa y el texto refundido de la Ley de Suelo, pero usted responde de lo que se publique bajo su nombre y su número de colegiado. Revise plazos, referencias y matices autonómicos antes de subirlo.
3. **Aviso legal y política de privacidad son plantillas.** Complételas y hágalas revisar. Y consulte con su colegio la publicidad del sitio, en especial el nombre imperativo del dominio y la frase sobre honorarios ligados al resultado.

---

## Publicar en GitHub

```bash
cd indemniza-me
git init
git add .
git commit -m "Sitio inicial de indemniza.me"
git branch -M main
git remote add origin https://github.com/USUARIO/indemniza-me.git
git push -u origin main
```

Si el repositorio va a ser público, revise antes que no haya quedado ningún dato personal de cliente en el histórico.

## Desplegar en Vercel

1. Entre en [vercel.com/new](https://vercel.com/new) e importe el repositorio.
2. En la configuración del proyecto:
   - **Framework Preset:** `Other`
   - **Build Command:** dejar vacío
   - **Output Directory:** dejar vacío (la raíz)
3. Pulse *Deploy*. En menos de un minuto tendrá una URL `*.vercel.app`.

Cada `git push` a `main` vuelve a desplegar automáticamente. Las ramas generan previsualizaciones sin tocar producción.

### Conectar el dominio

En el proyecto de Vercel, *Settings → Domains*, añada `indemniza.me` y `www.indemniza.me`. Vercel le dará los registros DNS que debe configurar donde tenga el dominio:

- `indemniza.me` → registro `A` apuntando a la IP que indique Vercel
- `www.indemniza.me` → registro `CNAME` a `cname.vercel-dns.com`

El certificado HTTPS se emite solo. Deje `indemniza.me` como dominio principal y `www` redirigiendo a él, para no partir la autoridad SEO entre dos versiones.

**Recomendación:** registre también `indemnizame.es` y redirájalo. Mucha gente lo escribirá junto al oírlo por teléfono.

### Activar el formulario

El formulario está preparado para [Formspree](https://formspree.io), que acepta archivos adjuntos en sus planes de pago:

1. Cree un formulario y copie su endpoint.
2. En `index.html`, sustituya `TU_ID_DE_FORMSPREE` en el atributo `action`.
3. Envíe una prueba y confirme que el archivo llega.

Si prefiere otro proveedor (Web3Forms, Basin, Netlify Forms), basta con cambiar la URL del `action`: el JavaScript hace un `POST` estándar con `FormData` y espera una respuesta `2xx`.

Al enviarse correctamente redirige a `/gracias/`, que está en `noindex`. Esa URL le sirve como objetivo de conversión en analítica y en Google Ads.

---

## Estructura

```
├── index.html                    Landing principal
├── blog/
│   ├── index.html                Índice de guías
│   └── <slug>/index.html         6 artículos
├── gracias/                      Página de conversión (noindex)
├── aviso-legal/
├── politica-privacidad/
├── assets/
│   ├── css/site.css              Toda la hoja de estilos
│   ├── js/site.js                Validación del formulario
│   └── *.png                     Logo, isotipo, favicons, imagen social
├── robots.txt
├── sitemap.xml
└── vercel.json                   URLs limpias, cabeceras de seguridad y caché
```

## Añadir un artículo nuevo

El generador `gen_blog.py` (fuera del repositorio) produce los artículos desde una plantilla común. También puede copiar una carpeta existente de `blog/` y editarla a mano. En ese caso, actualice siempre:

1. `<title>`, `<meta name="description">` y `rel="canonical"`
2. Los tres bloques JSON-LD: `Article`, `FAQPage` y `BreadcrumbList`
3. El índice lateral (`.toc`) y los anclajes `id` de los `<h2>`
4. La tarjeta en `blog/index.html`
5. Una entrada nueva en `sitemap.xml`

Escriba un artículo por **documento que la gente recibe**, no por concepto jurídico. La gente no busca "expropiación forzosa": busca el papel que le acaba de llegar.

## Qué hacer después de publicar

1. Dar de alta el sitio en Google Search Console y enviar `sitemap.xml`.
2. Crear la ficha de Google Business Profile.
3. Instalar analítica. Si usa cookies de terceros, necesitará banner de consentimiento previo que las bloquee hasta la aceptación.
4. Crear una página por obra concreta en marcha (`/blog/expropiacion-<nombre-de-la-obra>/`). Posiciona en días porque nadie más escribe sobre esa obra y el tráfico que trae está cualificado al máximo.
5. Contactar con cooperativas agrarias y comunidades de regantes de las zonas con trazados activos.

## Detalles técnicos

- Sin dependencias JS. Solo se cargan dos familias de Google Fonts.
- Mobile-first, verificado sin desbordamiento horizontal a 390, 820 y 1440 px.
- Barra fija inferior en móvil con llamada directa, que en este público suele ser el canal de mayor conversión.
- FAQ con `<details>` nativo: accesible y funciona sin JavaScript.
- Marcado `LegalService`, `FAQPage`, `Article` y `BreadcrumbList`.
- Foco visible en teclado y `prefers-reduced-motion` respetado.
- Cabeceras de seguridad y caché de un año para `/assets/` en `vercel.json`.

---

## Nota sobre la credibilidad cuando se empieza

La página está construida a propósito para que **la confianza no dependa del número de casos**. Con un despacho recién abierto, una rejilla de "resultados" medio vacía resta en lugar de sumar, así que el peso lo llevan cuatro cosas que sí tiene desde el primer día:

- **Un caso contado entero**, con su razonamiento, que convence más que cinco cifras sueltas sin contexto.
- **La sección "Cómo trabajamos"**, que convierte en ventaja lo que en un despacho grande es un defecto: que hablará siempre con el mismo abogado, no con un comercial.
- **Honorarios ligados al incremento**, que trasladan el riesgo de usted al despacho. Es el argumento más potente que tiene ahora mismo.
- **Las seis guías del blog.** Un sitio con contenido serio y bien trabajado sobre expropiación transmite competencia. En este sector, el contenido *es* el currículum.

A medida que cierre expedientes, sustituya el caso y añada otros. La estructura del bloque `.uno` admite varios apilados sin tocar el CSS.
