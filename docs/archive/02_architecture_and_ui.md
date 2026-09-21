# 🎨 GUÍA DE ARQUITECTURA VISUAL Y UI (Para el Director de Arte)
**Proyecto:** ISN'T BEHIND (Simulador de Gestión & Thriller Psicológico 2D)  
**Target:** React Native 0.85+ / Expo SDK 56+  
**Última Actualización:** 2026-08-18  

---

## 1. ESTRUCTURA EXACTA DE LAYOUTS FLEXBOX Y RESPONSIVIDAD

El proyecto opera bajo un sistema de diseño matemáticamente responsivo gestionado en [`src/utils/responsive.ts`](file:///src/utils/responsive.ts). El sistema toma como base un viewport de $390 \times 844\text{ px}$ y aplica un factor de escala amortiguado y limitado entre $0.8$ y $1.4$ para asegurar proporciones perfectas en cualquier dispositivo móvil o tablet.

### A. Pantalla de Menú Principal (`MainMenuScreen.tsx`)
Utiliza un layout horizontal dividido en 2 columnas:
- **Columna Izquierda (`leftColumn`, `flex: 0.35`):**
  - Contiene el logo circular giratorio (`LogoSvg.tsx`) centrado verticalmente y desfasado hacia el borde izquierdo para generar un recorte artístico.
- **Columna Derecha (`rightColumn`, `flex: 0.65`):**
  - **Sección Superior (`titleSection`, `flex: 2.1`):** Ancla el título vectorial (`TitleSvg.tsx`) hacia abajo, cerca del menú.
  - **Sección Central (`menuSection`, `flex: 1.2`):** Centra los botones de acción (`[ STORY ]`, `[ SETTINGS ]`, `[ EXIT ]`) rodeados de líneas punteadas.
  - **Sección Inferior (`footerSection`, `flex: 1.0`):** Ancla los créditos hacia arriba.

### B. Pantalla de Mesa de Trabajo / Turno (`ShiftScreen.tsx` / `GameInterface`)

Sistema de **Vertical Lock con coordenadas absolutas derivadas de Figma**. NO usa Flexbox; todos los sprites se posicionan con `position: absolute` usando la fórmula:

```
scale      = windowHeight / 1456
left       = (figma_left  - 619) * scale
top        = (figma_top   - 748) * scale
width      = figma_width         * scale
height     = figma_height        * scale
```

El canvas base de referencia es **646 × 1456 px** (OFFSET_X=619, OFFSET_Y=748 en el Figma cerrado).

```text
+------------------------------------------------------------+
| 🔴 ZONA ROJA     (10.71%) Y:    0 →  156 px base Figma    |
|  Techo, persiana enrollada (roll-up-door)                  |
+============================================================+
| 🟡 ZONA AMARILLA (32.83%) Y:  156 →  634 px base Figma    |
|  Pared de fondo, reja, cliente (NPC-1), teléfono           |
+------------------------------------------------------------+
| 🩵 ZONA CELESTE  (22.12%) Y:  634 →  956 px base Figma    |
|  Mesa, carrusel, PC, lampara-cabeza, objetos               |
+------------------------------------------------------------+
| 🔵 ZONA AZUL OSC (34.34%) Y:  956 → 1456 px base Figma    |
|  Sub-mesa, cajones, caja registradora, caja cartón, suelo  |
+------------------------------------------------------------+
```

> [!NOTE]
> Los Color Boxes son **guías de referencia visual** (toggle `SHOW_REFERENCE_COLOR_BOXES`), NO contenedores físicos. Los sprites pueden salir de su zona (`overflow: 'visible'` en `stageContainer`).

**Interacciones implementadas (8 sistemas):**
- `roll-up-door` — PanResponder vertical, snap arriba/abajo
- `lampara-cabeza` — PanResponder arrastre libre (±80px H, ±60px V), swipe derecha resetea
- `pc` — Tap abre overlay Monitor con zoom+dim
- `carrusel-mesa` — Tap enfoca cámara (zoom 1.28×); flechas ❮❯ navegan ítems
- `cajon-1` / `cajon-2` — Tap abre/cierra; flechas ❮❯ navegan ítems del cajón
- `caja-carton` — Tap abre submenu
- `apuntar` — Overlay supremo (zIndex 999), bloquea toda la pantalla
- `caja-registradora` — Overlay slide-desde-abajo con zoom+dim; abre al pulsar COBRAR

---


## 2. UBICACIÓN DE ASSETS, SPRITES Y COMPONENTES VECTORIALES (SVG)

| Tipo de Recurso | Archivo / Directorio en el Proyecto | Descripción y Uso |
|---|---|---|
| **Componente SVG Título** | [`src/components/menu/TitleSvg.tsx`](file:///src/components/menu/TitleSvg.tsx) | Trazo vectorial del logo/título "ISN'T BEHIND" (`viewBox="0 0 240 158"`). |
| **Componente SVG/Sprite Logo** | [`src/components/menu/LogoSvg.tsx`](file:///src/components/menu/LogoSvg.tsx) | Componente animado que rota el sello a 360° en un bucle continuo de 40s. |
| **Sprite Sello CST (Alta Res)** | `src/assets/sprites/sello-cst-2.png` | Arte circular del sello corporativo utilizado por `LogoSvg`. |
| **Sprite Sello CST (Original)** | `src/assets/sprites/sello-cst.png` | Arte original del sello burocrático para documentos. |
| **Sprites / Mocks Futuros** | `src/assets/sprites/` | Directorio reservado para sprites de visitantes, radio AM y documentos. |
| **Efectos de Audio** | `src/assets/sounds/` | Directorio reservado para SFX de sellado, ambiente y estática. |

---

## 3. PALETA DE COLORES INSTITUCIONAL (HEXADECIMAL)

Centralizada en [`src/theme/colors.ts`](file:///src/theme/colors.ts):

| Token | Código Hexadecimal | Propósito / Área de Aplicación |
|---|---|---|
| `background` | `#060606` | Fondo negro profundo de terminal para todas las pantallas. |
| `surfaceDark` | `#0d0d0d` | Fondo del mostrador superior (40%). |
| `surfaceCard` | `#141414` | Superficie de documentos, cajas de mock y botones de menú. |
| `surfaceHighlight` | `#1f1f1f` | Hover / Estado activo de componentes táctiles. |
| `crtGreen` | `#00ff66` | Fósforo verde de terminal CRT, texto activo de radio y sello de aprobación. |
| `crtGreenDim` | `rgba(0, 255, 102, 0.6)` | Subtextos CRT y detalles tenues de radio. |
| `crtGreenGlow` | `rgba(0, 255, 102, 0.15)` | Fondos translúcidos de botones CRT. |
| `stampRed` | `#641111` | Rojo oscuro corporativo CST para sellos y separadores burocráticos. |
| `stampRedBright` | `#8a0303` | Rojo brillante para botón de rechazo, abandonos y strikes de infracción. |
| `textPrimary` | `#ffffff` | Texto blanco puro para números grandes de día y títulos de alta prioridad. |
| `textSecondary` | `#d4d4d4` | Texto gris claro para botones principales (`[ STORY ]`, etc.). |
| `textMuted` | `#888888` | Texto secundario y descripciones de documentos. |
| `textSubtle` | `#555555` | Textos de créditos, cabeceras burocráticas y etiquetas menores. |
| `borderDark` | `#222222` | Bordes discretos de contenedores y cards. |
| `borderMedium` | `#444444` | Líneas punteadas y bordes de botones. |
| `mockGraybox` | `#2a2a2a` | Cajas grises para placeholders mientras se finaliza el arte. |

---

## 4. FUENTES TIPOGRÁFICAS IMPORTADAS

Cargadas de manera asíncrona y unificada en [`src/components/core/FontProvider.tsx`](file:///src/components/core/FontProvider.tsx):

1. **`Inconsolata-Light` (`@expo-google-fonts/inconsolata` - `Inconsolata_300Light`):**
   - Fuente principal de terminal CRT, menús, textos de transmisión de radio y formularios burocráticos.
2. **`Syne-Mono` (`@expo-google-fonts/syne-mono` - `SyneMono_400Regular`):**
   - Tipografía mecánica para el número de día grande (`[ DÍA 1 ]`), sellos corporativos y encabezados de alta jerarquía.
3. **`Cutive-Mono` (`@expo-google-fonts/cutive-mono` - `CutiveMono_400Regular`):**
   - Tipografía de máquina de escribir reservada para contenido mecanografiado en los documentos de los visitantes.
