# AVANCE 2: DISEÑO Y GESTIÓN DE DATOS EN APLICACIONES MÓVILES (SEMANAS 6-10)

> **Proyecto:** *ISN'T BEHIND*  
> **Framework:** React Native 0.86.3 / Expo SDK 57  
> **Unidad de Aprendizaje 2:** Diseño y gestión de datos en aplicaciones móviles.  
> **Logro:** *"Al finalizar la unidad, el estudiante desarrolla aplicaciones móviles híbridas que gestionan el almacenamiento dinámico de diversas fuentes."*

---

## 1. MATRIZ DE TRAZABILIDAD CURRICULAR

| Semana | Tema del Sílabo | Requisito Académico | Implementación en ISN'T BEHIND | Archivos Clave |
|---|---|---|---|---|
| **Semana 6 - 7** | Hooks y ciclo de vida en componentes funcionales | `useState`, `useEffect`, `useCallback`, `useMemo` | Gestión reactiva de datos, filtros en tiempo real, efectos de sincronización y limpieza de peticiones. | [`NetworkTerminalTab.tsx`](file:///d:/Projects/VS_code/Android_Proyecto/24-06-26/isnt-behind/src/components/dossier/NetworkTerminalTab.tsx)<br>[`OperatorRegistrationScreen.tsx`](file:///d:/Projects/VS_code/Android_Proyecto/24-06-26/isnt-behind/src/screens/OperatorRegistrationScreen.tsx) |
| **Semana 7 - 8** | Manejo de API REST y Fetching de Datos | Consumo de APIs públicas con `fetch` / `axios`, estados de carga y error | Servicio de red que consume dos APIs públicas REST con `AbortController` y timeouts de seguridad. | [`cstNetworkService.ts`](file:///d:/Projects/VS_code/Android_Proyecto/24-06-26/isnt-behind/src/services/api/cstNetworkService.ts) |
| **Semana 8** | Renderizado y manipulación de datos de API | Interfaz interactiva para mostrar datos consumidos y filtrado | Pestaña `[ RED / LOGS ]` en el Dossier con buscador textual en vivo y selector de filtros (`TODOS`, `CLOUD`, `CACHE`, `LOCAL`). | [`DossierScreen.tsx`](file:///d:/Projects/VS_code/Android_Proyecto/24-06-26/isnt-behind/src/screens/DossierScreen.tsx)<br>[`NetworkTerminalTab.tsx`](file:///d:/Projects/VS_code/Android_Proyecto/24-06-26/isnt-behind/src/components/dossier/NetworkTerminalTab.tsx) |
| **Semana 9** | Almacenamiento local con `AsyncStorage` | Demostración comparativa de almacenamiento Local vs Nube vs Caché | Persistencia de caché de comunicados (`@cst_cached_dispatches`), perfil de operador (`@isnt_behind_operator_profile`) y respaldo offline garantizado. | [`storageService.ts`](file:///d:/Projects/VS_code/Android_Proyecto/24-06-26/isnt-behind/src/services/storage/storageService.ts)<br>[`localDispatches.ts`](file:///d:/Projects/VS_code/Android_Proyecto/24-06-26/isnt-behind/src/constants/localDispatches.ts) |
| **Semana 10** | Integración de Temas | Soporte y alternancia dinámica de temas visuales | Contexto global de tema (`dark` y `light`) con persistencia en `AsyncStorage` (`@isnt_behind_menu_theme`). | [`MenuThemeContext.tsx`](file:///d:/Projects/VS_code/Android_Proyecto/24-06-26/isnt-behind/src/context/MenuThemeContext.tsx)<br>[`colors.ts`](file:///d:/Projects/VS_code/Android_Proyecto/24-06-26/isnt-behind/src/theme/colors.ts) |

---

## 2. ARQUITECTURA DEL CONSUMO DE APIS REST

El sistema implementa dos endpoints REST públicos reales mediante el estándar nativo WHATWG `fetch`, manteniendo la coherencia narrativa diegética (año 1986 / Consorcio Stratton-Tate):

### A. Comunicados Oficiales C.S.T. (JSONPlaceholder REST API)
- **Endpoint:** `https://jsonplaceholder.typicode.com/posts?_limit=6`
- **Método:** `GET`
- **Función en el juego:** Representa los mensajes emitidos por el servidor central de la corporación.
- **Mapeo:** Cada post se normaliza en una estructura `ICstDispatch` asignándole un sector y el origen `CLOUD_REST`.

### B. Telemetría Meteorológica del Perímetro (Open-Meteo REST API)
- **Endpoint:** `https://api.open-meteo.com/v1/forecast?latitude=-12.04&longitude=-77.03&current_weather=true`
- **Método:** `GET`
- **Función en el juego:** Informa al operador de la garita las condiciones climáticas del exterior de la frontera (Portwall): temperatura en °C, velocidad de viento y decodificación de niebla ácida.

### C. Manejo Robusto de Conexión
- Se implementó `AbortController` con timeout de 6000 ms para evitar bloqueos por latencia de red.
- En caso de error de red (p. ej. modo avión o falla de conexión), la aplicación conmuta automáticamente al **respaldo offline** sin colapsar ni interrumpir la experiencia de usuario.

---

## 3. COMPARATIVA DE ARQUITECTURA: LOCAL vs NUBE vs CACHÉ

En la pestaña `[ RED / LOGS ]` de la pantalla de Expediente (`DossierScreen`), el evaluador puede probar e inspeccionar las tres capas de datos:

```
┌────────────────────────────────────────────────────────┐
│              CAPAS DE GESTIÓN DE DATOS                 │
├────────────────────────────────────────────────────────┤
│ 1. NUBE (Cloud REST)                                   │
│    • Datos remotos dinámicos vía HTTP (JSONPlaceholder)│
│    • Requiere conectividad activa                      │
│    • Identificador en UI: [ NUBE // REST API ] (Azul)  │
├────────────────────────────────────────────────────────┤
│ 2. CACHÉ PERSISTENTE (AsyncStorage)                    │
│    • Almacenamiento no volátil en el dispositivo       │
│    • Se guarda mediante el botón [ 💾 CACHEAR ]        │
│    • Se carga offline mediante [ 📂 CARGAR CACHÉ ]     │
│    • Identificador en UI: [ ASYNC STORAGE // CACHÉ ]   │
├────────────────────────────────────────────────────────┤
│ 3. LOCAL / OFFLINE (Memoria ROM)                       │
│    • Constantes canónicas (`localDispatches.ts`)       │
│    • Garantía absoluta de funcionamiento sin internet  │
│    • Identificador en UI: [ LOCAL // ROM OFFLINE ]     │
└────────────────────────────────────────────────────────┘
```

---

## 4. MANIPULACIÓN Y FILTRADO DINÁMICO DE DATOS

El componente [`NetworkTerminalTab.tsx`](file:///d:/Projects/VS_code/Android_Proyecto/24-06-26/isnt-behind/src/components/dossier/NetworkTerminalTab.tsx) cumple con la exigencia de procesamiento de colecciones de datos en tiempo real:

1. **Buscador Reactivo (`TextInput`):** Permite filtrar los comunicados escribiendo palabras clave en el título, cuerpo o sector.
2. **Selector de Fuente (Filtros Categóricos):**
   - `TODOS`: Muestra la totalidad de comunicados activos.
   - `CLOUD`: Muestra exclusivamente los datos provenientes de la API REST.
   - `CACHE`: Muestra exclusivamente los registros persistidos en `AsyncStorage`.
   - `LOCAL`: Muestra los registros nativos offline.
3. **Optimización con `useMemo`:** El cálculo del arreglo resultante se memoriza para evitar recálculos innecesarios en el ciclo de vida del componente.

---

## 5. GUÍA RÁPIDA DE REVISIÓN Y DEMOSTRACIÓN

Para validar los requerimientos de la Unidad 2:

1. **Verificar Consumo de API y Clima:**
   - Iniciar la aplicación y desde el menú principal seleccionar `[ EXPEDIENTE / REGLAS ]`.
   - Pulsar la tercera pestaña inferior: `[ RED / LOGS ]`.
   - Observar la tarjeta superior de telemetría meteorológica (temperatura y condición real de Open-Meteo).
   - Observar los comunicados cargados desde el endpoint REST con el distintivo azul `[ NUBE // REST API ]`.

2. **Verificar Persistencia en AsyncStorage (Caché vs Nube):**
   - En la sección **ARQUITECTURA DE ALMACENAMIENTO**, presionar `[ 💾 CACHEAR ]`. El contador de registros en `AsyncStorage` se incrementará.
   - Presionar `[ 📂 CARGAR CACHÉ ]` para verificar cómo se leen los datos desde `AsyncStorage` con el distintivo ámbar `[ ASYNC STORAGE // CACHÉ ]`.
   - Presionar `[ ⚡ FORZAR LOCAL ]` para observar los comunicados estáticos offline de la garita.

3. **Verificar Manipulación de Datos:**
   - Escribir en el campo de búsqueda (p. ej. `"CUARENTENA"` o `"SECTOR"`).
   - Alternar entre los chips `TODOS`, `CLOUD`, `CACHE` y `LOCAL`.

4. **Verificar Persistencia del Perfil del Operador:**
   - En el Menú Principal, pulsar `[ FIRMAR CONTRATO ]` (`OperatorRegistrationScreen`).
   - Usar el botón `[ AUTO-RELLENAR ]` en la esquina superior del carnet y pulsar `[ VALIDAR Y FIRMAR CONTRATO ]`. Los datos quedan persistidos permanentemente en `AsyncStorage` bajo la clave `@isnt_behind_operator_profile`.
