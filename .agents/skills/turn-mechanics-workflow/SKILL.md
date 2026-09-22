---
name: turn-mechanics-workflow
description: >-
  Use this skill when developing, refactoring, or extending game mechanics,
  player interactions, economy rules, turn logic, or controls in ISN'T BEHIND
  (useTurnEngine, useDrawers, useOverlays, useSceneCamera, or ShiftScreen).
---

# Turn Mechanics Workflow (Clean Architecture & Modular Hooks)

Este skill define la guía arquitectónica para programar cualquier interacción, acción o regla de juego durante el turno de *ISN'T BEHIND*.

---

## 1. Árbol de Decisión Arquitectónico

Antes de escribir código o declarar un estado, responde a esta pregunta: **¿A qué capa pertenece lo que estás agregando?**

```
                            ¿Qué estás programando?
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
【Reglas del Juego / Turno】     【Modales a Pantalla Completa】  【Interacción Física en Escena】
   - Strikes                      - Monitor PC                      - Cajones de la mesa
   - Reloj 12:00 a 00:00          - Caja registradora (slide)       - Balanza / carrusel mostrador
   - Píldora CST / Estrés         - Apuntar arma (zIndex 999)       - Paneo táctil / Zoom cámara
   - Decisión Aprobar/Rechazar                                      - Lámpara articulada
        │                              │                              │
        ▼                              ▼                              ▼
  src/hooks/                     src/hooks/                     src/hooks/
  useTurnEngine.ts               useOverlays.ts                 useDrawers.ts (cajones/mesa)
  (DOMINIO PURO)                 (APLICACIÓN UI)                useSceneCamera.ts (cámara/luz)
```

---

## 2. Los 4 Contratos de Hooks Especializados

### 1. `src/hooks/useTurnEngine.ts` (Dominio Puro)
* **Regla de oro:** Cero `useState` de UI. No sabe si un cajón está abierto o si el monitor está visible.
* **Qué contiene:**
  * `shiftState: IShiftState` (dayNumber, phase, inGameTime, strikes, maxStrikes, stressLevel, withdrawalLevel).
  * Acciones de negocio: `sellAtLegalPrice`, `sellAtBlackMarketPrice`, `approveVisitor`, `rejectVisitor`, `takeCSTPill`, `addStrike`.
* **Horario oficial:** De `12:00` (mediodía) a `00:00` (medianoche / toque de queda CST).

### 2. `src/hooks/useOverlays.ts` (Modales Diegéticos)
* **Regla de oro:** Administra las 3 ventanas de pantalla completa.
* **Propiedad clave:** `isBlocked = isAiming || monitorOpen || cajaOpen`. Si `isBlocked === true`, el resto de interacciones de la escena quedan deshabilitadas.
* **Handlers auto-protegidos:** `openMonitor()`, `closeMonitor()`, `openCaja()`, `closeCaja()`, `aim()`, `holster()`.

### 3. `src/hooks/useDrawers.ts` (Cajones y Mostrador)
* **Regla de oro:** Lee `drawerConfig` dinámicamente de `sceneConfig.ts`. No hardcodear IDs de cajones.
* **API expuesta:** `getDrawer(id)`, `toggleDrawer(id)`, `nextItem(id)`, `prevItem(id)`.
* **Carrusel de mesa:** `tableCarouselIdx`, `carouselFocused`, `cajaCartonOpen`.

### 4. `src/hooks/useSceneCamera.ts` (Cámara y Lámpara)
* **Regla de oro:** Maneja los `Animated.Value` de la cámara global y de los objetos arrastrables sobre la mesa.
* **Lámpara cabeza:** Lee `panConfig.maxTranslateX` y `panConfig.maxTranslateY` de `sceneConfig.ts`.

---

## 3. Rol de `ShiftScreen.tsx` (Orquestador Ligero)

`ShiftScreen.tsx` es exclusivamente una capa de presentación (**View**).
* **Límite estricto:** Menos de 400 líneas de código.
* **Estructura del componente:**
  1. Instanciar los 4 hooks:
     ```tsx
     const engine   = useTurnEngine(currentDay);
     const overlays = useOverlays(scale, windowHeight);
     const drawers  = useDrawers(scale, overlays.isBlocked);
     const camera   = useSceneCamera(scale, overlays.isBlocked, drawers.carouselFocused);
     ```
  2. Pinta el escenario envolviendo todo en `<Animated.View style={camera.cameraTransform}>`.
  3. Renderiza sprites estáticos mediante `<GameSprite>`.
  4. Conecta los handlers de los hooks con los componentes interactivos.
  5. Renderiza los modales fuera del árbol de la cámara.

---

## 4. Checklist para Añadir una Nueva Mecánica

1. [ ] ¿Modifica coordenadas o límites físicos? → Configura primero en `src/config/sceneConfig.ts`.
2. [ ] ¿Afecta reglas de victoria/derrota, tiempo o dinero? → Añade la acción en `src/hooks/useTurnEngine.ts`.
3. [ ] ¿Afecta una animación o ventana? → Añade la lógica al hook correspondiente (`useDrawers`, `useOverlays` o `useSceneCamera`).
4. [ ] ¿`ShiftScreen.tsx` se mantiene como un mero conector sin lógica de cálculo?
5. [ ] ¿Se respetan las leyes de Clean Architecture (Cero `any`, Cero `@ts-ignore` sin justificar)?
