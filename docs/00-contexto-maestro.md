# 00 — CONTEXTO MAESTRO: ISN'T BEHIND
> **OBLIGATORIO:** Este es el primer documento que cualquier agente de IA o desarrollador debe leer antes de tocar una sola línea de código o documentación del proyecto.

---

## 1. IDENTIDAD DEL PROYECTO

**ISN'T BEHIND** es un videojuego móvil de simulación y gestión con elementos de horror psicológico y tensión ambiental, desarrollado en **React Native + Expo SDK 57** para Android.

**Inspiración directa:** *Papers, Please* (mecánica burocrática bajo presión) + *Voices of the Void* (tensión atmosférica, aislamiento, horror sin monstruos).

**Premisa en una frase:** Un hombre roto dirige una tienda brutalista en una ciudad bajo toque de queda corporativo-fascista, atrapado entre la culpa de sobrevivir, la explotación de su único contacto humano y la lenta corrosión química de los fármacos del régimen.

---

## 2. ROL DEL AGENTE DE IA

Cuando trabajes en este proyecto actúas como:

> **Lead Game Developer & Mobile Architect**  
> Especializado en React Native, Expo SDK 57, TypeScript Strict y arquitectura de videojuegos mobile.

**Tu misión:** Producir código que sea legible, escalable, mantenible y correcto. Nunca código que "solo funcione". Cada línea debe poder justificarse con un principio de ingeniería.

**Antes de escribir cualquier código debes:**
1. Leer `STATUS.md` para saber el estado actual del proyecto.
2. Identificar qué pilar de documentación es relevante para la tarea (`01` a `04`).
3. Verificar que la tarea no contradiga ninguna Ley de Oro (Sección 3 de este documento).
4. Confirmar con el usuario si alguna decisión afecta la arquitectura o el diseño de juego.

---

## 3. LEYES DE ORO (VERDADES NO NEGOCIABLES)

Estas reglas nunca se cuestionan ni se ignoran. Si algún documento antiguo en `docs/archive/` dice lo contrario, este documento tiene prioridad absoluta.

### 3.1 Leyes de Narrativa y Mundo

| # | Ley | Detalles |
|---|---|---|
| L1 | **Es una TIENDA, no una frontera** | El escenario es un local comercial brutalista en Portwall. No es un puesto de control migratorio. |
| L2 | **NO hay monstruos ni entidades sobrenaturales** | Todo el horror es PTSD + abstinencia química de los fármacos del C.S.T. Las alucinaciones son perceptivas y psicológicas. `isEntity: false` siempre. |
| L3 | **El C.S.T. es AZUL, no rojo** | Todo el branding del Consorcio Stratton-Tate es azul (`#2E86C1`). Prohibido el rojo en el branding corporativo. |
| L4 | **El turno es de 12:00 PM a 00:00 AM** | El toque de queda de Portwall comienza a medianoche. No de 00:00 a 06:00. |
| L5 | **El protagonista no tiene nombre** | Es intencional. Nunca se le asigna un nombre propio en ningún texto. |
| L6 | **No hay espejo convexo** | Fue reemplazado por la cámara de la PC. Eliminar cualquier referencia a esta mecánica. |

### 3.2 Leyes Técnicas

| # | Ley | Detalles |
|---|---|---|
| T1 | **Expo SDK 57** | React Native `0.86.3`, React `19.x`, TypeScript `5.x Strict`. Siempre verificar en `https://docs.expo.dev/versions/v56.0.0/` (la más cercana disponible). |
| T2 | **Posicionamiento absoluto Figma** | Los sprites NO usan Flexbox. Se posicionan con coordenadas derivadas de Figma. Ver `03-ui-sistema.md`. |
| T3 | **`overflow: 'visible'` en el stage** | Los sprites NO se cortan. Pueden salir de su zona Color Box. Prohibido `overflow: 'hidden'` en `stageContainer`. |
| T4 | **Separación estricta UI / Lógica** | `ShiftScreen.tsx` solo renderiza. La lógica del turno (reloj, economía, strikes, eventos) vive en `useTurnEngine` o reducers. |
| T5 | **Ningún archivo supera las 300 líneas** | Si un componente crece más, se divide. Sin "God Components". |
| T6 | **TypeScript Strict sin `any`** | Todos los estados, props y eventos deben estar fuertemente tipados. Prohibido `any` y `@ts-ignore` sin justificación documentada. |
| T7 | **`resizeMode: 'stretch'` en sprites** | Para que los sprites respeten exactamente el bounding box de Figma. |

### 3.3 Leyes de Calidad de Código

Este proyecto aplica los siguientes principios **cuando corresponden al contexto**. No son dogmas: son herramientas. Aplícalas con criterio.

- **Clean Code:** El código se escribe para ser leído por humanos primero. Nombres descriptivos, funciones cortas, sin comentarios redundantes.
- **SOLID:** Responsabilidad única por componente/hook/módulo. Interfaces sobre implementaciones concretas. Sin dependencias acopladas al framework en la capa de dominio.
- **DRY:** Una sola fuente de verdad para cada pieza de lógica. Sin duplicación de constantes, cálculos ni estructuras de datos.
- **KISS:** La solución más simple que resuelve correctamente el problema. Sin over-engineering especulativo.
- **YAGNI:** No implementar funcionalidades que aún no se necesitan, por más que "podrían ser útiles después".
- **Clean Architecture:** Separación tajante entre Dominio (TypeScript puro) → Aplicación (hooks, reducers) → Infraestructura/UI (React Native, Expo, AsyncStorage).
- **DDD (cuando aplique):** El lenguaje del código refleja el lenguaje del juego. `Turno`, `Visitante`, `Auditoría`, `PrecioNegro` son términos del dominio, no "data", "item" o "record".

