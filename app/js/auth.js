(() => {
  "use strict";

  const USER_IDS = Object.freeze({
    JAVI: "ed529e36-5f68-4326-a658-00cfe22d4f01",
    LAURA: "ef4258bf-5897-4594-86ac-a134fcd1feec"
  });

  const PROFILES = Object.freeze({
    javi: Object.freeze({
      name: "Javi",
      email: "javiermontorogranados@gmail.com",
      initial: "J"
    }),
    laura: Object.freeze({
      name: "Laura",
      email: "lauramoramegal@gmail.com",
      initial: "L"
    })
  });

  let client = null;
  let pendingSession = null;
  let selectedProfile = null;
  let bound = false;
  let authSubscription = null;

  const $ = id => document.getElementById(id);
  const app = () => window.JaviEatsApp;

  function requestedTurnRole() {
    const params = new URLSearchParams(window.location.search);
    const role = String(params.get("for") || "").toLowerCase();
    return role === "javi" || role === "laura" ? role : null;
  }

  function roleFromUser(user) {
    if (user?.id === USER_IDS.JAVI) return "javi";
    if (user?.id === USER_IDS.LAURA) return "laura";
    return "unknown";
  }

  function friendlyError(error) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("invalid login credentials")) return "Contraseña incorrecta para este perfil.";
    if (message.includes("email not confirmed")) return "La cuenta todavía no está confirmada en Supabase.";
    if (message.includes("failed to fetch")) return "No hay conexión con Supabase.";
    if (message.includes("no corresponde al perfil")) return "Esta contraseña no corresponde al perfil seleccionado.";
    return "No se ha podido iniciar sesión. Revisa los datos.";
  }

  function showProfileSelector() {
    $("turn-profile-mismatch")?.classList.add("hidden");
    selectedProfile = null;

    if ($("login-email")) $("login-email").value = "";
    if ($("login-password")) $("login-password").value = "";
    if ($("login-status")) $("login-status").textContent = "";
    if ($("auth-global-status")) $("auth-global-status").textContent = "";

    $("profile-selector")?.classList.remove("hidden");
    $("password-panel")?.classList.add("hidden");
  }

  function selectProfile(profileKey) {
    $("turn-profile-mismatch")?.classList.add("hidden");
    const profile = PROFILES[profileKey];
    if (!profile) return;

    selectedProfile = profileKey;

    if ($("login-email")) $("login-email").value = profile.email;
    if ($("login-password")) $("login-password").value = "";
    if ($("login-status")) $("login-status").textContent = "";
    if ($("auth-back-name")) $("auth-back-name").textContent = profile.name;
    if ($("auth-selected-avatar")) $("auth-selected-avatar").textContent = profile.initial;
    if ($("auth-selected-name")) $("auth-selected-name").textContent = `Hola, ${profile.name}`;
    if ($("auth-selected-hint")) $("auth-selected-hint").textContent = "JaviEats ya sabe tu correo. Solo falta tu contraseña.";

    $("password-panel")
      ?.querySelector(".selected-profile-card")
      ?.classList.toggle("is-laura", profileKey === "laura");

    $("profile-selector")?.classList.add("hidden");
    $("password-panel")?.classList.remove("hidden");

    setTimeout(() => $("login-password")?.focus(), 90);
  }

  function showAuthScreen({ resetProfile = false } = {}) {
    $("boot-screen")?.classList.add("hidden");
    $("welcome-screen")?.classList.add("hidden");
    $("app-screen")?.classList.add("hidden");
    $("auth-screen")?.classList.remove("hidden");
    $("turn-profile-mismatch")?.classList.add("hidden");

    if ($("login-status")) $("login-status").textContent = "";
    if ($("auth-global-status")) $("auth-global-status").textContent = "";

    if (resetProfile || !selectedProfile) showProfileSelector();
  }

  function showError(message) {
    showAuthScreen({ resetProfile: false });
    if (selectedProfile) {
      if ($("login-status")) $("login-status").textContent = message;
    } else if ($("auth-global-status")) {
      $("auth-global-status").textContent = message;
    }
  }

  async function acceptSession(session) {
    const role = roleFromUser(session?.user);
    if (role === "unknown") {
      await client?.auth?.signOut();
      showError("Esta cuenta no tiene acceso a JaviEats.");
      return false;
    }

    pendingSession = session;
    await app()?.acceptAuthenticatedSession?.(session, role);
    return true;
  }

  function showTurnMismatch(session, requestedRole) {
    const currentRole = roleFromUser(session?.user);
    const requested = PROFILES[requestedRole];
    const current = PROFILES[currentRole];

    if (!requested || !current) {
      acceptSession(session);
      return;
    }

    pendingSession = session;

    $("boot-screen")?.classList.add("hidden");
    $("welcome-screen")?.classList.add("hidden");
    $("app-screen")?.classList.add("hidden");
    $("auth-screen")?.classList.remove("hidden");
    $("profile-selector")?.classList.add("hidden");
    $("password-panel")?.classList.add("hidden");
    $("turn-profile-mismatch")?.classList.remove("hidden");

    if ($("turn-profile-mismatch-title")) {
      $("turn-profile-mismatch-title").textContent = `Este turno es para ${requested.name}`;
    }
    if ($("turn-profile-mismatch-copy")) {
      $("turn-profile-mismatch-copy").textContent =
        `Ahora mismo este navegador está abierto como ${current.name}. Puedes cambiar a ${requested.name} o seguir con la sesión actual.`;
    }
    if ($("turn-profile-switch-btn")) {
      $("turn-profile-switch-btn").textContent = `Cambiar a ${requested.name}`;
    }
    if ($("turn-profile-continue-btn")) {
      $("turn-profile-continue-btn").textContent = `Seguir como ${current.name}`;
    }
  }

  async function handleTurnSwitch() {
    const requestedRole = requestedTurnRole();
    if (!requestedRole || !client) return;

    const button = $("turn-profile-switch-btn");
    if (button) button.disabled = true;

    try {
      pendingSession = null;
      await client.auth.signOut();
      showAuthScreen({ resetProfile: true });
      selectProfile(requestedRole);
      if ($("login-status")) {
        $("login-status").textContent =
          `Este turno es para ${PROFILES[requestedRole].name}. Introduce tu contraseña para continuar.`;
      }
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function handleTurnContinue() {
    if (!pendingSession?.user) return;
    $("turn-profile-mismatch")?.classList.add("hidden");
    await acceptSession(pendingSession);
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (!client) return;

    const profile = PROFILES[selectedProfile];
    if (!profile) {
      showProfileSelector();
      return;
    }

    const status = $("login-status");
    const submit = $("login-submit");
    const passwordInput = $("login-password");

    if (status) status.textContent = "Entrando…";
    if (submit) submit.disabled = true;

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: profile.email,
        password: passwordInput?.value || ""
      });
      if (error) throw error;
      if (!data.session?.user) throw new Error("La sesión no se ha creado correctamente.");

      const actualRole = roleFromUser(data.session.user);
      if (actualRole !== selectedProfile) {
        await client.auth.signOut();
        throw new Error("Esta contraseña no corresponde al perfil seleccionado.");
      }

      if (passwordInput) passwordInput.value = "";
      if (status) status.textContent = "";
      pendingSession = data.session;
      await acceptSession(data.session);
    } catch (error) {
      console.error(error);
      if (status) status.textContent = friendlyError(error);
      passwordInput?.select?.();
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  async function logout() {
    if (!client) return;
    pendingSession = null;
    selectedProfile = null;
    await client.auth.signOut();
  }

  function bindUI() {
    if (bound) return;
    bound = true;

    $("login-form")?.addEventListener("submit", handleLogin);
    document.querySelectorAll("[data-auth-profile]").forEach(button => {
      button.addEventListener("click", () => selectProfile(button.dataset.authProfile));
    });
    $("auth-back-btn")?.addEventListener("click", showProfileSelector);
    $("turn-profile-switch-btn")?.addEventListener("click", handleTurnSwitch);
    $("turn-profile-continue-btn")?.addEventListener("click", handleTurnContinue);
    $("logout-btn")?.addEventListener("click", logout);
  }

  async function init(supabaseClient) {
    client = supabaseClient;
    bindUI();

    if (authSubscription?.unsubscribe) authSubscription.unsubscribe();

    const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        pendingSession = null;
        app()?.handleSignedOut?.();
        showAuthScreen({ resetProfile: true });
      }

      if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && session?.user) {
        pendingSession = session;
        app()?.updateAuthenticatedUser?.(session.user);
      }
    });

    authSubscription = authListener?.subscription || null;

    try {
      const { data: { session }, error } = await client.auth.getSession();
      if (error) throw error;

      pendingSession = session || null;
      const requestedRole = requestedTurnRole();

      if (pendingSession?.user) {
        const sessionRole = roleFromUser(pendingSession.user);
        if (requestedRole && sessionRole !== "unknown" && requestedRole !== sessionRole) {
          showTurnMismatch(pendingSession, requestedRole);
          return;
        }
        await acceptSession(pendingSession);
        return;
      }

      showAuthScreen({ resetProfile: true });
      if (requestedRole) {
        selectProfile(requestedRole);
        if ($("login-status")) {
          $("login-status").textContent =
            `Este turno es para ${PROFILES[requestedRole].name}. Introduce tu contraseña para continuar.`;
        }
      }
    } catch (error) {
      console.error(error);
      showAuthScreen({ resetProfile: true });
    }
  }

  window.JaviEatsAuth = Object.freeze({
    init,
    bindUI,
    logout,
    roleFromUser,
    requestedTurnRole,
    showAuthScreen,
    showProfileSelector,
    selectProfile,
    showError,
    profiles: PROFILES
  });
})();