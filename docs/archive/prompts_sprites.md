# DICCIONARIO DE PROMPTS PARA SPRITES — ISN'T BEHIND
## Guía de Generación Hiperrealista (Sin efecto plástico / Sin distorsión 3D)

> **REGLAS DE ORO DE REALISMO:**
> 1. **CERO "3D RENDER" / CERO "BRUTALIST" EN OBJETOS:**
>    - La palabra "brutalist" solo se usa para la pared de hormigón del fondo. En los objetos genera formas toscas, tubos inflados y apariencia de plástico/juguete.
>    - En su lugar usamos **vocabulario de fotografía documental real**: `authentic gritty documentary photograph`, `35mm lens`, `scratched cold-rolled steel`, `galvanized zinc wire`, `pitted rust`, `flea market relic`.
> 2. **PERSONAJES (Aspect Ratio 9:16):**
>    - Busto vertical 9:16, de pie mirando al frente, **sin mesas ni mostradores ni objetos alrededor**.
>    - **Fondo blanco puro plano (`#FFFFFF`)** con contornos oscuros para recorte con varita mágica en 1 clic.
>    - Luz dura fija a 45° superior-izquierda.
> 3. **OBJETOS (Aspect Ratio 16:9):**
>    - **ZONA A & B (0° Frontal puro):** Persiana, reloj, pared, enrejado de cerca (malla de alambre), cartel, teléfono de pared.
>    - **ZONA C (25° Picado suave):** Mesa de madera, monitor PC, carrusel de ítems, lámpara, latas, cenicero, pastillas.
>    - **ZONA D (70° Cenital empinado):** Interior de cajones abiertos, caja de cartón, caja registradora, suelo.

---

## 0. BLOQUES MAESTROS DE ANCLAJE (System Prompts para copiar antes del prompt)

### 0.1. Bloque Maestro para PERSONAJES (Clientes 9:16)
```text
[MASTER STYLE GUIDE - CHARACTERS]
Generate a character sprite for a gritty analog horror game. Maintain strict visual realism:
1. LIGHTING: Single harsh key light strictly from the upper-left (45 degrees up, 45 degrees left). Stark pitch-black shadows on the right side and beneath the chin. No soft studio bounce light.
2. BACKGROUND: 100% solid flat pure white background (#FFFFFF) with zero ambient shadows cast on the backdrop.
3. SILHOUETTE: Crisp, distinct dark perimeter outline around the hair, skin, and clothing for instant alpha cutout.
4. FRAMING: Pure isolated standing upper-body bust portrait, 9:16 vertical ratio, facing directly forward. Absolutely NO counters, NO desks, and NO background furniture.
5. ERA: Late 1990s / year 2000 impoverished urban clothing, real analog film photography, weathered fabric textures, tired and hollow facial expression.
```

### 0.2. Bloque Maestro para OBJETOS DE MESA (Zona C - 25° Picado, 16:9)
```text
[MASTER STYLE GUIDE - TABLETOP OBJECTS (ZONE C - 25° PITCH)]
Generate an authentic, tangible desktop prop. Avoid any 3D CGI look, low-poly bevels, or toy-like plastic appearance:
1. STYLE: Authentic gritty documentary macro photograph, 35mm lens, raw film texture, real flea market artifact from the late 1990s.
2. PERSPECTIVE: Exactly 25 degrees top-down angled perspective, viewing the tabletop from a seated user's point of view. Show both the top surface and the front-facing depth.
3. MATERIALS: Genuine scratched cold-rolled steel, aged yellowed ABS plastic with grime in seams, chipped paint, micro-scratches, dust, and oily thumbprints.
4. LIGHTING: Single harsh directional key light from upper-left (45 degrees above, 45 degrees left). Deep, pitch-black cast shadows strictly on the right side.
5. BACKGROUND: Solid pitch-black void (#000000) for clean asset extraction.
6. RATIO: 16:9 widescreen format.
```

### 0.3. Bloque Maestro para ELEMENTOS FRONTALES (Zona A/B - 0° Frontal, 16:9)
```text
[MASTER STYLE GUIDE - FRONTAL BARRIERS (ZONE A/B - 0° FLAT)]
Generate an authentic, raw industrial architectural asset:
1. PERSPECTIVE: Flat orthogonal 0-degree straight eye-level front view. Strictly parallel lines, no perspective distortion.
2. STYLE: Gritty documentary photograph, real physical construction materials, authentic oxidation, pitted rust, and chipped paint. Not a 3D render.
3. LIGHTING: Harsh directional grazing light from upper-left, throwing sharp shadow relief across wire mesh, ridges, and seams.
4. BACKGROUND: Solid pitch-black backdrop (#000000).
5. RATIO: 16:9 widescreen.
```

