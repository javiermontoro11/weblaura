# CONTEXTO MAESTRO — NUESTRA VIDA 1.0

> **Uso:** pega TODO este archivo en un chat nuevo si algún día se pierde el contexto de la conversación actual.  
> El objetivo es que ChatGPT pueda retomar el proyecto exactamente desde el estado actual sin volver a rediseñar, romper o rehacer cosas que ya están aprobadas.

---

## PROMPT PARA UN CHAT NUEVO

Quiero que continúes conmigo el desarrollo de mi juego web privado **“Nuestra Vida”**, integrado dentro de mi proyecto personal **JaviEats**.

No empieces de cero. No rediseñes el proyecto entero. No propongas reconstrucciones grandes si no son imprescindibles. La versión actual válida y que debe considerarse **MASTER** es:

**`Nuestra_Vida_1.0_RELEASE.zip`**

Esta versión nace de la rama 0.18.x después de muchas iteraciones y está ya aprobada para enseñársela a Laura.

Quiero que trabajes como si hubieras participado en todo el desarrollo anterior y respetes todas las decisiones ya cerradas que detallo a continuación.

---

# 1. ESTADO ACTUAL DEL PROYECTO

## Versión definitiva actual

**Nombre oficial:** `Nuestra Vida 1.0`  
**ZIP MASTER:** `Nuestra_Vida_1.0_RELEASE.zip`

Esta 1.0 deriva de la 0.18.57, después de una revisión general de release.

La 1.0 se considera **MASTER intocable**.

Si a partir de ahora aparece un bug concreto, no se debe sobrescribir esta versión: la siguiente versión sería, por ejemplo:

- `1.0.1`
- `1.0.2`
- etc.

No volver a numeración 0.18.x salvo que yo lo pida expresamente.

---

# 2. OBJETIVO DEL JUEGO

“Nuestra Vida” es un juego de tablero competitivo para dos jugadores:

- **Javi**
- **Laura**

Representa una vida completa desde el comienzo hasta la jubilación.

La partida mezcla:

- avance por tablero,
- ruleta,
- economía,
- profesión,
- vivienda,
- pareja/familia,
- hijos,
- mascotas,
- viajes,
- decisiones,
- eventos,
- minijuegos,
- pique competitivo,
- sueños personales,
- deuda,
- patrimonio,
- jubilación,
- puntuación final.

La intención es que tenga una identidad propia, cuidada, divertida, romántica sin ser empalagosa y con detalles personales reales.

---

# 3. DISPOSITIVOS PRIORITARIOS

El diseño principal está afinado para:

### Referencia principal
**iPad 11 en horizontal — 1180 × 820**

### También probado
**iPad Mini — 1024 × 768**

### PC
También debe seguir funcionando correctamente en escritorio.

Si hay que ajustar responsive, priorizar este orden:

1. 1180×820
2. 1024×768
3. PC

No romper PC para arreglar iPad salvo que no haya alternativa.

---

# 4. COSAS YA APROBADAS Y QUE NO SE DEBEN REDISEÑAR

Estas partes están cerradas salvo bug específico:

- Landing / portada
- Setup inicial
- Selector de Javi y Laura
- Moneda inicial
- Opening / cinemática de inicio
- Ruleta principal
- HUD de jugadores
- HUD superior
- Bloque inferior “AHORA”
- CTA “GIRAR RULETA”
- Cámara
- Tutorial
- Primera pasada de balance/economía
- Audio
- Jubilación
- Final de partida
- Responsive principal
- Títulos grandes de cinemáticas

No retocar estas áreas “porque se podrían hacer más bonitas”.

Solo cambiar si detectamos un error real.

---

# 5. LANDING Y ESTÉTICA GENERAL

La estética visual se inspiró en el lenguaje de diseño de JaviEats:

```css
--bg: #f4f0ea;
--card: #fff;
--text: #111;
--muted: #6f6a64;
--line: #e6ddd3;
--dark: #111;
--accent: #e85d45;
--accent-soft: #ffe0d7;
--gold-soft: #fff1c9;
--green-soft: #dff3e4;
--green: #24653a;
```

