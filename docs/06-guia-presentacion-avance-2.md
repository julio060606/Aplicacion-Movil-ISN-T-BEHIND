# GUÍA COMPLETA PARA INFORME (WORD) Y DIAPOSITIVAS (POWERPOINT)
## Avance 2: Unidad de Aprendizaje 2 (Semanas 6 a 10)
**Proyecto:** *ISN'T BEHIND* — React Native 0.86.3 / Expo SDK 57

---

> 💡 **Instrucciones para el equipo:**  
> Esta guía está estructurada diapositiva por diapositiva. Pueden copiar y pegar los textos directamente en PowerPoint o en el documento de Word.  
> Cada sección especifica **qué captura tomar en el celular/emulador**, **qué pasos seguir antes de tomarla** y **qué conceptos responder si el profesor pregunta**.

---

### DIAPOSITIVA 1: PORTADA
* **Título:** ISN'T BEHIND — Avance 2: Diseño y Gestión de Datos en Aplicaciones Móviles
* **Subtítulo:** Consumo de APIs REST, Almacenamiento Local con AsyncStorage y Ciclo de Vida con Hooks
* **Datos a incluir:** Nombre del curso, ciclo, integrantes del grupo, fecha.
* **Captura:** Captura del Menú Principal del juego con el título typewriter "ISN'T BEHIND".

---

### DIAPOSITIVA 2: LOGRO DE LA UNIDAD 2 Y MATRIZ DE CUMPLIMIENTO
* **Objetivo Académico del Sílabo:**  
  *"Al finalizar la unidad, el estudiante desarrolla aplicaciones móviles híbridas que gestionan el almacenamiento dinámico de diversas fuentes."*
* **Tabla Resumen para la diapositiva:**
  * **Semanas 6-7:** Hooks funcionales (`useState`, `useEffect`, `useCallback`, `useMemo`) y ciclo de vida.
  * **Semanas 7-8:** Fetching de datos mediante APIs REST públicas (`fetch` nativo) con estados de carga y error.
  * **Semana 8:** Manipulación y renderizado reactivo de colecciones de datos (búsqueda y filtrado en vivo).
  * **Semana 9:** Almacenamiento no volátil con `AsyncStorage` y matriz comparativa: **Nube vs Caché vs Local**.
  * **Semana 10:** Integración de Temas visuales persistidos en el almacenamiento local.

---

### DIAPOSITIVA 3: CONSUMO DE APIS REST PÚBLICAS (SEMANAS 7-8)
* **Texto de la Diapositiva:**
  * **Arquitectura de Red Diegética:** La garita de control fronterizo consume dos endpoints REST externos en tiempo real:
    1. **Comunicados Oficiales C.S.T.:** `https://jsonplaceholder.typicode.com/posts` (Mapea comunicados y órdenes de seguridad del Consorcio).
    2. **Telemetría Atmosférica:** `https://api.open-meteo.com/v1/forecast` (Obtiene en vivo la temperatura en °C y estado de niebla perimetral en Portwall).
  * **Manejo Robusto de Red:**
    * Uso de `fetch` estándar WHATWG sin librerías externas pesadas.
    * `AbortController` con timeout de seguridad (6 segundos) para evitar bloqueos por lentitud de red.
    * Fallback automático a datos locales de contingencia si el dispositivo no tiene internet.

📸 **CAPTURA REQUERIDA 1: Telemetría y Comunicados en la Nube**
* **Cómo tomarla:**
  1. En el Menú Principal, desliza el dedo desde el borde izquierdo hacia la derecha para abrir el menú lateral (Drawer).
  2. Toca `[ 02. ARCHIVO Y REGLAS (TABS) ]`.
  3. En la barra de abajo, toca la tercera pestaña: `[ RED / LOGS ]`.
  4. Toma la captura donde se aprecie:
     * El recuadro superior azul con la temperatura real en °C (`● EN LÍNEA`).
     * Las tarjetas de comunicados con la etiqueta azul `[ NUBE // REST API ]`.
* **Resaltar en la imagen:** Un círculo sobre la temperatura y sobre la etiqueta `[ NUBE // REST API ]`.

---

### DIAPOSITIVA 4: COMPARATIVA DE ALMACENAMIENTO: LOCAL vs NUBE vs CACHÉ (SEMANA 9)
* **Texto de la Diapositiva:**
  * El sílabo exige comprender y demostrar la diferencia entre fuentes de datos:
    * **1. Nube (Cloud REST API):** Datos remotos asíncronos. Requieren conexión activa y gestionan latencia y errores HTTP.
    * **2. Caché Local (`AsyncStorage`):** Datos persistidos en el almacenamiento del teléfono (`@cst_cached_dispatches`). Permiten consultar la información guardada aun desconectando el Wi-Fi / Datos.
    * **3. Local / ROM (Offline Fallback):** Archivo de contingencia preinstalado en la app (`localDispatches.ts`) para garantizar disponibilidad 100% offline.
  * **Acciones Interactivas:** El usuario puede pulsar `[ 💾 CACHEAR ]` para persistir la nube en el móvil, y `[ 📂 CARGAR CACHÉ ]` para recuperarla en modo offline.

📸 **CAPTURA REQUERIDA 2: Demostración de Caché con AsyncStorage**
* **Cómo tomarla:**
  1. En la misma pantalla `[ RED / LOGS ]`, pulsa el botón `[ 💾 CACHEAR ]`. Verás que el texto dice: *"Caché en AsyncStorage: 6 registros"*.
  2. Luego pulsa `[ 📂 CARGAR CACHÉ ]`.
  3. Toma la captura donde las tarjetas ahora muestren la etiqueta ámbar:  
     `[ ASYNC STORAGE // CACHÉ ]`.
