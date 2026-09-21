# 03 — SISTEMA UI Y ESTÉTICA: ISN'T BEHIND
> **Pilar 3 de 4.** Fuente de verdad para coordenadas Figma, sistema de posicionamiento, paleta de color, tipografía, pipeline de sprites y estética visual completa.

---

## 1. SISTEMA DE COORDENADAS Y POSICIONAMIENTO

### 1.1 La Regla Fundamental
**Los sprites NO usan Flexbox.** Todos los elementos del escenario se posicionan con `position: absolute` usando coordenadas derivadas directamente de Figma.

### 1.2 Canvas de Referencia

| Parámetro | Valor |
|---|---|
| **Canvas Figma total** | 1926 × 2204 px (estado cerrado) |
| **Viewport del juego** | 646 × 1456 px |
| **OFFSET_X** (estado cerrado) | 619 |
| **OFFSET_Y** (estado cerrado) | 748 |
| **OFFSET_X** (estado abierto) | 619 |
| **OFFSET_Y** (estado abierto) | 270 |

### 1.3 Fórmula de Conversión (OBLIGATORIA)

```typescript
const scale       = windowHeight / 1456;   // Factor de escala único
const stageWidth  = Math.round(646 * scale);
const stageHeight = windowHeight;

// Para cada elemento:
const left   = Math.round((figma_left  - OFFSET_X) * scale);
const top    = Math.round((figma_top   - OFFSET_Y) * scale);
const width  = Math.round(figma_width  * scale);
const height = Math.round(figma_height * scale);
```

Todos los sprites usan `resizeMode: 'stretch'` para respetar exactamente el bounding box de Figma.

### 1.4 Reglas de `overflow`

```typescript
// stageContainer SIEMPRE con overflow visible:
stageContainer: {
  overflow: 'visible',   // ← OBLIGATORIO. Nunca 'hidden'.
}
```

Los sprites pueden salir de su zona Color Box. **Nunca se cortan.**

---

## 2. LAS 4 ZONAS COLOR BOX

Los Color Boxes son **guías de referencia visual** — no contenedores físicos. Sirven para entender la distribución de la escena. Toggle `SHOW_REFERENCE_COLOR_BOXES` en `ShiftScreen.tsx` los muestra/oculta.

| Zona | Color | Altura Figma | % Pantalla | Rango Y (px Figma) | Contenido principal |
|---|---|---|---|---|---|
| **A** | 🔴 Rojo | 156 px | 10.71% | 0 → 156 | Techo, persiana (roll-up-door) |
| **B** | 🟡 Amarillo | 478 px | 32.83% | 156 → 634 | Pared de fondo, reja, cliente (NPC-1), teléfono |
| **C** | 🩵 Celeste | 322 px | 22.12% | 634 → 956 | Mesa, carrusel, PC (pc_station), lámpara |
| **D** | 🔵 Azul Oscuro | 500 px | 34.34% | 956 → 1456 | Sub-mesa, cajones, caja registradora, caja cartón, suelo |

```
Y=0    ┌────────────────────────────┐
       │  🔴 ROJO   (156px / 10.71%)│  Persiana, techo
Y=156  ├────────────────────────────┤
       │  🟡 AMARILLO (478px/32.83%)│  Pared, cliente, reja
Y=634  ├────────────────────────────┤
       │  🩵 CELESTE (322px/22.12%) │  Mesa, PC, carrusel
Y=956  ├────────────────────────────┤
       │  🔵 AZUL OSC (500px/34.34%)│  Sub-mesa, cajones
Y=1456 └────────────────────────────┘
```

---

## 3. COORDENADAS FIGMA DE LOS OVERLAYS (Estado Abierto, OFFSET_Y=270)

| Overlay | x (desde left) | y (desde top) | width | height | Trigger |
|---|---|---|---|---|---|
| `monitor-1` | 48 | 309 | 551 | 665 | Tap en sprite `pc` |
| `registradora-arriba` | 54 | 360 | 540 | 917 | Botón `[COBRAR]` / robo |
| `apuntar` | 234 | 506 | 594 | 950 | Acción de apuntar |

---

## 4. MATRIZ DE Z-INDEX

