# AUDITORÍA Y PLAN DE MEJORAS INTEGRAL
**Proyecto:** Portafolio Interactivo y Plataforma Profesional — Oier Santo Tomás Gamayo  
**Ubicación:** `D:\Mipagina`  
**Estándar:** Enterprise Grade (Inspirado en Linear, Stripe, Apple) · WCAG 2.1 / 2.2 AA · Vanilla Web Standards  
**Fecha:** 2026-10-23  

---

## 1. ARQUITECTURA ACTUAL

El proyecto está concebido bajo una **arquitectura espejo simétrica y desacoplada** (`html/`, `css/`, `js/`), sin dependencias pesadas ni frameworks, utilizando tecnologías web nativas modernas:

```text
D:\Mipagina/
├── index.html                   (Redirección al punto de entrada principal)
├── html/
│   ├── comun/
│   │   └── cabecera.html        (Plantilla del componente de navegación)
│   └── inicio/
│       └── portafolio.html      (Vista principal de la aplicación)
├── css/
│   ├── comun/
│   │   ├── variables.css        (Tokens de diseño y variables CSS nativas)
│   │   └── normalizacion.css    (Reset técnico, tipografía base y a11y)
│   └── inicio/
│       └── portafolio.css       (Estilos de la vista principal y componentes)
└── js/
    ├── comun/
    │   └── utilidades.js        (Módulos utilitarios: AudioGlaciar, portapapeles, throttle)
    └── inicio/
        └── portafolio.js        (Controlador de la vista: Three.js, interactividad, estado)
```

### Características Técnicas Identificadas:
- **Frontend puro:** HTML5 semántico, CSS3 moderno (Custom Properties, Grid, Flexbox), JavaScript ES6+ modular (`type="module"`).
- **Gráficos 3D:** Three.js r128 para el núcleo interactivo "Cryo-Crystal Nucleus" con sombreado PBR, wireframe geodésico y partículas.
- **Audio Sintético:** Síntesis sonora en tiempo real mediante la Web Audio API nativa (`AudioGlaciar`), sin ficheros de audio pesados.
- **Microinteracciones:** Botones magnéticos con iluminación reactiva al cursor, inclinación 3D (tilt) en tarjetas, consola de diagnóstico Homelab.

---

## 2. PROBLEMAS DETECTADOS Y EVIDENCIAS

### A. Errores de Sintaxis y Propiedades CSS Inválidas (Confirmado)
- **Token CSS no definido:** En `css/inicio/portafolio.css` (línea 1184), se utiliza `padding: var(--espacio-7);`. Sin embargo, en `css/comun/variables.css` existen `--espacio-6: 24px;` y `--espacio-8: 32px;`, pero `--espacio-7` no está declarada, lo que provoca que el padding falle o se ignore.
- **Propiedad no estándar de Tailwind en CSS puro:** En `css/inicio/portafolio.css` (líneas 159, 1033, 1687), se utiliza la directiva `inset-x: 0;`. Esta no es una propiedad CSS válida en los navegadores; la especificación estándar de CSS requiere `inset-inline: 0;` o `left: 0; right: 0;`. Los motores de renderizado descartan actualmente esta regla.

### B. Rendimiento Web y Hilo Principal (Confirmado)
- **Bucle de renderizado continuo de Three.js:** El método `animar()` en `portafolio.js` ejecuta `requestAnimationFrame` en bucle infinito sin importar si la sección `#hero` está visible o si el usuario ha hecho scroll hasta el final de la página. Esto consume ciclos constantes de CPU/GPU y agota la batería en dispositivos móviles.
- **Bloqueo del renderizado por `@import`:** En `css/comun/normalizacion.css` (línea 6), se utiliza `@import url('https://fonts.googleapis.com/...');`. Las directivas `@import` dentro de archivos CSS bloquean la descarga paralela y retrasan el First Contentful Paint (FCP). Deben cargarse mediante etiquetas `<link>` optimizadas con preconexión en el `<head>`.
- **Intervalo continuo de telemetría:** El `setInterval` de la simulación del Homelab (2400ms) se ejecuta incondicionalmente aunque la pestaña esté en segundo plano o la sección `#stack` no esté en el viewport.

