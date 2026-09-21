# 🎙️ GUÍA DE REUNIÓN Y DIAGRAMAS DE FLUJO (PRESENTACIÓN AL EQUIPO)
## ISN'T BEHIND — Simulador de Gestión & Thriller Psicológico 2D

**Rol del Expositor:** Director de Arte y QA (Líder de Proyecto)  
**Audiencia:** Dev 1 (Core/Navegación), Dev 2 (Menú/Intros), Dev 3 (Gameplay/Mesa de Trabajo)  
**Objetivo de la Reunión:** Alinear al equipo sobre la visión del juego, explicar la filosofía de "UI Diegética / Ceguera Selectiva", presentar los diagramas de flujo y asignar las ramas de Git sin fricciones.

---

## 1. 🗣️ GUION DEL DISCURSO (QUÉ DECIRLES PASO A PASO)

### Paso 1: Introducción y Estado del Proyecto (El "Pitch")
> *"Hola equipo. Les resumo dónde estamos: La base técnica del proyecto está 100% montada y blindada. Tenemos TypeScript estricto con 0 errores, Modo Inmersivo real en Android (ocultando barras nativas) y un sistema tipográfico de 11 fuentes que ambienta el juego en el contexto corporativo y burocrático de los años 2000."*

### Paso 2: Por qué usamos "Colorboxing" (Cajas de Colores)
> *"Verán que la pantalla de turno no tiene aún los sprites finales, sino cajas de colores contrastantes con textos en español. Esto es una decisión deliberada de ingeniería y arte llamada **Colorboxing**. Nos permite probar el equilibrio de la pantalla, la física táctil y la ergonomía del gameplay antes de integrar las ilustraciones finales sin romper código."*

### Paso 3: El Concepto Clave: "UI Diegética" y "Ceguera Selectiva"
> *"El corazón del terror en este juego no son los sustos fáciles (jumpscares), sino la **tensión por falta de visión (Ceguera Selectiva)**:*
> 1. *Si estás revisando la PC, el Fax te escupe una multa que te tapa el monitor.*
> 2. *Si sacas el Cuaderno de notas para ver las reglas, este es masivo (85% de la pantalla) y te tapa los documentos y al cliente.*
> 3. *Si abres la Caja Registradora para cobrar, bloqueas el escritorio.*
> 4. *Y mientras estás ciego atendiendo papeles... algo puede estar pasando en la ventanilla o detrás de ti en el espejo convexo."*

### Paso 4: Asignación y Reglas de Git
> *"Para no pisarnos código en Git, cada uno tiene asignada una carpeta exclusiva documentada en `/docs/05_sprint1_tasks.md`:*
> - ***Dev 1:** Se enfoca en Core (`src/components/core/`, `AssetProvider` y guards de navegación).*
> - ***Dev 2:** Se enfoca en Menú e Intros (`src/screens/MainMenu*`, `WeeklyIntro*`, `DailyIntro*` y efectos CRT).*
> - ***Dev 3:** Se enfoca en las mecánicas de la mesa (`src/components/shift/`, arrastre de documentos, sellos y el espejo).*
> - *Yo estaré en QA revisando los PRs y asegurando que el arte y la experiencia sean consistentes."*

---

## 2. 📊 DIAGRAMA 1: FLUJO GENERAL DEL JUGADOR (USER FLOW - MERMAID)

