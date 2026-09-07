# 🎨 DIAGRAMAS DE INTERFAZ Y FLUJO PARA FIGMA (UI FLOWS)
## ISN'T BEHIND — Guía de Prototipado Visual

**Versión:** 1.1.0  
**Objetivo:** Proveer a los equipos de Arte, UI/UX y Desarrollo una referencia visual, espacial y lógica clara de cómo deben comportarse las pantallas en Figma antes de programar la lógica en React Native.

---

## 1. FLUJO DEL MENÚ PRINCIPAL (`MainMenuScreen`)

Este diagrama establece que todas las opciones del menú principal (excepto `STORY`) operan como modales o overlays sin salir de la vista principal.

```plantuml
@startuml
skinparam backgroundColor #0d0d0d
skinparam state {
    BackgroundColor #141414
    BorderColor #00ff66
    FontColor #ffffff
    ArrowColor #38bdf8
}

[*] --> Pantalla_MenuPrincipal : Carga Inicial (Fade-in)

state Pantalla_MenuPrincipal {
    state "Arte: Estética CRT, Logo Giratorio" as ArteMenu
}

Pantalla_MenuPrincipal --> Modal_Settings : Tap en [ SETTINGS ]
state Modal_Settings {
    state "Overlay (No cambia de pantalla)\nSliders: Volumen, SFX\nToggle: Hápticos" as ConfigUI
}
Modal_Settings --> Pantalla_MenuPrincipal : Tap en [ CERRAR ]

Pantalla_MenuPrincipal --> Pantalla_Creditos : Tap en [ CREDITS ]
state Pantalla_Creditos {
    state "Texto con Scroll Vertical" as CreditosUI
}
Pantalla_Creditos --> Pantalla_MenuPrincipal : Tap en [ VOLVER ]

Pantalla_MenuPrincipal --> Modal_Salida : Tap en [ EXIT ]
state Modal_Salida {
    state "Overlay de Confirmación\n¿Abandonar el juego?" as ExitUI
}
ExitUI --> [*] : Tap [ SI ] (Cierra App)
Modal_Salida --> Pantalla_MenuPrincipal : Tap [ NO ]

Pantalla_MenuPrincipal --> Transicion_Historia : Tap en [ STORY ]
Transicion_Historia : (Fade-out a Negro Total)
@enduml
```

---

## 2. TRANSICIONES NARRATIVAS AL BUCLE (`Story -> Shift`)

Mapea la cadencia de la historia de la radio, los "Fade a Negro", y la transición cinemática sin cortes del reloj.

```plantuml
@startuml
skinparam backgroundColor #0d0d0d
skinparam activity {
    BackgroundColor #141414
    BorderColor #38bdf8
    FontColor #ffffff
    ArrowColor #00ff66
}

start
:Fade-in desde Menú Principal;

partition "**WeeklyIntroScreen** (Historia / Radio)" {
    #141414:Fondo Negro Puro\nTop: Icono Radio Analógica\nBottom: Vector Ciudad Brutalista;
    
    repeat :Texto aparece con "Barrido Escáner" hacia abajo;
        if (¿El jugador hace Tap?) then (sí)
            :Mostrar bloque de texto completo (Skip animación);
        else (no)
            if (¿Texto muy largo?) then (sí)
                :Pausar barrido;
                :Mostrar Flecha Parpadeante [Siguiente];
                :Esperar Tap;
            else (no)
            endif
        endif
    repeat while (¿Hay más texto/historia?) is (sí)
}

:Fade-out a Negro Total;

partition "**DailyIntroScreen** (Encabezado Burocrático)" {
    #141414:Estética Fría / Terminal PC\nLetras pequeñas;
    :Muestra: [ DÍA X ] y Normativas;
    :Esperar Tap en botón [ INICIAR TURNO ];
}

partition "**Transición Cinemática (Seamless)**" {
    :Reproducir SFX: Audio del Jefe;
    #000000:<color:white>Pantalla en Negro Total;
    :Brillo Blanco en el centro: **00:00 AM**;
    :Fondo hace Fade-out revelando el Mostrador 40/60;
    :El texto **00:00 AM** se encoge (Escala) y Traslada;
    #00ff66:Texto encaja en el Reloj Digital In-Game;
}

:Inicio del Bucle de Juego;
stop
@enduml
```

---

## 3. ARQUITECTURA DE INTERFACES DEL TURNO (40/60 & Ceguera Selectiva)

El diagrama más importante para Figma. Dicta qué elementos cubren a otros, y diferencia entre gestos *Tap*, *Hold* y *Drag*.

