# 04 — ARQUITECTURA TÉCNICA: ISN'T BEHIND
> **Pilar 4 de 4.** Fuente de verdad canónica para la arquitectura de código, contratos TypeScript, hooks modulares, sistema de sprites y estructura de carpetas.  
> **Última actualización:** 2026-09-21 (Refactorización Modular Completa — Clean Architecture)

---

## 1. ARQUITECTURA GLOBAL Y REGLAS DE ORO

El proyecto sigue **Clean Architecture** (Arquitectura Limpia) con separación estricta de responsabilidades (*Separation of Concerns — SoC*) y principio de responsabilidad única (*Single Responsibility Principle — SRP*).

```
┌─────────────────────────────────────────────────────────────┐
│  CAPA 1: INFRAESTRUCTURA Y VISTAS (React Native / UI)       │
│  src/screens/         → Pantallas (Orquestadores de vistas) │
│  src/components/      → Componentes atómicos (GameSprite)   │
│  src/services/        → AsyncStorage, Sensores, Audio       │
├─────────────────────────────────────────────────────────────┤
│  CAPA 2: APLICACIÓN (Orquestación y Hooks Especializados)   │
│  src/hooks/useDrawers.ts     → Estado y animación cajones   │
│  src/hooks/useOverlays.ts    → Monitor, caja, apuntar       │
│  src/hooks/useSceneCamera.ts → Zoom, paneo, lámpara         │
│  src/navigation/             → Navegadores Stack y Drawer   │
├─────────────────────────────────────────────────────────────┤
│  CAPA 3: DOMINIO (Lógica de Negocio y Contratos de Datos)   │
│  src/hooks/useTurnEngine.ts  → Motor puro de turno          │
│  src/models/                 → Contratos TypeScript / Datos │
├─────────────────────────────────────────────────────────────┤
│  CAPA 4: CONFIGURACIÓN Y DATOS ESTÁTICOS (Single Source)    │
│  src/config/sceneConfig.ts   → Registro central Figma 2.5D  │
│  src/theme/                  → Tipografías y paleta color   │
│  src/utils/                  → Responsive math, diccionario │
└─────────────────────────────────────────────────────────────┘
```

### Reglas de Dependencia Inquebrantables
1. **La UI no contiene lógica de juego:** Los componentes visuales y las pantallas solo pintan lo que reciben de los hooks. Cero reglas de strikes, inventario o economía dentro de un JSX.
2. **Los datos están separados del renderizado:** Las coordenadas y dimensiones de Figma viven exclusivamente en `src/config/sceneConfig.ts`. Cero píxeles fijos hardcodeados en los componentes.
3. **TypeScript Estricto:** Modo `strict: true`. Prohibido el uso de `any` y `@ts-ignore` injustificados.

---

## 2. ESTRUCTURA CANÓNICA DE CARPETAS Y ARCHIVOS (`src/`)

A continuación se documenta el árbol real, exhaustivo y auditado de la carpeta `src/`. Todo archivo listado aquí tiene un propósito justificado; cualquier archivo ajeno debe ser considerado sospechoso o residual.

