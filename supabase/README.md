# Supabase

Esta carpeta contiene el historial SQL reproducible de JaviEats.

## Reglas

- Todo cambio de esquema, permisos, políticas RLS, índices, funciones o triggers debe quedar documentado en `migrations/`.
- No se debe depender únicamente del estado actual del proyecto en Supabase.
- Los cambios deben ser incrementales y compatibles con producción.
- No incluir secretos, contraseñas, claves `service_role` ni contenido de Vault.
- Después de un cambio de base de datos, actualizar `contextos/CONTEXTO_BASE_DATOS.md` y, si afecta a la arquitectura general, `README.md`.

## Estado

La carpeta se incorpora en JaviEats 3.3.6. Las migraciones anteriores a esta fecha no estaban versionadas dentro del repositorio, por lo que el estado histórico previo debe tratarse como baseline de producción.
