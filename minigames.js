(() => {
  "use strict";

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadScript("minigames-core.js?v=3.1")
    .then(() => loadScript("nuestra-vida-launcher.js?v=1.0"))
    .catch(error => console.error("JaviEats: no se ha podido cargar un modulo", error));
})();