```
src/
├── components/
│   ├── core/
│   │   └── FontProvider.tsx         — Proveedor de fuentes retro (expo-font) + oculta NavigationBar
│   ├── menu/
│   │   ├── LogoSvg.tsx              — Logotipo vectorial corporativo del C.S.T.
│   │   └── TitleSvg.tsx             — Título vectorial diegético para la pantalla de inicio
│   └── scene/
│       └── GameSprite.tsx           — RENDERIZADOR ATÓMICO: escala y pinta 1 sprite desde sceneConfig
│
├── config/
│   └── sceneConfig.ts               — FUENTE DE VERDAD (SSoT): Diccionario de sprites, coordenadas Figma,
│                                      offsets, zonas de color, panConfig y drawerConfig
│
├── hooks/
│   ├── useTurnEngine.ts             — DOMINIO PURO: Strikes, reloj 12:00-00:00, economía, estrés, píldoras
│   ├── useDrawers.ts                — APLICACIÓN UI: Estado y animación de apertura/cierre de cajones
│   ├── useOverlays.ts               — APLICACIÓN UI: Control de Monitor PC, Caja Registradora y Apuntar
│   └── useSceneCamera.ts            — APLICACIÓN UI: Zoom, paneo táctil (Zona B) y arrastre de la lámpara
│
├── models/                          — CONTRATOS DE DATOS DEL DOMINIO (Ver Sección 4)
│   ├── types.ts                     — Navegación (RootStackParamList, MenuDrawerParamList), Game Over
│   ├── visitor.ts                   — Entidad Cliente/Visitante, Documentos, sellos, discrepancias
│   ├── config.ts                    — Estructura de configuración de días (IDayConfiguration, clima)
│   ├── sanity.ts                    — Métricas psicológicas (estrés, abstinencia, anomalías activas)
│   └── save.ts                      — Esquema de guardado local (partida, perfil de operador, audio)
│
├── navigation/
│   └── MenuDrawerNavigator.tsx      — Menú lateral diegético de CST (Inicio, Expediente, Ajustes)
│
├── screens/
│   ├── MainMenuScreen.tsx           — Pantalla principal / Acceso a Story y Opciones
│   ├── OperatorRegistrationScreen.tsx — Formulario de registro y firma de contrato con CST
│   ├── WeeklyIntroScreen.tsx        — Cinemática de introducción semanal
│   ├── DailyIntroScreen.tsx         — Cinemática y directivas antes de iniciar el turno
│   ├── DossierScreen.tsx            — Manual de consulta / Expediente con pestañas
│   ├── SettingsScreen.tsx           — Ajustes del juego (volumen, vibración, pantalla)
│   └── ShiftScreen.tsx              — ORQUESTADOR DE ESCENA: Ensambla los 4 hooks + GameSprite
│
├── services/
│   └── storage/
│       └── storageService.ts        — Capa de infraestructura para AsyncStorage (load/save/clear)
│
├── theme/
│   ├── colors.ts                    — Paleta oficial (Azul CST #2E86C1, ámbar, oscuros diegéticos)
│   ├── typography.ts                — Familias tipográficas retro (VCR OSD Mono, Terminal, etc.)
│   └── globalStyles.ts              — Estilos compartidos de botones retro, bordes y contenedores
│
└── utils/
    ├── dictionary.ts                — Textos, mensajes y cadenas de lore en español centralizados
    └── responsive.ts                — Fórmulas de escala para formularios y pantallas de menús
```

---

## 3. DUALIDAD CLAVE: `sceneConfig.ts` vs `GameSprite.tsx`

Una de las decisiones arquitectónicas fundamentales de este proyecto es la separación total entre **Datos** y **Renderizado**:

| Aspecto | `src/config/sceneConfig.ts` | `src/components/scene/GameSprite.tsx` |
|---|---|---|
| **Naturaleza** | **DATOS ESTÁTICOS (El Plano / Base de Datos)** | **COMPONENTE REACT (El Constructor / Pintor)** |
| **¿Contiene React?** | NO. TypeScript puro y referencias `require(...)`. | SÍ. Es un `React.FC<GameSpriteProps>`. |
| **Responsabilidad** | Registrar qué existe en Figma, dónde está (`figmaLeft`, `figmaTop`), qué dimensiones tiene (`figmaWidth`, `figmaHeight`), su zIndex y su comportamiento (`static`, `tappable`, `pannable`, `shadow`). | Recibir un `ISceneElement` + el factor `scale` del móvil actual, calcular `(figmaLeft - 619) * scale`, y renderizar el sprite. |
| **Si el artista mueve un sprite** | **Solo se edita este archivo.** Cambias `figmaLeft` o `figmaTop`. | **No se toca.** Ni una sola línea de código React cambia. |
| **Si cambia el motor de render** | **No se toca.** No le importa si se usa `<Image>`, Skia o SVG. | **Solo se edita aquí.** Si añades un filtro CRT o corriges un fallback, los 30 sprites se actualizan a la vez. |