### C. Experiencia de Usuario y Diseño Responsive (Confirmado)
- **Navegación rota en pantallas móviles (<768px):** En `css/inicio/portafolio.css`, la clase `.navegacion-enlaces` tiene `display: none;` en resoluciones inferiores a 768px. No existe un menú móvil alternativo (hamburguesa, cajón o barra de navegación adaptada). Los usuarios en smartphones no tienen forma de saltar entre secciones desde la cabecera.
- **Bloqueo de selección de texto en Hero:** `.hero-cuerpo` posee `pointer-events: none;`, lo que impide seleccionar el titular o copiar la propuesta de valor con el cursor.
- **Formulario de contacto no operativo:** El formulario `#formulario-transmision` solo posee un campo de texto (textarea) para el mensaje, careciendo de campos para Nombre y Correo Electrónico del remitente. Al pulsar "Enviar", el mensaje no se envía ni se enlaza con ningún cliente de correo (`mailto:`), resultando en una acción estéril.
- **Consola Homelab limitada:** Solo admite clics en botones predeterminados, pero carece de un campo de entrada donde el usuario pueda teclear comandos reales (`help`, `status`, `ai`, `stack`, `clear`, etc.).

### D. Accesibilidad y Estándares WCAG 2.1 / 2.2 AA (Confirmado)
- **Contraste insuficiente:** La variable `--color-texto-terciario: #64748b;` sobre el fondo `#090b0e` ofrece un ratio de contraste de **4.14:1**, inferior al mínimo exigido por WCAG AA (4.5:1 para texto normal).
- **Anti-patrón ARIA en la barra de navegación:** Se utiliza `role="menubar"` y `role="menuitem"`, pero no se implementa el control por teclado obligatorio para barras de menús (flechas izquierda/derecha, inicio/fin). Siguiendo las directrices de accesibilidad, es preferible utilizar HTML semántico nativo dentro de `<nav>`.
- **Inaccesibilidad por teclado en Línea de Tiempo y Matriz:** Los hitos de la trayectoria (`<article class="item-linea-tiempo">`) y las tarjetas de tecnología son interactivos mediante clic, pero no son elementos enfocables (`<button>` o `tabindex="0"`) ni poseen atributos `aria-expanded` para lectores de pantalla.
- **Selector de temas de contacto sin semántica de radio:** El contenedor tiene `role="radiogroup"`, pero los botones no declaran `role="radio"` ni `aria-checked="true|false"`.
- **Falta de retroalimentación accesible en copia de email:** Al copiar el correo, el cambio visual a "EMAIL COPIADO" no se notifica a lectores de pantalla por falta de un contenedor `aria-live="polite"`.
- **Respeto a `prefers-reduced-motion`:** Three.js no detiene la rotación continua cuando el usuario tiene activada la preferencia de movimiento reducido en su sistema operativo.

