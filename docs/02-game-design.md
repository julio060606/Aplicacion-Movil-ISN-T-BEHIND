# 02 — GAME DESIGN: ISN'T BEHIND
> **Pilar 2 de 4.** Fuente de verdad para todas las mecánicas de juego, reglas económicas, sistemas de turno y diseño de clientes.

---

## 1. ESTRUCTURA DEL TURNO

### 1.1 Horario y Duración
- **Horario real del protagonista:** 12:00 PM a 00:00 AM (12 horas).
- **Toque de queda:** A las 00:00 AM, sirenas anuncian el inicio. Las patrullas del régimen disparan a cualquier figura en la calle.
- **Duración en tiempo real (MVP):** 180 segundos (3 minutos = 12 horas in-game).
- **Ratio de conversión:** 1 segundo real = 4 minutos in-game.

### 1.2 Fases del Turno

```
PRE_SHIFT   → El protagonista prepara la tienda. Llega la directiva del día (fax/radio/terminal).
    ↓
RUNNING     → Clientes entran. El reloj corre. El jugador toma decisiones.
    ↓
PAUSED      → (Evento especial: llamada de Garrett, auditoría inesperada, apagón.)
    ↓
EVALUATION  → Al cerrar (00:00 AM): revisión del inventario, conteo de dinero, cuadre de libros.
    ↓
ENDED       → Resumen del turno. Informe del C.S.T. Consecuencias de las decisiones.
```

### 1.3 Directivas del Día
Cada turno comienza con 2–4 directivas del C.S.T. que el jugador DEBE cumplir. Ejemplos:
- "Verificar que la fecha de expiración del documento sea posterior a 1986."
- "El sello C.S.T. debe tener el código de autorización C.S.T.-04."
- "Rechazar inmediatamente a cualquier sujeto con discrepancias en su nombre."

Las directivas de Garrett pueden complementar o contradecir las del C.S.T.

---

## 2. ECONOMÍA DE LA TIENDA

### 2.1 Sistema de Precios Dual

| Tipo | Descripción | Riesgo |
|---|---|---|
| **Precio Legal** | Precio oficial regulado por el C.S.T. | Sin riesgo. Margen mínimo; no alcanza para sobrevivir. |
| **Precio Negro** | Sobreprecio no oficial acordado con el cliente | Mayor ingreso. Si el cliente es detenido y delata la tienda: multa, deportación o peor. |

### 2.2 Mecánicas Económicas del Turno

| Mecánica | Descripción | Riesgo asociado |
|---|---|---|
| **Adulterar productos** | Estirar el inventario mezclando o diluyendo productos. | Quejas de clientes, inspecciones de calidad. |
| **Precio negro** | Cobrar sobre el precio regulado. | Auditoría del C.S.T. |
| **Cuadrar libros** | Inyectar dinero negro como blanco para que el inventario cuadre en auditorías. | Si los números no cuadran: strike o sanción. |
| **Pagar extorsiones** | Insurgentes, inspectores corruptos o Vieja Guardia exigen pagos. | Negarse puede traer represalias físicas o sanciones. |
| **Venta de productos negros** | Productos que llegan por canales no oficiales (contrabando). | Máximo riesgo si hay inspección. |

### 2.3 Inventario y Mercancía

**Categorías disponibles:**
1. **Bienes regulados:** Alimentos, suministros básicos, artículos racionados. Precio fijado por el C.S.T.
2. **Fármacos del C.S.T.:** Las "píldoras azules" que el régimen distribuye como "estabilizadores". Generan dependencia.
3. **Productos del mercado negro:** Llegan por canales no oficiales (posiblemente de Rodinia o contrabando). Sin precio fijo; requieren negociación.
4. **Productos adulterados:** Inventario extendido artificialmente. Riesgo de detección en calidad.

**Carrusel de la mesa (ítems MVP):**
`'no-texture'`, `'leche'`, `'harina'`, `'cigarros'`, `'pildoras'`, `'latas'`

---

## 3. SISTEMA DE STRIKES Y AUDITORÍAS

### 3.1 Strikes
- **Límite por turno:** 3 strikes (configurable por día en `day_XX.json`).
- **Causas de strike:**
  - Vender a precio incorrecto (por encima o por debajo del permitido sin autorización).
  - Aprobar a un cliente con documentos inválidos.
  - Rechazar a un cliente con documentos válidos.
  - Incumplir una directiva activa.
  - No responder a un evento temporal (ej: apagón sin resolver en el tiempo límite).
- **Consecuencia de 3 strikes:** Fin del turno anticipado con penalización severa (multa C.S.T., reducción de inventario, o fin de juego).

