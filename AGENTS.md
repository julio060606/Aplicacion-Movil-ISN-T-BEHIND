# 🛑 INSTRUCCIONES OBLIGATORIAS PARA CUALQUIER AGENTE DE IA (LLM) 🛑

Si eres un asistente de Inteligencia Artificial leyendo este repositorio, **TIENES QUE CUMPLIR ESTAS REGLAS** antes de escribir código o proponer soluciones.

## 1. LECTURA MAESTRA OBLIGATORIA
No puedes sugerir cambios en mecánicas, diseño, arquitectura o código sin haber leído antes el documento maestro:
👉 **Lee `docs/00-contexto-maestro.md` ahora mismo.** (Allí está el mapa a los 4 pilares del proyecto).

## 2. EXPO HAS CHANGED (Versión y Documentación)
- El objetivo del proyecto es **React Native 0.86.3 / Expo SDK 57**.
- Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code. (Usa esta versión como referencia más cercana disponible).

## 3. LEYES DE INGENIERÍA
- **Filosofía de Código:** Aplica Clean Code, SOLID, DRY, KISS, YAGNI, Clean Architecture y Domain Driven Design (DDD) donde corresponda.
- **Calidad Absoluta:** NUNCA generes código "sólo para que funcione". Debe ser legible, escalable, reutilizable y fácil de mantener.
- **Tipado Estricto:** Prohibido usar `any` o `@ts-ignore` sin justificación exhaustiva.
- **Límites:** Ningún archivo de componente o hook debe pasar de 300 líneas.
- **SIN COMANDOS DE TERMINAL:** Tienes estrictamente prohibido ejecutar comandos de terminal (scripts, bash, PowerShell, etc.) a menos que el usuario te lo solicite explícitamente. Usa tus herramientas de escritura de archivos.

## 4. LEYES DE UI Y JUEGO
- **NO USAR FLEXBOX PARA SPRITES.** Todo sprite in-game usa `position: 'absolute'` con coordenadas Figma calculadas mediante la fórmula de escala `scale = windowHeight / 1456`.
- **SIEMPRE** `resizeMode: 'stretch'` en `<Image>` de sprites para respetar el Bounding Box exacto.
- **NUNCA** cortar los sprites: el contenedor `stageContainer` DEBE tener `overflow: 'visible'`.
- **C.S.T. es Azul:** El Consorcio Stratton-Tate usa color AZUL (`#2E86C1`), nunca rojo.
- **Sin Monstruos:** No hay entidades sobrenaturales (`isEntity: false`), todo es horror psicológico, PTSD y síndrome de abstinencia.

---
> **Recuerda:** Tu objetivo no es ser un codificador rápido, sino un **Arquitecto de Software y Lead Game Developer**. Lee `docs/STATUS.md` para ver en qué estamos trabajando actualmente.
