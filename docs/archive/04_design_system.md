# 📐 SISTEMA DE DISEÑO Y UI DIEGÉTICA: "ISN'T BEHIND"
## Especificación de Layout 40/60, Modo Inmersivo, Capas Absolutas, Colorboxing y Mapeo Tipográfico Y2K (Años 2000)

**Versión:** 1.2.0 (Mapeo Tipográfico Corporativo & Contexto Histórico Y2K)  
**Fecha de Aprobación:** 2026-08-18  
**Componente Principal:** [`src/screens/ShiftScreen.tsx`](file:///src/screens/ShiftScreen.tsx)  
**Módulos Asociados:** `src/theme/typography.ts`, `src/theme/colors.ts`, `src/utils/responsive.ts`, `src/components/core/FontProvider.tsx`  

---

## 1. CONTEXTO HISTÓRICO Y DIRECCIÓN DE ARTE TIPOGRÁFICA (AÑOS 2000 / Y2K)

El juego se ambienta en la transición burocrática e industrial hacia la digitalización corporativa de principios de los años 2000 (era Y2K). La interfaz combina sistemas arcaicos de papel mecanografiado, sellos de goma, monitores CRT monocromáticos, faxes térmicos y las primeras pantallas digitales de cuarzo/LED.

### Mapa Semántico de Tipografías (`src/theme/typography.ts`)

| Token Semántico | Familia Google Font | Nombre de Fuente en App | Propósito Diegético y Escenarios de Uso |
|---|---|---|---|
| `systemPC` | **Inconsolata** (`300 Light`) | `'Inconsolata-Light'` | Menús del sistema, interfaz de terminal PC CRT y consolas operativas. |
| `stamps` | **Syne Mono** (`400 Regular`) | `'Syne-Mono'` | Sellos oficiales burocráticos CST, rótulo del Día grande (`[ DÍA 1 ]`) y logotipos. |
| `faxMain` | **Share Tech Mono** (`400 Regular`) | `'ShareTechMono-Regular'` | Impresora de Fax: texto principal de multas, sanciones y fichas burocráticas. |
| `faxSecondary` | **VT323** (`400 Regular`) | `'VT323-Regular'` | Multas secundarias, números de serie y códigos de error matriciales. |
| `digitalMain` | **Chakra Petch** (`400 Regular / Bold`) | `'ChakraPetch-Regular'` | Pantallas digitales: CCTV, visor de cámara, etiquetas de la Caja Registradora. |
| `digitalSecondary` | **Orbitron** (`400 Regular / Bold`) | `'Orbitron-Regular'` | Reloj in-game digital (00:00 AM) e importes numéricos de la Caja Registradora. |
| `dirtyDoc` | **Special Elite** (`400 Regular`) | `'SpecialElite-Regular'` | Cuaderno de notas, pasaportes desgastados, informes con tinta corrida/vintage. |
| `cleanDoc` | **Courier Prime** (`400 Regular / Bold`) | `'CourierPrime-Regular'` | Contratos limpios, directivas del consorcio y letra pequeña corporativa. |
| `handwriting` | **Caveat** (`400 Regular / Bold`) | `'Caveat-Regular'` | Firmas de inspectores y notas personales a mano alzada. |
| `handwritingNumbers`| **Nanum Pen Script** (`400 Regular`)| `'NanumPenScript-Regular'` | Fechas adulteradas, tachaduras a mano y números alterados en documentos. |

---

## 2. MODO INMERSIVO ESTRICTO (PANTALLA COMPLETA REAL)

Para garantizar la inmersión total requerida por el género thriller psicológico y evitar interferencias visuales con la interfaz diegética:
- **Android Navigation Bar:** Se oculta globalmente desde [`FontProvider.tsx`](file:///src/components/core/FontProvider.tsx) mediante `expo-navigation-bar`:
  ```typescript
  await NavigationBar.setVisibilityAsync('hidden');
  ```
- **Status Bar:** Oculto en todo el juego con `<StatusBar hidden={true} />`, suprimiendo la barra horaria nativa y de batería del SO.

---

## 3. LA CUADRÍCULA BASE FLEXBOX (SPLIT 40 / 60)

La pantalla de turno se divide rígidamente en dos macro-zonas mediante una **Línea Roja Divisoria** (`height: 4`, color `#641111`, `zIndex: 10`):

```text
+---------------------------------------------------------------------------------+  --- 0% Top
|  TOP_ZONE (flex: 0.4 - 40% del Viewport)                                        |
|  +---------------------------------------------------------------------------+  |
|  | Top15Zone (flex: 15/40):                                                  |  |
|  | [ ESPEJO CONVEXO ]        [ TURNO / ALERTA ]        [ CCTV / RELOJ ]      |  |
|  +---------------------------------------------------------------------------+  |
|  | Top25Zone (flex: 25/40):                                                  |  |
|  |                    [ ÁREA SPRITE DEL CLIENTE / VISITANTE ]                |  |
|  +---------------------------------------------------------------------------+  |
+========================= LÍNEA ROJA DIVISORIA (#641111, height: 4) =============+  --- 40% Viewport
|  BOTTOM_ZONE (flex: 0.6 - 60% del Viewport)                                     |
|  +---------------------------------------------------------------------------+  |
|  | Bottom35Zone (flex: 35/60):                                               |  |
|  |             ZONA CARRUSEL DE DOCUMENTOS (EXPANDIDO flex: 1)  | [ UV ][ TEC ] |
|  +---------------------------------------------------------------------------+  |
|  | Bottom25Zone (flex: 25/60):                                               |  |
|  | [ CAJONES DE GUARDADO - flex: 0.75 ]         | [ INVENTARIO - flex: 0.25 ] |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+  --- 100% Bottom
```

---

## 4. MATRIZ DE CAPAS FLOTANTES, Z-INDEXES Y MECÁNICAS DIEGÉTICAS

| Componente | Archivo Fuente | Dimensiones / Posición | Z-Index | Mecánica Interactiva & Físicas |
|---|---|---|---|---|
| `<PcAndFaxStation />` | [`src/components/shift/PcAndFaxStation.tsx`](file:///src/components/shift/PcAndFaxStation.tsx) | `width: scale(150)`, `height: verticalScale(195)`. `left: scale(4)` | `40` (Monitor)<br>`50` (Multa) | Flota atravesando la línea roja. Al dispararse la multa, una hoja animada baja tapando la PC (**Ceguera Selectiva**). Su `zIndex: 40` evita colisiones con el carrusel expandido. |
| `<DraggableNotebook />` | [`src/components/shift/DraggableNotebook.tsx`](file:///src/components/shift/DraggableNotebook.tsx) | **Masivo: 85% Ancho, 65% Alto**. Nace en cajón inferior izquierdo. | `48` | Cuaderno con `PanResponder`. Al extraerse del cajón, cubre la mesa de trabajo forzando **Ceguera Selectiva**. Contiene las notas y directivas del consorcio. |
| `<CashRegisterOverlay />` | [`src/components/shift/CashRegisterOverlay.tsx`](file:///src/components/shift/CashRegisterOverlay.tsx) | `position: 'absolute'`, `bottom: 0`, `width: '100%'`, `height: 52%` | `60` | Se desliza verticalmente desde abajo tapando el Bottom25Zone y gran parte del Bottom35Zone. |

---

## 5. LÍMITES MATEMÁTICOS DE ARRASTRE DEL CUADERNO MASIVO

$$\begin{aligned}
\text{MIN\_X} &= \text{scale}(6) \\
\text{MAX\_X} &= \text{ScreenWidth} - \text{NotebookWidth} - \text{scale}(6) \\
\text{MIN\_Y} &= \text{ScreenHeight} \times 0.40 \times 0.25 \quad \text{(Permite elevación para lectura completa)} \\
\text{MAX\_Y} &= \text{ScreenHeight} - \text{verticalScale}(70) \quad \text{(Posición plegada en cajón)}
\end{aligned}$$

---

## 6. DICCIONARIO DE COLORBOXING

| Elemento / Caja | Color de Fondo | Borde / Acento | Etiqueta en Pantalla |
|---|---|---|---|
| **Espejo Convexo** | `#d97706` (Naranja) | `#f59e0b` | `"ESPEJO CONVEXO [ VIGILANCIA ATRÁS ]"` |
| **CCTV / Reloj** | `#0284c7` (Cyan) | `#38bdf8` | `"CCTV // RELOJ [ CAM-01: ACTIVA ]"` |
| **Sprite Cliente** | `#1e293b` (Gris Azulado) | `#475569` | `"SPRITE DEL CLIENTE / VISITANTE"` |
| **Línea Divisoria** | `#641111` (Rojo CST) | N/A | *Separador físico de 4px* |
| **Carrusel Expandido** | `#78350f` (Marrón Papel) | `#b45309` | `"ZONA CARRUSEL DE DOCUMENTOS (EXPANDIDO)"` |
| **Lámpara UV** | `#6b21a8` (Púrpura) | `#a855f7` | `"LÁMPARA UV"` |
| **Teclado Mecánico** | `#374151` (Gris Carbón) | `#6b7280` | `"TECLADO MEC."` |
| **Cajones Guardado** | `#1e3a8a` (Azul Acero) | `#3b82f6` | `"CAJONES DE GUARDADO (C.S.T.)"` |
| **Inventario** | `#065f46` (Verde Bosque) | `#10b981` | `"INVENTARIO [ 3 SLOTS ]"` |
| **PC Terminal (Ampliado)** | `#0f172a` (Azul Noche) | `#38bdf8` | `"PC TERMINAL // SISTEMA C.S.T."` |
| **Impresora Fax** | `#991b1b` (Rojo Carmesí) | `#b91c1c` | `"[ IMPRESORA FAX C.S.T. ]"` |
| **Hoja de Multa** | `#fef2f2` (Blanco Hueso) | `#991b1b` | `"⚠️ INFRACCIÓN CST - MULTA"` |
| **Cuaderno Masivo** | `#451a03` (Cuero Oscuro) | `#7c2d12` | `"CUADERNO DE NOTAS Y DIRECTIVAS C.S.T."` |
| **Caja Registradora** | `#064e3b` (Verde Esmeralda) | `#059669` | `"CAJA REGISTRADORA ACTIVA"` |
