-- JaviEats 3.3.6
-- Optimización de políticas RLS.
-- Misma lógica y mismos permisos; solo evita reevaluar auth.uid() por cada fila.

begin;

alter policy "Javi y Laura pueden ver los puzzles"
  on public.puzzles_premio
  using ((select auth.uid()) = any (array[
    'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
    'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
  ]));

alter policy "Javi y Laura pueden ver las piezas"
  on public.piezas_puzzle
  using ((select auth.uid()) = any (array[
    'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
    'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
  ]));

alter policy push_select_own
  on public.push_subscriptions
  using ((select auth.uid()) = user_id);

alter policy push_insert_own
  on public.push_subscriptions
  with check ((select auth.uid()) = user_id);

alter policy push_update_own
  on public.push_subscriptions
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy push_delete_own
  on public.push_subscriptions
  using ((select auth.uid()) = user_id);

alter policy mensajes_dia_select_javi_laura
  on public.mensajes_dia
  using (
    (((select auth.uid()) = 'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid)
      and (autor_id = (select auth.uid())))
    or
    (((select auth.uid()) = 'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid)
      and (destinatario_id = (select auth.uid())))
  );

alter policy notificaciones_select_propias
  on public.notificaciones
  using (destinatario_id = (select auth.uid()));

alter policy propuestas_v3_select_javi_laura
  on public.propuestas
  using ((select auth.uid()) = any (array[
    'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
    'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
  ]));

alter policy propuestas_v3_insert_javi_laura
  on public.propuestas
  with check (
    ((select auth.uid()) = any (array[
      'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
      'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
    ]))
    and (created_by = (select auth.uid()))
    and (status = 'pendiente'::text)
  );

alter policy propuestas_v3_update_javi_laura
  on public.propuestas
  using ((select auth.uid()) = any (array[
    'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
    'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
  ]))
  with check ((select auth.uid()) = any (array[
    'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
    'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
  ]));

alter policy propuestas_v3_delete_javi_laura
  on public.propuestas
  using ((select auth.uid()) = any (array[
    'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
    'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
  ]));

alter policy recuerdos_app_v3_select_javi_laura
  on public.recuerdos_app
  using ((select auth.uid()) = any (array[
    'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
    'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
  ]));

alter policy recuerdos_app_v3_insert_javi_laura
  on public.recuerdos_app
  with check (
    ((select auth.uid()) = any (array[
      'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
      'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
    ]))
    and (created_by = (select auth.uid()))
  );

alter policy recuerdos_app_v3_update_javi_laura
  on public.recuerdos_app
  using ((select auth.uid()) = any (array[
    'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
    'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
  ]))
  with check ((select auth.uid()) = any (array[
    'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
    'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
  ]));

alter policy recuerdos_app_v3_delete_javi_laura
  on public.recuerdos_app
  using ((select auth.uid()) = any (array[
    'ed529e36-5f68-4326-a658-00cfe22d4f01'::uuid,
    'ef4258bf-5897-4594-86ac-a134fcd1feec'::uuid
  ]));

commit;
