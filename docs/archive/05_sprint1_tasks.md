# 📋 ASIGNACIÓN MODULAR DE TAREAS — SPRINT 1 (UNIDAD 1)
## ISN'T BEHIND — Simulador de Gestión & Thriller Psicológico 2D

**Rol del Líder:** Director de Arte y QA  
**Fecha de Publicación:** 2026-08-18  
**Objetivo del Sprint:** Consolidar el MVP de la Unidad 1 (Navegación Fluida, UI Diegética 40/60, Sistema Tipográfico Y2K y Físicas Interactivas con Cero Conflictos en Git).  

---

## 🗺️ MATRIZ DE AISLAMIENTO PARA CONTROL DE VERSIONES (GIT)

Para evitar colisiones y *merge conflicts* en ramas de Git, **cada desarrollador tiene asignada una carpeta y conjunto de archivos exclusivos**. Queda prohibido modificar archivos fuera del área asignada sin previa coordinación con el Líder de QA.

```text
src/
├── components/
│   ├── core/           <-- DEV 1 (Core, Providers, Design System)
│   ├── menu/           <-- DEV 2 (Visuales de Menú, Intros, Animaciones CRT)
│   └── shift/          <-- DEV 3 (Componentes de Mesa, Documentos, Sellos)
├── screens/
│   ├── MainMenuScreen, WeeklyIntroScreen, DailyIntroScreen  <-- DEV 2
│   └── ShiftScreen                                          <-- DEV 3
└── theme/              <-- DEV 1 (Tokens de Colores, Tipografías, Escala)
```

---

## 👤 DEV 1: INGENIERO DE ESTRUCTURA, CORE Y NAVEGACIÓN

### 🎯 Rol y Misión
Garantizar la estabilidad de la arquitectura base, la gestión estricta del Modo Inmersivo en Android, la integridad de los tokens del sistema de diseño (`typography.ts`, `colors.ts`, `responsive.ts`) y la base para el Catálogo de Assets (`AssetProvider`).