```mermaid
flowchart TD
    A["📱 INICIO DE APP<br>(Splash Screen & FontProvider 11 Fuentes)"] --> B["🖥️ MENÚ PRINCIPAL (MainMenuScreen)<br>Split 35/65, Logo Giratorio, Estética CRT"]
    
    B -->|Tocar [ SETTINGS ]| B1["⚙️ Modal de Configuración<br>(Volumen & Hápticos)"]
    B -->|Tocar [ EXIT ]| B2["🚪 Diálogo de Salida (ExitApp)"]
    B -->|Tocar [ STORY ]| C["📻 TRANSMISIÓN RADIAL (WeeklyIntroScreen)<br>Efecto Typewriter, Radio AM, Frecuencia 84.2"]
    
    C -->|Confirmar Recepción| D["📜 ENCABEZADO BUROCRÁTICO (DailyIntroScreen)<br>Sello CST, Número de Día Dinámico"]
    
    D -->|Iniciar Turno| E["🚨 MESA DE CONTROL (ShiftScreen)<br>Layout Split 40/60 & Modo Inmersivo"]
    
    subgraph BUCLE_TURNO [Bucle Nocturno 00:00 - 06:00]
        E --> E1["1. Llega Visitante a la Ventanilla"]
        E1 --> E2["2. Consultar Cuaderno Masivo (85%x65%)"]
        E2 --> E3["3. Arrastrar Documento del Carrusel"]
        E3 --> E4["4. Estampar Sello [APROBAR] o [RECHAZAR]"]
        E4 --> E5["5. Vigilar Espejo Convexo / Retaguardia"]
    end
    
    BUCLE_TURNO -->|Fin de Turno (06:00 AM) / Strikes < 3| F["🏆 EVALUACIÓN DEL DÍA<br>(Aprobados, Errores, Sueldo)"]
    BUCLE_TURNO -->|3 Strikes / Ataque / Cordura 0| G["💀 GAME OVER<br>(Reintentar Día)"]
    
    F -->|Siguiente Día| D
```

---

## 3. 🔄 DIAGRAMAS PLANTUML DEL BUCLE DE JUEGO (SHIFT GAMEPLAY)

A continuación se incluyen los códigos estándar **PlantUML** listos para renderizar en cualquier visor o plugin UML:

### A. Diagrama de Secuencia PlantUML (Bucle Diegético de Turno)

```plantuml
@startuml
autonumber
skinparam backgroundColor #0d0d0d
skinparam handwritten false
skinparam shadowing true
skinparam sequence {
    ArrowColor #00ff66
    ActorBorderColor #00ff66
    LifeLineBorderColor #444444
    LifeLineBackgroundColor #141414
    ParticipantBorderColor #38bdf8
    ParticipantBackgroundColor #0f172a
    ParticipantFontColor #ffffff
    ActorFontColor #ffffff
}

actor "Jugador (Operador CST)" as Jugador
participant "Mostrador 40%\n(TopZone / Ventanilla)" as Mostrador
participant "Mesa 60%\n(BottomZone / Escritorio)" as Mesa
participant "Overlays Diegéticos\n(PC, Cuaderno, Registradora)" as Overlays

== INICIO DEL TURNO (00:00 AM) ==
Mostrador -> Jugador: Llega visitante a ventanilla (Sprite Cliente)
Mesa -> Jugador: Despacha documento de identidad al Carrusel Central

alt Consulta de Directivas y Normas
    Jugador -> Overlays: Extrae Cuaderno Masivo (85%x65%) del cajón
    note over Overlays, Jugador #641111
        <font color=white><b>⚠️ CEGUERA SELECTIVA:</b> El cuaderno cubre la mesa completa</font>
    end note
    Jugador -> Overlays: Pliega el cuaderno al cajón inferior
end

Jugador -> Mesa: Arrastra documento al centro del escritorio
Jugador -> Mesa: Inspecciona fotos, fechas y sellos CST

alt Interrupción por Fax (Multa)
    Overlays -> Jugador: Impresora Fax expulsa MULTA animada
    note over Overlays #641111
        <font color=white><b>⚠️ MULTA TAPA LA PC:</b> Pérdida de visión en monitor</font>
    end note
    Jugador -> Overlays: Toca la multa para descartar sanción
end

Jugador -> Mesa: Aplica Sello [ APROBAR ] o [ RECHAZAR ]

opt Sospecha de Anomalía o Acecho Trasero
    Jugador -> Mostrador: Toca Espejo Convexo (Vigilancia)
    Mostrador --> Jugador: Feedback de verificación ("Nadie atrás... por ahora")
end

Mesa --> Mostrador: Documento sellado y despachado
Mostrador -> Jugador: Visitante se retira -> Siguiente en cola

== FIN DEL TURNO (06:00 AM) ==
@enduml
```

---

### B. Diagrama de Máquina de Estados PlantUML (State Machine del Bucle de Turno)