### 3.2 Auditorías del C.S.T.
- Ocurren al final del turno (EVALUATION) o de forma sorpresa durante el turno (evento PAUSED).
- Verifican: coincidencia del inventario físico con el libro de cuentas, precios cobrados vs. permitidos, documentación de clientes procesados.
- El jugador puede "cocinar los libros" antes de que llegue el auditor (mecánica de cuadre manual).

---

## 4. SISTEMA DE CLIENTES

### 4.1 Tipos de Visitantes

| Tipo | Descripción | Señales |
|---|---|---|
| **Civil honesto** | Necesita provisiones básicas. Documentos en regla. | Diálogo directo, sin evasivas. |
| **Informante del C.S.T.** | Busca detectar actividad irregular. | Preguntas inusuales, insistencia en el precio, documentos demasiado perfectos. |
| **Insurgente residual** | Del Frente o de facciones afines. | Comportamiento nervioso, menciona lugares o personas prohibidas. |
| **Cliente de mercado negro** | Busca productos no regulados. | Señales verbales o gestuales específicas del día. |

### 4.2 Proceso de Atención al Cliente

1. Cliente aparece en la ventanilla/mostrador.
2. El jugador puede revisar sus documentos (en el carrusel de la mesa).
3. Decisiones disponibles:
   - **Vender al precio legal** (seguro, bajo margen).
   - **Vender al precio negro** (riesgo calculado, mayor ingreso).
   - **Rechazar** (si hay sospecha o documentos inválidos).
   - **Hacer preguntas** (diálogo opcional; puede revelar intención real del cliente o provocar reacción).
4. Consecuencias según decisión y tipo real del cliente.

### 4.3 Detonantes de PTSD del Protagonista
Ciertas interacciones o características de clientes pueden disparar una secuencia de estrés/alucinación:
- Una madre con su hija pequeña.
- Alguien que mencione "el puente".
- El olor o referencia a los medicamentos del C.S.T.
- Violencia directa presenciada en la tienda.

---

## 5. SISTEMA DE SALUD MENTAL / ESTRÉS

### 5.1 Métricas invisibles
El protagonista tiene dos métricas que el jugador no puede ver directamente:

| Métrica | Efecto cuando sube |
|---|---|
| **Nivel de Estrés (PTSD)** | Alucinaciones visuales: luces parpadean (flashbacks), sonidos fantasma (gritos de la estampida), sombras que se mueven (paranoia). |
| **Nivel de Abstinencia** | Aumenta si no toma los fármacos del C.S.T. Genera distorsiones más severas: text scramble en documentos, screen shake, scanlines globales, acúfenos (zumbido de audio). |

### 5.2 Decisión de los Fármacos

| Decisión | Efecto inmediato | Efecto a largo plazo |
|---|---|---|
| **Tomar la píldora** | Suprime las alucinaciones del turno actual. | Profundiza la dependencia. El siguiente turno sin tomarla es peor. |
| **No tomar la píldora** | El turno transcurre con alucinaciones progresivas. | Evita aumentar la dependencia; el estrés base es menor a largo plazo. |

### 5.3 Gradiente de efectos visuales (según nivel de estrés)

| Estado | Overlay | Grano | Viñeta | Efectos extras |
|---|---|---|---|---|
| **Normal** | `#1A2A3A` al 15% | 5% opacidad | 30% bordes | Ninguno |
| **Estrés Medio** | `#1A2A3A` al 25% | 15% opacidad | 50% bordes | Parpadeo sutil de luz cada 3–8s |
| **Abstinencia/Crítico** | `#1A2A3A` al 40% | 25–35% opacidad | 70% bordes | Screen shake ±2px, text scramble, scanlines globales, zumbido de audio |

---

## 6. MECÁNICAS DE INTERACCIÓN (GAMEPLAY FÍSICO)

### 6.1 La Caja Registradora
- Se activa al pulsar el botón `[COBRAR]` en el carrusel de mesa (cuando el carrusel está enfocado).
- Aparece con animación de slide desde abajo.
- **Función:** Calculadora de vuelto. El jugador ingresa el precio cobrado y el dinero recibido; la máquina calcula el cambio.
- También aparece cuando ocurre un robo (mecánica futura).
- Bloquea toda interacción mientras está abierta (solo botones internos + tap fuera para cerrar).

### 6.2 El Revólver
- Guardado en el cajón derecho (`cajon-2`).
- Ítems del cajón derecho: `['revolver']`.
- Al sacarlo, el protagonista entra en modo "apuntar" (`isAiming = true`).
- **Estado aiming:** Bloquea toda la pantalla. Solo disponible: `[GUARDAR]` (guardar el arma) o `[DISPARAR]`.
- **DISPARAR:** Lógica de disparo pendiente de implementación. Ver `STATUS.md`.