Fondos crema con brillos/radiales coral y naranja.

Características:

- tarjetas blancas,
- bordes redondeados,
- botones negros principales,
- coral suave como secundario,
- aspecto limpio y cálido.

El título de la pestaña del navegador es:

**`Nuestra Vida · JaviEats`**

No volver a poner títulos Beta antiguos.

---

# 6. MONEDA INICIAL — IMPORTANTE

Este bloque dio muchos problemas históricos.

Las versiones antiguas intentaban una moneda CSS 3D de dos caras y fallaban mostrando a Javi en ambas caras.

La solución válida fue reconstruirla como una sola cara visible que cambia entre Javi y Laura durante el giro.

Por tanto:

**NO volver a arquitectura CSS 3D con dos caras y `backface-visibility`.**

La moneda actual tiene:

- interacción manual,
- soporte de arrastre/giro,
- botón fallback “Girar moneda” dentro del modal.

No debe existir un botón “Gira la moneda” suelto en la landing.

---

# 7. HUD ACTUAL

El HUD pasó por varias fases:

- P1 limpio
- P2 más información
- P2.1 legibilidad
- P3 controles superiores
- P4 bloque inferior

El HUD actual está aprobado.

Incluye por jugador:

- avatar,
- nombre,
- turno,
- fase actual,
- saldo,
- deuda,
- suerte,
- Amor,
- Feliz,
- Éxito,
- Pique,
- profesión,
- nómina,
- vivienda,
- relación,
- hijos,
- mascotas,
- sueño.

La tipografía se aumentó expresamente porque en iPad los hijos/mascotas no se leían.

No volver a reducir tamaño de letra.

Los controles superiores quedaron reorganizados:

- Ajustes
- Mapa
- Explorar
- Ayuda
- Menú

Mapa y explorar tienen estados claros:

- Mapa → Seguir
- Explorar → Salir

---

# 8. CÁMARA — BLOQUE CERRADO

La cámara fue revisada específicamente.

Debe:

- seguir suavemente al jugador mientras avanza,
- evitar que la ficha quede bajo el HUD,
- reencuadrar de forma suave al acabar movimiento,
- respetar una zona segura,
- permitir Mapa completo,
- permitir Explorar,
- volver al jugador sin saltos bruscos.

También se corrigió:

- mapa completo que recortaba extremos,
- resize/orientación durante modo Explorar,
- centrado del jugador.

La cámara se considera solucionada.

---

# 9. MAPA Y DECISIONES VISUALES HISTÓRICAS

La base visual buena del mapa viene de la línea estable anterior, especialmente alrededor de 0.18.x.

Reglas importantes:

- No rediseñar todo el mapa.
- No rehacer el recorrido completo.
- Hacer cambios quirúrgicos.
- Evitar carreteras secundarias decorativas absurdas.
- No poner casas dentro del río.
- Mantener el recorrido protagonista.
- Colores alegres, luminosos y agradables.
- Nombres de zonas integrados.
- Mantener vida ambiental sutil.

Ambientación usada:

- coches,
- avión,
- barco,
- bicicleta.

---

# 10. BUGS DE AMBIENTACIÓN YA CORREGIDOS

## Barco

El barco del mapa tenía una animación demasiado repetitiva / extraña.

Se arregló ajustando:

- `transform-box`
- `transform-origin`
- duración larga
- mucho tiempo fuera de pantalla

El usuario confirmó literalmente:

**“El barco solucionado!!”**

No romper este arreglo.

## Bicicleta

Posteriormente apareció el mismo problema con la bici.

Se corrigió con la misma filosofía:

- menos frecuencia,
- recorrido más lento,
- tiempos largos sin aparecer.

También se considera cerrado.

---

# 11. CINEMÁTICAS Y TÍTULOS GRANDES

Había un error visible donde textos como:

**“¡A LA UNIVERSIDAD!”**

se salían del marco en iPad.

Se corrigió creando una zona segura de texto y escalado adaptable para títulos largos.

Se revisaron especialmente:

- Universidad
- Graduación
- Jubilación
- Boda
- Bebé
- Casa
- Mascotas
- Caminos
- Despedida