### 0.4. Bloque Maestro para CAJONES Y SUB-MESA (Zona D - 70° Cenital, 16:9)
```text
[MASTER STYLE GUIDE - SUB-DESK STORAGE (ZONE D - 70° OVERHEAD)]
Generate an authentic storage container viewed from above:
1. PERSPECTIVE: Extreme steep 70-degree near-overhead top-down perspective, looking directly down into the deep interior cavities.
2. STYLE: Real documentary photography, genuine aged splintered timber, worn corrugated cardboard fibers, and greasy metal glides.
3. LIGHTING: Harsh overhead-left key light, casting deep black shadows inside corners and recesses.
4. BACKGROUND: Solid pitch-black backdrop (#000000).
5. RATIO: 16:9 widescreen.
```

---

## 1. PERSONAJES: CLIENTES DE PIE (Aspect Ratio 9:16)
*Busto vertical, parados de frente, luz dura desde arriba-izquierda, sin muebles de tienda, recortable sobre blanco puro.*

### 1.1. Varón Joven (20s - Atuendo urbano noventero)
```text
Full upper-body portrait of a tired 22-year-old young man from the late 1990s, standing directly facing forward towards the camera, 9:16 vertical aspect ratio. Wearing an oversized faded dark denim jacket over a dark hooded sweatshirt, hands casually resting at his sides. Neutral exhausted expression, hollow eyes looking forward. ONLY the person, no counter, no desk, no background scenery. Harsh single directional key light coming strictly from the upper-left (45 degrees above, 45 degrees left), casting stark sharp dark shadows across the right side of his face and clothing folds. Distinct crisp dark silhouette outlines, isolated on a completely flat solid pure white background (#FFFFFF) with zero ambient cast shadows on the backdrop, high-contrast analog realism, sharp edges for cutout. --ar 9:16
```

### 1.2. Mujer Adulta (30s-40s - Ropa sobria funcional)
```text
Full upper-body portrait of a tense 38-year-old woman in year 2000, standing directly facing the camera, 9:16 vertical aspect ratio. Hair tied back in a messy practical bun, wearing a heavy dark charcoal wool overcoat with a high collar, holding a small worn coin pouch in both hands in front of her chest. Guarded neutral expression, eyes looking forward. ONLY the person, no furniture, no counter. Harsh single directional spotlight strictly from the upper-left (45 degrees above, 45 degrees left), casting sharp deep shadows under the jaw and across the right side of her coat. Crisp dark perimeter silhouette edges, isolated on a solid seamless pure white background (#FFFFFF) with no background shadows, photorealistic, clean contours for easy alpha mask. --ar 9:16
```

### 1.3. Obrero Anciano (60s - Ropa pesada desgastada)
```text
Full upper-body portrait of a weathered 65-year-old working-class man standing directly facing the camera, late 1990s, 9:16 vertical aspect ratio. Rugged facial stubble, deep skin wrinkles, wearing a bulky faded dark canvas utility jacket with brass buttons and a dark knit beanie, hands tucked into his jacket pockets. Heavy, weary posture looking straight ahead. ONLY the person, no table, no environment. Harsh directional key light coming strictly from the upper-left, throwing deep hard shadows across the right side of the face and garment creases. Stark dark silhouette perimeter, isolated on a solid pure white background (#FFFFFF), sharp edge contrast, photorealistic cinematic portrait. --ar 9:16
```

### 1.4. Joven Sospechoso / Clandestino (18-20s - Posible insurgente)
```text
Full upper-body portrait of an anxious 19-year-old youth standing facing forward towards the camera, early 2000s, 9:16 vertical aspect ratio. Wearing an oversized dark navy nylon windbreaker zipped all the way up, wet messy bangs, fingers nervously fidgeting with a small folded slip of paper. Looking forward with a tense, guarded glance. ONLY the person, no counter, no obstacles. Intense hard spotlight from the upper-left casting sharp geometric shadows and high-contrast rim lighting on the left side, right side enveloped in dark shade. Clean dark silhouette boundary, isolated on a flat solid pure white background (#FFFFFF), gritty realistic photography, crisp cutout borders. --ar 9:16
```

---

## 2. ZONA A & B: ELEMENTOS FRONTALES (Ángulo 0° Frontal Ortogonal, 16:9)