### Fórmula de Conversión Canónica
En `GameSprite.tsx`:
$$\text{screenLeft} = (\text{figmaLeft} - \text{FIGMA\_OFFSET\_X}) \times \text{scale}$$
$$\text{screenTop} = (\text{figmaTop} - \text{FIGMA\_OFFSET\_Y}) \times \text{scale}$$
Donde:
* $\text{FIGMA\_OFFSET\_X} = 619$
* $\text{FIGMA\_OFFSET\_Y} = 239$
* $\text{scale} = \frac{\text{windowHeight}}{1456}$

---

## 4. LA CARPETA `src/models/`: ENTIDADES Y CONTRATOS DE DOMINIO

### ¿Por qué se llama `models` y qué representa?
En arquitectura de software (MVC, DDD, Clean Architecture), un **Modelo** representa la estructura y lógica de las entidades de negocio. En TypeScript, esta carpeta contiene los **Contratos de Datos**:
* **No son exclusivos del bucle de juego:** Cubren la persistencia en disco (`save.ts`), la navegación por pantallas (`types.ts`), la parametrización de niveles (`config.ts`), y los datos diegéticos de ciudadanos (`visitor.ts`).
* **Garantizan tipado estricto:** Si un programador o un agente de IA intenta leer `visitor.isEntity`, TypeScript rechazará la compilación de inmediato, protegiendo las reglas de oro del juego.

### Modelos Canónicos Auditados:
1. **`types.ts`**: Rutas de React Navigation (`RootStackParamList`, `MenuDrawerParamList`, `DossierTabParamList`) y motivos de derrota (`GameOverReason`).
2. **`visitor.ts`**: Contrato `IVisitor` y `IDocumentData`. Incluye nombre, foto, documentos, discrepancias y la bandera de trauma (`triggersTrauma?: boolean`).
3. **`config.ts`**: `IDayConfiguration`. Define duración en segundos, número de visitantes, clima y directivas activas por día.
4. **`sanity.ts`**: `ISanityMetrics` e `IActiveAnomaly`. Parámetros del horror psicológico, estrés (0-100) y alucinaciones.
5. **`save.ts`**: `ISaveGameSchema` e `IOperatorProfile`. Formato JSON guardado en AsyncStorage.

---

## 5. CAPA DE APLICACIÓN: LOS 4 HOOKS ESPECIALIZADOS

Para evitar que `ShiftScreen.tsx` vuelva a convertirse en un archivo monolítico inmanejable de 1300 líneas, la lógica se distribuye en 4 hooks con límites claros:

```
                      ┌────────────────────────┐
                      │    ShiftScreen.tsx     │
                      │  (Orquestador Visual)  │
                      └───────────┬────────────┘
         ┌────────────────┬───────┴────────┬────────────────┐
         ▼                ▼                ▼                ▼
┌─────────────────┐ ┌───────────┐ ┌─────────────────┐ ┌───────────┐
│  useOverlays    │ │useDrawers │ │ useSceneCamera  │ │useTurnEngine│
│ (Monitor, Caja, │ │(Cajones y │ │(Zoom, Cámara B, │ │ (Dominio,   │
│     Apuntar)    │ │Carruseles)│ │    Lámpara)     │ │ Strikes)    │
└─────────────────┘ └───────────┘ └─────────────────┘ └───────────┘
```

### 5.1 `useTurnEngine.ts` (Dominio Puro)
* **Responsabilidad:** Gestionar el estado del turno `IShiftState`.
* **Propiedades:** `shiftState` (día, reloj `12:00` a `00:00`, strikes, estrés, nivel de abstinencia).
* **Acciones:** `sellAtLegalPrice`, `sellAtBlackMarketPrice`, `approveVisitor`, `rejectVisitor`, `takeCSTPill`, `addStrike`.
* **Cero UI:** No contiene ningún `useState` de cajones abiertos ni animaciones.