También se detectó y corrigió un posible desbordamiento de:

**“¡JUBILACIÓN!”**

No volver a permitir títulos que salgan del marco.

---

# 12. TUTORIAL

El tutorial ya existía y no se rehizo desde cero.

Se pulió reduciéndolo de unas 13 pantallas a aproximadamente 9.

Explica:

- giro,
- avance,
- resolución,
- casillas,
- STOP,
- caminos,
- HUD,
- saldo,
- deuda,
- número de la suerte,
- pique,
- minijuegos,
- economía,
- patrimonio,
- jubilación,
- cómo se gana.

Se eliminó el avance automático cada 5 segundos.

Ahora el usuario avanza manualmente con:

- Atrás
- Siguiente
- Saltar

No volver a hacerlo autoplay.

---

# 13. ECONOMÍA / BALANCE ACTUAL

Se hizo una primera pasada conservadora.

Cambios realizados:

### Hacienda inicial
Se eliminó una Hacienda obligatoria al principio porque castigaba demasiado pronto.

Esa casilla pasó a ser una **Oportunidad**.

Hacienda sigue existiendo en eventos/destino.

### Oportunidades
Los premios económicos de oportunidades se subieron aproximadamente a:

**18k – 28k**

para que tengan peso real.

### Vivienda
Al buscar vivienda, se intenta mostrar al menos una opción razonablemente accesible.

Antes de comprar, ahora se muestra:

- si hace falta financiación,
- deuda aproximada que generaría.

### No se tocaron
Deliberadamente:

- salarios,
- coste de universidad,
- coste de hijos,
- coste de mascotas,
- préstamo 100k → 110k deuda,
- interés del 5%,
- fórmula de puntuación final.

No hacer cambios agresivos de balance sin haber jugado varias partidas reales.

---

# 14. AUDIO — DECISIÓN MUY IMPORTANTE

El usuario pidió expresamente:

**SONIDOS REALES**

No quiere llantos, ladridos, etc. generados artificialmente si se puede usar una grabación real.

La 1.0 incluye/usa sonidos reales para:

- llanto de bebé,
- ladrido,
- maullido,
- caja registradora,
- aplausos.

Se añadieron fallbacks para evitar que una falta de carga rompa la partida.

El audio debe sentirse como efecto real de ambiente, no como sonidos cutres o demasiado artificiales.

Históricamente también se pidió evitar:

- duplicidad de cobros,
- loops molestos,
- música de fondo mala/repetitiva.

Si se toca audio en el futuro, mantener esta filosofía.

---

# 15. JUBILACIÓN Y FINAL

Este bloque ya estaba bastante hecho y se terminó en la 0.18.57 / 1.0.

Ahora el HUD puede mostrar:

### Jubilación tranquila
- número de giros / espera

### Jubilación viajera
- mejoras

Cuando llega el segundo jugador:

- aparece transición clara de “Los dos habéis llegado”,
- se pasa al recuento final.

El resultado final muestra:

- ganador claro,
- empate diferenciado,
- diferencia de puntos.

Se corrigió el texto:

**“segundo lugar”**

por algo tipo:

**“Llegó después · cerró el tablero”**

para no hacer parecer que llegar después es una penalización independiente.

No modificar fórmula de puntuación sin motivo.

---

# 16. FINAL DE PARTIDA — IDEA ORIGINAL

Cuando un jugador termina primero:

- espera al otro,
- puede disponer de ruletas/mejoras mientras espera.

La jubilación debe sentirse como una fase final real, no simplemente un popup de “FIN”.

La intención es que el final tenga sensación de cierre.

---

# 17. PERSONAJES, VIDA Y DETALLES PERSONALES

Jugadores:

- Javi
- Laura

Contexto personal usado en cartas/eventos y ambientación:

- Javi es informático.
- Laura estudia/trabaja en Enfermería.
- Perros de Javi: Randy y Nala.
- Laura: La Fortuna.
- Javi: Orcasitas.
- Ambos son ahorradores.
- Ambos son competitivos; Laura especialmente.
- Suelen llegar tarde.
- A Javi le gusta regalar y que le regalen.
- Empezaron a hablar el 23 de diciembre.