### E. SEO y Metadatos Estructurados (Confirmado)
- Carencia de etiquetas Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`).
- Carencia de Twitter Cards.
- Carencia de datos estructurados en formato JSON-LD (Schema.org `Person` y `ProfilePage`), impidiendo que motores de búsqueda indexen de forma enriquecida los estudios de Somorrostro, las certificaciones y las competencias del perfil.

---

## 3. SKILLS Y HERRAMIENTAS IDENTIFICADAS

1. **`agency-accessibility-auditor`**: Metodología WCAG 2.2 AA (POUR), verificación de ratios de contraste, gestión del foco visible (`:focus-visible`), navegación 100% por teclado y semántica ARIA rigurosa.
2. **`agency-frontend-developer`**: Maquetación limpia, vanilla ES6+, manipulación segura del DOM sin `innerHTML` en variables no confiables, desacoplamiento CSS/JS.
3. **`agency-ux-architect`**: Jerarquía de información, diseño del menú de navegación móvil fluido, retroalimentación táctil/auditiva y prevención de saltos de maquetación (CLS).
4. **`agency-ui-finish-gate-reviewer`**: Eliminación de patrones genéricos, preservación de la estética sobria institucional, veto estricto a emojis, iconografía SVG monocroma de trazo fino (`stroke-width="1.5"`).
5. **`agency-seo-specialist`**: Metadatos sociales, microformatos Schema.org, canonical URLs, optimización de rastreo.
6. **`agency-performance-benchmarker`**: Optimización de carga de fuentes (`preload` vs `@import`), implementación de `IntersectionObserver` para apagar WebGL fuera de pantalla, reducción de trabajo en el hilo principal.
7. **`agency-code-reviewer`**: Refactorización de código duplicado, resolución de dependencias circulares y limpieza de variables no declaradas.

---

## 4. MEJORAS DE DISEÑO UI/UX PROPUESTAS

1. **Navegación Móvil Adaptativa (*Enterprise Grade*):**
   - Implementar un botón disparador minimalista en la cabecera para pantallas < 768px con icono SVG técnico.
   - Panel de navegación desplegable sobrio con desenfoque de fondo (*backdrop-filter: blur(20px)*), transiciones de opacidad y transformación matemática.
   - Navegación táctil fluida y cierre automático al seleccionar una sección o pulsar fuera/Escape.

2. **Formulario de Conexión Real y Funcional:**
   - Añadir campos armoniosos para Nombre/Empresa y Correo de Contacto.
   - Enlace de envío que genera la comunicación estructurada y permite el despacho directo vía `mailto:oier.santotomas@dev-ops.es` con el asunto y cuerpo formateados.

3. **Consola Homelab Interactiva con Entrada por Teclado:**
   - Mantener los botones de presets rápidos y añadir una línea de comandos real con prompt interactivo `oier@stg-homelab:~$`.
   - Soporte para comandos: `help`, `status`, `ai`, `stack`, `smr`, `dam`, `contact`, `clear`.

4. **Refinamiento de Microinteracciones:**
   - Botón de reinicio o sincronización automática en el control de iluminación del manifiesto.
   - Habilitar selección de texto nativa en el Hero (`pointer-events: auto;`) sin interferir con el arrastre 3D del fondo.
   - Persistencia de la preferencia de audio HUD en `localStorage`.

---

## 5. OPTIMIZACIONES TÉCNICAS

1. **Suspensión Inteligente de Three.js con `IntersectionObserver`:**
   - Cuando la sección `#hero` salga del campo de visión del usuario, detener inmediatamente el bucle `requestAnimationFrame`.
   - Reactivar automáticamente la renderización al volver a entrar en el viewport.
   - En caso de `prefers-reduced-motion: reduce`, renderizar una captura estática y deshabilitar oscilaciones automáticas.

2. **Eliminación de Cadena de Peticiones Críticas de Fuentes:**
   - Suprimir `@import` de `normalizacion.css`.
   - Incorporar en `portafolio.html` etiquetas `<link rel="preload" as="style">` y `<link rel="stylesheet">` con `display=swap`.

3. **Corrección de Tokens y Propiedades CSS:**
   - Declarar `--espacio-7: 28px;` en `variables.css`.
   - Ajustar `--color-texto-terciario: #94a3b8;` para garantizar un ratio de contraste > 5.5:1 (WCAG AA superado con solvencia).
   - Sustituir `inset-x: 0;` por la sintaxis estándar `inset-inline: 0;` en los 3 selectores identificados.

4. **Accesibilidad Integral en Componentes Interactivos:**
   - Línea de tiempo: Convertir cabeceras en botones accesibles con `aria-expanded` y gestión de teclado (Enter / Espacio).
   - Matriz de tecnologías: Convertir tarjetas en elementos interactivos con `tabindex="0"`, `role="button"` y navegación por teclado.
   - Formulario: Integrar `role="radio"` y `aria-checked` dinámico en los temas de interés.
   - Mensaje de confirmación: Añadir región `aria-live="polite"` para avisos de copia de correo y transmisión.

5. **SEO Avanzado con Schema.org JSON-LD:**
   - Inyectar gráfico de conocimiento en JSON-LD con entidad `Person`, formación académica en Somorrostro, habilidades tecnológicas (SMR, DAM, IA) y enlaces canónicos.

---

## 6. RIESGOS Y DEPENDENCIAS

- **Riesgo:** Incompatibilidad de Three.js en navegadores antiguos o con aceleración por hardware deshabilitada.
  - *Mitigación:* Se mantiene la detección segura `window.WebGLRenderingContext` y degradación elegante a gradiente atmosférico puro.
- **Riesgo:** Desincronización entre `cabecera.html` y `portafolio.html`.
  - *Mitigación:* Actualizar simétricamente ambos ficheros conforme a la directriz de estructura espejo.
- **Riesgo:** Dependencia externa del CDN de Three.js y Google Fonts.
  - *Mitigación:* Se implementa manejo de errores ante fallo de red y fuentes de respaldo del sistema (*system fonts fallback*).

---

## 7. MATRIZ DE PRIORIDADES

