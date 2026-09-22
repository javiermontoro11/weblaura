(() => {
  "use strict";

  const services = Object.freeze([
  {
    id: "mimos",
    icon: "🫂",
    title: "Mimos",
    category: "Cariño y desconexión",
    description: "Un rato tranquilo de caricias, abrazos y desconexión. Sin planes complicados y sin necesidad de justificar el pedido.",
    eta: "15-60 min",
    durations: ["Mimos express · 15 minutos", "Sesión estándar · 30 minutos", "Modo sin prisa"],
    bullets: [
      "Caricias en el pelo, la espalda o donde se solicite razonablemente.",
      "Abrazos, sofá o peli de fondo.",
      "Conversación opcional y derecho a quedarse dormida sin penalización."
    ],
    notePlaceholder: "Puedes indicar si te apetecen abrazos, caricias, peli, sofá o modo sin hablar..."
  },
  {
    id: "masaje",
    icon: "💆",
    title: "Masaje",
    category: "Relax",
    description: "Espalda, cuello o modo relax. Duración y presión negociables.",
    eta: "20-45 min",
    durations: ["20 minutos", "30 minutos", "45 minutos"],
    bullets: [
      "Para espalda cargada, cuello o cansancio acumulado.",
      "Se aceptan indicaciones de presión.",
      "Servicio sujeto a energía disponible."
    ],
    notePlaceholder: "Ej: cuello cargado, espalda, presión suave..."
  },
  {
    id: "sushi",
    icon: "🍣",
    title: "Sushi Date",
    category: "Planes para comer",
    description: "Propuesta para comer o cenar sushi juntos. La elección del sitio se puede negociar.",
    eta: "1-2 h",
    durations: ["Comida", "Cena", "Plan completo"],
    bullets: [
      "Ideal para un antojo serio de sushi.",
      "La hora y el restaurante se hablan entre los dos.",
      "Nivel de hambre obligatorio: medio o alto."
    ],
    notePlaceholder: "Ej: quiero buffet, prefiero pedir a casa, tengo antojo de salmón..."
  },
  {
    id: "telenovio",
    icon: "🏠",
    title: "Telenovio",
    category: "Cuidado a domicilio",
    description: "Novio a domicilio para días malos, enfermedad, bajón o necesidad de compañía y cuidados en casa.",
    eta: "Visita variable",
    durations: ["Visita rápida", "Un par de horas", "Tarde de cuidados", "Modo sin prisa"],
    bullets: [
      "Compañía, manta, peli y cuidados básicos.",
      "Posibilidad de ir a por comida, medicinas o lo que haga falta.",
      "Para urgencias reales hay que llamar a un profesional; para lo demás, JaviEats intentará acudir."
    ],
    notePlaceholder: "Cuenta cómo te encuentras o qué necesitas..."
  },
  {
    id: "cine",
    icon: "🎬",
    title: "Peli en el cine",
    category: "Plan de cine",
    description: "Plan para ir juntos al cine, elegir una película y acompañarla con palomitas o algo rico.",
    eta: "2-4 h",
    durations: ["Sesión de tarde", "Sesión de noche", "Cine + cena", "Cine + picoteo"],
    bullets: [
      "La película y el cine se negocian.",
      "Palomitas altamente recomendadas.",
      "Se puede completar el plan comiendo antes o después."
    ],
    notePlaceholder: "Ej: película que quieres ver, cine preferido, palomitas dulces o saladas..."
  },
  {
    id: "plan-diferente",
    icon: "💡",
    title: "Plan diferente",
    category: "Propuesta libre",
    description: "Para cuando tengáis una idea distinta que no aparezca en el catálogo de JaviEats.",
    eta: "A decidir",
    durations: ["Plan corto", "Media tarde", "Día completo", "Por decidir"],
    bullets: [
      "Quien propone explica la idea.",
      "Puede ser cualquier plan que os apetezca.",
      "Los detalles se terminan de hablar entre los dos."
    ],
    requiresNote: true,
    notePlaceholder: "Describe el plan diferente que te apetece proponer..."
  },
  {
    id: "sorpresa",
    icon: "🎁",
    title: "Plan Sorpresa",
    category: "Sorpresa",
    description: "Uno propone la fecha y el otro se encarga de preparar la sorpresa.",
    eta: "Variable",
    durations: ["Plan corto", "Plan medio", "Plan completo"],
    bullets: [
      "Quien propone elige la fecha.",
      "La otra persona prepara la idea.",
      "Puede incluir comida, paseo o un plan inesperado."
    ],
    notePlaceholder: "Puedes indicar presupuesto, tiempo disponible o cosas que no te apetezcan..."
  },
  {
    id: "perritos",
    icon: "🐶",
    title: "Paseo con los perritos",
    category: "Plan con Randy y Nala",
    description: "Para cuando os apetezca ver a Randy y Nala, sacarlos de paseo o pasar un rato con ellos.",
    eta: "30 min-3 h",
    durations: ["Paseo corto", "Paseo largo", "Tarde con los perritos", "Visita y mimos"],
    bullets: [
      "Randy y Nala, sujetos a disponibilidad perruna.",
      "Paseo y tiempo para jugar con ellos.",
      "Posibilidad de añadir merienda o paseo juntos."
    ],
    notePlaceholder: "Ej: paseo largo, quiero ver a Randy y Nala, merienda después..."
  }
].map(service => Object.freeze({
    ...service,
    durations: Object.freeze([...(service.durations || [])]),
    bullets: Object.freeze([...(service.bullets || [])])
  })));

  function getService(id) {
    return services.find(service => service.id === id) || null;
  }

  window.JaviEatsPlans = Object.freeze({
    services,
    getService
  });
})();