Referencias que se han manejado:

- Oporto / Bingo
- Tagliatella Preciados
- sushi en Pozuelo y Alcorcón
- “Una hora más” en el coche
- Disney con prioridad alta entre viajes
- Gandía
- Cullera
- Valle de Ordesa

No meter terceras personas reales innecesarias.

---

# 18. CAMINOS / VIDA

Hay una idea de caminos diferenciados:

### Familia
Más probabilidad de:

- hijos,
- mascotas,
- eventos familiares.

### Viajes
Más eventos de viajes.

Disney tiene prioridad alta.

Evitar movimientos absurdos que salten grandes secciones de mapa.

---

# 19. MINIJUEGOS

Se han planteado / utilizado cosas como:

- Bingo
- “Prepararse en 15 minutos”
- retos
- enfrentamientos
- ruletas
- desafíos 1–10

La intención era que aparezcan con frecuencia suficiente para dar vida, pero sin cansar.

Ejemplo real de Bingo de Oporto:

- premio 1000 / 500,
- perdedor paga 1:5.

También existen ideas de otros juegos dentro de JaviEats como:

- Dibuja
- No lo digas

Pero no meterlos en Nuestra Vida automáticamente si no forman ya parte de la versión actual.

---

# 20. INTEGRACIÓN CON JAVIEATS

Nuestra Vida pertenece al ecosistema privado **JaviEats**.

JaviEats usa:

- Supabase,
- autenticación,
- roles,
- Edge Functions,
- correo,
- minijuegos.

Nuestra Vida estuvo oculto durante el desarrollo para que Laura no lo viera antes de tiempo.

En una integración futura:

- no romper JaviEats,
- mantener autenticación existente,
- mantener el juego privado,
- revisar ruta de entrada,
- conservar compatibilidad con sesiones.

No rehacer arquitectura de Supabase si no es necesario.

---

# 21. PWA / INSTALACIÓN

En el proyecto se contempló una evolución PWA.

La 1.0 incluye:

- manifest válido,
- iconos 180 / 192 / 512,
- service worker.

La caché del Service Worker fue limpiada para la release 1.0.

Si se actualiza una versión futura:

- cambiar el cache key,
- evitar HTML viejo cacheado.

---

# 22. GUARDADOS — MUY IMPORTANTE

Aunque la aplicación visible sea **1.0**, internamente el schema de guardado sigue identificándose como:

**`0.18.29`**

Esto es deliberado por compatibilidad.

NO cambiar ese número solo porque la release sea 1.0.

Cambiarlo podría invalidar partidas guardadas.

Solo cambiar el schema de guardado si realmente hay una migración de datos.

---

# 23. ARCHIVOS / ESTRUCTURA

El proyecto usa un HTML principal grande con mucho CSS y JS inline.

Archivos/carpetas importantes históricas:

- `index.html`
- `lab.html` durante desarrollo
- `assets23`
- `assets25`
- `assets26`
- `audio27`
- `icons`
- `sw.js`
- `manifest`

La release 1.0 pública fue limpiada para no llevar basura de QA/LAB innecesaria.

No volver a meter archivos de test dentro del ZIP público salvo que yo lo pida.

---

# 24. QA QUE SE HIZO PARA 1.0

Antes de nombrarla 1.0 se revisó:

- referencias locales,
- assets faltantes,
- archivos de audio,
- imágenes,
- JavaScript,
- CSS,
- keyframes duplicados,
- IDs estáticos duplicados,
- manifest,
- iconos PWA,
- integridad del ZIP,
- restos visibles de versiones Beta.

Se reportó:

- 97 referencias locales revisadas
- 0 archivos faltantes
- 50 archivos de audio
- 0 corruptos
- 46 imágenes/assets
- 0 corruptos
- JS correcto
- CSS sin errores detectados
- sin keyframes duplicados
- sin IDs estáticos duplicados
- ZIP íntegro

---

# 25. VERSIONES HISTÓRICAS IMPORTANTES

No hace falta volver a ellas salvo para comparar un bug.

Referencia aproximada:

