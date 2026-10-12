# STATUS — ISN'T BEHIND
> **Documento vivo.** Se actualiza al inicio y al final de cada sesión de trabajo.  
> **Última actualización:** 2026-09-21 (Refactorización Modular Completa — Fases 0, 1, 2, 3 y 4 Finalizadas)

---

## 1. ESTADO GENERAL DEL PROYECTO

| Aspecto | Estado | Notas |
|---|---|---|
| **Compilación** | ✅ Compila limpio | Sin errores de TypeScript. `ViewStyle` y `camera` styles arreglados. |
| **Pantalla principal (`ShiftScreen`)** | ✅ Orquestador Puro | Reducido de 1324 líneas a ~390 líneas. Cero lógica de negocio, cero px hardcodeados. |
| **Motor de turno (`useTurnEngine`)** | ✅ Dominio Puro | `IShiftState`, strikes, reloj in-game 12:00-00:00, píldora CST. Cero `useState` de UI. |
| **Hooks Especializados** | ✅ Implementados | `useDrawers.ts`, `useOverlays.ts`, `useSceneCamera.ts`. |
| **Registro de escena (`sceneConfig.ts`)** | ✅ SSoT Completa | Matriz de Figma con `OFFSET_X=619, OFFSET_Y=239`, `panConfig`, `drawerConfig`. |
| **Renderizador Atómico (`GameSprite.tsx`)** | ✅ Operativo | Aplica la fórmula `(figma - offset) * scale`. Soporta imágenes, animaciones y sombras. |
| **Limpieza de Residuos (Zombies)** | ✅ Completada | Eliminados `useShiftEngine.ts`, `components/shift/` (10 archivos), `AssetContext.tsx`, `assets.ts` y `core/`. |
| **Documentación** | ✅ Fase 4 Completa | Todos los 4 pilares + Contexto Maestro + Status alineados con la nueva arquitectura. |
| **Git / Control de versiones** | 🌿 Ramas creadas | `develop`, `feature/turn-engine`, `feature/ui-render`, `feature/game-mechanics`, `feature/narrative-events`. |

---

## 2. PANTALLAS Y COMPONENTES — ESTADO ACTUAL

### Pantallas
| Pantalla | Archivo | Estado | Notas |
|---|---|---|---|
| **Menú Principal** | `MainMenuScreen.tsx` | ✅ Estable | UI retro con botones diegéticos |
| **Intro Semanal** | `WeeklyIntroScreen.tsx` | ✅ Estable | Cinemática semanal |
| **Intro Diaria** | `DailyIntroScreen.tsx` | ✅ Estable | Cinemática de directivas diarias |
| **Registro Operador** | `OperatorRegistrationScreen.tsx` | ✅ Estable | Formulario de contrato con CST |
| **Expediente / Reglas** | `DossierScreen.tsx` | ✅ Estable | Pestañas de directivas y anomalías |
| **Ajustes** | `SettingsScreen.tsx` | ✅ Estable | Configuración de audio y vibración |
| **Turno / Juego** | `ShiftScreen.tsx` | ✅ Modularizado (Fase 2) | Orquestador puro de 288 líneas (< 300 líneas). Hotspots TOGGLE BOTONS, expansión de cajones, caja pos 2 y PC abierto. |

### Sistemas de interacción en `ShiftScreen` (Fase 2)
| Sistema | Hook / Componente Responsable | Estado |
|---|---|---|
| `roll-up-door` (persiana) | `ShiftScreen` + `sceneConfig.panConfig` | ✅ Límite calibrado al fin de la Zona A inferior (`410.17 px` Figma) con snap vertical |
| `pc` → modal PC Abierto | `useOverlays` + `<SceneOverlays>` | ✅ `pc_abierto` (1740x1741) + `pantalla_negra` (298x225) con terminal CRT interactiva |
| `cajon-1` | `useDrawers` (3 fases) | ✅ Hotspot `toggle cajon 1`: cerrado → mitad → completo → cerrado con expansión a la derecha |
| `cajon-2` | `useDrawers` (3 fases) | ✅ Hotspot `toggle cajon 2`: cerrado → mitad → completo → cerrado con expansión a la derecha |
| `caja-carton` | `useDrawers` (2 posiciones) | ✅ Hotspot `toggle caja`: posición 1 (fondo zIndex 8) ↔ posición 2 (por encima de todo zIndex 50) |
| Exclusión mutua Caja / Cajones | `useDrawers` | ✅ Caja abierta bloquea cajones; cualquier cajón abierto bloquea mover la caja |
| Hotspots / TOGGLE BOTONS | `viewportConfig.ts` | ✅ 8 zonas táctiles calibradas según Figma. Toggle debug `SHOW_TOGGLE_HITBOXES` |
| `apuntar` | `useOverlays` + `<SceneOverlays>` | ✅ Funcional (Overlay zIndex 999, bloquea todo, GUARDAR/DISPARAR) |
| `caja-registradora` | `useOverlays` + `<SceneOverlays>` | ✅ Funcional (Slide animado desde abajo + dim) |
| Color Boxes de Referencia | `viewportConfig.ts` | ⏸ Deshabilitadas (`SHOW_REFERENCE_COLOR_BOXES = false`) |

