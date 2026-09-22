(() => {
  "use strict";

  let bound = false;
  const $ = id => document.getElementById(id);
  const app = () => window.JaviEatsApp;
  const state = () => app()?.getState?.() || {};

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
  }

  function madridDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date);
    const value = type => parts.find(part => part.type === type)?.value || "";
    return `${value("year")}-${value("month")}-${value("day")}`;
  }

  function shortDate(dateKey) {
    const [year, month, day] = String(dateKey || "").split("-").map(Number);
    if (!year || !month || !day) return String(dateKey || "");
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short"
    }).format(new Date(year, month - 1, day));
  }

  function icon(type) {
    return ({
      mensaje_dia: "💌",
      ysi_resultado: "💭",
      ysi_turno: "💭",
      ysi_resultado_final: "❤️",
      puzzle_pieza: "🧩",
      puzzle_completado: "🎁",
      plan_nuevo: "📅",
      plan_estado: "📅",
      plan_cambio: "📅",
      recuerdo_nuevo: "📸"
    })[type] || "🔔";
  }

  function timeLabel(timestamp) {
    const date = new Date(timestamp);
    const diff = Math.max(0, Date.now() - date.getTime());
    if (diff < 60_000) return "Ahora";
    if (diff < 3_600_000) return `Hace ${Math.max(1, Math.floor(diff / 60_000))} min`;
    if (diff < 86_400_000) return `Hace ${Math.floor(diff / 3_600_000)} h`;
    if (diff < 172_800_000) return "Ayer";
    return shortDate(madridDateKey(date));
  }

  async function fetchAll(client) {
    if (!client) throw new Error("Supabase client unavailable");
    const { data, error } = await client
      .from("notificaciones")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return { notifications: data || [], loadError: false };
  }

  function visibleNotifications() {
    const notifications = Array.isArray(state().notifications) ? state().notifications : [];
    return notifications.filter(item => item.tipo !== "mensaje_dia");
  }

  function refreshUI() {
    render();
    window.dispatchEvent(new CustomEvent("javieats:data"));
  }

  function render() {
    const badge = $("notifications-badge");
    const list = $("notifications-list");
    const bulk = $("notifications-read-all");
    if (!badge || !list) return;

    const notifications = visibleNotifications();
    const unread = notifications.filter(item => !item.leido_at).length;

    badge.textContent = unread > 99 ? "99+" : String(unread);
    badge.classList.toggle("hidden", unread === 0 || state().notificationLoadError);

    if (bulk) {
      const hasNotifications = notifications.length > 0 && !state().notificationLoadError;
      bulk.classList.toggle("hidden", !hasNotifications);

      if (hasNotifications) {
        const clearMode = unread === 0;
        bulk.textContent = clearMode ? "Borrar todo" : "Marcar todo leído";
        bulk.dataset.notificationAction = clearMode ? "clear" : "read";
        bulk.classList.toggle("is-danger", clearMode);
      } else {
        bulk.classList.remove("is-danger");
        delete bulk.dataset.notificationAction;
      }
    }

    if (state().notificationLoadError) {
      list.innerHTML = '<div class="notification-empty">Las notificaciones todavía no están disponibles.</div>';
      return;
    }

    if (!notifications.length) {
      list.innerHTML = '<div class="notification-empty">Todo al día. Cuando el otro haga algo que te afecte, aparecerá aquí.</div>';
      return;
    }

    list.innerHTML = notifications.map(notification => {
      const unreadClass = notification.leido_at ? "" : " is-unread";
      const detail = notification.detalle ? `<p>${escapeHtml(notification.detalle)}</p>` : "";
      return `<div class="notification-row">
        <button class="notification-item${unreadClass}" type="button" data-notification-id="${notification.id}">
          <span class="notification-item-icon">${icon(notification.tipo)}</span>
          <span class="notification-item-copy"><strong>${escapeHtml(notification.titulo)}</strong>${detail}</span>
          <span class="notification-item-time">${timeLabel(notification.created_at)}${notification.leido_at ? "" : '<span class="notification-unread-dot" aria-label="Sin leer"></span>'}<span class="notification-open-mark" aria-hidden="true">›</span></span>
        </button>
        <button class="notification-delete-btn" type="button" data-notification-delete="${notification.id}" aria-label="Eliminar notificación" title="Eliminar">&times;</button>
      </div>`;
    }).join("");
  }

  function openModal() {
    render();
    $("notifications-modal")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    $("notifications-modal")?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  async function markRead(id) {
    const notification = (state().notifications || []).find(item => item.id === id);
    if (!notification || notification.leido_at) return;
    const client = app()?.getClient?.();
    if (!client) return;

    const { error } = await client.rpc("marcar_notificacion_leida", { p_id: id });
    if (error) throw error;
    notification.leido_at = new Date().toISOString();
    refreshUI();
  }

  async function markAllRead() {
    const bulk = $("notifications-read-all");
    if (state().notificationLoadError || !bulk) return;
    const client = app()?.getClient?.();
    if (!client) return;

    bulk.disabled = true;
    try {
      const { error } = await client.rpc("marcar_todas_notificaciones_leidas");
      if (error) throw error;
      const now = new Date().toISOString();
      (state().notifications || []).forEach(item => {
        if (!item.leido_at) item.leido_at = now;
      });
      refreshUI();
    } catch (error) {
      console.error(error);
      app()?.showToast?.("No se han podido marcar las notificaciones.");
    } finally {
      bulk.disabled = false;
    }
  }

  async function deleteOne(id) {
    if (!id || state().notificationLoadError) return;
    const client = app()?.getClient?.();
    if (!client) return;

    try {
      const { data, error } = await client.rpc("eliminar_notificacion", { p_id: id });
      if (error) throw error;
      if (data !== true) throw new Error("Notification not owned by current user");

      state().notifications = (state().notifications || []).filter(item => item.id !== id);
      refreshUI();
      app()?.showToast?.("Notificación eliminada.");
    } catch (error) {
      console.error(error);
      app()?.showToast?.("No se ha podido eliminar la notificación.");
    }
  }

  async function clearAll() {
    const bulk = $("notifications-read-all");
    if (state().notificationLoadError || !bulk) return;
    const notifications = visibleNotifications();
    if (!notifications.length) return;
    if (!window.confirm("¿Quieres borrar toda la actividad? Esta acción no se puede deshacer.")) return;

    const client = app()?.getClient?.();
    if (!client) return;

    bulk.disabled = true;
    try {
      const { error } = await client.rpc("vaciar_notificaciones");
      if (error) throw error;
      state().notifications = [];
      refreshUI();
      app()?.showToast?.("Actividad borrada.");
    } catch (error) {
      console.error(error);
      app()?.showToast?.("No se ha podido borrar la actividad.");
    } finally {
      bulk.disabled = false;
    }
  }

  async function bulkAction() {
    const notifications = visibleNotifications();
    const unread = notifications.filter(item => !item.leido_at).length;
    if (unread > 0) {
      await markAllRead();
      return;
    }
    if (notifications.length > 0) await clearAll();
  }

  async function openDestination(notification) {
    const destination = notification.destino || "home";

    if (destination === "mensaje") {
      app()?.showPage?.("home");
      return;
    }

    if (destination === "ysi" || destination === "rps") {
      app()?.showPage?.("minigames");
      window.JaviEatsMinigames?.open?.(destination, { force: true });
      return;
    }

    if (destination === "calendar") {
      app()?.showPage?.("calendar");
      setTimeout(() => {
        const target = notification.tipo === "plan_nuevo"
          ? document.getElementById("v3-plan-pending")
          : document.getElementById("v3-plan-next");
        target?.scrollIntoView?.({ behavior: "smooth", block: "start" });
      }, 120);
      return;
    }

    if (destination === "memories") {
      app()?.showPage?.("memories");
      if (notification.entidad_id) {
        setTimeout(() => app()?.openRemoteMemory?.(notification.entidad_id), 160);
      }
      return;
    }

    if (["minigames", "home"].includes(destination)) {
      app()?.showPage?.(destination);
      return;
    }

    app()?.showPage?.("home");
  }

  async function handleClick(event) {
    const deleteButton = event.target.closest("[data-notification-delete]");
    if (deleteButton) {
      event.preventDefault();
      event.stopPropagation();
      deleteButton.disabled = true;
      try {
        await deleteOne(deleteButton.dataset.notificationDelete);
      } finally {
        if (deleteButton.isConnected) deleteButton.disabled = false;
      }
      return;
    }

    const button = event.target.closest("[data-notification-id]");
    if (!button) return;
    const notification = (state().notifications || []).find(item => item.id === button.dataset.notificationId);
    if (!notification) return;

    try {
      await markRead(notification.id);
    } catch (error) {
      console.error(error);
      app()?.showToast?.("No se ha podido marcar la notificación.");
    }

    closeModal();
    await openDestination(notification);
  }

  function bindUI() {
    if (bound) return;
    bound = true;

    $("notifications-btn")?.addEventListener("click", openModal);
    $("notifications-read-all")?.addEventListener("click", bulkAction);
    $("notifications-list")?.addEventListener("click", handleClick);
    document.querySelectorAll("[data-notifications-close]").forEach(element => {
      element.addEventListener("click", closeModal);
    });
  }

  function reset() {
    closeModal();
  }

  window.JaviEatsNotifications = Object.freeze({
    fetchAll,
    render,
    bindUI,
    openModal,
    closeModal,
    reset
  });
})();