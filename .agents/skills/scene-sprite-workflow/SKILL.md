---
name: scene-sprite-workflow
description: >-
  Use this skill when adding, updating, repositioning, or replacing sprites,
  bounding boxes, or visual elements from Figma into the 2.5D game scene of ISN'T BEHIND
  (sceneConfig.ts, GameSprite.tsx, and ShiftScreen.tsx).
---

# Scene Sprite Workflow (Figma 2.5D → React Native)

Este skill es el procedimiento estándar y obligatorio para integrar cualquier asset o cambio de coordenadas visuales en el turno de juego de *ISN'T BEHIND*.

---

## 1. El Sistema de Coordenadas Canónico (Figma 2.5D)

El escenario visual no usa Flexbox. Todo se renderiza mediante posicionamiento absoluto sobre un Viewport móvil de **646 × 1456 px** extraído de un lienzo Figma panorámico de **1926 × 1793 px**.

* **Origen X (Figma):** `FIGMA_OFFSET_X = 619`
* **Origen Y (Figma):** `FIGMA_OFFSET_Y = 239` (Tope de la zona roja superior)
* **Escala global en runtime:**
  $$\text{scale} = \frac{\text{windowHeight}}{1456}$$
* **Fórmula de pantalla (aplicada exclusivamente en `GameSprite.tsx`):**
  $$\text{screenLeft} = (\text{figmaLeft} - 619) \times \text{scale}$$
  $$\text{screenTop} = (\text{figmaTop} - 239) \times \text{scale}$$
  $$\text{screenWidth} = \text{figmaWidth} \times \text{scale}$$
  $$\text{screenHeight} = \text{figmaHeight} \times \text{scale}$$

---

## 2. Procedimiento Paso a Paso: Añadir o Modificar un Sprite

### Paso 1: Obtener las métricas del diseño en Figma
Del código exportado de Figma (CSS/HTML o inspección), extrae:
* `left`: coordenada X original.
* `top`: coordenada Y original.
* `width`: ancho en px Figma.
* `height`: alto en px Figma.
* `z-index`: orden de profundidad visual.

### Paso 2: Guardar el asset `.webp`
1. Guarda la imagen en `src/assets/sprites/<id_del_sprite>.webp`.
2. Formato: `.webp` con compresión de calidad diegética (posterizada/retro).
3. **Regla de Lore:** Si el asset pertenece al C.S.T. (Consorcio Stratton-Tate), debe usar azul corporativo (`#2E86C1`), NUNCA rojo.

### Paso 3: Registrar en `src/config/sceneConfig.ts`
1. Agrega el `require` en `SPRITE_ASSETS`:
   ```typescript
   export const SPRITE_ASSETS: Record<string, ImageSourcePropType> = {
     // ...
     'mi-nuevo-sprite': require('../assets/sprites/mi-nuevo-sprite.webp'),
   };
   ```
2. Agrega la definición a `ADAPTED_ELEMENTS`:
   ```typescript
   {
     id: 'mi-nuevo-sprite',
     spriteKey: 'mi-nuevo-sprite',
     label: 'DESCRIPCIÓN DEBUG',
     figmaLeft: 719,        // Valor exacto de Figma (sin restar offset manualmente)
     figmaTop: 360,         // Valor exacto de Figma
     figmaWidth: 490,
     figmaHeight: 781,
     zIndex: 15,
     behavior: 'static',    // 'static' | 'tappable' | 'pannable' | 'shadow' | 'carousel'
     fallbackColor: 'rgba(30,41,59,0.85)',
     fallbackBorderColor: '#475569',
   },
   ```

### Paso 4: Comportamientos especiales (opcional)
* **Si es arrastrable (persiana, lámpara):** Agrega `panConfig`:
  ```typescript
  panConfig: {
    maxTranslateX: 80,
    maxTranslateY: 60,
    resetOnFastSwipe: true,
  }
  ```
* **Si es un cajón interactivo:** Agrega `drawerConfig`:
  ```typescript
  drawerConfig: {
    openTranslateY: 109,
    carouselSlotId: 'carrusel-cajon-1',
    items: ['revolver'],
  }
  ```
* **Si abre un modal:** Agrega `opensOverlay: 'monitor' | 'caja-registradora' | 'apuntar'`.

### Paso 5: Verificación
* En `ShiftScreen.tsx`, el elemento se renderiza automáticamente a través del map de `ADAPTED_ELEMENTS` con `<GameSprite>`.
* Si es estático, no requiere escribir una sola línea de código en `ShiftScreen.tsx`.
* Activa `SHOW_REFERENCE_COLOR_BOXES = true` en `sceneConfig.ts` si necesitas auditar las 4 zonas de color del Viewport.

---

## 3. Leyes Absolutas de Sprites
1. **NUNCA usar Flexbox para posicionar sprites del escenario.** Todo es absoluto y multiplicado por `scale`.
2. **SIEMPRE usar `resizeMode="stretch"` en `<Image>`.** Esto garantiza que el sprite llene exactamente el Bounding Box de Figma sin desfasarse.
3. **NUNCA cortar sprites:** El contenedor `stageContainer` DEBE mantener `overflow: 'visible'`.