| Rango | Capa | Contenido |
|---|---|---|
| `1–50` | **Mundo / Escena** | Sprites del escenario (fondo, mesa, objetos) |
| `51–100` | **Elementos interactivos** | Sprites con PanResponder o TouchableOpacity (persiana, lámpara, PC, cajones) |
| `500–699` | **Camera overlay** | Zoom y paneo de cámara |
| `700` | **Dim overlay** | Oscurecimiento de fondo cuando hay overlay activo |
| `750–800` | **Overlays de pantalla** | Monitor (PC), Caja Registradora |
| `900` | **Referencia Color Boxes** | Solo en modo desarrollo (`SHOW_REFERENCE_COLOR_BOXES`) |
| `950` | **Filtro atmosférico** | Overlay de color `ENABLE_SCREEN_FILTER` |
| `990–999` | **Supremo: Apuntar** | Overlay del revólver. Bloquea absolutamente todo. |

---

## 5. RESTRICCIONES DE INTERACCIÓN (BLOQUEOS)

| Estado activo | Qué bloquea |
|---|---|
| `isAiming = true` | Todo excepto `[GUARDAR]` y `[DISPARAR]` |
| `monitorOpen = true` | Todo excepto tap fuera del overlay del monitor |
| `cajaOpen = true` | Todo excepto botones internos de la caja y tap fuera |
| `carouselFocused = true` | Inspección táctil (Zona B); sí puede abrir `cajaOpen` |

---

## 6. ESTÉTICA: DUOTONO POSTERIZADO CON GRANO ANALÓGICO

### 6.1 Nombre técnico
**Duotono Posterizado con Grano Analógico** *(Posterized Duotone with Analog Grain)*

También conocido como: High-contrast duotone, Xerographic art, Stencil art photography, Aesthetic blackout (comunidades DSBM/post-punk).

### 6.2 Definición visual
Tomar imágenes fotorrealistas y **destruir su información tonal de forma controlada**, reduciéndolas a 2–3 niveles tonales mapeados a la paleta restringida:
- Las sombras colapsan a **NEGRO PURO** (sin detalle).
- Los tonos medios se mapean a **Azul Petróleo Oscuro** (`#1A2A3A`).
- Los highlights se mapean al **Azul C.S.T.** (`#2E86C1`).
- Se añade **grano analógico** (ruido monocromático) que simula degradación de señal o fotocopia.

**El efecto evoca:** Vigilancia CCTV degradada, fotocopias de documentos clasificados, propaganda subversiva, la visión de alguien en abstinencia o bajo estrés extremo.

### 6.3 Por qué esta estética funciona
1. **Unifica todo:** Cualquier elemento visual pasa por el mismo pipeline. Sin disonancia entre renders.
2. **Deshumaniza:** La posterización elimina matices faciales. Las personas se convierten en formas.
3. **Oprime:** La paleta restringida (negro + azul oscuro + azul) genera claustrofobia cromática. No hay colores cálidos.
4. **Es diegética:** Justificable como "así es como el protagonista ve el mundo" — PTSD + abstinencia filtran su percepción.

---

## 7. PALETA DE COLOR CANÓNICA

### 7.1 Paleta Principal (Tritono)

| Nivel Tonal | Nombre | Hex | Uso |
|---|---|---|---|
| **SOMBRAS** | Negro Absoluto | `#000000` | Sombras, bordes, siluetas negativas, fondo profundo |
| **MEDIOS** | Azul Petróleo Oscuro | `#1A2A3A` | Tonos medios, volumen, atmósfera |
| **LUCES** | Azul C.S.T. | `#2E86C1` | Highlights, objetos iluminados, elementos interactivos, branding CST |

### 7.2 Variaciones Permitidas

| Variación | Hex | Uso |
|---|---|---|
| Azul acero claro | `#3498DB` | Texto legible sobre fondos oscuros, botones activos |
| Azul desaturado | `#1B4F72` | Textura de hormigón brutalista, elementos de fondo |
| Negro-azulado | `#0A1520` | Alternativa al negro puro en menús |
| Blanco tenue (EXCEPCIONAL) | `#B0C4DE` | SOLO para texto crítico que DEBE leerse (precios, cantidades) |

### 7.3 Paleta de Terminal CRT (solo dentro de pantallas de PC)

| Nivel | Hex | Uso |
|---|---|---|
| Negro de fondo CRT | `#0A0A0A` | Fondo de pantallas de terminal |
| Verde fósforo | `#00FF66` | Texto de terminal, datos del C.S.T. |
| Verde oscuro | `#005522` | Grano de scanline dentro del CRT |