```plantuml
@startuml
skinparam backgroundColor #0d0d0d
skinparam state {
    BackgroundColor #141414
    BorderColor #f4a261
    FontColor #ffffff
    ArrowColor #38bdf8
}

state "ZONA SUPERIOR (Mostrador 40%)" as TopZone {
    state "Fondo de Tienda" as FondoTienda : Tap = Transparencia 50% en Cliente/PC\n(Vigilar robos traseros)
    state "Espejo Convexo" as Espejo : Tap = Se expande tapando el 40%\n(Vigilar retaguardia)
    state "Cortinilla de Privacidad" as Cortinilla : Tap = Baja persiana\n(Oculta acciones del cliente)
}

state "ZONA INTERMEDIA (Bloqueos / Capa Flotante)" as MidZone {
    state "PC Terminal" as PC : Abre UI Corporativa\n(Bloquea visión central)
    state "Impresora Fax" as Fax : Imprime Multa ENCIMA de la PC
    
    Fax --> PC : Multa tapa monitor
    note right of Fax : Requiere hacer "Drag" (deslizar)\npara tirar la multa y usar PC.
}

state "ZONA INFERIOR (Mesa de Trabajo 60%)" as BottomZone {
    state "Mesa Central (35%)" as Mesa {
        state "Carrusel" as Carrusel : Muestra Documentos
        state "Uso de Herramienta" as Herramienta : Ej. Lupa/UV
        Carrusel --> Herramienta : Combinar
        Herramienta --> SpriteZoom : Abre "Sprite de Zoom"\npara ver sellos/marcas
    }
    
    state "Caja Registradora" as Caja {
        state "Tap en [ COBRAR ]" as Cobrar
        Cobrar --> UI_Caja : Tapa 52% inferior de pantalla
        UI_Caja : Interfaz Calculadora\nIngreso de Vuelto (Blanco/Negro)
    }

    state "Cajones (25%)" as Cajones {
        state "Tap = Abrir / Cerrar" as TapCajon
        state "Hold = Extraer Objeto" as HoldCajon
        
        HoldCajon --> Cuaderno_Extraido : Cuaderno de Notas
        Cuaderno_Extraido : NO vuelve al cajón\nSe arrastra (Drag)\nTapa visión de la mesa
        
        HoldCajon --> Arma_Extraida : Revólver
        Arma_Extraida : SÍ vuelve al cajón (Hold)\nInvalida usar herramientas\nEstado 1: Oculta / Estado 2: Apuntando
    }
    
    state "Inventario Lateral" as Inventario : Desliza de Derecha a Izquierda\n(Fuerza el cierre de cajones al abrirse)
}

TopZone -down-> MidZone : Se superponen
MidZone -down-> BottomZone : Interacción constante

@enduml
```

---

## 4. INTERFACES POST-GAMEPLAY (Resumen, Tienda y Auditoría)

Muestra las 3 pantallas de cierre de turno donde se gestiona la economía legal/ilegal y el minijuego de lavado.

```plantuml
@startuml
skinparam backgroundColor #0d0d0d
skinparam state {
    BackgroundColor #141414
    BorderColor #00ff66
    FontColor #ffffff
    ArrowColor #38bdf8
}

title "DIAGRAMA 4: Flujo Post-Gameplay (Fin de Turno, Tienda y Lavado)"

[*] --> FinDeTurno : Reloj marca 06:00 AM\n(Fade-out a Negro)

state FinDeTurno {
    state "1. RESUMEN FINANCIERO (ShiftSummaryScreen)" as ResumenUI {
        state "Estética: Factura Burocrática Impresa" as Factura
        Factura : - Sueldo Base + Clientes Atendidos\n- Multas del Fax (Infracciones)\n- Gastos Fijos (Renta, Electricidad)\n= Balance Legal Neto Disponible
    }
    
    ResumenUI --> TiendaConsorcio : Tap en [ CONTINUAR A GESTIÓN ]
    
    state "2. TIENDA DEL CONSORCIO (ConsortiumShopScreen)" as TiendaConsorcio {
        state "Solo acepta: DINERO LEGAL (Blanco)" as ReglaDineroLegal #064e3b
        state "Catálogo de Compra" as Catalogo
        Catalogo : - Herramientas Oficiales (Lámpara UV, Lupa)\n- Mejoras PC (Software de Base de Datos, Escáner)\n- Pago de Cuotas Sindicales
    }
    
    TiendaConsorcio --> AuditoriaLavado : Tap en [ PROCEDER A AUDITORÍA ]
    
    state "3. AUDITORÍA Y JUSTIFICACIÓN (AuditLaunderingScreen)" as AuditoriaLavado {
        state "Estética: Libro Contable Clandestino" as LibroContable #451a03
        LibroContable : **SLIDER / INPUT INTERACTIVO:**\n"¿Cuánto dinero Ilegal transfieres a Legal?"
        
        state "Medidores Dinámicos" as Medidores
        Medidores : - Dinero Legal Declarado (No puede ser $0)\n- Dinero Ilegal Restante (Para Mercado Negro)\n- Barra de SOSPECHA CORPORATIVA
        
        state "Validación de Auditoría" as Validacion
        Validacion : - Si lavas demasiado: +Sospecha\n- Si declaras muy poco: +Alerta de Incompetencia
    }
}

AuditoriaLavado --> SiguienteDia : Tap en [ SELLAR DECLARACIÓN ]\n(Sospecha < 100% y Deudas Pagadas)
AuditoriaLavado --> GameOverAuditoria : Sospecha >= 100% o Quiebra\n(Inspección y Arresto)

state SiguienteDia {
    state "Fade a Negro -> Transición a DailyIntroScreen (Día X+1)" as NextDayUI
}

state GameOverAuditoria {
    state "Pantalla de Despido / Ejecución" as GameOverUI #991b1b
}

NextDayUI --> [*]
GameOverUI --> [*]

@enduml
```
