# 🚀 GUÍA DE TRABAJO EN EQUIPO (TEAM SETUP GUIDE)
**Proyecto:** ISN'T BEHIND  
**Objetivo:** Instrucciones claras para trabajar en el proyecto tras la consolidación de la arquitectura base en el Sprint 1.

---

## 1. Módulos y Dependencias Base Instaladas (Expo SDK 56)

Se han integrado las librerías oficiales del ecosistema Expo necesarias para completar la especificación técnica. **NO utilices alternativas o librerías nativas incompatibles con Expo Go/Dev Client:**

*   **Persistencia:** `@react-native-async-storage/async-storage` (La especificación descarta SQLite a favor de AsyncStorage para guardar estados JSON simples del día).
*   **Feedback Táctil:** `expo-haptics` (Para latidos de estrés y golpes de sello).
*   **Sensores de Movimiento:** `expo-sensors` (Para la mecánica del Giroscopio de "Mirar Atrás").
*   **Audio Ambiental:** `expo-audio` / `expo-av` (Para paisajes sonoros).

## 2. Modelos de Dominio Consolidados (`src/models/`)

Todas las interfaces que estaban descritas en `docs/03_game_data_models.md` ahora existen como código TypeScript puro y estricto. **Úsalas y no uses `any`:**

*   `types.ts`: Parámetros completos de navegación (incluyendo pantallas `GameOver` y `Victory`).
*   `shift.ts`: `IShiftState`, `ShiftPhase`, `ShiftAction` (El core del bucle de tiempo).
*   `visitor.ts`: `IVisitor`, `IDocumentData` (Reglas de documentos y discrepancias).
*   `sanity.ts`: `ISanityMetrics`, `IActiveAnomaly` (Motor de estrés y apariciones).
*   `save.ts`: `ISaveGameSchema` (Esquema estricto de guardado).
*   `config.ts`: `IDayConfiguration` (Variables que dictan la dificultad de cada día).

## 3. Estructura de Directorios Limpia (Clean Architecture)

Se han eliminado los archivos informales y se ha establecido un árbol de carpetas formal:

```text
src/
├── components/     # UI de React Native (Hooks y JSX)
├── context/        # Providers globales (ej. AssetContext.tsx)
├── core/           # Lógica pura, matemáticas y FSM (Sin React)
│   ├── shift/      # Reglas del turno
│   └── sanity/     # Cálculos del medidor de paranoia
├── hooks/          # El "pegamento" entre Core y UI (ej. useShiftEngine.ts)
├── models/         # Tipos y Contratos (TS puros)
├── navigation/     # Configuración de routers
├── screens/        # Vistas completas de cada ruta
├── services/       # Integración con Hardware o APIs
│   └── storage/    # storageService.ts (AsyncStorage)
├── theme/          # Sistema de Diseño, Colores, Tipografías
└── utils/          # Responsive y Diccionarios
```

## 4. Uso de Mocks (Feature Flag)

El `AssetProvider` está envuelto en `App.tsx`. 
Para cualquier componente visual, puedes usar el hook `useAssetSwitcher()` desde `src/context/AssetContext.tsx` para saber si debes pintar una "caja gris" o una imagen/svg final.

```tsx
import { useAssetSwitcher } from '../context/AssetContext';

const MiComponente = () => {
  const { useMockAssets } = useAssetSwitcher();
  return useMockAssets ? <View style={mockStyle} /> : <Image source={realSrc} />;
}
```

## 5. Próximos Pasos Recomendados (Desarrollo Paralelo)

1.  **Dev 1 (Core):** Implementar la FSM completa en `src/hooks/useShiftEngine.ts` y cargar los JSONs en `src/core/shift/`.
2.  **Dev 2 (Menú/Intros):** Conectar `storageService.ts` en `MainMenuScreen` para habilitar [ CONTINUAR ] cuando existan datos de partida.
3.  **Dev 3 (Mesa/Gameplay):** Enlazar el carrusel de documentos (`DraggableNotebook.tsx`) y los sellos a las acciones de `useShiftEngine` (`DECIDE_VISITOR`).
