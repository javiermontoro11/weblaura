(() => {
  "use strict";

  const SW_URL = "./service-worker.js";
  let bound = false;

  const app = () => window.JaviEatsApp;
  const $ = id => document.getElementById(id);

  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent || "")
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function isStandalone() {
    return window.matchMedia?.("(display-mode: standalone)")?.matches
      || navigator.standalone === true;
  }

  function isSupported() {
    return "serviceWorker" in navigator
      && "PushManager" in window
      && "Notification" in window;
  }

  function vapidKeyToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  async function register() {
    if (!("serviceWorker" in navigator)) return null;
    try {
      await navigator.serviceWorker.register(SW_URL, { scope: "./" });
      return await navigator.serviceWorker.ready;
    } catch (error) {
      console.error("No se ha podido registrar el Service Worker de JaviEats:", error);
      return null;
    }
  }

  async function currentSubscription() {
    const registration = await register();
    return registration ? registration.pushManager.getSubscription() : null;
  }

  async function saveSubscription(subscription) {
    const user = app()?.getUser?.();
    const client = app()?.getClient?.();
    if (!subscription || !user || !client) {
      throw new Error("No hay sesión válida para guardar Push.");
    }

    const json = subscription.toJSON();
    const p256dh = json?.keys?.p256dh;
    const auth = json?.keys?.auth;
    if (!json.endpoint || !p256dh || !auth) {
      throw new Error("La suscripción Push está incompleta.");
    }

    const payload = {
      user_id: user.id,
      endpoint: json.endpoint,
      p256dh,
      auth,
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from("push_subscriptions")
      .upsert(payload, { onConflict: "endpoint" });
    if (error) throw error;
  }

  async function deleteSubscription(endpoint) {
    const user = app()?.getUser?.();
    const client = app()?.getClient?.();
    if (!endpoint || !user || !client) return;

    const { error } = await client
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", endpoint)
      .eq("user_id", user.id);
    if (error) throw error;
  }

  async function enable() {
    if (!isSupported()) throw new Error("Este dispositivo no soporta notificaciones Push web.");
    if (isIOS() && !isStandalone()) {
      throw new Error("En iPhone/iPad, añade primero JaviEats a la pantalla de inicio y ábrela desde su icono.");
    }

    let permission = Notification.permission;
    if (permission !== "granted") permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error(permission === "denied"
        ? "Has bloqueado las notificaciones para JaviEats."
        : "No se ha concedido permiso para notificaciones.");
    }

    const registration = await register();
    if (!registration) throw new Error("No se ha podido preparar JaviEats para recibir notificaciones.");

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const vapidPublicKey = app()?.getVapidPublicKey?.();
      if (!vapidPublicKey) throw new Error("No se ha encontrado la clave pública Push.");
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKeyToUint8Array(vapidPublicKey)
      });
    }

    await saveSubscription(subscription);
    await render();
    return subscription;
  }

  async function disable() {
    const subscription = await currentSubscription();
    if (!subscription) {
      await render();
      return;
    }

    const endpoint = subscription.endpoint;
    try {
      await deleteSubscription(endpoint);
    } catch (error) {
      console.error(error);
    }

    await subscription.unsubscribe();
    await render();
  }

  async function render() {
    const holder = $("push-settings");
    const status = $("push-status");
    const button = $("push-toggle");
    if (!holder || !status || !button) return;

    if (!isSupported()) {
      holder.dataset.state = "unsupported";
      status.textContent = "Este navegador no permite notificaciones Push.";
      button.textContent = "No disponible";
      button.disabled = true;
      return;
    }

    if (isIOS() && !isStandalone()) {
      holder.dataset.state = "install";
      status.textContent = "Para activarlas en iPhone o iPad, añade JaviEats a la pantalla de inicio y ábrela desde su icono.";
      button.textContent = "Instálala primero";
      button.disabled = true;
      return;
    }

    if (Notification.permission === "denied") {
      holder.dataset.state = "denied";
      status.textContent = "Las notificaciones están bloqueadas en los ajustes del dispositivo.";
      button.textContent = "Bloqueadas";
      button.disabled = true;
      return;
    }

    const subscription = await currentSubscription();
    if (subscription) {
      holder.dataset.state = "enabled";
      status.textContent = "Este dispositivo recibirá avisos importantes de JaviEats.";
      button.textContent = "Desactivar";
      button.disabled = false;
    } else {
      holder.dataset.state = "disabled";
      status.textContent = "Actívalas para recibir avisos importantes aunque JaviEats esté cerrada.";
      button.textContent = "Activar notificaciones";
      button.disabled = false;
    }
  }

  async function toggle() {
    const button = $("push-toggle");
    if (!button || button.disabled) return;
    button.disabled = true;

    try {
      const subscription = await currentSubscription();
      if (subscription) {
        await disable();
        app()?.showToast?.("Notificaciones desactivadas en este dispositivo.");
      } else {
        await enable();
        app()?.showToast?.("Notificaciones activadas en este dispositivo.");
      }
    } catch (error) {
      console.error(error);
      app()?.showToast?.(error?.message || "No se han podido configurar las notificaciones.");
      await render();
    } finally {
      if (button) button.disabled = false;
    }
  }

  function bindUI() {
    if (bound) return;
    bound = true;
    $("push-toggle")?.addEventListener("click", toggle);
  }

  window.JaviEatsPush = Object.freeze({
    bindUI,
    register,
    render,
    currentSubscription,
    enable,
    disable,
    isSupported,
    isStandalone,
    isIOS
  });
})();