- 0.18.29 — foundation / base de una etapa estable
- 0.18.34 — Setup aprobado
- 0.18.46 — moneda reconstruida correctamente
- 0.18.47 — moneda + botón fallback / opening pulido
- 0.18.48 — HUD P1 + boat fix
- 0.18.49 — HUD clean + título pestaña
- 0.18.50 — HUD P2 más información
- 0.18.51 — HUD P2.1 legibilidad
- 0.18.52 — HUD P3 controles
- 0.18.53 — cinemáticas + HUD P4
- 0.18.54 — cámara P1
- 0.18.55 — arreglo bici
- 0.18.56 — tutorial + balance P1
- 0.18.57 — audio real + jubilación/final
- **1.0 — RELEASE MASTER**

---

# 26. COSAS QUE EL USUARIO VALORA MUCHO AL TRABAJAR

Esto es importante para cómo debes ayudarme.

## 1. Entregables reales
Cuando hagamos cambios, quiero normalmente un ZIP descargable real.

No me vale que me expliques cómo quedaría si puedes modificarlo tú.

## 2. Cambios incrementales
Prefiero:

1. hacer un bloque,
2. probarlo,
3. aprobarlo,
4. congelarlo,
5. pasar al siguiente.

## 3. No romper lo aprobado
Si una parte funciona, no tocarla de rebote.

## 4. No prometer pruebas falsas
Nunca digas:

- “lo he probado”
- “está perfecto”
- “he revisado visualmente”

si realmente no lo has hecho.

Diferenciar siempre:

- validación de código,
- revisión estática,
- prueba real en navegador,
- prueba real en iPad.

## 5. Revisar bien antes de pasar archivos
Prefiero tardar algo más y recibir algo correcto.

## 6. Links claros
Cuando generes ZIPs, dar siempre enlace descargable `sandbox:`.

## 7. Español
Responder en español.

Tono natural, directo, técnico cuando hace falta.

---

# 27. FILOSOFÍA DE DESARROLLO A PARTIR DE 1.0

La prioridad ahora es:

**ESTABILIDAD > NUEVAS FUNCIONES**

No abrir nuevos frentes antes de arreglar bugs reales.

Si aparece un fallo:

1. reproducir / identificar causa,
2. arreglar de forma quirúrgica,
3. comprobar que no rompe otra cosa,
4. sacar patch version.

Ejemplo:

`Nuestra_Vida_1.0.1_<descripcion>.zip`

No hacer otro rediseño global.

---

# 28. QUÉ HACER SI TE PASO LA 1.0 EN UN CHAT NUEVO

Si te adjunto:

**`Nuestra_Vida_1.0_RELEASE.zip`**

debes:

1. considerar ese ZIP como fuente de verdad,
2. inspeccionarlo antes de modificar,
3. no reconstruir basándote solo en este documento,
4. conservar la estructura,
5. cambiar solo lo solicitado,
6. revisar sintaxis JS de `index.html`,
7. revisar rutas/assets,
8. revisar ZIP,
9. si afecta responsive, comprobar 1180×820 y 1024×768,
10. generar una nueva versión sin sobrescribir MASTER.

---

# 29. ESTADO EN EL MOMENTO DE CREAR ESTE DOCUMENTO

Estado actual:

**Nuestra Vida 1.0 está terminada y aprobada.**

Javi ha valorado el estado final como:

**10/10**

Esta es la versión que se va a enseñar por primera vez a Laura.

A partir de aquí solo queda:

- feedback real tras jugar,
- bugs concretos,
- pequeños patches,
- integración definitiva / mantenimiento.

No hay ningún bloque grande pendiente de desarrollo antes del estreno.

---

# 30. INSTRUCCIÓN FINAL PARA EL NUEVO CHAT

Antes de proponer cualquier cambio, dime brevemente que has entendido:

- que la versión MASTER es `Nuestra_Vida_1.0_RELEASE.zip`,
- que no se debe rediseñar,
- que el objetivo es preservar todo lo aprobado,
- que cualquier modificación futura será incremental tipo 1.0.1,
- y que el viewport prioritario es 1180×820.

Después seguimos desde ahí.
