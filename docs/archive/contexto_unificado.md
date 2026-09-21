# CONTEXTO UNIFICADO — ISN'T BEHIND

**Propósito:** Este documento actúa como la Única Fuente de la Verdad (Single Source of Truth - SSoT) del proyecto. Su función es indexar, cruzar referencias y, lo más importante, **corregir sistemáticamente** toda la información desactualizada o errónea presente en la documentación existente, ofreciendo una visión unificada y precisa del estado del juego.

---

## SECCIÓN 1: ÍNDICE DE DOCUMENTACIÓN

A continuación, se listan todos los documentos presentes en el directorio `docs/`, su propósito y su estado actual dentro del ecosistema del proyecto:

*   **`README.md`**: Reglas de gobernanza, definición de la SSoT y estándares de calidad del proyecto.
*   **`TECHNICAL_MASTER_SPEC.md`**: Especificación técnica maestra (728 líneas). **ESTADO: REQUIERE CORRECCIONES CRÍTICAS** (ver Sección 2).
*   **`01_sprint_progress.md`**: Estado y progreso del Sprint 1.
*   **`02_architecture_and_ui.md`**: Sistema de diseño UI, layout Flexbox, ubicaciones de assets y paleta de colores base.
*   **`03_game_data_models.md`**: Interfaces de TypeScript y esquemas JSON para los datos del juego.
*   **`04_design_system.md`**: Wireframes, matriz de z-index y sistema de colorboxing.
*   **`05_sprint1_tasks.md`**: Asignación de tareas del sprint.
*   **`06_meeting_presentation_guide.md`**: Guía para reuniones y diagramas de arquitectura en PlantUML.
*   **`07_mvp_user_flow.md`**: Flujo de experiencia de usuario (UX) para las 3 fases del juego.
*   **`07_team_setup_guide.md`**: Instrucciones de configuración para el equipo *(NOTA: Número duplicado con el documento anterior)*.
*   **`08_figma_ui_diagrams.md`**: Diagramas PlantUML de la interfaz exportados desde conceptos de Figma.
*   **`09_scrum_sprint_planning.md`**: Ceremonias Scrum y planificación ágil.
*   **`lore.md`**: Historia y trasfondo del juego organizados por episodios. **(REESCRITO)**
*   **`cronologia.md`**: Referencia rápida de la línea temporal de eventos. **(NUEVO)**
*   **`personajes_temas_decisiones.md`**: Detalles sobre personajes, temas centrales, la tienda y ramificaciones de decisiones. **(NUEVO)**
*   **`biblia_estetica.md`**: Biblia de arte y dirección visual. Define la estética "Duotono Posterizado con Grano Analógico", pipeline técnico de procesamiento de sprites, paleta de color canónica (azul CST), reglas por capa visual, y sistema de post-procesado dinámico. **(NUEVO — CREADO)**
*   **`ref_estetica_01.jpg`**: Imagen de referencia estética #1 (prioridad máxima). **(NUEVO)**
*   **`ref_estetica_02.jpg`**: Imagen de referencia estética #2. **(NUEVO)**
*   **`contexto_unificado.md`**: **ESTE DOCUMENTO** (Índice y correcciones maestras).

---

## SECCIÓN 2: CORRECCIONES CRÍTICAS A DOCUMENTACIÓN EXISTENTE

La documentación técnica y de diseño previa contiene inconsistencias con la visión final del juego. A continuación se detalla **cada pieza de información errónea o desactualizada**, junto con su **versión CORRECTA y canónica**:

1.  **El escenario NO es un puesto fronterizo de control:**
    *   *Corrección:* Es una **TIENDA / LOCAL COMERCIAL** ubicada en Portwall (ciudad de arquitectura brutalista reconstruida tras la toma del Frente de Liberación Popular). El protagonista, cuyo nombre se omite intencionalmente, administra esta tienda bajo las órdenes de su "amigo" y jefe, Garrett.
    *   *Documentos Afectados:* `TECHNICAL_MASTER_SPEC.md`, `04_design_system.md`, `06_meeting_presentation_guide.md`, `07_mvp_user_flow.md`.

2.  **Horario de trabajo real:**
    *   *Corrección:* El horario laboral del protagonista es de **12:00 PM (Mediodía) a 00:00 AM (Medianoche)**. El toque de queda en Portwall entra en vigor exactamente a la medianoche. (NO de 00:00 a 06:00 AM como indicaban documentos anteriores).
    *   *Documentos Afectados:* `TECHNICAL_MASTER_SPEC.md`, `06_meeting_presentation_guide.md`, `07_mvp_user_flow.md`.