### 2.1. Rejilla de Seguridad de Cerca de Alambre (Sin marco grueso, con hueco y abertura inferior)
```text
An authentic documentary photograph of a real indoor retail security counter barrier made of oxidized galvanized steel chain-link diamond wire mesh, straight eye-level 0-degree front view, 16:9 aspect ratio. Frameless wire mesh extending naturally across the frame. In the center of the wire mesh, there is a torn jagged hole where rusty wires have snapped and bent open. At the bottom center, there is a clean arched semicircular pass-through opening cut into the wire for customers to slide money and items through. Realistic thin twisted steel wire with fine scratches, dull galvanized patina, dark grease stains, and spotty orange rust on broken tips. Harsh cold directional fluorescent light from upper-left highlighting wire edges and casting crisp shadows. Flat solid pitch-black backdrop (#000000) behind the wire mesh, isolated game asset, raw real photography, high detail, not a 3D render, no plastic look. --ar 16:9
```

### 2.2. Persiana Metálica Enrollada (Tambor/Caja Superior - Zona A)
```text
An authentic documentary photograph of the top housing box and spool drum of an industrial galvanized steel roll-up security shutter, straight horizontal eye-level 0-degree front view, 16:9 aspect ratio. Corrugated thin sheet steel housing with real metal denting, grease tracks from the roller mechanism, scratched primer paint, and rusted hex bolts along horizontal seams. Harsh frontal-side key light from upper-left creating sharp contrast along metal bends, solid pitch-black background, isolated architectural layer asset, raw authentic metal photography, zero 3D CGI look. --ar 16:9
```

### 2.3. Reloj Digital de Pared de los 90s (Zona A)
```text
An authentic 1990s industrial digital wall clock, straight 0-degree eye-level front view, 16:9 aspect ratio. Rectangular matte textured black plastic casing with genuine surface scuffs, fine hairline scratches, and dust in the side speaker grille slots. Large empty dark LCD glass display panel (powered off, blank dark grey liquid crystal surface with subtle faint grid lines, no digits shown). Small recessed plastic adjustment buttons. Directional cold key light from upper-left, solid pitch-black background, isolated UI prop, real vintage electronics photo. --ar 16:9
```

### 2.4. Fondo de Pared de Hormigón Brutalista (Zona B)
```text
A panoramic architectural photograph of an oppressive interior bunker wall, straight 0-degree front view, 16:9 aspect ratio. Massive prefabricated cream-grey concrete slabs with deep horizontal and vertical expansion seams, water seepage marks, chipped cement corners, and exposed rusty rebar wire. Cold moody directional light from the upper-left casting stark shadows across concrete joints and cracks, gritty analog documentary photography, seamless backdrop texture. --ar 16:9
```

### 2.5. Cartel Circular de Propaganda Nacional C.S.T. (Zona B - Derecha)
```text
An authentic photograph of an old circular stamped sheet-metal corporate propaganda sign screwed to a wall, straight 0-degree front view, 16:9 aspect ratio. Chipped dark enamel paint around the curled rim, rusted screw holes, greasy fingerprints, and surface scratches. The inner circle is completely BLANK metal ready for custom stencils, with no letters or illustrations. Directional lighting from upper-left, solid pitch-black background, isolated vintage metal prop. --ar 16:9
```

### 2.6. Teléfono Fijo de Pared con Cable Colgante (Boundary-Breaker Izquierdo)
```text
An authentic documentary photograph of a 1980s heavy wall-mounted push-button telephone, straight side-profile perspective as if mounted flush against a left-side wall, 16:9 aspect ratio. Scuffed dark charcoal plastic body with yellowed plastic number keys, greasy handset resting in its metal cradle, and a long thick black coiled handset cord hanging straight down below the unit. Realistic dust along crevices, harsh directional grazing light from upper-right, stark edge contrast, solid pitch-black background, isolated asset. --ar 16:9
```

---

## 3. ZONA C: MOSTRADOR Y OBJETOS DE MESA (Ángulo Picado Suave ~25°, 16:9)

### 3.1. Superficie Mostrador de Madera Vieja (Zona C Background)
```text
An authentic photograph of an old wooden shop counter surface, viewed from a 25-degree top-down perspective from a seated clerk's point of view, 16:9 aspect ratio. Worn solid dark pine planks with chipped dark varnish, deep gouges, cigarette burns into the grain, dark water ring stains, and grey grime in the wood pores. Harsh directional cold grazing light from the upper-left highlighting the uneven splintered wood grain and knife scratches, solid black borders, raw photo. --ar 16:9
```