> **Principio rector:** El código nunca se escribe únicamente para que funcione. Debe ser legible, escalable, reutilizable y fácil de mantener.

---

## 4. TECH STACK CANÓNICO

| Tecnología | Versión | Notas |
|---|---|---|
| **Expo SDK** | 57 | `^57.0.20` |
| **React Native** | 0.86.3 | |
| **React** | 19.x | |
| **TypeScript** | 5.x | `strict: true`, `noImplicitAny: true` |
| **Navegación** | `@react-navigation/native` | Stack Navigator |
| **Fuentes** | `expo-font` | 10 familias Y2K (ver `03-ui-sistema.md`) |
| **Animaciones** | `react-native` `Animated` API | PanResponder para drag |
| **Hápticos** | `expo-haptics` | |
| **Navigation Bar** | `expo-navigation-bar` | Oculta en todo el juego |
| **Assets** | `.webp` | Sprites posterizados. `.png` solo para SVG/sellos |

---

## 5. ESTRUCTURA DEL PROYECTO

```
isnt-behind/
├── src/
│   ├── screens/          # Pantallas (solo UI y orquestación)
│   │   ├── MainMenuScreen.tsx
│   │   ├── ShiftScreen.tsx       ← PANTALLA PRINCIPAL (solo renderizado)
│   │   ├── DailyIntroScreen.tsx
│   │   └── WeeklyIntroScreen.tsx
│   ├── components/       # Componentes reutilizables
│   │   ├── core/         # FontProvider, layout base
│   │   └── shift/        # Componentes específicos del turno
│   ├── hooks/            # Lógica desacoplada de la UI
│   │   └── useTurnEngine.ts      ← MOTOR DEL TURNO (pendiente de crear)
│   ├── config/           # Configuraciones centralizadas
│   │   └── sceneConfig.ts        ← REGISTRO DE SPRITES (pendiente de crear)
│   ├── domain/           # TypeScript puro: reglas de negocio
│   │   └── turn/         # Lógica del turno, economía, eventos
│   ├── models/           # Interfaces y tipos TypeScript
│   │   └── types.ts
│   ├── assets/
│   │   └── sprites/      # .webp posterizados (14 sprites actuales)
│   └── theme/
│       ├── typography.ts # TYPOGRAPHY constante con 10 familias
│       └── colors.ts     # Paleta canónica (azul CST, negro, petróleo)
├── docs/
│   ├── 00-contexto-maestro.md    ← ESTE ARCHIVO
│   ├── STATUS.md                 ← Estado actual del proyecto
│   ├── 01-lore-narrativa.md      ← Lore, mundo, personajes
│   ├── 02-game-design.md         ← Mecánicas, economía, turno
│   ├── 03-ui-sistema.md          ← Coordenadas Figma, estética, tipografía
│   ├── 04-arquitectura-tecnica.md← Contratos de código, hooks, tipos
│   └── archive/                  ← Documentos históricos (solo lectura)
└── AGENTS.md                     ← Reglas para agentes IA (raíz del repo)
```

---

## 6. MAPA DE DOCUMENTACIÓN — GUÍA DE LECTURA POR TAREA

Antes de trabajar, identifica cuál es tu tarea y ve directamente al documento correcto.

```
¿Vas a tocar historia, diálogos o personajes?
  → Lee: 01-lore-narrativa.md

¿Vas a tocar mecánicas de turno, economía, clientes o eventos?
  → Lee: 02-game-design.md

¿Vas a mover sprites, tocar estilos, coordenadas Figma o la estética visual?
  → Lee: 03-ui-sistema.md

¿Vas a crear hooks, componentes, tipos TS o arquitectura de código?
  → Lee: 04-arquitectura-tecnica.md

¿Quieres saber qué funciona hoy, qué está roto o qué toca hacer ahora?
  → Lee: STATUS.md
```

---

## 7. FLUJO DE TRABAJO APROBADO

Para cualquier nueva funcionalidad o cambio significativo, sigue estas 3 fases:

### Fase A — Definición (antes de escribir código)
1. Identificar qué documento del sistema es el responsable de esa funcionalidad.
2. Verificar que no contradiga ninguna Ley de Oro.
3. Anotar en `STATUS.md` qué se va a hacer.

### Fase B — Lógica (primero la mecánica, sin arte)
1. Implementar la lógica en el módulo de dominio o en un hook aislado.
2. Verificar que compila y que los tipos son correctos.
3. La pantalla puede usar datos de prueba simples (strings, números fijos).

### Fase C — Arte y Skin (conectar los sprites y animaciones)
1. Conectar los assets visuales sobre la base funcional.
2. Validar contra `03-ui-sistema.md` (coordenadas Figma, pipeline de sprites).
3. Actualizar `STATUS.md` marcando la tarea como completada.

---

## 8. PROHIBICIONES ABSOLUTAS

- ❌ Código sin tipos (`any`, `object` sin interfaz, callbacks sin tipado).
- ❌ Lógica de juego dentro de componentes React (`useState` de turno dentro de `ShiftScreen`).
- ❌ Sprites con `overflow: 'hidden'` que los corte.
- ❌ Sprites sin `resizeMode: 'stretch'`.
- ❌ Coordenadas de sprite hardcodeadas en píxeles sin escalar por `windowHeight / 1456`.
- ❌ Archivos de componentes de más de 300 líneas sin justificación.
- ❌ Entidades sobrenaturales en narrativa o código (`isEntity: true` en visitantes normales).
- ❌ Uso del color rojo como branding del C.S.T.
- ❌ Referencias al "puesto fronterizo" o al "espejo convexo".
- ❌ Código escrito sin leer primero el documento maestro relevante.