3.  **Ausencia total de entidades sobrenaturales:**
    *   *Corrección:* **No hay monstruos ni eventos paranormales.** Todo el horror es de naturaleza psicológica y química. Las alucinaciones ("acechadores" o visiones) son producto del Trastorno de Estrés Postraumático (PTSD) del protagonista y del severo síndrome de abstinencia causado por las medicinas adictivas del Consorcio Stratton-Tate (C.S.T.). Toda referencia a la propiedad `isEntity` o criaturas debe ser eliminada.
    *   *Documentos Afectados:* `TECHNICAL_MASTER_SPEC.md` (Módulo 07 Sanity, `isEntity` en el modelo de visitantes).

4.  **Mecánica del espejo convexo DESCARTADA:**
    *   *Corrección:* El uso de un espejo convexo en la interfaz ha sido eliminado. La cámara conectada a la PC de la tienda cumple ahora exactamente esa misma función narrativa y mecánica.
    *   *Documentos Afectados:* `04_design_system.md`, `06_meeting_presentation_guide.md`.

5.  **Color corporativo del C.S.T. es AZUL, no rojo:**
    *   *Corrección:* Todo el branding, sellos y paleta de colores asociados al Consorcio Stratton-Tate (C.S.T.) deben utilizar el color **AZUL**, reemplazando cualquier referencia antigua al rojo.
    *   *Documentos Afectados:* `02_architecture_and_ui.md` (paleta de colores), y los recursos gráficos `sello-cst.png` / `sello-cst-2.png`.

6.  **Versión real del Expo SDK:**
    *   *Corrección:* Aunque la documentación menciona repetidamente "Expo SDK 56", el archivo `package.json` establece la versión instalada como **Expo SDK 57** (`^57.0.20` y dependencias en `~57.x`, utilizando React Native 0.86.3). Todos los documentos deben reflejar SDK 57.
    *   *Documentos Afectados:* Múltiples referencias dispersas en la documentación.

7.  **La deshumanización es un proceso BIDIRECCIONAL y sistémico:**
    *   *Corrección:* El juego no trata únicamente sobre el protagonista decidiendo deshumanizar a los clientes. El sistema burocrático del C.S.T. **impone** la deshumanización: los documentos oficiales reducen a las personas a meros puntos de datos, y las regulaciones corporativas reducen el comercio humano a un frío cumplimiento de normativas.

8.  **Múltiples facetas del Mercado Negro (Precio Negro):**
    *   *Corrección:* El mercado negro no es simplemente una forma de ganar más dinero; tiene usos complejos y vitales:
        *   Adulterar productos.
        *   Pagar extorsiones.
        *   Comprar productos ilegales o realizar trueques.
        *   Justificar auditorías (mezclando estratégicamente ventas negras con ventas blancas para que el inventario concuerde y cuadren los números).
        *   *Nota mecánica:* No siempre será posible o seguro vender un producto en negro.

9.  **Medicinas adictivas del C.S.T. como mecanismo de Control Social:**
    *   *Corrección:* El Consorcio (C.S.T.) distribuye e impulsa medicinas altamente adictivas bajo la excusa de "lanzamientos de prueba". Son estas drogas las que provocan las severas alucinaciones terroríficas en los ciudadanos (incluido el protagonista) cuando experimentan síndrome de abstinencia, funcionando como un perverso método de control poblacional. (Debe integrarse como mecánica central).

10. **Arquitectura Brutalista:**
    *   *Corrección:* Tras el conflicto, la ciudad de Portwall fue reconstruida bajo un estricto estilo **brutalista** (típico de la era de los años 2000 en este universo). Esto afecta directamente la dirección de arte de todos los fondos, sprites de entorno y decorado de la tienda.

11. **Refactorización urgente de `ShiftScreen.tsx`:**
    *   *Corrección:* El archivo actual `ShiftScreen.tsx` tiene **543 líneas**, lo cual viola directamente la regla estipulada en `docs/README.md` que exige un máximo de **200 líneas por archivo**. Debe ser refactorizado en componentes más pequeños.

12. **`useShiftEngine.ts` es únicamente un ESQUELETO:**
    *   *Corrección:* Actualmente, el hook del motor solo maneja los estados `TICK`, `PAUSE` y `RESUME`. Carece por completo de lógica de juego real, sistema de generación (spawning) de visitantes o conteo de infracciones (strikes).

13. **Directorios de core vacíos:**
    *   *Corrección:* Los directorios `src/core/shift/` y `src/core/sanity/` existen en la estructura de carpetas, pero **están VACÍOS** y no contienen implementación de lógica de dominio.