* **Resaltar en la imagen:** El botón `[ 💾 CACHEAR ]` y la insignia ámbar `[ ASYNC STORAGE // CACHÉ ]`.

---

### DIAPOSITIVA 5: MANIPULACIÓN Y FILTRADO DE DATOS EN TIEMPO REAL (SEMANA 8)
* **Texto de la Diapositiva:**
  * **Filtros Categóricos:** Permite alternar la visualización entre `TODOS`, `CLOUD`, `CACHE` y `LOCAL`.
  * **Buscador en Vivo (`TextInput`):** Filtra los datos reactivamente por título, cuerpo del comunicado o sector asignado.
  * **Optimización con `useMemo`:** El cálculo del filtrado se memoriza para garantizar 60 FPS sin re-renders costosos.

📸 **CAPTURA REQUERIDA 3: Filtro Dinámico y Búsqueda Activa**
* **Cómo tomarla:**
  1. En la pestaña `[ RED / LOGS ]`, escribe en el campo de texto la palabra `"SECTOR"` o `"CUARENTENA"`.
  2. Selecciona el botón de filtro `[ CLOUD ]` o `[ CACHE ]`.
  3. Toma la captura donde se vea el texto en el buscador y cómo la lista de resultados se redujo a los elementos coincidentes.
* **Resaltar en la imagen:** La barra de búsqueda con texto y el chip de filtro activo.

---

### DIAPOSITIVA 6: GESTIÓN DE ESTADO CON HOOKS Y FORMULARIOS (SEMANAS 6 Y 7)
* **Texto de la Diapositiva:**
  * **Ciclo de vida en Componentes Funcionales:**
    * `useState`: Control de inputs, estados asíncronos (`isLoading`, `error`) y datos en pantalla.
    * `useEffect`: Disparo de peticiones HTTP al montar el componente y suscripción a eventos.
    * `useCallback`: Memorización de funciones asíncronas para evitar recreación innecesaria en memoria.
  * **Formulario de Registro de Operador (`OperatorRegistrationScreen`):**
    * Validación en tiempo real contra los documentos de identidad en mesa (DNI y salvoconducto).
    * Al presionar `[ VALIDAR Y FIRMAR ]`, los datos se guardan permanentemente en el almacenamiento local bajo la clave `@isnt_behind_operator_profile`.

📸 **CAPTURA REQUERIDA 4: Formulario de Contrato y Perfil de Operador**
* **Cómo tomarla:**
  1. Desde el Menú Principal, pulsa `[ STORY ]`.
  2. Pulsa en un slot vacío o `Nueva Partida`.
  3. En la pantalla del contrato, pulsa el botón `[ AUTO-RELLENAR ]` en la esquina superior del carnet.
  4. Toma la captura con los campos completados antes o justo al pulsar `[ VALIDAR Y FIRMAR CONTRATO ]`.
* **Resaltar en la imagen:** Los campos de texto validados y el botón de acción principal.

---

### DIAPOSITIVA 7: INTEGRACIÓN DE TEMAS DINÁMICOS (SEMANA 10)
* **Texto de la Diapositiva:**
  * **Contexto de Tema Global (`MenuThemeContext`):**
    * Soporta cambio de tema entre `dark` (estética terminal / noche) y `light` (burocracia / papel oficial).
    * Persistencia instantánea de la preferencia del usuario en `AsyncStorage` (`@isnt_behind_menu_theme`).
    * Provee tokens de color centralizados (`theme.background`, `theme.accent`, etc.) consumidos por las vistas del menú.

📸 **CAPTURA REQUERIDA 5: Conmutador de Temas (Opcional pero recomendado)**
* **Cómo tomarla:**
  1. Ir a `SettingsScreen` (`[ SETTINGS ]` en el menú principal).
  2. Tomar captura mostrando las opciones de configuración y paleta visual.

---

### DIAPOSITIVA 8: CONCLUSIONES Y LECCIONES APRENDIDAS
* **Puntos clave para exponer:**
  1. **Arquitectura Offline-First:** La app nunca se cuelga si no hay internet; conmuta de forma transparente entre Nube (REST API), Caché (`AsyncStorage`) y ROM Local.
  2. **Clean Architecture y Modularidad:** Cada componente respeta el límite estricto de menos de 300 líneas de código, con tipado TypeScript riguroso sin uso de `any`.
  3. **Inmersión Diegética:** Todos los requisitos académicos se integraron de forma natural dentro de la narrativa retro-futurista de 1986 del Consorcio Stratton-Tate.

---

## 📋 CHECKLIST RÁPIDO PARA LA DEMOSTRACIÓN ANTE EL PROFESOR
1. Abrir la app en el Menú Principal y mostrar la navegación fluida.
2. Abrir el menú lateral (Drawer) y entrar a `[ 02. ARCHIVO Y REGLAS (TABS) ]`.
3. Tocar la pestaña `[ RED / LOGS ]`:
   - Mostrar el **clima en tiempo real** de Open-Meteo.
   - Mostrar los **comunicados descargados de JSONPlaceholder**.
   - Pulsar `[ 💾 CACHEAR ]` y luego `[ 📂 CARGAR CACHÉ ]` para demostrar el uso de `AsyncStorage`.
   - Escribir en el buscador para demostrar **filtrado dinámico de datos**.
4. Ir a `[ STORY ]` -> Contrato y demostrar la persistencia del perfil de operador con `AsyncStorage`.
