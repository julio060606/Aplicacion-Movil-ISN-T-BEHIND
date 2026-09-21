# 🗺️ FLUJO DE USUARIO Y ARQUITECTURA DE INTERFACES (MVP)
## ISN'T BEHIND — Game Design & UX Flow

**Versión:** 1.0.0 (Estructuración para Figma)  
**Objetivo:** Definir el comportamiento, jerarquía visual y flujo lógico de todas las pantallas antes de la fase de prototipado en Figma.

---

## 1. REGLAS GLOBALES DE UX/UI

- **Transiciones Base:** Eliminación del destello blanco. Todo cambio de escena usa un **Fade a Negro** (Difuminado de entrada y salida) para mantener el tono thriller/oscuro.
- **Interacciones Físicas:**
  - **Tap:** Abrir/Cerrar cajones, encender herramientas, interactuar con menús.
  - **Hold (Mantener Presionado):** Mecánica de esfuerzo para extraer objetos pesados/peligrosos de los cajones (Cuaderno, Arma). Previene extracciones accidentales.
  - **Drag (Arrastrar):** Mover el cuaderno por la mesa, apartar multas del monitor.

---

## 2. FASE 1: PRE-GAMEPLAY (Menús y Narrativa)

### 2.1 Menú Principal (`MainMenuScreen`)
Interfaz limpia, estética CRT.
- `[ STORY ]`: Inicia el flujo del juego hacia `WeeklyIntroScreen`.
- `[ SETTINGS ]`: Abre un modal superpuesto. Contiene sliders/toggles para Volumen Master, SFX y Vibración Háptica.
- `[ CREDITS ]`: Transición a pantalla de scroll vertical de créditos.
- `[ EXIT ]`: Modal de alerta: *"¿Abandonar el turno? [SI] [NO]"*. Cierra la app.

### 2.2 Transmisión Radial / Historia (`WeeklyIntroScreen`)
- **Fondo:** Negro puro.
- **Top:** Icono de Radio Analógica.
- **Bottom:** Arte vectorial de una ciudad brutalista.
- **Mecánica de Texto:** Efecto "barrido" de arriba a abajo. Si el texto es muy largo, se pausa y muestra una flecha de `[ Siguiente ]`.
- **Interacción:** Tap corto salta la animación de barrido mostrando el bloque de texto actual completo.

### 2.3 Intro Burocrática (`DailyIntroScreen`)
- **Estética:** Terminal monocromática, letras pequeñas, diseño frío.
- **Contenido:** Número del día (Ej. `[ DÍA 1 ]`) y normativas breves.
- **Acción:** Botón `[ INICIAR TURNO ]`. Dispara el Audio/SFX del Jefe.

### 2.4 Transición Cinemática de Entrada
1. Pantalla en Negro total tras pulsar iniciar.
2. Aparece en el centro la **Fecha y Hora (00:00 AM)** brillando en blanco.
3. El fondo negro hace un fade-out revelando el escritorio de trabajo.
4. El texto brillante se encoge y se traslada espacialmente hasta fundirse con el reloj digital en la interfaz del escritorio.

---

## 3. FASE 2: BUCLE DE JUEGO (Mesa de Control 40/60)

### 3.1 ZONA SUPERIOR (40% - Interacción con el Entorno)
- **Espejo Convexo (Top 15% Izq):** Tap para expandir visual. Permite monitorear la retaguardia para detectar hurtos o entidades.
- **Fondo de la Tienda:** Tap en el fondo de la pantalla. Aplica un 50% de opacidad (transparencia) al cliente y a la PC para poder vigilar el fondo del local.
- **Cortinilla (Privacidad):** Toggle de cerrado/abierto. Oscurece la visión del cliente hacia nuestra mesa. Permite realizar acciones ilícitas sin subir el medidor de sospecha del visitante.

### 3.2 ZONA INTERMEDIA (Capas de Bloqueo / Ceguera Selectiva)
- **PC Terminal:** Interfaz corporativa. Al abrirse bloquea la visión central (Cliente y Mesa).
- **Impresora Fax:** Ubicada sobre la PC. Al emitir una Multa, el papel tapa la pantalla del monitor. El jugador debe esperar la impresión y hacer *Drag* (deslizar) para botarla y poder usar la PC.

### 3.3 ZONA INFERIOR (60% - Mesa de Trabajo)
- **Mesa de Madera (Bottom 35%):** Contiene el carrusel de documentos/objetos.
  - *Mecánica de Lupa/UV:* Seleccionar herramienta + Tap en objeto = Abre un Sprite de **"Zoom/Inspección"** para ver detalles ocultos.
  - Botón `[ COBRAR ]` disponible.
- **Cajones (Bottom 25%):**
  - Tap para Abrir/Cerrar. Se cierran solos al usar herramientas de mano.
  - Para extraer equipo base, se usa la mecánica *Hold*.
- **Inventario Lateral:** Se desliza desde la derecha. Para evitar solapamientos visuales, al abrir el inventario, los cajones se fuerzan a cerrarse.

### 3.4 OBJETOS FÍSICOS EXTRAÍBLES
- **Cuaderno de Notas:**
  - Extracción: *Hold* en el cajón.
  - Atributo: **NO puede volver a guardarse**.
  - Física: Arrastrable libremente por la pantalla. Queda por encima de todo (excepto Caja Registradora), obligando a moverlo para poder ver.
- **Revólver:**
  - Extracción: *Hold* en el cajón opuesto. **SÍ puede volver a guardarse**.
  - *Fase 1 (Oculto):* Arma en la mano bajo la mesa (Invalida usar otras herramientas).
  - *Fase 2 (Apuntar):* Botón de apuntar al cliente. Disparar finaliza el día de inmediato.

### 3.5 CAJA REGISTRADORA (Pago)
- Se activa con `[ COBRAR ]`. Emerge tapando el 52% inferior.
- **Interfaz:** Estilo calculadora digital.
- **Datos:** Muestra (1) Monto Entregado por el cliente, (2) Costo Real de los items, (3) Total de Dinero del Turno.
- **Acción:** El jugador teclea el vuelto (cambio). Permite cobrar exacto (Blanco) o dar mal el vuelto (Negro/Robo). Se oculta al procesar.

---

## 4. FASE 3: FIN DE DÍA Y ECONOMÍA (Auditoría)

### 4.1 Resumen del Día
Pantalla estática mostrando métricas: Sueldo base, Multas incurridas, Deudas al Estado, Consumo de servicios básicos.

### 4.2 Las Dos Carteras (Economía Dual)
- **💰 Dinero Legal (Blanco):** Obtenido del sueldo y cobros correctos. Se usa en la **Tienda del Consorcio** (Mejoras de PC, Lámparas UV oficiales, Pago de Impuestos).
- **🩸 Dinero Ilegal (Negro):** Obtenido de hurtos, vueltos adulterados y sobornos. Se usa en el **Mercado Negro** (Mercenarios, Comerciantes clandestinos, Herramientas de adulteración). No sirve en el Consorcio.

### 4.3 Minijuego de Auditoría (El Lavado)
- **Regla:** El jugador debe decidir cuánto de su "Dinero Ilegal" va a justificar y convertir en "Dinero Legal" para poder llegar a fin de mes.
- **Riesgo:**
  - Si el Dinero Legal generado es $0 (o muy bajo), el Consorcio sospecha (Suben las alarmas).
  - Si intentas "lavar" (pasar de Ilegal a Legal) montos gigantescos de un día para otro, la **Sospecha Corporativa** sube dramáticamente desencadenando inspecciones letales.
