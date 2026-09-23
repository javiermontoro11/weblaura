import { withSupabase } from "npm:@supabase/server@1.5.3";
import webpush from "npm:web-push@3.6.7";

interface NotificationRow {
  id: string;
  destinatario_id: string;
  tipo: string;
  titulo: string | null;
  detalle: string | null;
  destino: string | null;
  entidad_id: string | null;
  dedupe_key: string | null;
}
interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: NotificationRow | null;
  old_record: NotificationRow | null;
}
function shouldSendPush(notification: NotificationRow): boolean {
  if (notification.tipo === "push_test") return true;
  if (notification.tipo === "nuestro24") return true;
  if (notification.tipo === "ysi_turno") return true;
  if (notification.tipo === "ysi_resultado_final") return true;
  if (notification.tipo === "plan_nuevo") return true;
  if (notification.tipo === "plan_cambio") return true;
  if (notification.tipo === "plan_estado") {
    const key = notification.dedupe_key || "";
    return key.includes(":confirmada:") || key.includes(":cancelada:");
  }
  return false;
}
function getPushUrl(notification: NotificationRow): string {
  if (notification.tipo === "ysi_turno" || notification.tipo === "ysi_resultado_final" || notification.destino === "ysi") return "./?open=ysi";
  if (notification.tipo === "plan_nuevo" || notification.tipo === "plan_cambio" || notification.tipo === "plan_estado" || notification.destino === "calendar") return "./?open=plans";
  return "./";
}
function madridDateKey(ms: number): string {
  const parts = new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(ms));
  const value = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}
function secondsUntilNextMadridDay(nowMs: number): number {
  const currentDay = madridDateKey(nowMs);
  let low = nowMs;
  let high = nowMs + 30 * 60 * 60 * 1000;
  if (madridDateKey(high) === currentDay) return 60;
  while (high - low > 1000) {
    const middle = Math.floor((low + high) / 2);
    if (madridDateKey(middle) === currentDay) low = middle;
    else high = middle;
  }
  return Math.max(60,Math.min(90000,Math.ceil((high-nowMs)/1000)));
}
function getPushTtl(notification: NotificationRow): number {
  return notification.tipo === "nuestro24" ? secondsUntilNextMadridDay(Date.now()) : 60;
}
export default {
  fetch: withSupabase({auth:"secret"},async (req,ctx) => {
    if (req.method !== "POST") return Response.json({error:"Método no permitido"},{status:405});
    const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY");
    const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY");
    const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT");
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
      console.error("Faltan Secrets VAPID.");
      return Response.json({error:"Configuración VAPID incompleta"},{status:500});
    }
    let payload: WebhookPayload;
    try { payload = await req.json(); }
    catch { return Response.json({error:"JSON inválido"},{status:400}); }
    if (payload.type !== "INSERT" || payload.schema !== "public" || payload.table !== "notificaciones" || !payload.record) {
      return Response.json({ok:true,ignored:true,reason:"Evento no relevante"});
    }
    const notification = payload.record;
    if (!shouldSendPush(notification)) {
      return Response.json({ok:true,ignored:true,reason:`El tipo ${notification.tipo} no genera Push`});
    }
    const {data:subscriptions,error:subscriptionError} = await ctx.supabaseAdmin
      .from("push_subscriptions").select("id, endpoint, p256dh, auth").eq("user_id",notification.destinatario_id);
    if (subscriptionError) {
      console.error("Error leyendo push_subscriptions:",subscriptionError);
      return Response.json({error:"No se pudieron leer las suscripciones"},{status:500});
    }
    if (!subscriptions?.length) return Response.json({ok:true,sent:0,reason:"El destinatario no tiene Push activo"});
    const pushPayload = JSON.stringify({
      title: notification.titulo || "JaviEats ❤️",
      body: notification.detalle || "Tienes una novedad en JaviEats.",
      url: getPushUrl(notification),
      notificationId: notification.id,
      tag: notification.dedupe_key || notification.id,
    });
    let sent=0,stale=0,failed=0;
    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {endpoint:subscription.endpoint,keys:{p256dh:subscription.p256dh,auth:subscription.auth}},
          pushPayload,
          {TTL:getPushTtl(notification),vapidDetails:{subject:VAPID_SUBJECT,publicKey:VAPID_PUBLIC_KEY,privateKey:VAPID_PRIVATE_KEY}},
        );
        sent++;
      } catch (error) {
        const status = Number((error as {statusCode?:number;status?:number})?.statusCode || (error as {statusCode?:number;status?:number})?.status || 0);
        console.error("Error enviando Push:",status,(error as {message?:string})?.message || error);
        if (status === 404 || status === 410) {
          stale++;
          await ctx.supabaseAdmin.from("push_subscriptions").delete().eq("id",subscription.id);
        } else failed++;
      }
    }
    return Response.json({ok:failed===0,sent,stale,failed});
  }),
};