| Tarea | Impacto | Complejidad | Riesgo | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| Corrección de `--espacio-7` e `inset-x: 0` | Alto | Baja | Nulo | **Crítica** |
| Menú de navegación adaptable para móviles (<768px) | Muy Alto | Media | Muy Bajo | **Crítica** |
| Suspensión de Three.js mediante `IntersectionObserver` | Muy Alto | Media | Bajo | **Crítica** |
| Accesibilidad por teclado en Timeline, Matriz y Formulario | Alto | Media | Bajo | **Alta** |
| Optimización de carga de fuentes (eliminación de `@import`) | Alto | Baja | Nulo | **Alta** |
| Ajuste de contraste WCAG AA en `--color-texto-terciario` | Medio | Baja | Nulo | **Alta** |
| Formulario de contacto funcional (Nombre, Email, `mailto:`) | Alto | Media | Nulo | **Alta** |
| Metadatos SEO, Open Graph y Schema.org JSON-LD | Medio | Baja | Nulo | **Media** |
| Consola Homelab con input interactivo por teclado | Medio | Media | Nulo | **Media** |
| Persistencia de preferencia de audio en `localStorage` | Bajo | Baja | Nulo | **Baja** |

---

## 8. ARCHIVOS A MODIFICAR

1. `css/comun/variables.css` (tokens de espaciado y contraste)
2. `css/comun/normalizacion.css` (eliminación de `@import`, estilos de reducción de movimiento)
3. `css/inicio/portafolio.css` (estándares CSS, menú móvil, responsive, consola interactiva, formulario)
4. `html/inicio/portafolio.html` (semántica, enlaces de fuentes, inputs de formulario, menú móvil, SEO/JSON-LD)
5. `html/comun/cabecera.html` (componente espejo actualizado con botón y menú móvil)
6. `js/inicio/portafolio.js` (IntersectionObserver, navegación móvil, accesibilidad teclado, consola homelab, formulario)
7. `js/comun/utilidades.js` (persistencia de audio, utilidades accesibles)
8. `index.html` (metadatos enriquecidos)

---

## 9. ESTRATEGIA DE VALIDACIÓN

1. **Auditoría con Scripts Automatizados:**
   - Comprobación de cero errores de sintaxis CSS y propiedades inválidas.
   - Comprobación de cero emojis en todos los ficheros del proyecto.
   - Verificación de correspondencia 1:1 entre IDs en JS y HTML.
   - Cálculo matemático de contraste de colores para todas las variables tipográficas.
2. **Pruebas de Accesibilidad:**
   - Recorrido completo de la aplicación utilizando únicamente la tecla `Tab`, `Shift+Tab`, `Enter` y `Espacio`.
   - Verificación de que todos los estados interactivos presentan `:focus-visible`.
   - Verificación de anuncios `aria-live`.
3. **Pruebas de Responsive y Renderizado:**
   - Verificación de maquetación en resoluciones móviles (375px, 414px), tablets (768px), laptops (1024px, 1280px) y ultra-wide (1920px+).
   - Comprobación del menú desplegable móvil.
4. **Pruebas de Rendimiento:**
   - Confirmación de parada efectiva de Three.js al hacer scroll fuera del Hero.
   - Medición de ausencia de errores en consola.

---

## 10. ORDEN DE IMPLEMENTACIÓN

1. **Fase 1: Capa de Estilos Base y Tokens (`css/comun/`)**
   - Incorporar `--espacio-7` y ajustar contraste en `variables.css`.
   - Limpiar `@import` y reforzar reglas en `normalizacion.css`.
2. **Fase 2: Estructura HTML Semántica y SEO (`html/`)**
   - Actualizar `portafolio.html` y `cabecera.html` con menú móvil, inputs de formulario, atributos ARIA y metadatos JSON-LD.
3. **Fase 3: Hojas de Estilo del Portafolio (`css/inicio/portafolio.css`)**
   - Corregir `inset-x: 0;`, diseñar el menú móvil, añadir estilos para consola interactiva y campos de contacto.
4. **Fase 4: Lógica JavaScript y Rendimiento (`js/`)**
   - Implementar `IntersectionObserver` en `GestorEscena3D`, controlador del menú móvil, interactividad por teclado y consola interactiva.
5. **Fase 5: Validación, Pruebas y Generación de `INFORME_FINAL_MEJORAS.md`**.
