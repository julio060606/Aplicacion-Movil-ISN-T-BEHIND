---
name: expo-sdk-guidelines
description: >-
  Use this skill when developing, configuring, or troubleshooting React Native
  and Expo code in ISN'T BEHIND (Expo SDK 57 / React Native 0.86.3, APIs, fonts,
  haptics, navigation, styles, or performance).
---

# Expo SDK & React Native Guidelines (ISN'T BEHIND)

Este skill define las pautas técnicas, de compatibilidad y buenas prácticas para el entorno móvil de *ISN'T BEHIND*.

---

## 1. Stack Tecnológico y Versiones Oficiales

| Dependencia | Versión Oficial | Archivo Fuente |
|---|---|---|
| **Expo SDK** | `^57.0.20` (SDK 57) | `package.json` |
| **React Native** | `0.86.3` | `package.json` |
| **React** | `19.x` | `package.json` |
| **TypeScript** | `~5.x` (`strict: true`) | `tsconfig.json` |
| **expo-font** | `~13.x` | Fuentes retro diegéticas |
| **expo-haptics** | Incluido en SDK 57 | Vibración física en cajones y armas |
| **expo-navigation-bar** | Incluido en SDK 57 | Oculta la barra de navegación Android |

> **Documentación Oficial de Referencia:** Siempre consultar `https://docs.expo.dev/versions/v56.0.0/` (versión más cercana disponible en docs oficiales).

---

## 2. REGLA DE ORO DE SEGURIDAD: COMANDOS DE TERMINAL

⚠️ **PROHIBIDO EJECUTAR COMANDOS DE TERMINAL SIN PERMISO EXPLÍCITO.**  
Ningún agente de IA debe ejecutar scripts, `npx`, `npm`, `powershell` o `bash` en la máquina del usuario salvo que este lo pida explícitamente en el mensaje actual. Si necesitas hacer cambios de código, usa siempre las herramientas de edición de archivos (`write_to_file`, `replace_file_content`).

---

## 3. Pautas de Interfaz Móvil e Inmersión

### Pantalla Completa Diegética
* La app debe mantener la barra de estado oculta: `<StatusBar hidden={true} />`.
* La barra de navegación de Android se oculta mediante `expo-navigation-bar` configurado en `src/components/core/FontProvider.tsx`.

### Tipografía Retro (Y2K / Terminal)
* NUNCA hardcodear nombres de fuentes como `"Arial"` o `"monospace"`.
* Importar siempre la constante canónica:
  ```typescript
  import { TYPOGRAPHY } from '../theme/typography';
  // Uso: fontFamily: TYPOGRAPHY.systemPC, TYPOGRAPHY.cleanDoc, etc.
  ```

### Feedback Táctil (`expo-haptics`)
Cada interacción física en la tienda debe ofrecer respuesta sensorial:
* **Tap ligero / Selección en carrusel:** `Haptics.selectionAsync()` o `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`.
* **Abrir/cerrar cajón o PC:** `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)`.
* **Desenfundar revólver / Abrir caja registradora:** `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)`.
* Siempre envolver en `try { ... } catch {}` para evitar caídas en dispositivos no compatibles.

---

## 4. Rendimiento en Animaciones (`Animated`)

1. **`useNativeDriver: true` OBLIGATORIO** para todas las animaciones de `transform` (`translateX`, `translateY`, `scale`) y `opacity`.
2. **Evitar cierres estáticos en `PanResponder`:** Al crear un `PanResponder` dentro de un hook o componente, usar `useRef` sincronizado o referencias mutables para leer estados actuales (`isBlocked`, etc.) sin recrear el listener en cada render.
3. **No anidar estilos en spreads incompatibles:**
   * Usar arrays de estilos tipados de React Native:
     ```tsx
     style={[baseStyle, transforms.length > 0 && { transform: transforms }]}
     ```
   * En `StyleSheet.create`, evitar el spread de `StyleSheet.absoluteFillObject` si genera conflictos de tipo con TypeScript; usar propiedades explícitas (`{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }`).