---

## 3. SPRITES — ESTADO DE ASSETS

| Sprite | Clave en `sceneConfig.ts` | Estado |
|---|---|---|
| Suelo | `suelo` | ✅ Asignado (`suelo.webp`) |
| Sombra debajo mesa | `sombra-debajo-mesa` | ✅ Asignado (`behavior: 'shadow'`) |
| Caja cartón | `caja-carton` | ✅ Asignado (`caja-carton.webp`) |
| Carrusel caja | `carrusel-caja` | ✅ Asignado (`carrusel-caja.webp`) |
| Sombra caja | `sombra-caja` | ✅ Asignado (`behavior: 'shadow'`) |
| Cliente NPC-1 | `npc-1` | ✅ Asignado (`npc-1.webp`) |
| Mesa plataforma / abajo | `mesa-plataforma`, `mesa-abajo` | ✅ Asignado (`mesa-plataforma.webp`, etc.) |
| Cajón 1 y 2 | `cajon-1`, `cajon-2` | ✅ Asignado (`cajon-1.webp`, `cajon-2.webp`) |
| Carruseles cajón 1 y 2 | `carrusel-cajon-1`, `carrusel-cajon-2` | ✅ Asignado |
| Sombras cajones | `sombra-cajon-1`, `sombra-cajon-2` | ✅ Asignado (`behavior: 'shadow'`) |
| Rejilla de seguridad | `rejilla` | ✅ Asignado (`rejilla.webp`) |
| PC estación | `pc` | ✅ Asignado (`pc.webp`) |
| Teléfono | `telefono` | ✅ Asignado (`telefono.webp`) |
| Píldoras CST | `pildoras` | ✅ Asignado (`pildoras.webp`) |
| Mercancía (cigarros, latas, leche, harina, papeles) | Varios | ✅ Asignados |
| Lámpara (base y cabeza) | `lampara-base`, `lampara-cabeza` | ✅ Asignados |
| Revólver | `revolver` | ✅ Asignado |
| Roll-Up Door | `roll-up-door` | ✅ Asignado |
| **Monitor overlay** | `monitor-1` (551×665px) | ⏳ Placeholder funcional — pendiente arte final |
| **Registradora overlay** | `registradora-arriba` (540×917px) | ⏳ Placeholder funcional — pendiente arte final |

---

## 4. PRÓXIMOS PASOS PRIORIZADOS (POST-REFACTOR)

### Sprint Próximo — Mecánicas de Juego y Contenido
1. **Mecánica de Cobro e Inspección de Documentos:**
   - Conectar la balanza/carrusel de mesa con la calculadora de vuelto en la registradora.
   - Implementar el sellador diegético (Aprobado / Rechazado) con feedback táctil y visual.
2. **Sistema de Clientes (Visitantes) y Fila:**
   - Inyectar la cola de visitantes en `useTurnEngine.ts` leyendo de un `day_01.json`.
   - Sistema de diálogo dinámico con máquina de estados.
3. **Eventos y Terror Psicológico:**
   - Disparador de alucinaciones y parpadeo de luces en `useSceneCamera.ts`.
   - Integración del efecto de consumo de píldoras CST sobre el estrés y la abstinencia.
4. **Pipeline Estético (Assets Finales):**
   - Incorporar `monitor-1.webp` y `registradora-arriba.webp` finales cuando el artista los entregue.

---

## 5. ÚLTIMO PUNTO DE TRABAJO

**Sesión:** 2026-10-05  
**Tareas completadas (Unidad 2 / Avance 2 del Sílabo Académico):**
- **Servicio REST diegético (`cstNetworkService.ts`):** Consumo con `fetch` de JSONPlaceholder (`/posts`) y telemetría climática en tiempo real con Open-Meteo (`/forecast`).
- **Terminal de Red y Dossier (`NetworkTerminalTab.tsx` en `DossierScreen.tsx`):**
  - Implementación de comparativa transparente: Nube (REST API) vs Caché (`AsyncStorage`) vs Local Offline (ROM).
  - Herramientas interactivas de manipulación de datos: buscador reactivo por texto/sector y filtros por categoría (`TODOS`, `CLOUD`, `CACHE`, `LOCAL`).
- **Persistencia en AsyncStorage:** Gestión de caché de red (`@cst_cached_dispatches`), perfiles de operador (`@isnt_behind_operator_profile`) y preferencias de tema (`@isnt_behind_menu_theme`).
- **Leyes de Ingeniería:** Todos los componentes por debajo de 300 líneas (Ley T5), TypeScript estricto sin `any`, y estética retro-brutalista preservada.
- **Documento Académico:** Creado `docs/05-avance-2-academic.md` con la matriz de trazabilidad y guía de evaluación.