### 3.2. Monitor CRT de la PC + Teclado Mecánico (Boundary-Breaker Zona C/B)
```text
An authentic gritty photograph of a heavy beige 1997 CRT computer monitor and matching thick mechanical keyboard sitting on a desk, viewed from an elevated 25-degree angle, 16:9 aspect ratio. Aged ABS plastic with realistic nicotine yellowing, dusty ventilation slots on top, scuffed edges, and faded volume dials. The CRT screen is powered OFF, dark curved heavy tinted glass with faint internal phosphor shadow and subtle dust specks. Keyboard shows faded, worn letter keys and a scuffed spacebar. Harsh directional light from upper-left casting sharp dark shadows to the right, solid pitch-black background, raw photo of authentic obsolete electronics, no 3D render look. --ar 16:9
```

### 3.3. Solo Monitor CRT (Para superponer interfaces en Zona C/B)
```text
An authentic photograph of a bulky standalone 1990s CRT computer monitor on a short tilt-swivel stand, no keyboard, front-angled at a 25-degree tilt from above, 16:9 aspect ratio. Powered off, dark curved glass display with realistic ambient darkness and no glare. Yellowed beige industrial plastic bezel with scuffed corners, power button, and brightness dials. Harsh key light from upper-left, sharp deep shadow, solid pitch-black background, real vintage hardware photograph. --ar 16:9
```

### 3.4. Lámpara de Mesa de Hierro Envejecido (Zona C - Derecha)
```text
An authentic vintage industrial gooseneck desk lamp with an enameled dome shade, viewed from a 25-degree elevated tabletop perspective, 16:9 aspect ratio. Chipped cream-white enamel paint revealing rusted raw iron underneath, brass adjustment wingnuts with patina, heavy cast-iron base with a dirty toggle switch, black cloth-wrapped electrical cord. The lamp head is aimed toward the left. Light bulb is completely TURNED OFF. Sharp directional key lighting from upper-left casting crisp shadows to the right, solid pitch-black background, real antique photograph. --ar 16:9
```

### 3.5. Frasco de Píldoras del C.S.T. (Zona C - Mesa)
```text
A detailed macro photograph of an authentic industrial amber glass apothecary pill jar with a ribbed white plastic screw cap, sealed with a torn dark blue tamper tape, resting on a wooden tabletop beside two dark blue gelatin capsule pills, viewed from a 25-degree top-down angle, 16:9 aspect ratio. Real glass thickness, air bubbles in glass, scratched plastic cap. Single harsh directional light from upper-left casting a deep black shadow to the right, solid pitch-black background, realistic pharmacy relic photo. --ar 16:9
```

### 3.6. Cenicero con Colillas y Latas Acumuladas (Zona C - Props)
```text
An authentic macro photograph of shopkeeper desk clutter: two crushed empty aluminum beverage cans with faded dark 90s graphics, metal scratches, and sticky soda residue, sitting next to a heavy black molded bakelite ashtray filled with crushed filter cigarette butts and grey ash, viewed from a 25-degree tabletop perspective, 16:9 aspect ratio. Harsh directional light from upper-left, deep black shadows, solid pitch-black background, gritty real trash photo. --ar 16:9
```

### 3.7. Portalápices y Papelería de Oficina (Zona C - Props)
```text
An authentic photograph of desktop bureaucratic clutter: a scratched tin can used as a pen holder filled with chewed black ballpoint pens, rusted steel scissors, a wooden-handled rubber inspection stamp, and a messy pile of curled yellowed paper receipts with ink stamps, viewed from a 25-degree perspective, 16:9 aspect ratio. Sharp side light from upper-left, solid pitch-black background, real desk props photo. --ar 16:9
```

---

## 4. OBJETOS DEL CARRUSEL DE MESA (Ángulo 25° Apoyados, 16:9)
*Objetos entregados por el cliente a través de la abertura de la reja, apoyados sobre la madera.*

### 4.1. Documento de Identidad del C.S.T. (Citizen ID Card)
```text
An authentic macro photograph of an official citizen identity card from the year 2000 under an oppressive corporate state, resting flat on a wooden surface viewed from a 25-degree angle, 16:9 aspect ratio. Thick laminated paper card with peeling clear plastic corners, dull blue-grey geometric border, blank faded square for a photo, and blank rectangular serial number lines. Real paper yellowing, dirty fingerprints, single harsh directional light from upper-left casting a sharp paper shadow, solid pitch-black background. --ar 16:9
```

### 4.2. Cartilla de Racionamiento / Suministros (Ration Booklet)
```text
An authentic macro photograph of a small pocket ration coupon booklet made of coarse grey-brown pulp paper, open on a desk, viewed from a 25-degree angle, 16:9 aspect ratio. Printed grid of stamp boxes on fibrous paper, some boxes stamped with black ink and others blank, creased spine, frayed paper edges. Directional lighting from upper-left showing paper fiber relief, crisp shadow, solid pitch-black background, real historical prop photo. --ar 16:9
```

