# 🎮 Análisis de Arquitectura UI — Nueva Distribución 2.5D
## "ISN'T BEHIND" — ShiftScreen — Referencia física 15 cm × 6.7 cm

---

## 1. Lectura del Boceto (Análisis Visual)

![Boceto de referencia](file:///C:/Users/julio/.gemini/antigravity/brain/35cdaba8-745f-4391-bda1-0f2999577ca1/.user_uploaded/media_1788838791615.png)

### Lo que se lee en el dibujo (de arriba a abajo):

| Zona | Elementos identificados en el boceto |
|---|---|
| **Tope superior** | Persiana metálica enrollada (bloque grueso horizontal con textura de rayas), reloj digital centrado debajo de esta |
| **Fondo vertical — zona pared** | A la izquierda: teléfono fijo montado en muro con cable colgante. Centro-derecha: enrejado de reja con silueta traslúcida del cliente detrás. Extremo derecho: cartel circular de "PUBLICIDAD" nacional. Flecha `←` izquierda indica scroll horizontal |
| **Línea de quiebre ~7 cm** | Superficie de la mesa aparece. Se perciben objetos 3D pequeños sobre la meseta: cenicero, pildoras/blisters, lápices/lapicero con latas, una taza |
| **Superficie de mesa 7–11 cm** | Izquierda: Monitor PC apilado sobre papeles y portapapeles. Centro: carrusel táctil (carrusel de documentos / "objeto 3D" interactivo). Derecha: lámpara de escritorio, latas/cilindros (micro/botes), varios objetos de oficina |
| **Sub-mesa (bajo mostrador) 11–15 cm** | Cajón izquierdo y cajón derecho visibles en extremos. Centro: caja registradora como modal expansible (con flecha `[^]`/`[v]`). Primera franja: caja de cartón deslizable horizontal. Texto claro "CAJA" al fondo |

### Observaciones clave del boceto que el diagrama de texto no capturaba:
- El **teléfono** claramente **rompe la frontera** hacia arriba, su cuerpo parte desde la pared pero su auricular y papeles caen hacia la zona de mesa (~8 cm). Esto confirma el elemento *boundary-breaker* izquierdo.
- El **monitor PC** tiene una perspectiva picada: se ve la parte superior del monitor (pantalla) y el frente del gabinete, confirmando el ángulo 25° de la zona de mesa.
- La **silueta del cliente** ocupa todo el centro-alto y está claramente detrás del enrejado (z-index inferior al enrejado).
- El **carrusel de documentos** (zona central mesa) parece ser el elemento interactivo principal, con el "objeto 3D" siendo el documento actual presentado al frente.
- Los **cajones sub-mesa** tienen perspectiva empinada (~70°), se ven casi de arriba.
- La **caja registradora** es claramente un elemento modal que emerge desde la sub-mesa hacia arriba (flecha bidireccional).

---

## 2. Sistema de Coordenadas — Figma to React Native

> [!IMPORTANT]
> La arquitectura anterior basada en Flexbox y medidas físicas (cm) fue **reemplazada completamente** por un sistema de posicionamiento absoluto derivado de Figma.

**Canvas Figma de referencia:** 1926 × 2204 px (estado cerrado)
**Viewport de pantalla:** 646 × 1456 px (Color Box total)
**Offset del viewport:** `OFFSET_X = 619`, `OFFSET_Y = 748`

### 2.1 Fórmula de conversión

```typescript
scale  = windowHeight / 1456          // factor de escala único
left   = (figma_left  - 619) * scale
top    = (figma_top   - 748) * scale
width  = figma_width         * scale
height = figma_height        * scale
```

Todos los sprites usan `resizeMode: 'stretch'` para rellenar exactamente el bounding box de Figma.

### 2.2 Las 4 Zonas Color Box — Proporciones Absolutas

| Zona | Color | Altura Figma | % Pantalla | Top → Bottom (px Figma) | Contenido principal |
|---|---|---|---|---|---|
| **A** | 🔴 Rojo    | 156 px | **10.71%** | 0 → 156   | Techo, persiana (roll-up-door) |
| **B** | 🟡 Amarillo| 478 px | **32.83%** | 156 → 634 | Pared, reja, cliente, teléfono |
| **C** | 🩵 Celeste | 322 px | **22.12%** | 634 → 956 | Mesa, carrusel, PC, lámpara |
| **D** | 🔵 Azul    | 500 px | **34.34%** | 956 → 1456| Sub-mesa, cajones, cajas, suelo |

> [!NOTE]
> Los Color Boxes son **guías de referencia visual solamente** — `overflow: 'visible'` permite que los sprites los crucen libremente. El toggle `SHOW_REFERENCE_COLOR_BOXES` los muestra/oculta.

### 2.3 Overlays de estado abierto (Figma abierto: OX=619, OY=270)

| Overlay | x | y | w | h | Trigger |
|---|---|---|---|---|---|
| `monitor-1` | 48 | 309 | 551 | 665 | Tap en sprite `pc` |
| `registradora-arriba` | 54 | 360 | 540 | 917 | Botón `[COBRAR]` o robo |
| `apuntar` | 234 | 506 | 594 | 950 | Acción de apuntar |

---


## 3. Sistema Z-Index y Boundary-Breakers (Perspectiva 2.5D)

### 3.1 Capas de Z-Index (de más lejano a más cercano)

```
z: 1  — Fondo de pared / textura muro (ZONA B background)
z: 2  — Silueta del cliente (detrás del enrejado)
z: 3  — Enrejado metálico con plástico (ZONA B)
z: 4  — Publicidad nacional (ZONA B, derecha)
z: 5  — Superficie de la mesa (ZONA C background)
z: 6  — Objetos pequeños de mesa (cenicero, lápices, latas)
z: 7  — Carrusel de documentos (elemento interactivo principal)
z: 8  — Monitor PC (BOUNDARY BREAKER ↑ invade ZONA B)
z: 9  — Teléfono fijo (BOUNDARY BREAKER ↑ invade ZONA B)
z: 10 — Sub-mesa / cajones (ZONA D)
z: 11 — Caja registradora modal (emerge de ZONA D hacia ZONA C)
z: 20 — Cuaderno arrastrable (overlay global)
z: 30 — Inventario (overlay global)
z: 40 — Pistola / arma (overlay global, top-most)
```

### 3.2 Los 2 Boundary-Breakers clave

**Monitor PC** (COL-IZQ, boundary-breaker hacia arriba):
- Su base (`bottom`) ancla en `~7cm` (línea de quiebre, `46.7%` desde top).
- Su cuerpo se eleva visualmente hasta `~4.5 cm` (`30%` desde top, dentro de ZONA B).
- Implementación: `position: absolute`, `bottom` desde su contenedor ZONA C, `marginTop: -X` negativo.

**Teléfono fijo** (COL-IZQ, boundary-breaker hacia arriba):
- Montado en la pared (ZONA B), su base y cable caen hasta `~7.5 cm` (ligeramente dentro ZONA C).
- Implementación: `position: absolute` en ZONA B, `bottom: -Y%` negativo para que sobrepase hacia ZONA C.

---

## 4. Tabla de Color Boxes para el Esqueleto

Para la primera iteración del esqueleto usaremos estos colores de la paleta ya definida en `colors.ts`:

| Zona / Elemento | Color Box | Hex Token |
|---|---|---|
| **ZONA A** — Persiana/Reloj | `mockGraybox` dark | `#1a1a2e` |
| **ZONA B** — Pared fondo | `pcTerminal` | `#0f172a` |
| **Cliente silueta** | `clientArea` | `#1e293b` |
| **Enrejado** | `mockBorder` | `#3a3a3a` |
| **Publicidad** | `hangingClipboard` | `#b45309` |
| **ZONA C** — Mesa | `drawerStorage` blue | `#1e3a8a` |
| **Monitor PC** | `pcTerminal` | `#0f172a` |
| **Carrusel documentos** | `docCarousel` | `#78350f` |
| **Lámpara / objetos der.** | `uvLamp` | `#6b21a8` |
| **Objetos pequeños (pillbox)** | `faxPrinter` | `#991b1b` |
| **ZONA D** — Sub-mesa | `draggableNotebook` | `#451a03` |
| **Cajón izquierdo** | `drawerStorage` | `#1e3a8a` |
| **Cajón derecho** | `drawerStorage` | `#1e3a8a` |
| **Caja registradora** | `cashRegister` | `#064e3b` |
| **Caja cartón deslizante** | `inventory` | `#065f46` |

---

## 5. Análisis de Perspectiva Híbrida 2.5D

### 5.1 ZONA A (0–2 cm / 0–13.3%) — Ortográfica plana
- La persiana se ve completamente de frente, sin ángulo.
- El reloj digital es 100% frontal.
- **Sin transformaciones de perspectiva.**

### 5.2 ZONA B (2–7 cm / 13.3–46.7%) — Ortográfica frontal con parallax
- La pared es una vista frontal plana (como fondo de room scaler).
- El cliente se ve frontal pero con efecto de profundidad (escala ligeramente menor).
- El enrejado tiene líneas verticales paralelas (sin vanishing point).
- **Sin `transform: perspective()` pero con scale para el cliente.**

### 5.3 ZONA C (7–11 cm / 46.7–73.3%) — Picado leve 25°
- La mesa se ve desde arriba en ~25°: los objetos muestran su parte superior + frente.
- El monitor PC muestra: parte superior de la pantalla + frente del gabinete.
- Los papeles/documentos se ven ligeramente aplastados verticalmente.
- **`transform: perspective(800px) rotateX(12deg)` aprox. en objetos de mesa.**

### 5.4 ZONA D (11–15 cm / 73.3–100%) — Picado pronunciado 70°
- Los cajones se ven casi completamente desde arriba.
- La caja registradora es un panel que "se abre hacia el jugador".
- La caja de cartón aparece casi como vista aérea deslizándose hacia la izquierda.
- **`transform: perspective(400px) rotateX(25–30deg)` en contenedores.**

---

## 6. Plan de Acción Recomendado (En Orden)

### FASE 1 — Esqueleto de Layout (Solo código React Native, color boxes)
> Prioridad: MÁXIMA. Sin sprites, sin lógica.

1. Refactorizar `ShiftScreen.tsx` → extraer zonas en componentes de layout.
2. Crear `ZoneA_RollerShutter.tsx` — flex 1.33, color `#1a1a2e`.
3. Crear `ZoneB_WallBackground.tsx` — flex 3.33, 3 columnas.
4. Crear `ZoneC_DeskSurface.tsx` — flex 2.67, boundary-breakers posicionados.
5. Crear `ZoneD_SubDesk.tsx` — flex 2.67, cajones y registradora.
6. Implementar los 2 boundary-breakers con `position: absolute` + márgenes negativos.
7. Verificar en dispositivo físico con las proporciones de pantalla reales.

### FASE 2 — Sprites (Trabajo de arte en paralelo)
> Puede hacerse en paralelo con FASE 1 o después.

| Sprite necesario | Perspectiva | Notas para el artista |
|---|---|---|
| Persiana metálica | Frontal plana | Textura de rayas horizontales, estilo industrial |
| Fondo de pared | Frontal plana | Textura de concreto / ladrillo industrial |
| Enrejado + plástico | Frontal plana | PNG transparente con malla metálica y plástico arrugado |
| Teléfono fijo de muro | Vista lateral + cable | Perspectiva 0°, montado en pared |
| Monitor PC (CRT) | Vista 25° picado | Se ven la pantalla y la parte delantera del gabinete |
| Carrusel de documentos | Vista 25° picado | Carpetas/documentos ordenados horizontalmente |
| Lámpara de escritorio | Vista 25° picado | Clásica lámpara articulada, estilo oficina burocrática |
| Cajones (×2) | Vista 70° picado | Se ven casi de arriba, manija frontal visible |
| Caja registradora | Vista 70° picado | Estilo vintage años 80, con display LED |
| Cliente (silueta) | Frontal | Silueta oscura, con variaciones por tipo de visitante |

### FASE 3 — Lógica y Animaciones
> Solo después de que FASE 1 esté validada visualmente.

- Scroll horizontal de ZONA B (cliente se mueve).
- Zoom al monitor PC (tap sobre monitor).
- Modal de caja registradora (slide-up desde ZONA D).
- Drawer de cajones (interacción existente, adaptar al nuevo layout).

---

## 7. Pregunta Abierta para Ti

> [!IMPORTANT]
> **¿El teléfono fijo es solo decorativo o es interactivo?**
> En el boceto aparece en ZONA B pegado al muro, pero si es interactivo (llamadas, alertas, etc.) necesita un z-index alto y un hit area cuidadoso para no interferir con el scroll horizontal del cliente.

> [!IMPORTANT]
> **¿La "publicidad nacional" es un elemento fijo o cambia dinámicamente?**
> Si cambia según el turno/semana, necesita ser un slot de imagen dinámico desde el momento del esqueleto.

> [!TIP]
> Para los sprites, el formato **WebP con fondo transparente (alpha)** que ya usas es el correcto. La indicación clave al artista es siempre el **ángulo de cámara** de cada zona (0°, 25°, 70°).