```plantuml
@startuml
skinparam backgroundColor #060606
skinparam state {
    BackgroundColor #141414
    BorderColor #00ff66
    FontColor #ffffff
    ArrowColor #38bdf8
    StartColor #00ff66
    EndColor #e63946
}

[*] --> PreTurno : Reloj 00:00 AM

state PreTurno {
    [*] --> EsperandoVisitante
}

state TurnoActivo {
    EsperandoVisitante --> VisitanteEnVentanilla : Cola despacha sujeto
    
    VisitanteEnVentanilla --> InspeccionandoDocumento : Arrastrar doc al escritorio
    
    state "Ceguera Selectiva (Cuaderno Abierto)" as CuadernoAbierto #451a03
    InspeccionandoDocumento --> CuadernoAbierto : Desplegar Cuaderno 85%
    CuadernoAbierto --> InspeccionandoDocumento : Plegar a cajón
    
    state "Alerta de Fax (Multa Activa)" as MultaActiva #991b1b
    InspeccionandoDocumento --> MultaActiva : Infracción de tiempo
    MultaActiva --> InspeccionandoDocumento : Descartar multa
    
    state "Vigilancia en Espejo Convexo" as VigilandoEspejo #d97706
    InspeccionandoDocumento --> VigilandoEspejo : Tocar Espejo
    VigilandoEspejo --> InspeccionandoDocumento : Regresar a mesa
    
    InspeccionandoDocumento --> SellandoDecision : Aplicar Sello
    SellandoDecision --> EvaluandoAcierto : Enviar documento
    
    EvaluandoAcierto --> EsperandoVisitante : Correcto (Continuar)
    EvaluandoAcierto --> InfraccionCometida : Incorrecto (+1 Strike)
    InfraccionCometida --> EsperandoVisitante : Strikes < 3
}

InfraccionCometida --> GameOver : Strikes == 3
TurnoActivo --> GameOver : Cordura == 0 o Ataque
TurnoActivo --> EvaluacionFinal : Reloj llega a 06:00 AM

state EvaluacionFinal {
    [*] --> CalculandoSueldo
    CalculandoSueldo --> TurnoSuperado : Mostrar Reporte Diario
}

TurnoSuperado --> [*] : Avanzar al Siguiente Día
GameOver --> [*] : Reintentar Jornada

@enduml
```

---

### C. Diagrama de Actividades PlantUML (Flujo de Decisiones del Operador)

```plantuml
@startuml
skinparam backgroundColor #0d0d0d
skinparam activity {
    BackgroundColor #141414
    BorderColor #00ff66
    FontColor #ffffff
    ArrowColor #00ff66
    DiamondBackgroundColor #1f1f1f
    DiamondBorderColor #f4a261
}

start
:Llega nuevo visitante a la ventanilla;
:Se genera documento en el Carrusel;

if (¿Operador duda de las reglas?) then (sí)
    :Extraer Cuaderno Masivo (85%x65%);
    #641111:Ceguera Selectiva (Mesa Oculta);
    :Consultar Directivas del Consorcio;
    :Plegar Cuaderno al Cajón;
else (no)
endif

:Arrastrar documento al centro de la mesa;
:Cotejar Fotografía, Vigencia y Sello CST;

if (¿Llega Multa por Fax?) then (sí)
    #991b1b:La hoja de multa baja tapando la PC;
    :Tocar para descartar multa;
else (no)
endif

if (¿El documento cumple todas las normas?) then (sí)
    :Tomar Sello Verde [ APROBAR ];
    :Estampar sobre el documento;
else (no)
    :Tomar Sello Rojo [ RECHAZAR ];
    :Estampar sobre el documento;
endif

if (¿Se escucha un ruido atrás?) then (sí)
    :Tocar Espejo Convexo;
    :Verificar ausencia de anomalía;
else (no)
endif

:Despachar visitante;

if (¿El reloj marcó las 06:00 AM?) then (sí)
    #00ff66:Turno Finalizado con Éxito;
    :Mostrar Evaluación y Salario;
    stop
else (no)
    if (¿Infracciones acumuladas >= 3?) then (sí)
        #e63946:Despido Inmediato (GAME OVER);
        stop
    else (no)
        :Esperar siguiente visitante;
    endif
endif

@enduml
```