14. **`storageService.ts` está desconectado:**
    *   *Corrección:* El servicio existe y tiene métodos de `save/load/clear`, pero actualmente **no está conectado** ni se invoca en ninguna pantalla o flujo del juego.

15. **Sistema de mocks y colorboxing deshabilitado:**
    *   *Corrección:* Los "colorboxes" de desarrollo tienen el estilo `display: 'none'` en `ShiftScreen`. Los sprites de la interfaz se están importando directamente, saltándose el sistema de *feature flags* que se había diseñado para alternar entre prototipo y arte final.

---

## SECCIÓN 3: ESTADO REAL DEL PROYECTO

### Código Funcional (Implementado)
*   **Flujo de Navegación:** `MainMenu` → `WeeklyIntro` → `DailyIntro` → `GameInterface` → `Shift` ✅
*   **Pantalla de Turno (`ShiftScreen`):** Implementada con 12 componentes superpuestos gestionados estrictamente mediante sistema de *z-index* ✅
*   **Interacciones de Componentes:** Exclusión mutua (abrir un panel cierra otros) y callbacks básicos funcionando ✅
*   **Sistema Tipográfico:** 11 familias de fuentes integradas ✅
*   **Modo Inmersivo (Immersive Mode):** Activado y funcionando ✅
*   **Sistema Responsivo:** Escala uniforme (`UNIFORM_SCALE`) implementada ✅
*   **Mecánicas de PanResponder:** Interacciones táctiles para gavetas (drawers), libreta (notebook), puerta (door) e inventario funcionando ✅

### Código Esqueleto (Sin Lógica Real)
*   **`useShiftEngine`:** Solo posee control básico de tiempo (`TICK/PAUSE/RESUME`).
*   **Game Loop (Bucle de Juego):** No hay generación de visitantes (`spawning`) ni flujo de decisiones programado.
*   **Sistema de Strikes y Evaluación:** Ausente.
*   **Sistema Económico:** La caja registradora existe únicamente a nivel de UI, sin lógica de transacciones o mercado negro subyacente.
*   **Sistema de Cordura (Sanity/Stress):** No implementado.
*   **Sistema de Guardado:** El servicio existe pero no está cableado al flujo de la aplicación.

### Arte / Assets
*   **Sprites:** Existen 14 archivos de sprites en `src/assets/sprites/` (13 en formato `.webp` y 1 `.png`).
*   **Objetos Pre-renderizados 3D:** Fotorrealistas integrados ✅ *(Requieren recontextualización para alinearse a la estética brutalista y entorno de tienda)*.
*   **Sprite del Personaje:** Foto procesada con *dither/halftone* (A la espera de una decisión final de dirección de arte).
*   **Menús:** Estilo actual "flat dark-mode" genérico (Requiere un rediseño urgente para coincidir con la temática del C.S.T.).
*   **Sprite de Caja de Inventario:** Utiliza un patrón pixelado que es **DISONANTE** con el resto del estilo fotorrealista 3D pre-renderizado. Requiere reemplazo.

---

## SECCIÓN 4: PRÓXIMOS PASOS CRÍTICOS

Ordenados por prioridad estricta para el avance del proyecto:

1.  **Definir la Biblia de Arte (`biblia_estetica.md`):** Establecerla como la guía absoluta para toda la producción visual, documentando el estilo brutalista y los requerimientos fotorrealistas.
2.  **Recontextualización de Sprites:** Adaptar los sprites existentes al entorno brutalista de Portwall y al contexto de una tienda/comercio.
3.  **Definir el Bucle de Juego (Gameplay Loop):** Diseñar y documentar el flujo completo integrando las nuevas mecánicas de tienda (auditorías, mercado negro, medicinas del C.S.T.).
4.  **Implementar Lógica del Motor de Turno (`useShiftEngine`):** Construir la lógica real de spawning de clientes y gestión de tiempo/eventos.
5.  **Creación de Objetos Críticos Faltantes:** Diseñar el documento de identidad, la orden de compra, los sellos oficiales del C.S.T. (en AZUL), etc.
6.  **Refactorizar `ShiftScreen.tsx`:** Dividir el archivo para reducirlo de 543 líneas al límite de 200 líneas máximo, separando lógica de UI.
7.  **Conectar `storageService`:** Cablear el sistema de guardado al flujo del juego (al inicio/fin de cada turno/día).
8.  **Corregir Referencias de Versiones en Docs:** Actualizar todas las menciones a Expo SDK 56 para que reflejen la versión real (SDK 57) instalada en el proyecto.