### 7.4 Colores PROHIBIDOS
- ❌ **Rojo** en ninguna variación (el C.S.T. es AZUL).
- ❌ **Colores cálidos** (amarillo, naranja, verde cálido).
- ⚠️ **Verde CRT** (`#00FF66`) — SOLO dentro de pantallas de terminal. Nunca en el mundo físico.

---

## 8. PIPELINE DE SPRITES (Pre-Procesado)

Los sprites se procesan ANTES de integrarlos al juego:

```
PASO 1: IMAGEN ORIGINAL (render 3D o fotografía)
PASO 2: DESATURAR → Convertir a escala de grises
PASO 3: AJUSTAR NIVELES → Input: Negro=40, Gamma=0.65, Blanco=200
PASO 4: POSTERIZAR → 3 niveles (Image → Posterize → Levels: 3)
PASO 5: MAPEAR COLORES (Gradient Map)
  ├── PRESET A (fondos/atmósfera): pos 0%=#000000, pos 42%=#1A2A3A, pos 100%=#2E86C1
  └── PRESET B (objetos interactivos): pos 0%=#000000, pos 50%=#1A2A3A, pos 100%=#2E86C1
PASO 6: AÑADIR GRANO
  ├── PRESET A: 8-12% ruido monocromático
  └── PRESET B: 5-8% ruido monocromático
PASO 7: EXPORTAR como .webp con transparencia (sprites) o sin (fondos)
```

> **Regla rápida:** ¿Es fondo o ambiente? → Preset A. ¿El jugador lo toca? → Preset B.

### Distribución tonal por referencia

| Aspecto | Estado Base (Ref.3) | Objetos Interactivos (Ref.1) | Estrés/Abstinencia (Ref.2) |
|---|---|---|---|
| Negro dominante | ~60% | ~45% | ~70% |
| Azul C.S.T. visible | Acento ~10% | Iluminación ~35% | Mínimo ~5% |
| Grano | Medio-bajo | Sutil | Pesado |
| Legibilidad | Alta (entorno) | Alta (objeto) | Baja (horror) |
| Bordes | Duros | Muy duros | Difusos |

---

## 9. REGLAS POR CAPA VISUAL

### Fondo de la Tienda
- Render 3D del interior brutalista (hormigón, estanterías metálicas, fluorescentes).
- Pipeline completo: posterizar 3 niveles + duotono + grano 5–8%.
- El fondo debe ser MÁS OSCURO que los objetos interactivos.

### Objetos Interactivos
- Pipeline completo con posterización 3–4 niveles (un poco más de detalle que el fondo).
- MÁS presencia del azul C.S.T. que el fondo para que destaquen.
- **Regla de Silueta:** Si el objeto no se reconoce por su silueta sola (solo contorno negro), el render base necesita rediseñarse.

### Personajes / Clientes
- Pipeline AGRESIVO: 2–3 niveles de posterización.
- SOLO azul petróleo oscuro + negro. **Sin azul C.S.T. saturado** (no son "iluminados" por el sistema).
- Grano mayor: 10–15%. Los humanos se ven MÁS degradados que los objetos.
- Sombra arrojada debajo/detrás: OBLIGATORIA para anclarlos al espacio.

### Documentos del Juego
- Overlay de textura de papel viejo/fotocopia + grano.
- Los datos (nombre, fecha, precio) con tipografía clara sobre fondo texturizado.
- **Excepción a la posterización agresiva:** El texto DEBE poder leerse.
- Color: Fondo `#0F1A24`, Texto `#B0C4DE`, Sellos C.S.T. `#2E86C1`.

### Menús
- Son SUPERFICIES DIEGÉTICAS — no menús flat/dark-mode genéricos.
- **Menú principal:** Cortina metálica cerrada con opciones como cartel pegado, placa industrial, grafiti.
- **Settings:** Panel trasero de equipo electrónico viejo o pared de trastienda con controles de radio.

---

## 10. POST-PROCESADO EN RUNTIME

### Estado Base (estrés bajo)
```
Overlay: #1A2A3A al 15% opacidad
Grano: textura de ruido al 5%
Viñeta: radial center=transparente, edges=#000 al 30%
```

### Estado Estrés Medio
```
Overlay: #1A2A3A al 25% opacidad
Grano: al 15%
Viñeta: edges=#000 al 50%
Extra: parpadeo sutil de luz (opacidad oscila ±5% cada 3-8s)
```

