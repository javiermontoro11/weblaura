# JaviEats

Web privada tipo aplicación de delivery para proponer planes, guardar recuerdos y desbloquear premios entre Laura y Javi.

---

# Novedades / Historial de versiones

## Versión 2.2 — Recuerdos, servicios y reto diario

Actualización centrada en los recuerdos de la relación, la revisión completa del catálogo de servicios y un minijuego diario.

### Novedades principales

* Nueva sección **Recuerdos**.
* Nueva línea temporal con cartas, flores y fotografías.
* La antigua carta secreta se mueve desde Inicio hasta Recuerdos.
* Nuevo minijuego diario de piedra, papel o tijera.
* Nuevo sistema de vales descargables.
* Nuevo servicio **Mimos**.
* Servicio **Telenovio** corregido.
* Servicio **Peli & Sofá** sustituido por **Peli en el cine**.
* Servicio **Café y Charla** sustituido por **Plan diferente**.
* Servicio **Paseo / Recogida** sustituido por **Paseo con los perritos**.
* El historial de propuestas se mueve debajo del calendario.
* Nuevo menú inferior:

  * Inicio
  * Servicios
  * Calendario
  * Recuerdos

---

# Reto diario

La página principal incluye un minijuego de piedra, papel o tijera.

## Funcionamiento

* Se juegan cinco rondas.
* Laura elige piedra, papel o tijera.
* La máquina elige de forma completamente aleatoria.
* La máquina no analiza jugadas anteriores.
* Se muestra visualmente la jugada de Laura.
* Se muestra visualmente la jugada de la máquina.
* Cada ronda consume un intento.
* Los empates también consumen ronda.
* Los empates no suman una victoria a ninguno.
* Después de cinco rondas gana quien tenga más victorias.

Ejemplo:

```text
Ronda 1: empate
Ronda 2: empate
Ronda 3: empate
Ronda 4: empate
Ronda 5: victoria de Laura

Resultado: gana Laura
