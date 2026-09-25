# JaviEats · Nuestra galería — Diseño

Fecha: 2026-09-25  
Rama: `feature/nuestro-24`

## Objetivo

Añadir dentro de **Recuerdos** una galería privada y compartida para Javi y Laura, pensada para guardar fotos bonitas juntos de forma visual, ligera y fácil de mantener. La galería no sustituye a Recuerdos: Recuerdos seguirá siendo el archivo narrativo de momentos especiales; Nuestra galería será el archivo visual continuo.

## Experiencia de usuario

En la página **Recuerdos** se añadirá un selector interno con dos vistas:

- **Nuestros recuerdos**
- **Nuestra galería**

La navegación inferior de JaviEats no cambia.

### Cuadrícula

Nuestra galería mostrará las fotos en una cuadrícula continua:

- escritorio: 6 columnas;
- tablet: 3–4 columnas según ancho;
- móvil: 2 columnas.

Cada tarjeta mostrará:

- fotografía;
- fecha;
- descripción breve, con máximo visual de dos líneas;
- menú de acciones.

El orden será del más reciente al más antiguo.

### Visor

Al pulsar una foto se abrirá un visor a pantalla grande con:

- fotografía completa;
- fecha;
- descripción;
- anterior / siguiente;
- indicador de posición;
- botón **Descargar**;
- acción de editar;
- acción de eliminar con confirmación.

En móvil se permitirá navegación táctil entre fotos.

## Subida y edición

Javi y Laura podrán subir varias fotografías en una misma operación.

Flujo:

1. Pulsar **Subir fotos**.
2. Seleccionar una o varias imágenes.
3. Elegir fecha, con la fecha actual como valor inicial.
4. Escribir una descripción opcional.
5. Previsualizar las fotos.
6. Guardar.

La fecha y descripción introducidas se aplicarán inicialmente a todas las fotos seleccionadas en esa subida. Después cada fotografía podrá editarse individualmente.

La primera versión limitará cada operación de subida a un máximo de 10 imágenes para evitar cargas excesivas y simplificar los estados de error/reintento.

## Arquitectura frontend

La funcionalidad se mantendrá aislada del código principal de Recuerdos para no aumentar innecesariamente `app/js/memories.js`.

Piezas previstas:

- `app/js/gallery.js`: carga, subida, edición, borrado, visor, descarga y caché de URLs firmadas;
- `app/css/gallery.css`: cuadrícula, tarjetas, modal, responsive y estados;
- `index.html`: selector Recuerdos/Galería, contenedores, modal y carga de assets;
- integración mínima con el estado y navegación existentes de JaviEats.

Se reutilizarán patrones ya probados de Recuerdos para:

- autenticación;
- compresión de imágenes;
- URLs firmadas;
- manejo de errores;
- sincronización de datos.

## Persistencia en Supabase

### Tabla

Se creará una tabla independiente, propuesta como `public.galeria_app`, para no mezclar fotografías sueltas con la semántica de `public.recuerdos_app`.

Campos:

- `id uuid primary key default gen_random_uuid()`;
- `created_by uuid not null default auth.uid()`;
- `fecha date not null default fecha de Madrid`;
- `descripcion text not null default ''`;
- `image_path text not null unique`;
- `created_at timestamptz not null default now()`;
- `updated_at timestamptz not null default now()`.

No se duplicarán datos binarios en Postgres.

### Storage

Se reutilizará el bucket privado existente `recuerdos`, que ya está protegido para las dos cuentas autorizadas.

Las nuevas imágenes se guardarán bajo un prefijo separado, por ejemplo:

`gallery/<uuid>.webp`

No se creará un bucket adicional.

### Seguridad

La nueva tabla tendrá RLS activado.

Las políticas seguirán el mismo modelo de autorización ya utilizado por `recuerdos_app`:

- solo las dos cuentas autorizadas podrán leer;
- solo las dos cuentas autorizadas podrán insertar;
- `created_by` deberá coincidir con `auth.uid()` al insertar;
- ambas cuentas podrán editar y eliminar porque la galería es compartida.

El bucket permanecerá privado y el frontend trabajará con URLs firmadas temporales. No se expondrán URLs públicas ni claves privilegiadas.

## Uso eficiente de recursos

El diseño prioriza no malgastar almacenamiento ni transferencia en Supabase.

### Compresión

Se reutilizará la compresión de Recuerdos que ya ha demostrado mantener buena calidad:

- lado máximo: 1600 px;
- WebP cuando el navegador lo permita;
- objetivo aproximado: hasta 700 KB;
- reducción adaptativa de calidad, evitando las compresiones extremas que degradaron las fotos de los bolos.

No se generarán copias adicionales ni miniaturas independientes en la primera versión.

### Carga de la cuadrícula

Para reducir egress y evitar firmar centenares de URLs a la vez:

- se cargarán 24 fotos inicialmente;
- habrá **Cargar más** para añadir el siguiente bloque;
- las imágenes usarán `loading="lazy"`;
- solo se generarán URLs firmadas para las fotos del bloque visible/cargado;
- se reutilizará una caché temporal de URLs firmadas como en Recuerdos.

Esto permite que la galería crezca sin que abrir la página implique descargar todo el archivo histórico.

### Descarga

Descargar una foto utilizará el mismo objeto privado ya almacenado. No se generará una copia adicional en Storage.

## Estados y errores

La interfaz contemplará:

- galería vacía;
- carga inicial;
- subida en progreso;
- error parcial al subir varias fotos;
- reintento sin duplicar las imágenes ya guardadas;
- expiración de URL firmada;
- pérdida de conexión;
- confirmación antes de borrar.

Un fallo de Nuestra galería no debe impedir abrir Recuerdos ni el resto de JaviEats.

## Alcance de la primera versión

Incluido:

- selector Recuerdos / Nuestra galería;
- grid responsive;
- subida múltiple;
- fecha y descripción;
- edición individual;
- visor;
- navegación anterior/siguiente y swipe;
- descarga;
- eliminación;
- almacenamiento privado;
- paginación ligera por bloques de 24.

Fuera de alcance por ahora:

- álbumes;
- favoritos;
- comentarios;
- reacciones;
- etiquetas;
- búsqueda;
- reconocimiento de caras;
- duplicados automáticos;
- miniaturas almacenadas separadamente.

Estas funciones podrán añadirse después si aportan valor real.

## Verificación

Antes de dar la funcionalidad por cerrada se comprobará:

1. Javi y Laura pueden abrir la galería.
2. Un usuario no autorizado no puede leer ni modificar filas u objetos.
3. Subida de una foto.
4. Subida múltiple.
5. Compresión mantiene calidad visual razonable.
6. Fecha y descripción aparecen en grid y visor.
7. Edición persiste tras recargar.
8. Borrado elimina metadato y objeto.
9. Descargar entrega la imagen correcta.
10. Las URLs firmadas se renuevan al caducar.
11. Grid de 6 columnas en escritorio, 2 en móvil y adaptación intermedia.
12. El bloque **Cargar más** no vuelve a descargar elementos ya cargados.
13. No hay regresiones en Recuerdos, Nuestro 24 ni navegación general.

## Criterio de terminado

La funcionalidad estará lista cuando Javi y Laura puedan usar Nuestra galería como un archivo visual compartido, privado y responsive, con subida y descarga sencillas, sin duplicar infraestructura ni introducir un consumo innecesario de Supabase.