### 6.3 La Persiana (Roll-Up Door)
- **Abierta:** Persiana enrollada en la parte superior (Zona Roja).
- **Cerrada:** Persiana baja hasta el límite de la Zona Amarilla (478px Figma = fin de zona amarilla, Y=634).
- **Interacción:** PanResponder vertical. Drag lento → spring al extremo más cercano.
- **Mecánica narrativa:** Cerrar la persiana puede ocultar acciones al cliente o dar privacidad para actividades del mercado negro.

### 6.4 El Monitor (PC / Terminal C.S.T.)
- Tap en el sprite `pc` abre el overlay del monitor.
- **Función narrativa:** Acceso a directivas del C.S.T., inventario digital, comunicaciones internas.
- **Función futura:** La cámara de seguridad conectada a la PC reemplaza la mecánica del espejo convexo original.
- Bloquea toda interacción mientras está abierto (solo tap fuera para cerrar).

### 6.5 Los Cajones
- **Cajón izquierdo** (`cajon-1`): Ítems del cajón — `['revolver']` (puede cambiar por día).
- **Cajón derecho** (`cajon-2`): Ítems del cajón — `['revolver']`.
- Tap abre/cierra el cajón. Al abrirse, aparecen flechas ❮❯ para navegar ítems.

### 6.6 La Lámpara de Cabeza
- Sprite arrastrable libremente con PanResponder.
- Límites: ±80px horizontal, ±60px vertical.
- Swipe rápido hacia la derecha → spring de reset a posición original.
- **Mecánica narrativa futura:** Iluminar zonas oscuras, usar lámpara UV para detectar sellos falsos.

---

## 7. CONFIGURACIÓN DE DÍA (Formato JSON)

Cada día del juego se configura con un archivo `src/data/days/day_XX.json`:

```json
{
  "dayNumber": 1,
  "weekNumber": 1,
  "shiftDurationSeconds": 180,
  "maxStrikesAllowed": 3,
  "ambientWeather": "FOG",
  "radioTransmission": {
    "frequency": "84.2",
    "message": ">> CONEXIÓN ESTABLECIDA... C.S.T. RED DE TRANSMISIÓN LOCAL... SECTOR 4 APERTURADO..."
  },
  "directives": [
    "Verificar que la fecha de expiración del documento sea posterior a 1986.",
    "El sello CST debe tener el código de autorización C.S.T.-04.",
    "Rechazar inmediatamente a cualquier sujeto con discrepancias en su nombre."
  ],
  "visitors": [ ... ],
  "scheduledAnomalies": [
    {
      "id": "anom_day1_01",
      "category": "LIGHT_OUTAGE",
      "triggerTimeSeconds": 90,
      "timeLimitSeconds": 15,
      "penaltyStress": 20,
      "penaltyStalker": 15
    }
  ]
}
```

**Categorías de anomalías disponibles:**
- `DOCUMENT_ANOMALY` — Discrepancia en documentos del cliente.
- `LIGHT_OUTAGE` — Apagón. El jugador debe reaccionar en tiempo límite.
- `PHONE_LORE` — Llamada entrante de Garrett o de un número desconocido.
- `BEHIND_SHADOW` — Alucinación: sombra detrás del protagonista (PTSD).

---

## 8. CONSECUENCIAS ACUMULATIVAS

| Acción repetida | Consecuencia a largo plazo |
|---|---|
| Actividad excesiva en mercado negro | Sospecha corporativa → inspecciones más frecuentes |
| Discrepancias constantes de inventario | Auditorías sorpresa → fin de turno forzado |
| Estrés acumulado no gestionado | Alucinaciones más frecuentes e intensas |
| Tomar fármacos cada turno | Dependencia total → sin fármacos = turno casi injugable |
| Desafiar órdenes de Garrett | Reducción del abastecimiento o amenazas veladas |
| Incumplir directivas del C.S.T. | Multas, strikes acumulados, visitas de inspectores |

---

## 9. HABILIDADES DEL PROTAGONISTA (Ventajas del técnico)

El trasfondo como Técnico Electromecánico le otorga ventajas únicas:
- **Reparar radios averiadas** — Acceso a transmisiones de radio que otros no pueden escuchar.
- **Puentear fusibles** — Restaurar electricidad durante apagones más rápido que el tiempo límite.
- **Trucar básculas analógicas** — Adulterar pesos de productos de forma más eficiente sin detección.
- **Calibrar pesas** — Cuadrar los libros de contabilidad de forma más convincente durante auditorías.