### 4.3. Billetes de Dinero del Consorcio (C.S.T. Banknotes)
```text
An authentic photograph of three wrinkled, dirty paper currency banknotes from the late 1990s resting fanned out on a table, viewed from a 25-degree angle, 16:9 aspect ratio. Muted dark teal and grey intaglio print with geometric guilloche borders, blank center ovals, creases, torn edges, and oily smudge marks. Hard directional light from upper-left casting sharp paper edge shadows, solid pitch-black background, real paper money photo. --ar 16:9
```

### 4.4. Lata de Ración Oficial del C.S.T. (Standard Ration Can)
```text
An authentic macro photograph of an unbranded commercial tin food can, viewed from a 25-degree workstation perspective, 16:9 aspect ratio. Dented galvanized tinplate metal with scratches, subtle rust along the rolled lid rim, and a simple dull dark blue paper band label wrapped around the cylinder. Stamped numeric lot code on the lid. Cold directional key light from upper-left casting a sharp shadow to the right, solid pitch-black background, raw realistic canned food photo. --ar 16:9
```

### 4.5. Paquete Sospechoso de Trueque / Contrabando (Black Market Item)
```text
An authentic photograph of a small clandestine package roughly wrapped in aged yellowed newspaper and bound tightly with coarse hairy jute twine with a frayed knot, resting on a table, 25-degree angle, 16:9 aspect ratio. Dark oily grease stains soaking through the newsprint from whatever is inside. Harsh side lighting from upper-left revealing paper crinkles and twine hair, sharp dark shadow, solid pitch-black background, real contraband prop photo. --ar 16:9
```

---

## 5. ZONA D: SUB-MESA Y ALMACENAMIENTO (Ángulo Picado Empinado ~70° Cenital, 16:9)
*Mirando directamente hacia abajo al interior de los cajones abiertos y los contenedores.*

### 5.1. Cajón Izquierdo Abierto (Efectivo y Balances - 70° Cenital)
```text
An authentic documentary photograph of a heavy wooden shop desk drawer pulled completely open, viewed from an extreme 70-degree near-overhead top-down perspective looking straight down into the interior compartments, 16:9 aspect ratio. Dark splintered timber sides, bottom divided into wooden coin and bill trays showing dark wood grain and corners filled with dust. Hard directional grazing light from upper-left casting deep black shadows inside corners, solid pitch-black background, real furniture photo. --ar 16:9
```

### 5.2. Cajón Derecho Abierto (Clandestino / Arma - 70° Cenital)
```text
An authentic photograph of an isolated shop desk drawer pulled open, viewed from a steep 70-degree overhead top-down perspective looking directly down into the empty dark bottom, 16:9 aspect ratio. Dark stained pine with an iron pull handle visible on the front lip, hollow empty cavity with deep black shadows. Harsh directional light from upper-left highlighting the top edges, solid pitch-black background, authentic vintage carpentry photo. --ar 16:9
```

### 5.3. Caja de Cartón Larga de Inventario (70° Cenital)
```text
An authentic photograph of a long rectangular corrugated cardboard shipping box resting on the floor, viewed from an extreme 70-degree top-down near-overhead perspective looking directly down into the hollow bottom, 16:9 aspect ratio. Creased weathered cardboard with torn flaps, peeling brown paper packing tape, dirty edges, and scuffs. Hard directional key light from upper-left casting deep black shadows inside the box, solid pitch-black background, authentic packaging photo, not a 3D render. --ar 16:9
```

### 5.4. Caja Registradora Vintage (Modal Emergente - Zona D / C)
```text
An authentic photograph of a heavy industrial electronic cash register from 1989, viewed from a steep 65-degree elevated top-down perspective, 16:9 aspect ratio. Matte charcoal-grey sheet metal chassis with authentic paint chipping, chunky mechanical rubberized number keys with faded white numbers, a narrow dark LED readout window, and a heavy front cash drawer handle. Harsh single directional key light from upper-left casting stark shadows, solid pitch-black background, real vintage retail machine photo. --ar 16:9
```

### 5.5. Suelo de Losetas Cuadradas Crema (70° Picado Cenital)
```text
An authentic documentary texture photograph of an old commercial linoleum tile floor, viewed from a steep 70-degree near-overhead top-down perspective looking straight down at the ground, 16:9 aspect ratio. Large square faded cream-yellowed tiles with wide dark dirty grout lines, scuff marks from work boots, dried mop streaks, and unpolished matte surface. Single directional grazing light from upper-left, subtle edge relief, uniform seamless floor photo. --ar 16:9
```
