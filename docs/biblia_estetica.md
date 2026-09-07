# BIBLIA ESTÉTICA — ISN'T BEHIND
## Guía de Dirección de Arte y Producción Visual

> **Propósito:** Este documento es la guía DEFINITIVA para toda decisión visual del proyecto. Ningún sprite, menú, interfaz o efecto visual debe producirse sin consultarlo. Es la Única Fuente de Verdad (SSoT) para el arte del juego.

---

## ÍNDICE
1. [Nombre y Definición de la Estética](#1-nombre-y-definición)
2. [Imágenes de Referencia y Análisis](#2-referencias)
3. [Paleta de Color Canónica](#3-paleta-de-color)
4. [Pipeline Técnico: Cómo Lograr el Efecto](#4-pipeline-técnico)
5. [Reglas por Capa Visual](#5-reglas-por-capa)
6. [Reconocibilidad de Objetos: La Regla de Silueta](#6-reconocibilidad)
7. [Tipografía y Texto en el Efecto](#7-tipografía)
8. [Filtros y Post-Procesado en Runtime](#8-post-procesado)
9. [Casos Específicos: Menús, UI, Documentos](#9-casos-específicos)
10. [Lo Que Está PROHIBIDO](#10-prohibiciones)

---

## 1. NOMBRE Y DEFINICIÓN DE LA ESTÉTICA

### Nombre técnico
**Duotono Posterizado con Grano Analógico** (*Posterized Duotone with Analog Grain*)

También conocido en comunidades de diseño y arte como:
- **High-contrast duotone** / **Tritone posterization**
- **Xerographic art** (arte xerográfico / estética de fotocopia)
- **Stencil art photography** (por su similitud con el arte de plantilla/esténcil)
- En el ámbito musical DSBM/post-punk: **aesthetic blackout** o simplemente **duotone noir**

### Términos de búsqueda para encontrar más referencias
- `"posterized duotone photography"` `"high contrast duotone dark"`
- `"xerography art aesthetic"` `"photocopy art dark"`
- `"tritone posterize noir"` `"stencil photo effect"`
- `"DSBM album art aesthetic"` `"dark duotone grain"`

### Definición visual
La estética consiste en tomar imágenes fotorrealistas y DESTRUIR su información tonal de forma controlada, reduciéndolas a **2-3 niveles tonales** mapeados a una paleta de color restringida. El resultado:
- Las sombras colapsan a **NEGRO PURO** (sin detalle).
- Los tonos medios se mapean a un **color intermedio oscuro** (en nuestro caso: azul-acero/petróleo oscuro).
- Las luces/highlights se mapean al **color primario saturado** (en nuestro caso: azul C.S.T.).
- Se añade **ruido/grano analógico** que simula degradación de señal, fotocopia, o impresión sobre papel malo.

El efecto evoca: **vigilancia CCTV degradada, fotocopias de documentos clasificados, impresiones en papel barato de propaganda subversiva, la visión de alguien en abstinencia o bajo estrés extremo.**

### Por qué esta estética funciona para ISN'T BEHIND
1. **Unifica todo**: Si CADA elemento visual (fondo, objetos, personajes, menús) pasa por el mismo pipeline, desaparece la disonancia entre "render 3D" y "foto procesada" y "pixel art". Todo se convierte en el mismo lenguaje.
2. **Deshumaniza**: La posterización elimina los matices faciales. Las personas se convierten en formas. Conecta directamente con el tema central.
3. **Oprime**: La paleta restringida (negro + azul oscuro + azul) genera claustrofobia cromática. No hay colores cálidos, no hay escape.
4. **Es diegética**: Puede justificarse como "así es como el protagonista ve el mundo" — su PTSD y la abstinencia de las medicinas del C.S.T. filtran su percepción.
5. **Es económica**: Un render 3D procesado con este pipeline se ve MEJOR que sin procesar, y es más barato que producir arte pintado a mano.

---

## 2. IMÁGENES DE REFERENCIA Y ANÁLISIS

### Referencia 1 (Prioridad MÁXIMA — la más cercana al objetivo)

La imagen muestra una persona sentada en el suelo contra una pared. Procesada con posterización agresiva: 3 niveles tonales (negro puro / rojo oscuro-marrón / rojo saturado brillante). Los bordes son duros. La silueta es perfectamente legible. Los objetos (botella, manos, escalera del fondo) se reconocen a pesar de la reducción tonal.

**Qué aprender de esta referencia:**
- **Nivel de posterización:** Agresivo (3 niveles). Es el nivel que queremos para el gameplay.
- **Contraste:** Extremo. Negro puro ocupa ~40-50% de la imagen. El color saturado (rojo→azul) ocupa ~30%. El tono medio oscuro ocupa ~20%.
- **Siluetas:** Perfectamente legibles. La persona, la botella, el marco de la puerta/ventana — todo se identifica por FORMA, no por detalle.
- **Grano:** Presente pero sutil. No domina la imagen.

### Referencia 2 (Prioridad ALTA)

La imagen muestra una persona con pelo largo, manos visibles, en un entorno oscuro. Mayor cantidad de GRANO/RUIDO analógico. El tono medio (púrpura-marrón) domina más que en la Referencia 1. Las formas son más difusas — los bordes se pierden parcialmente en el ruido.

**Qué aprender de esta referencia:**
- **Nivel de grano:** Alto. Este es el nivel para momentos de ESTRÉS o ABSTINENCIA en el juego — cuando la percepción del protagonista se degrada.
- **Legibilidad:** Menor. Esto es DELIBERADO para estados de estrés — pero NO es el estado base del gameplay.
- **Uso en el juego:** Overlay de ruido progresivo que AUMENTA con el nivel de estrés/abstinencia del protagonista. A mayor estrés → más grano → menos legibilidad → más horror.

### Diferencia clave entre ambas (el GRADIENTE de estrés)

| Aspecto | Ref. 1 (Estado Normal) | Ref. 2 (Estado Estrés) |
|---|---|---|
| Posterización | 3 niveles limpios | 3 niveles con bordes difusos |
| Grano | Sutil, fino | Pesado, grueso, dominante |
| Legibilidad | Alta — objetos claros | Baja — formas se pierden |
| Contraste | Duro y cortante | Suavizado por el ruido |
| Uso en juego | **Estado base del gameplay** | **Alucinaciones / abstinencia** |

---

## 3. PALETA DE COLOR CANÓNICA

### Paleta Principal (Tritono)

| Nivel Tonal | Nombre | Hex | Uso |
|---|---|---|---|
| **SOMBRAS** | Negro Absoluto | `#000000` | Sombras, bordes, siluetas negativas, fondo profundo |
| **MEDIOS** | Azul Petróleo Oscuro | `#1A2A3A` | Tonos medios, volumen, atmósfera, transiciones |
| **LUCES** | Azul C.S.T. | `#2E86C1` | Highlights, objetos iluminados, elementos interactivos, branding CST |

### Variaciones Tonales Permitidas (para legibilidad)

| Variación | Hex | Uso Específico |
|---|---|---|
| Azul acero claro | `#3498DB` | Texto legible sobre fondos oscuros, botones activos |
| Azul desaturado | `#1B4F72` | Textura de hormigón brutalista, elementos de fondo |
| Negro-azulado | `#0A1520` | Alternativa al negro puro para suavizar contraste en menús |
| Blanco tenue (EXCEPCIONAL) | `#B0C4DE` | SOLO para texto crítico de gameplay que DEBE leerse (precios, cantidades) |

### Color Prohibido
- ❌ **ROJO** en ninguna variación. El rojo del branding C.S.T. ha sido reemplazado por azul.
- ❌ **Colores cálidos** (amarillo, naranja, verde cálido). No existen en este mundo.
- ⚠️ **Verde CRT** (`#00FF66`) — SOLO dentro de las pantallas de terminal/PC. Nunca en el mundo físico.

### Paleta Secundaria (Solo para UI de Terminal CRT)

| Nivel | Hex | Uso |
|---|---|---|
| Negro de fondo CRT | `#0A0A0A` | Fondo de pantallas de terminal |
| Verde fósforo | `#00FF66` | Texto de terminal, datos del C.S.T. |
| Verde oscuro | `#005522` | Grano de scanline dentro del CRT |

---

## 4. PIPELINE TÉCNICO: CÓMO LOGRAR EL EFECTO

### 4.1. Pipeline de Pre-Procesado (para sprites/assets estáticos)

Los sprites se procesan ANTES de integrarlos al juego. Este es el flujo en cualquier editor de imagen (Photoshop, GIMP, Photopea):

```
PASO 1: IMAGEN ORIGINAL (render 3D o fotografía)
    │
    ▼
PASO 2: DESATURAR
    │  Convertir a escala de grises.
    │  (Image → Desaturate / Channel Mixer → Monochrome)
    │
    ▼
PASO 3: AJUSTAR NIVELES / CURVAS
    │  Aumentar contraste para separar bien las 3 zonas tonales.
    │  - Aplastar sombras (todo lo oscuro → negro puro)
    │  - Empujar medios ligeramente hacia las sombras
    │  - Mantener highlights separados
    │  
    │  Valores sugeridos (Levels):
    │  Input: Negro=40, Gamma=0.65, Blanco=200
    │
    ▼
PASO 4: POSTERIZAR
    │  Reducir a 3 niveles tonales.
    │  (Image → Posterize → Levels: 3)
    │  
    │  RESULTADO: Imagen en 3 grises (negro, gris medio, gris claro)
    │
    ▼
PASO 5: MAPEAR COLORES (Gradient Map / Color Lookup)
    │  Crear un Gradient Map con 3 paradas:
    │  - Posición 0% (sombras): #000000 (Negro Absoluto)
    │  - Posición 50% (medios): #1A2A3A (Azul Petróleo Oscuro)
    │  - Posición 100% (luces): #2E86C1 (Azul C.S.T.)
    │
    ▼
PASO 6: AÑADIR GRANO (OPCIONAL — depende de la capa)
    │  Añadir capa de ruido monocromático.
    │  (Filter → Noise → Add Noise → Monochromatic, 5-15%)
    │  O usar overlay de textura de papel/fotocopia.
    │  
    │  NIVEL BASE (gameplay normal): 5-8% de ruido
    │  NIVEL ESTRÉS (se aplica en runtime): 15-30% de ruido
    │
    ▼
PASO 7: EXPORTAR como .webp con transparencia (para sprites)
         o .webp sin transparencia (para fondos)
```

### 4.2. Pipeline de Runtime (para efectos dinámicos en React Native)

Efectos que se aplican EN TIEMPO REAL durante el gameplay para responder al estado del protagonista:

**Capa de Filtro Global (ya existe como overlay en ShiftScreen):**
```
Overlay de color con BlendMode:
- Estado normal: backgroundColor: '#1A2A3A', opacity: 0.15
- Estado estrés leve: opacity sube a 0.25 + grano leve (imagen de ruido como overlay)
- Estado abstinencia: opacity sube a 0.40 + grano pesado + screen shake
```

**Implementación del grano dinámico:**
- Pre-renderizar 3-4 texturas de ruido (512×512px) a diferentes densidades.
- Mostrarlas como `<Image>` overlay en el z-index más alto.
- Animar la opacidad según el nivel de estrés del protagonista.
- Alternar entre las texturas cada X segundos para simular ruido vivo.

### 4.3. Automatización con Scripts

Para procesar múltiples sprites de forma consistente, se puede crear un script de ImageMagick:

```bash
# Procesar un sprite al estilo posterizado duotono
magick input.webp \
  -colorspace Gray \
  -level 20%,80% \
  -posterize 3 \
  -fill "#2E86C1" -opaque white \
  -fill "#1A2A3A" -opaque "#808080" \
  +noise Gaussian \
  output.webp
```

O un Action de Photoshop / script de GIMP que aplique los 7 pasos a lote.

---

## 5. REGLAS POR CAPA VISUAL

### 5.1. Fondo de la Tienda (game_background)

| Regla | Detalle |
|---|---|
| **Base** | Render 3D del interior brutalista (hormigón, estanterías metálicas, fluorescentes) |
| **Procesado** | Pipeline completo (posterizar a 3 niveles + mapeo de color azul + grano sutil 5%) |
| **Posterización** | AGRESIVA (3 niveles). Las paredes de hormigón se convierten en masas planas de azul oscuro con bordes negros. |
| **Grano** | Bajo (5-8%). El fondo no debe competir con los objetos interactivos. |
| **Contraste** | El fondo debe ser MÁS OSCURO que los objetos en primer plano. Predomina el negro y el azul petróleo. El azul saturado CST aparece solo en reflejos de la luz. |

### 5.2. Objetos Interactivos (mesa, cajones, PC, caja registradora, etc.)

| Regla | Detalle |
|---|---|
| **Base** | Render 3D individual del objeto |
| **Procesado** | Pipeline completo PERO con posterización ligeramente menos agresiva (3-4 niveles) para mantener legibilidad |
| **Posterización** | 3-4 niveles. Los objetos interactivos necesitan un PELO más de detalle que el fondo para destacar. |
| **Contraste** | Los objetos interactivos deben tener MÁS presencia del azul CST saturado que el fondo. El ojo debe distinguirlos. |
| **Silueta** | CRÍTICO: cada objeto debe tener una silueta reconocible AL INSTANTE. Si al posterizar se pierde la forma → el render base necesita más contraste en los bordes. |
| **Grano** | Igual al fondo (5-8%). Los objetos viven en el mismo espacio que el fondo. |

### 5.3. Personajes / Clientes

| Regla | Detalle |
|---|---|
| **Base** | Foto real o render hiperrealista de busto/torso humano |
| **Procesado** | Pipeline completo con posterización AGRESIVA (2-3 niveles). Los personajes se ven MÁS procesados que los objetos. |
| **Justificación** | El protagonista deshumaniza. Los clientes son siluetas, no personas. La posterización agresiva elimina rasgos faciales individuales. |
| **Color** | Los personajes usan SOLO azul petróleo oscuro + negro. NO reciben el azul CST saturado (no son "iluminados" por el sistema). |
| **Grano** | Mayor que los objetos (10-15%). Los humanos se ven MÁS degradados que las cosas. Las cosas importan más que las personas en este mundo. |
| **Sombra arrojada** | OBLIGATORIO: sombra oscura debajo/detrás del personaje para anclarlo al espacio. |

### 5.4. Menús e Interfaces Meta-Juego

| Regla | Detalle |
|---|---|
| **Concepto** | Los menús son SUPERFICIES DIEGÉTICAS procesadas con el mismo pipeline. |
| **Menú principal** | Cortina metálica de la tienda cerrada (render brutalista posterizado) con opciones escritas como grafiti, cartel pegado, o placa industrial. |
| **Settings** | Panel trasero de un equipo electrónico viejo, o la pared de la trastienda con controles de radio analógica. Todo posterizado. |
| **Pre-juego (DailyIntro)** | Terminal CRT — se mantiene la estética verde fósforo sobre negro. El CRT es un OBJETO DENTRO del mundo, así que usa su propia paleta (verde CRT). |
| **Post-juego (Fin de Turno)** | Formulario del CST sobre papel industrial amarillento→azulado. Posterizado pero con tipografía legible. Marcas de sello, café, dobleces. |

### 5.5. Documentos del Juego (órdenes de compra, IDs, etc.)

| Regla | Detalle |
|---|---|
| **Base** | Generados programáticamente con tipografía + layout. |
| **Procesado** | Overlay de textura de papel viejo/fotocopia + grano. Los datos (nombre, fecha, precio) se renderizan con tipografía clara sobre fondo texturizado. |
| **Legibilidad** | Los documentos son la EXCEPCIÓN a la posterización agresiva. El jugador DEBE poder leer los campos. Se aplica grano y textura pero no posterización de texto. |
| **Color** | Fondo del documento: azul petróleo muy oscuro (#0F1A24). Texto: azul claro/blanco tenue. Sellos del CST: azul saturado. |

---

## 6. RECONOCIBILIDAD DE OBJETOS: LA REGLA DE SILUETA

### El Problema
La posterización destruye detalle interno. ¿Cómo se reconoce un objeto si pierde sus matices?

### La Solución: La Regla de Silueta

> **Si un objeto no se reconoce por su SILUETA SOLA (sin color, sin detalle, solo contorno negro), entonces el render base necesita rediseñarse.**

### Checklist de Silueta (aplicar a cada objeto antes de procesar)

1. ¿El contorno del objeto es ÚNICO y distinguible?
   - ✅ Una botella tiene una silueta inconfundible.
   - ❌ Una caja cuadrada sin rasgos NO tiene silueta distinguible → necesita un detalle (manija, etiqueta, ángulo).
2. ¿El objeto tiene CONTRASTE INTERNO suficiente para sobrevivir 3 niveles de posterización?
   - ✅ Un teclado con teclas separadas mantiene textura incluso posterizado.
   - ❌ Una superficie lisa uniforme se convierte en un bloque plano → necesita textura o variación de luz.
3. ¿El tamaño del objeto en pantalla permite reconocerlo posterizado?
   - ✅ Objetos grandes (mesa, reja, PC) toleran posterización agresiva.
   - ⚠️ Objetos pequeños (sellos, botones) necesitan posterización más suave o estar en el nivel de color más brillante (azul CST) para destacar.

### Estrategias para Mantener Legibilidad

| Estrategia | Cuándo Usarla |
|---|---|
| **Contraste de silueta** | SIEMPRE. El borde del objeto contra el fondo debe ser nítido. |
| **Separación de nivel tonal** | Objetos interactivos en azul CST saturado, fondo en negro/azul petróleo. |
| **Outline sutil** | Para objetos pequeños críticos: un borde de 1-2px en azul claro que delimite la forma. No es un outline cartoon — es un borde de antialiasing luminoso. |
| **Animación de estado** | Al tocar/hover sobre un objeto interactivo, un leve brillo o pulso de opacidad indica interactividad. |
| **Iconografía simplificada** | Si un objeto posterizado pierde identidad, considerar simplificar la geometría 3D del render. Menos detalle interno = silueta más clara. |

---

## 7. TIPOGRAFÍA Y TEXTO EN EL EFECTO

### Texto Diegético (dentro del mundo del juego)
- **Fuente:** `SpecialElite` (máquina de escribir) para documentos, `CourierPrime` para formularios oficiales del CST.
- **Color:** Azul claro (`#B0C4DE`) sobre fondos oscuros. NUNCA posterizar el texto.
- **Efecto:** Overlay de grano DEBAJO del texto, nunca encima. El texto siempre es legible.

### Texto de UI (botones, etiquetas, HUD)
- **Fuente:** `Inconsolata` o `SyneMono` para datos numéricos (precios, reloj).
- **Color:** Azul CST saturado (`#2E86C1`) para interactivos, azul claro para información pasiva.
- **Regla:** El texto de UI NO recibe grano ni posterización. Es la capa más limpia.

### Texto de Terminal CRT
- **Fuente:** `Inconsolata` monoespaciada.
- **Color:** Verde fósforo (`#00FF66`) sobre negro.
- **Efecto:** Scanlines horizontales (alternancia de líneas oscuras), leve flicker de opacidad, glow suave alrededor del texto.

---

## 8. FILTROS Y POST-PROCESADO EN RUNTIME

### 8.1. Estado Base (Estrés Bajo)

```
Overlay de color: #1A2A3A al 15% de opacidad
Grano: Textura de ruido al 5% de opacidad
Viñeta: Esquinas oscurecidas con gradiente radial (center=transparente, edges=#000 al 30%)
```

### 8.2. Estado Estrés Medio

```
Overlay de color: #1A2A3A al 25% de opacidad
Grano: Textura de ruido al 15% de opacidad
Viñeta: edges=#000 al 50%
Efectos adicionales: Parpadeo sutil de la luz (opacidad del fondo oscila ±5% cada 3-8 segundos)
```

### 8.3. Estado Abstinencia / Estrés Crítico

```
Overlay de color: #1A2A3A al 40% de opacidad
Grano: Textura de ruido grueso al 25-35% de opacidad (imagen de ruido diferente, más agresiva)
Viñeta: edges=#000 al 70%
Efectos adicionales:
  - Screen shake leve (translación random ±2px)
  - Texto de documentos se scramble parcialmente
  - Scanlines globales (como si toda la pantalla fuera un CRT roto)
  - Sonido de acúfeno / zumbido eléctrico (audio, no visual)
```

### 8.4. Implementación en React Native

La capa de efectos se apila sobre el contenido del juego como `<View>` con `pointerEvents="none"`:

```
Z-INDEX STACK:
  70: Overlay de grano (Image con opacity dinámica)
  69: Overlay de color (View con backgroundColor y opacity)
  68: Viñeta (Image/gradient con opacity dinámica)
  67: Scanlines (Image con líneas horizontales, solo en estrés alto)
  ---
  60-0: Contenido del juego (objetos, fondo, personajes)
```

---

## 9. CASOS ESPECÍFICOS

### 9.1. Menú Principal → Propuesta

**Concepto:** La cortina metálica de la tienda CERRADA, vista desde afuera.
- Sprite base: Render 3D de una cortina metálica brutalista con el logo del CST.
- Procesado con pipeline completo (posterización + duotono azul).
- Opciones del menú como elementos sobre la cortina:
  - Un cartel pegado con "STORY" (como un poster arrancado a medio pegar).
  - "SETTINGS" como una placa industrial atornillada.
  - "EXIT" como texto grafiteado con spray.
- El sello CST azul gira lentamente en un rincón.

### 9.2. Cómo Procesar los Sprites EXISTENTES

Los 14 sprites actuales en `src/assets/sprites/` pueden adaptarse a la nueva estética:

| Sprite Actual | Acción |
|---|---|
| `game_background.webp` | **RE-RENDERIZAR** el fondo con materiales brutalistas (hormigón en vez de madera), luego procesar con pipeline |
| `desk_workstation.webp` | Procesar con pipeline. Si la silueta se mantiene clara, puede servir. |
| `desk_under_drawer1/2.webp` | Procesar con pipeline. Probar legibilidad del tirador/manija. |
| `desk_under_workstation.webp` | Procesar con pipeline. |
| `protection_grille.webp` | Procesar. La reja tiene excelente contraste natural — sobrevivirá bien. |
| `pc_station.webp` | Procesar con pipeline (4 niveles para mantener detalle del monitor). |
| `roll-up_door_body/head.webp` | Procesar con pipeline. Añadir desgaste (ralladuras) antes de posterizar. |
| `character_client_1.webp` | **RE-PROCESAR** completamente con el pipeline de personajes (2-3 niveles, más grano, sin azul saturado). |
| `inventory_box.webp` | **REEMPLAZAR** — el patrón pixelado actual es incompatible. Nuevo render brutalista de caja metálica. |
| `sello-cst.png` / `sello-cst-2.png` | **RE-COLOREAR** de rojo a azul CST. Luego procesar. |
| `missing_texture.webp` | Reemplazar con sprite real cuando exista. |

---

## 10. LO QUE ESTÁ PROHIBIDO

1. ❌ **Sprites fotorrealistas sin procesar.** Ningún render 3D entra al juego sin pasar por el pipeline de posterización + duotono.
2. ❌ **Pixel art / patrones 8-bit.** No coexisten con esta estética.
3. ❌ **Color rojo.** El CST es azul. Todo lo que era rojo es ahora azul.
4. ❌ **Colores cálidos** (amarillo, naranja, verde cálido). No existen en Portwall.
5. ❌ **Menús flat/dark-mode genéricos.** Los menús son superficies diegéticas del mundo del juego.
6. ❌ **Posterizar el texto.** El texto de gameplay debe ser SIEMPRE legible. El grano va debajo, nunca encima.
7. ❌ **Entidades sobrenaturales.** Todo horror es PTSD + abstinencia. No hay monstruos.
8. ❌ **Más de 4 niveles de posterización** para cualquier sprite. Si necesitas 5+, la imagen base necesita más contraste.
9. ❌ **Grano UNIFORME en toda la pantalla al mismo nivel.** El grano es DINÁMICO: responde al estado de estrés del protagonista.

---

> **NOTA FINAL:** Este documento debe actualizarse cada vez que se tome una decisión visual nueva. Todo sprite producido debe validarse contra las reglas aquí documentadas antes de integrarse al código.