### 📖 Documentación Obligatoria a Leer
1. [`docs/README.md`](file:///docs/README.md) *(Gobernanza y Regla de Oro)*
2. [`docs/TECHNICAL_MASTER_SPEC.md`](file:///docs/TECHNICAL_MASTER_SPEC.md) *(Módulo 01: Navigation Core y Módulo 05: Asset Switcher)*
3. [`docs/04_design_system.md`](file:///docs/04_design_system.md) *(Modo Inmersivo y Tipografías)*

### 📁 Archivos Asignados
- `App.tsx`
- `src/components/core/*` (ej. `FontProvider.tsx`, nuevo `AssetProvider.tsx`)
- `src/theme/*` (`colors.ts`, `typography.ts`, `globalStyles.ts`)
- `src/utils/responsive.ts`
- `src/models/types.ts`

### 🔨 Tareas Específicas
1. **Auditoría del Modo Inmersivo:** Asegurar que al cambiar de pantalla o reanudar la app desde background, la barra de navegación de Android permanezca oculta (`hidden`) sin saltos de layout.
2. **Setup de Feature Flags para Mocks (`AssetProvider`):** Crear un contexto `AssetContext` con la bandera booleana `useMockAssets: boolean` (por defecto `true`) para alternar entre cajas grises/colorboxing y assets finales.
3. **Control de Guards de Navegación:** Implementar en `App.tsx` o un hook `usePreventBack` la interceptación del botón retroceso nativo de Android en `ShiftScreen` para evitar abandonos accidentales.

### ✅ Criterios de Aceptación (DoD)
- [ ] La app inicia sin parpadeos de la barra de estado ni de la barra de botones de Android.
- [ ] Existe un hook o provider reutilizable `useAssetSwitcher()` listo para ser consumido por el resto del equipo.
- [ ] TypeScript compila con 0 advertencias (`npx tsc --noEmit`).

---

## 👤 DEV 2: INGENIERO DE MENÚ PRINCIPAL E INTROS NARRATIVAS

### 🎯 Rol y Misión
Llevar a nivel cinematográfico y diegético las pantallas de apertura del juego (`MainMenuScreen`, `WeeklyIntroScreen`, `DailyIntroScreen`), aplicando el mapa tipográfico de los años 2000, efectos atmosféricos de monitor CRT (glitch, blur intermitente) y la interacción funcional de botones.

### 📖 Documentación Obligatoria a Leer
1. [`docs/02_architecture_and_ui.md`](file:///docs/02_architecture_and_ui.md) *(Layout Flexbox 35/65 del menú y paleta)*
2. [`docs/03_game_data_models.md`](file:///docs/03_game_data_models.md) *(Carga de diálogos y transmisiones)*
3. [`docs/04_design_system.md`](file:///docs/04_design_system.md) *(Fuentes: `systemPC`, `stamps` y `cleanDoc`)*

### 📁 Archivos Asignados
- `src/screens/MainMenuScreen.tsx`
- `src/screens/WeeklyIntroScreen.tsx`
- `src/screens/DailyIntroScreen.tsx`
- `src/components/menu/*` (`TitleSvg.tsx`, `LogoSvg.tsx`, nuevos efectos visuales)

### 🔨 Tareas Específicas
1. **Efecto CRT & Glitch en Menú Principal:**
   - Implementar un efecto visual sutil de parpadeo/flicker o distorsión cromática discontinua en `TitleSvg` y `LogoSvg` para simular la degradación de un monitor de tubo del año 2004.
2. **Interactividad del Menú:**
   - `[ STORY ]`: Navega a `WeeklyIntroScreen` con `{ weekNumber: 1 }`.
   - `[ SETTINGS ]`: Abrir modal/overlay diegético con controles para activar/desactivar efectos hápticos y volumen master.
   - `[ EXIT ]`: Mostrar diálogo de confirmación de salida de la terminal o invocar `BackHandler.exitApp()` en Android.
3. **Pulido de la Transmisión Radial (`WeeklyIntroScreen`):**
   - Incorporar efecto de parpadeo del cursor verde (`█`) y botón `[ SALTAR TRANSMISIÓN ]` para agilizar testing.
4. **Pantalla Burocrática (`DailyIntroScreen`):**
   - Asegurar que el sello CST y el número grande de día usen `TYPOGRAPHY.stamps` (`Syne-Mono`) y que la transición a `GameInterface` sea fluida.

### ✅ Criterios de Aceptación (DoD)
- [ ] Todas las opciones del menú principal realizan una acción visual interactiva.
- [ ] El efecto CRT en el título y logo no causa caídas de FPS en dispositivos gama baja (usar `Animated` con `useNativeDriver: true`).
- [ ] Las 3 pantallas consumen estrictamente los tokens de `TYPOGRAPHY` y `colors`.

---

## 👤 DEV 3: INGENIERO DE INTERFAZ DE TURNO Y FÍSICAS DE MESA

### 🎯 Rol y Misión *(Sugerencia de Especialización Arquitectónica)*
**Rol Sugerido:** *Gameplay & Desk Mechanics Engineer*.  
Es el encargado de transformar la mesa de trabajo de una cuadrícula estática a un **entorno 100% interactivo**. Dará vida al carrusel de documentos, a la mecánica de estampado (aprobar/rechazar) y a la interacción de vigilancia en el espejo convexo.

### 📖 Documentación Obligatoria a Leer
1. [`docs/04_design_system.md`](file:///docs/04_design_system.md) *(Wireframe 40/60, z-indexes y drag bounds)*
2. [`docs/03_game_data_models.md`](file:///docs/03_game_data_models.md) *(Modelos `IDocumentData`, `IVisitor` y `IShiftState`)*
3. [`docs/TECHNICAL_MASTER_SPEC.md`](file:///docs/TECHNICAL_MASTER_SPEC.md) *(Módulo 03: Interactive Desk y Módulo 04: Sanity/Paranoia)*

### 📁 Archivos Asignados
- `src/screens/ShiftScreen.tsx`
- `src/components/shift/*` (ej. nuevos `DocumentCarousel.tsx`, `InspectionDocument.tsx`, `StampsRack.tsx`, `ConvexMirrorTrigger.tsx`)

### 🔨 Tareas Específicas
1. **Componente de Documento Inspeccionable y Arrastrable (`InspectionDocument.tsx`):**
   - Crear el documento de identidad en el Carrusel Central (`Bottom35Zone`).
   - Permitir arrastrarlo hacia el centro del escritorio usando `PanResponder` con límites de contención en la mesa.
   - Renderizar los datos del visitante usando `TYPOGRAPHY.dirtyDoc` (`SpecialElite-Regular`) para texto impreso y `TYPOGRAPHY.handwriting` (`Caveat`) para firmas.
2. **Rack de Sellos Interactivo (`StampsRack.tsx`):**
   - Implementar los sellos `[ APROBAR ]` y `[ RECHAZAR ]`.
   - Al pulsar un sello y tocar sobre el documento, estampar una marca visual roja o verde con retroalimentación háptica (`expo-haptics`).
3. **Mecánica de Vigilancia en el Espejo Convexo (`ConvexMirrorTrigger.tsx`):**
   - Al tocar el `Espejo Convexo` en el `Top15Zone`, ejecutar una animación de enfoque / alerta que simule revisar si "hay alguien detrás".
4. **Integración Modular en `ShiftScreen`:**
   - Asegurar que los documentos y sellos convivan armoniosamente con la PC/Fax (`PcAndFaxStation`), el Cuaderno Masivo (`DraggableNotebook`) y la Caja Registradora (`CashRegisterOverlay`).

### ✅ Criterios de Aceptación (DoD)
- [ ] Es posible tomar un documento, inspeccionar sus campos y aplicarle un sello visual.
- [ ] Tocar el espejo convexo ejecuta una respuesta visual inmediata en pantalla.
- [ ] No existen colisiones de z-index entre los documentos arrastrados y los overlays de la PC o la registradora.

---

## 👑 LÍDER: DIRECTOR DE ARTE Y QA

### 🎯 Rol y Responsabilidades
1. **Revisión de Pull Requests (Code Review):** Validar que ningún desarrollador introduzca dependencias innecesarias, código sin tipar o violaciones a la arquitectura.
2. **Auditoría Visual (QA de Arte):** Probar en emuladores y dispositivos físicos que el Colorboxing respete la paleta, que las 11 tipografías carguen correctamente y que no haya desbordamientos en pantallas pequeñas.
3. **Gestión de SSoT:** Mantener actualizados los documentos en `/docs` conforme el equipo reporte avances.

---

## 🚀 FLUJO DE TRABAJO Y ENTREGABLES EN GIT

1. **Creación de Ramas:** Cada Dev trabajará en su rama temática:
   - `feature/dev1-core-navigation`
   - `feature/dev2-menu-crt-intros`
   - `feature/dev3-desk-mechanics-documents`
2. **Pull Requests:** Antes de fusionar a `main`, el PR debe:
   - Compilar sin errores (`npx tsc --noEmit`).
   - Haber sido probado visualmente en Modo Inmersivo.
   - Contar con la aprobación del Director de Arte y QA.