### 5.2 `useOverlays.ts` (Aplicación - Overlays)
* **Responsabilidad:** Administrar las 3 ventanas modales diegéticas de pantalla completa.
* **Overlays gestionados:**
  1. **Monitor PC:** Zoom-in (0.88 → 1.0) con oscurecimiento.
  2. **Caja Registradora:** Slide vertical desde abajo hacia arriba con oscurecimiento.
  3. **Apuntar Arma:** Modo de máxima prioridad (zIndex 999), bloquea cualquier otra interacción.
* **Propiedad derivada:** `isBlocked = isAiming || monitorOpen || cajaOpen`. Si `isBlocked` es `true`, la cámara y los cajones quedan congelados.

### 5.3 `useDrawers.ts` (Aplicación - Cajones y Carruseles)
* **Responsabilidad:** Leer dinámicamente qué elementos en `sceneConfig.ts` tienen `drawerConfig` y administrar su animación de apertura/cierre.
* **Dinamismo:** No tiene IDs hardcodeados. Itera sobre `ADAPTED_ELEMENTS`. Si se añade un tercer cajón en la configuración, este hook lo soporta automáticamente.
* **Carrusel de mesa:** Gestiona el índice del producto en la balanza/mostrador (`tableCarouselIdx`).

### 5.4 `useSceneCamera.ts` (Aplicación - Cámara y Lámpara)
* **Responsabilidad:** Zoom cinematográfico y paneo horizontal en la zona de atención al cliente (Zona B).
* **Lámpara de cabeza:** Lee `panConfig.maxTranslateX` y `maxTranslateY` de `sceneConfig.ts` para permitir el arrastre libre con el dedo y el reset rápido con swipe.

---

## 6. LA PANTALLA PRINCIPAL: `ShiftScreen.tsx`

`ShiftScreen.tsx` es ahora un **Orquestador Puro** de menos de 400 líneas. Su ciclo de vida es:
1. Obtiene la escala vertical: `scale = windowHeight / 1456`.
2. Instancia los 4 hooks en cascada lógica:
   ```tsx
   const engine   = useTurnEngine(currentDay);
   const overlays = useOverlays(scale, windowHeight);
   const drawers  = useDrawers(scale, overlays.isBlocked);
   const camera   = useSceneCamera(scale, overlays.isBlocked, drawers.carouselFocused);
   ```
3. Pinta los sprites estáticos y de sombra iterando sobre `ADAPTED_ELEMENTS`:
   ```tsx
   {ADAPTED_ELEMENTS.filter(e => e.behavior === 'static' || e.behavior === 'shadow')
     .map(e => <GameSprite key={e.id} element={e} scale={scale} />)}
   ```
4. Renderiza los elementos interactivos usando el helper matemático de posición `pos(e)` y conectando los handlers de los hooks.
5. Pinta los overlays condicionales (`isAiming`, `monitorOpen`, `cajaOpen`) fuera de la cámara global.

---

## 7. CONVENCIONES DE CÓDIGO Y GUÍA PARA AGENTES IA

Para que ningún desarrollador o agente de IA futuro degrade la arquitectura:

1. **PROHIBIDO mezclar lógica de juego en componentes:** Nunca declarar `strikes`, `reloj` ni `inventario` dentro de un componente de UI.
2. **PROHIBIDO colocar coordenadas arbitrarias en la UI:** Cualquier nuevo sprite debe registrarse en `src/config/sceneConfig.ts` con sus coordenadas Figma originales.
3. **PROHIBIDO crear subcarpetas huérfanas:** No crear carpetas como `core/` o `context/` sin una justificación de arquitectura aprobada y documentada.
4. **Límite de líneas por archivo:**
   * Pantallas: Máximo 400 líneas.
   * Hooks: Máximo 180 líneas.
   * Componentes: Máximo 150 líneas.
   * Si un archivo supera este límite, debe modularizarse inmediatamente.