### Estado Abstinencia / Crítico
```
Overlay: #1A2A3A al 40% opacidad
Grano: ruido grueso al 25-35%
Viñeta: edges=#000 al 70%
Extras: screen shake ±2px, text scramble en documentos,
        scanlines globales, zumbido de audio (acúfeno)
```

### Implementación en React Native (z-index del stack de efectos)
```
z: 70 — Overlay de grano (Image con opacity dinámica)
z: 69 — Overlay de color (View backgroundColor + opacity)
z: 68 — Viñeta (gradient con opacity dinámica)
z: 67 — Scanlines (solo en estrés alto)
z: 0–60 — Contenido del juego
```

---

## 11. TIPOGRAFÍA — SISTEMA Y2K / BRUTALISTA

Sistema de 10 familias tipográficas. Definidas en `src/theme/typography.ts` como la constante `TYPOGRAPHY`.

| Token | Familia Google Font | Propósito Diegético |
|---|---|---|
| `systemPC` | **Inconsolata** (Light 300) | Menús del sistema, interfaz de terminal CRT, consolas del C.S.T. |
| `stamps` | **Syne Mono** (Regular 400) | Sellos burocráticos del C.S.T., rótulo de Día `[ DÍA 1 ]`, logotipos. |
| `faxMain` | **Share Tech Mono** (Regular 400) | Texto principal de multas, sanciones y fichas del fax. |
| `faxSecondary` | **VT323** (Regular 400) | Números de serie, códigos de error matriciales. |
| `digitalMain` | **Chakra Petch** (Regular / Bold) | Pantallas digitales: CCTV, etiquetas de la Caja Registradora. |
| `digitalSecondary` | **Orbitron** (Regular / Bold) | Reloj in-game (12:00 PM–00:00 AM), importes numéricos. |
| `dirtyDoc` | **Special Elite** (Regular 400) | Cuaderno de notas, pasaportes desgastados, informes con tinta corrida. |
| `cleanDoc` | **Courier Prime** (Regular / Bold) | Contratos limpios, directivas del C.S.T., letra pequeña corporativa. |
| `handwriting` | **Caveat** (Regular / Bold) | Firmas de inspectores, notas personales a mano alzada. |
| `handwritingNumbers` | **Nanum Pen Script** (Regular 400) | Fechas adulteradas, tachaduras, números alterados en documentos. |

### Reglas tipográficas
- **Texto diegético:** `SpecialElite` o `CourierPrime`. Color `#B0C4DE` sobre fondos oscuros. Grano DEBAJO del texto, nunca encima.
- **UI de gameplay:** `Inconsolata` o `SyneMono`. Color `#2E86C1` para interactivos, `#B0C4DE` para información pasiva.
- **Terminal CRT:** `Inconsolata`. Color `#00FF66`. Scanlines horizontales + flicker.
- **Nunca** posterizar el texto. El texto de gameplay es siempre legible.

---

## 12. MODO INMERSIVO ESTRICTO

- **Navigation Bar de Android:** Oculta globalmente desde `FontProvider.tsx`:
  ```typescript
  await NavigationBar.setVisibilityAsync('hidden');
  ```
- **Status Bar:** `<StatusBar hidden={true} />` en todas las pantallas del juego.

---

## 13. PROHIBICIONES VISUALES ABSOLUTAS

1. ❌ Sprites fotorrealistas sin procesar — ningún render entra al juego sin pipeline de posterización.
2. ❌ Pixel art / patrones 8-bit — incompatibles con esta estética.
3. ❌ Color rojo como branding del C.S.T.
4. ❌ Colores cálidos (amarillo, naranja, verde cálido).
5. ❌ Menús flat/dark-mode genéricos — los menús son superficies diegéticas.
6. ❌ Posterizar el texto de gameplay — siempre debe ser legible.
7. ❌ Entidades sobrenaturales visuales — no hay monstruos, solo alucinaciones psicológicas.
8. ❌ Más de 4 niveles de posterización — si se necesitan más, el render base necesita más contraste.
9. ❌ Grano uniforme en toda la pantalla — el grano es DINÁMICO y responde al nivel de estrés.
10. ❌ `overflow: 'hidden'` en el contenedor del escenario — los sprites no se cortan.
