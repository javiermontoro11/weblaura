/* Bateria cerrada de Entre tu y yo. Contenido facilitado por el usuario; no reformular. */
(() => {
  'use strict';

  const source = {
  "meta": {
    "game": "Entre tú y yo",
    "dataset_version": "1.0",
    "language": "es-ES",
    "total": 450,
    "counts": {
      "who_of_two": 150,
      "bet_on_me": 150,
      "rankings": 150
    },
    "who_of_two_answer_options": [
      "Javi",
      "Laura",
      "Los dos"
    ],
    "editorial_intent": "Cómo sois, cómo os veis y cuánto os conocéis; evitar convertir la batería en una variante de ¿Y si...?",
    "integration_note": "Usar estas 450 propuestas tal cual como batería base. No generar contenido sustituto ni mezclar preguntas y opciones de entradas distintas.",
    "anti_repeat": "Mantener las últimas 100 propuestas usadas por tipo en localStorage; nunca repetir dentro de una misma partida.",
    "category_distribution": {
      "who_of_two": {
        "Así eres tú": 28,
        "Te tengo calado": 14,
        "Nosotros dos": 24,
        "Pequeñas cosas": 24,
        "Favoritos y preferencias": 12,
        "Prioridades": 8,
        "Confesiones inocentes": 16,
        "Caos y risas": 24
      },
      "bet_on_me": {
        "Así eres tú": 18,
        "Te tengo calado": 28,
        "Nosotros dos": 16,
        "Pequeñas cosas": 22,
        "Favoritos y preferencias": 28,
        "Prioridades": 10,
        "Confesiones inocentes": 18,
        "Caos y risas": 10
      },
      "rankings": {
        "Así eres tú": 12,
        "Te tengo calado": 18,
        "Nosotros dos": 20,
        "Pequeñas cosas": 14,
        "Favoritos y preferencias": 20,
        "Prioridades": 32,
        "Confesiones inocentes": 14,
        "Caos y risas": 20
      }
    }
  },
  "who_of_two": [
    {
      "id": "qdt_001",
      "category": "Así eres tú",
      "prompt": "¿Quién necesita darle más vueltas antes de decidir qué pedir cuando todo le apetece?"
    },
    {
      "id": "qdt_002",
      "category": "Así eres tú",
      "prompt": "¿Quién se da cuenta antes de que al otro le pasa algo aunque diga que está bien?"
    },
    {
      "id": "qdt_003",
      "category": "Así eres tú",
      "prompt": "¿Quién mantiene mejor la calma cuando un plan empieza a torcerse?"
    },
    {
      "id": "qdt_004",
      "category": "Así eres tú",
      "prompt": "¿Quién se pica más con un juego aunque al principio diga que le da igual ganar?"
    },
    {
      "id": "qdt_005",
      "category": "Así eres tú",
      "prompt": "¿Quién se ríe antes de terminar de contar su propia anécdota?"
    },
    {
      "id": "qdt_006",
      "category": "Así eres tú",
      "prompt": "¿Quién necesita más rato a solas después de un día con mucha gente?"
    },
    {
      "id": "qdt_007",
      "category": "Así eres tú",
      "prompt": "¿A quién se le nota más rápido que tiene hambre por el cambio de humor?"
    },
    {
      "id": "qdt_008",
      "category": "Así eres tú",
      "prompt": "¿Quién piensa más un mensaje antes de darle a enviar?"
    },
    {
      "id": "qdt_009",
      "category": "Así eres tú",
      "prompt": "¿Quién empieza ordenando una cosa y acaba reorganizando media habitación?"
    },
    {
      "id": "qdt_010",
      "category": "Así eres tú",
      "prompt": "¿Quién suele recordar mejor dónde están las cosas cuando el otro no las encuentra?"
    },
    {
      "id": "qdt_011",
      "category": "Así eres tú",
      "prompt": "¿Quién lleva peor una cola que avanza desesperadamente lenta?"
    },
    {
      "id": "qdt_012",
      "category": "Así eres tú",
      "prompt": "¿Quién dice más veces “me da igual” teniendo en realidad una opción favorita?"
    },
    {
      "id": "qdt_013",
      "category": "Así eres tú",
      "prompt": "¿Quién suele calcular mejor cuánto tiempo necesita para llegar a un sitio?"
    },
    {
      "id": "qdt_014",
      "category": "Así eres tú",
      "prompt": "¿Quién entra antes en “modo solución” cuando algo deja de funcionar?"
    },
    {
      "id": "qdt_015",
      "category": "Así eres tú",
      "prompt": "¿Quién se queda pensando más en un detalle pequeño que probablemente nadie más ha notado?"
    },
    {
      "id": "qdt_016",
      "category": "Así eres tú",
      "prompt": "¿Quién prefiere saber con antelación cómo va a ser el plan?"
    },
    {
      "id": "qdt_017",
      "category": "Así eres tú",
      "prompt": "¿Quién se adapta más rápido cuando toca cambiar el plan sobre la marcha?"
    },
    {
      "id": "qdt_018",
      "category": "Así eres tú",
      "prompt": "¿Quién se ilusiona antes cuando aparece una idea nueva que le gusta?"
    },
    {
      "id": "qdt_019",
      "category": "Así eres tú",
      "prompt": "¿Quién necesita más tiempo para convertirse en persona por la mañana?"
    },
    {
      "id": "qdt_020",
      "category": "Así eres tú",
      "prompt": "¿Quién es más difícil de convencer cuando ya tiene una opinión formada?"
    },
    {
      "id": "qdt_021",
      "category": "Así eres tú",
      "prompt": "¿Quién rompe antes un silencio incómodo hablando de cualquier cosa?"
    },
    {
      "id": "qdt_022",
      "category": "Así eres tú",
      "prompt": "¿Quién se fija más en detalles de decoración, ropa o ambiente de un sitio?"
    },
    {
      "id": "qdt_023",
      "category": "Así eres tú",
      "prompt": "¿Quién se ríe con más facilidad cuando está muy cansado?"
    },
    {
      "id": "qdt_024",
      "category": "Así eres tú",
      "prompt": "¿Quién tiene menos problema en pedir ayuda cuando no sabe hacer algo?"
    },
    {
      "id": "qdt_025",
      "category": "Así eres tú",
      "prompt": "¿Quién se distrae más a mitad de una historia y acaba contando otra distinta?"
    },
    {
      "id": "qdt_026",
      "category": "Así eres tú",
      "prompt": "¿Quién acepta antes un plan y luego comprueba si realmente podía hacerlo?"
    },
    {
      "id": "qdt_027",
      "category": "Así eres tú",
      "prompt": "¿Quién se pone más perfeccionista cuando algo le importa de verdad?"
    },
    {
      "id": "qdt_028",
      "category": "Así eres tú",
      "prompt": "¿Quién sabe tranquilizar mejor al otro cuando está nervioso?"
    },
    {
      "id": "qdt_029",
      "category": "Te tengo calado",
      "prompt": "¿Quién es más fácil de sorprender con un detalle inesperado?"
    },
    {
      "id": "qdt_030",
      "category": "Te tengo calado",
      "prompt": "¿Quién cambia menos de opinión una vez que ha dicho “yo haría esto”?"
    },
    {
      "id": "qdt_031",
      "category": "Te tengo calado",
      "prompt": "¿A quién sería más fácil pedirle en un restaurante sin preguntarle primero?"
    },
    {
      "id": "qdt_032",
      "category": "Te tengo calado",
      "prompt": "¿Quién tiene peor cara de póker cuando intenta fingir que algo le da igual?"
    },
    {
      "id": "qdt_033",
      "category": "Te tengo calado",
      "prompt": "¿A quién se le nota antes que algo le ha molestado aunque no diga nada?"
    },
    {
      "id": "qdt_034",
      "category": "Te tengo calado",
      "prompt": "¿Quién estropea antes una sorpresa porque se le nota demasiado la ilusión?"
    },
    {
      "id": "qdt_035",
      "category": "Te tengo calado",
      "prompt": "¿Quién disimula peor cuando un plan no le convence del todo?"
    },
    {
      "id": "qdt_036",
      "category": "Te tengo calado",
      "prompt": "¿Quién tiene más “elecciones de siempre” que el otro podría adivinar de memoria?"
    },
    {
      "id": "qdt_037",
      "category": "Te tengo calado",
      "prompt": "¿A quién sería más fácil elegirle un outfit sin pedirle opinión?"
    },
    {
      "id": "qdt_038",
      "category": "Te tengo calado",
      "prompt": "¿De quién acertaría antes el otro qué quiere cenar sin preguntarle?"
    },
    {
      "id": "qdt_039",
      "category": "Te tengo calado",
      "prompt": "¿Quién repite más frases o expresiones que el otro ya reconoce al instante?"
    },
    {
      "id": "qdt_040",
      "category": "Te tengo calado",
      "prompt": "¿Quién tiene una opción comodín más evidente cuando está cansado y no quiere decidir?"
    },
    {
      "id": "qdt_041",
      "category": "Te tengo calado",
      "prompt": "¿De quién podría el otro pedir el desayuno habitual casi palabra por palabra?"
    },
    {
      "id": "qdt_042",
      "category": "Te tengo calado",
      "prompt": "¿A quién se le nota más cuando dice “no tengo sueño” y claramente sí tiene?"
    },
    {
      "id": "qdt_043",
      "category": "Nosotros dos",
      "prompt": "¿Quién suele iniciar más los gestos de cariño porque sí?"
    },
    {
      "id": "qdt_044",
      "category": "Nosotros dos",
      "prompt": "¿Quién acaba cediendo antes en una discusión tonta que ya no merece la pena?"
    },
    {
      "id": "qdt_045",
      "category": "Nosotros dos",
      "prompt": "¿Quién recuerda más detalles pequeños de planes o conversaciones que habéis tenido?"
    },
    {
      "id": "qdt_046",
      "category": "Nosotros dos",
      "prompt": "¿Quién propone más veces hacer algo juntos sin que haya una ocasión especial?"
    },
    {
      "id": "qdt_047",
      "category": "Nosotros dos",
      "prompt": "¿Quién hace más fotos cuando estáis juntos?"
    },
    {
      "id": "qdt_048",
      "category": "Nosotros dos",
      "prompt": "¿Quién dice antes “tenemos que repetir esto” cuando un plan ha salido muy bien?"
    },
    {
      "id": "qdt_049",
      "category": "Nosotros dos",
      "prompt": "¿Quién manda más cosas por el móvil simplemente porque le han recordado al otro?"
    },
    {
      "id": "qdt_050",
      "category": "Nosotros dos",
      "prompt": "¿Quién detecta antes que el otro necesita un rato tranquilo?"
    },
    {
      "id": "qdt_051",
      "category": "Nosotros dos",
      "prompt": "¿Quién alarga más las despedidas cuando ninguno de los dos tiene prisa real?"
    },
    {
      "id": "qdt_052",
      "category": "Nosotros dos",
      "prompt": "¿Quién roba más bocados del plato del otro después de decir que no quería?"
    },
    {
      "id": "qdt_053",
      "category": "Nosotros dos",
      "prompt": "¿Quién suele acabar eligiendo la música cuando vais juntos en coche?"
    },
    {
      "id": "qdt_054",
      "category": "Nosotros dos",
      "prompt": "¿Quién pregunta más “¿quieres algo?” antes de pedir para sí mismo?"
    },
    {
      "id": "qdt_055",
      "category": "Nosotros dos",
      "prompt": "¿Quién propone más veces haceros una foto juntos?"
    },
    {
      "id": "qdt_056",
      "category": "Nosotros dos",
      "prompt": "¿Quién convierte más fácilmente un recado normal en un pequeño plan de pareja?"
    },
    {
      "id": "qdt_057",
      "category": "Nosotros dos",
      "prompt": "¿Quién disfruta más preparando una sorpresa para el otro?"
    },
    {
      "id": "qdt_058",
      "category": "Nosotros dos",
      "prompt": "¿Quién manda más veces el típico “avísame cuando llegues”?"
    },
    {
      "id": "qdt_059",
      "category": "Nosotros dos",
      "prompt": "¿Quién guarda más entradas, fotos o pequeñas cosas porque le recuerdan a un día juntos?"
    },
    {
      "id": "qdt_060",
      "category": "Nosotros dos",
      "prompt": "¿Quién inicia más conversaciones profundas en el momento menos esperado?"
    },
    {
      "id": "qdt_061",
      "category": "Nosotros dos",
      "prompt": "¿Quién suele decidir antes dónde sentaros cuando llegáis a un sitio?"
    },
    {
      "id": "qdt_062",
      "category": "Nosotros dos",
      "prompt": "¿Quién recuerda mejor fechas concretas de cosas que habéis hecho juntos?"
    },
    {
      "id": "qdt_063",
      "category": "Nosotros dos",
      "prompt": "¿Quién mantiene vivos durante más tiempo vuestros chistes internos?"
    },
    {
      "id": "qdt_064",
      "category": "Nosotros dos",
      "prompt": "¿Quién pide perdón antes después de haber estado de mal humor sin motivo claro?"
    },
    {
      "id": "qdt_065",
      "category": "Nosotros dos",
      "prompt": "¿Quién se emociona más organizando algo que sabe que le va a gustar al otro?"
    },
    {
      "id": "qdt_066",
      "category": "Nosotros dos",
      "prompt": "¿Quién propone más veces pedir un postre “para compartir” y luego se come media vida?"
    },
    {
      "id": "qdt_067",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién dice “cinco minutos” y casi nunca son cinco minutos?"
    },
    {
      "id": "qdt_068",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién pierde más tiempo buscando algo que tenía prácticamente delante?"
    },
    {
      "id": "qdt_069",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién empieza una cosa y se distrae con otra por el camino?"
    },
    {
      "id": "qdt_070",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién mira antes el móvil después de despertarse?"
    },
    {
      "id": "qdt_071",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién tiene más papeletas de no recordar dónde ha dejado las llaves?"
    },
    {
      "id": "qdt_072",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién deja más a menudo un vaso o una botella a medias por ahí?"
    },
    {
      "id": "qdt_073",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién abre más veces la nevera sin saber realmente qué está buscando?"
    },
    {
      "id": "qdt_074",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién tarda más en arreglarse justo el día que había dicho “voy rapidísimo”?"
    },
    {
      "id": "qdt_075",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién acumula más pestañas abiertas en el móvil o el ordenador?"
    },
    {
      "id": "qdt_076",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién usa más el botón de posponer la alarma?"
    },
    {
      "id": "qdt_077",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién manda más audios cuando podría haber escrito dos líneas?"
    },
    {
      "id": "qdt_078",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién vuelve a mirar la carta aunque ya sepa casi seguro qué va a pedir?"
    },
    {
      "id": "qdt_079",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién deja más notificaciones pendientes pensando “luego respondo”?"
    },
    {
      "id": "qdt_080",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién lleva más cosas “por si acaso” cuando sale de casa?"
    },
    {
      "id": "qdt_081",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién se acuerda menos de cargar el móvil antes de que sea demasiado tarde?"
    },
    {
      "id": "qdt_082",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién pone una serie o una peli y acaba mirando el móvil a ratos?"
    },
    {
      "id": "qdt_083",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién cambia de ropa en el último momento porque de repente nada le convence?"
    },
    {
      "id": "qdt_084",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién necesita más alarmas, notas o recordatorios para no olvidarse de cosas?"
    },
    {
      "id": "qdt_085",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién acaba más veces terminándose lo que el otro ha dejado en el plato?"
    },
    {
      "id": "qdt_086",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién hace más fotos a la comida antes de empezar a comer?"
    },
    {
      "id": "qdt_087",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién mira antes el tiempo que va a hacer antes de salir?"
    },
    {
      "id": "qdt_088",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién dice “no quiero nada” y luego prueba lo del otro?"
    },
    {
      "id": "qdt_089",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién camina naturalmente más rápido cuando vais por la calle?"
    },
    {
      "id": "qdt_090",
      "category": "Pequeñas cosas",
      "prompt": "¿Quién vuelve más veces sobre sus pasos para comprobar si ha cerrado bien?"
    },
    {
      "id": "qdt_091",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién prefiere más repetir un sitio que ya le encanta antes que probar uno nuevo?"
    },
    {
      "id": "qdt_092",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién elegiría antes algo salado que algo dulce cuando le apetece picar?"
    },
    {
      "id": "qdt_093",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién intenta quedarse más veces con el asiento junto a la ventana?"
    },
    {
      "id": "qdt_094",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién prefiere más una terraza agradable a sentarse dentro?"
    },
    {
      "id": "qdt_095",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién disfruta más de desayunar o merendar fuera que de salir a cenar?"
    },
    {
      "id": "qdt_096",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién repite más veces el mismo sabor cuando encuentra uno que le encanta?"
    },
    {
      "id": "qdt_097",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién pone más veces una canción que ya se sabe de memoria en vez de buscar música nueva?"
    },
    {
      "id": "qdt_098",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién elegiría antes un plan tranquilo que uno con mucha gente y ruido?"
    },
    {
      "id": "qdt_099",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién valora más que un sitio tenga buenas vistas aunque haya que desplazarse un poco?"
    },
    {
      "id": "qdt_100",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién disfruta más entrando en tiendas solo para mirar sin intención de comprar?"
    },
    {
      "id": "qdt_101",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién tiene más tendencia a volver a ver una peli o serie que ya sabe que le gusta?"
    },
    {
      "id": "qdt_102",
      "category": "Favoritos y preferencias",
      "prompt": "¿Quién elegiría antes un paseo largo con algo de comer que una actividad organizada?"
    },
    {
      "id": "qdt_103",
      "category": "Prioridades",
      "prompt": "¿Quién prioriza más estar cómodo que estar en el sitio más bonito?"
    },
    {
      "id": "qdt_104",
      "category": "Prioridades",
      "prompt": "¿Quién pagaría antes un poco más por ahorrarse bastante tiempo?"
    },
    {
      "id": "qdt_105",
      "category": "Prioridades",
      "prompt": "¿Quién protege más sus horas de sueño aunque eso signifique hacer menos cosas?"
    },
    {
      "id": "qdt_106",
      "category": "Prioridades",
      "prompt": "¿Quién prefiere tener una cosa muy buena antes que varias simplemente correctas?"
    },
    {
      "id": "qdt_107",
      "category": "Prioridades",
      "prompt": "¿Quién suele elegir antes una opción práctica y cercana que otra más espectacular pero incómoda?"
    },
    {
      "id": "qdt_108",
      "category": "Prioridades",
      "prompt": "¿Quién disfruta más cuando un plan tiene margen y no hay que ir corriendo a ningún sitio?"
    },
    {
      "id": "qdt_109",
      "category": "Prioridades",
      "prompt": "¿Quién da más importancia a comer a una hora razonable cuando estáis haciendo planes?"
    },
    {
      "id": "qdt_110",
      "category": "Prioridades",
      "prompt": "¿Quién necesita más reservarse algún rato sin plan para sentir que ha descansado de verdad?"
    },
    {
      "id": "qdt_111",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién tiene más dificultad para admitir “vale, no tenía ni idea”?"
    },
    {
      "id": "qdt_112",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién se ríe antes cuando los dos intentáis manteneros serios?"
    },
    {
      "id": "qdt_113",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién dice más veces “no me pasa nada” cuando claramente sí le pasa algo pequeño?"
    },
    {
      "id": "qdt_114",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién siente más vergüenza al tener que pedir a alguien que repita algo por tercera vez?"
    },
    {
      "id": "qdt_115",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién se queda más cortado cuando recibe un cumplido muy directo?"
    },
    {
      "id": "qdt_116",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién revisa más veces una foto antes de decidir si le gusta cómo sale?"
    },
    {
      "id": "qdt_117",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién tiene más canciones que le encantan pero le daría un poco de vergüenza poner delante de todo el mundo?"
    },
    {
      "id": "qdt_118",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién mira más veces el precio antes de reconocer que algo le encanta?"
    },
    {
      "id": "qdt_119",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién tarda más en reconocer que se está quedando dormido?"
    },
    {
      "id": "qdt_120",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién pregunta menos por una dirección y prefiere intentar orientarse solo un rato más?"
    },
    {
      "id": "qdt_121",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién se inventa más excusas pequeñas para no levantarse del sofá cuando está demasiado cómodo?"
    },
    {
      "id": "qdt_122",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién se pone más nervioso cuando sabe que le están preparando una sorpresa?"
    },
    {
      "id": "qdt_123",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién tiene más dificultad para tirar algo porque piensa “igual algún día me sirve”?"
    },
    {
      "id": "qdt_124",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién se arrepiente más rápido de haber dicho “yo no quiero postre”?"
    },
    {
      "id": "qdt_125",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién mira más discretamente lo que ha pedido otra mesa porque tiene buena pinta?"
    },
    {
      "id": "qdt_126",
      "category": "Confesiones inocentes",
      "prompt": "¿Quién tarda más en admitir que el otro tenía razón en una tontería?"
    },
    {
      "id": "qdt_127",
      "category": "Caos y risas",
      "prompt": "¿Quién tiene más facilidad para convertir un recado de diez minutos en una miniaventura?"
    },
    {
      "id": "qdt_128",
      "category": "Caos y risas",
      "prompt": "¿Quién podría perderse siguiendo Google Maps y aun así defender que iba bien?"
    },
    {
      "id": "qdt_129",
      "category": "Caos y risas",
      "prompt": "¿Quién acabaría antes hablando con una persona desconocida porque ha surgido cualquier comentario?"
    },
    {
      "id": "qdt_130",
      "category": "Caos y risas",
      "prompt": "¿Quién tiene más papeletas de pedir algo pensando que era otra cosa y descubrirlo cuando llega?"
    },
    {
      "id": "qdt_131",
      "category": "Caos y risas",
      "prompt": "¿Quién se subiría antes al transporte equivocado por ir hablando o pensando en otra cosa?"
    },
    {
      "id": "qdt_132",
      "category": "Caos y risas",
      "prompt": "¿Quién aguantaría menos tiempo sin reírse en una situación en la que está fatal reírse?"
    },
    {
      "id": "qdt_133",
      "category": "Caos y risas",
      "prompt": "¿Quién haría antes una apuesta absurda solo porque el otro ha dicho “no te atreves”?"
    },
    {
      "id": "qdt_134",
      "category": "Caos y risas",
      "prompt": "¿Quién tiene más posibilidades de empezar a bailar si suena una canción que le encanta aunque el sitio no acompañe?"
    },
    {
      "id": "qdt_135",
      "category": "Caos y risas",
      "prompt": "¿Quién podría acabar comprando una cosa completamente inútil solo porque le ha hecho mucha gracia?"
    },
    {
      "id": "qdt_136",
      "category": "Caos y risas",
      "prompt": "¿Quién tendría más papeletas de decir una palabra mal y convertirla en un chiste interno para meses?"
    },
    {
      "id": "qdt_137",
      "category": "Caos y risas",
      "prompt": "¿Quién se inventaría antes una historia sobre una persona desconocida que está sentada lejos solo por entretenerse?"
    },
    {
      "id": "qdt_138",
      "category": "Caos y risas",
      "prompt": "¿Quién haría antes una foto ridícula si sabe que solo la va a ver el otro?"
    },
    {
      "id": "qdt_139",
      "category": "Caos y risas",
      "prompt": "¿Quién tiene más papeletas de entrar en un sitio “solo a mirar” y salir con algo?"
    },
    {
      "id": "qdt_140",
      "category": "Caos y risas",
      "prompt": "¿Quién sería más capaz de improvisar una letra distinta para una canción y seguir como si nada?"
    },
    {
      "id": "qdt_141",
      "category": "Caos y risas",
      "prompt": "¿Quién acabaría antes aceptando un karaoke aunque cinco minutos antes dijera que ni loco?"
    },
    {
      "id": "qdt_142",
      "category": "Caos y risas",
      "prompt": "¿Quién tiene más posibilidades de hacer amistad con el camarero o dependiente durante una conversación normal?"
    },
    {
      "id": "qdt_143",
      "category": "Caos y risas",
      "prompt": "¿Quién podría provocar más fácilmente que una foto seria termine siendo un desastre de risas?"
    },
    {
      "id": "qdt_144",
      "category": "Caos y risas",
      "prompt": "¿Quién se reiría más si un plan perfectamente organizado empieza a salir regular pero sin consecuencias graves?"
    },
    {
      "id": "qdt_145",
      "category": "Caos y risas",
      "prompt": "¿Quién tiene más papeletas de quedarse con un apodo absurdo después de una sola anécdota?"
    },
    {
      "id": "qdt_146",
      "category": "Caos y risas",
      "prompt": "¿Quién sería más probable que propusiera cambiar de rumbo solo porque ha visto algo curioso a lo lejos?"
    },
    {
      "id": "qdt_147",
      "category": "Caos y risas",
      "prompt": "¿Quién se vendría arriba antes en una máquina de recreativos aunque no tenga ni idea de jugar?"
    },
    {
      "id": "qdt_148",
      "category": "Caos y risas",
      "prompt": "¿Quién podría convertir una frase completamente normal en una broma que solo entendéis vosotros?"
    },
    {
      "id": "qdt_149",
      "category": "Caos y risas",
      "prompt": "¿Quién acabaría antes probándose un accesorio ridículo en una tienda solo para hacer reír al otro?"
    },
    {
      "id": "qdt_150",
      "category": "Caos y risas",
      "prompt": "¿Quién tiene más papeletas de empezar una competición absurda por algo que no importa nada?"
    }
  ],
  "bet_on_me": [
    {
      "id": "apm_001",
      "category": "Así eres tú",
      "prompt": "Cuando estás muy cansado/a, ¿qué se te nota primero?",
      "options": [
        "Hablas bastante menos",
        "Te entra sueño de golpe",
        "Te vuelves más impaciente",
        "Casi no se te nota"
      ]
    },
    {
      "id": "apm_002",
      "category": "Así eres tú",
      "prompt": "Cuando algo te hace mucha ilusión, ¿qué haces primero?",
      "options": [
        "Se lo cuentas a alguien",
        "Empiezas a buscar información",
        "Empiezas a organizarlo",
        "Te lo guardas un rato para ti"
      ]
    },
    {
      "id": "apm_003",
      "category": "Así eres tú",
      "prompt": "Después de un día bastante malo, ¿qué te ayuda más a resetear?",
      "options": [
        "Hablarlo con alguien",
        "Estar un rato a solas",
        "Comer algo que te gusta",
        "Dormir o tumbarte"
      ]
    },
    {
      "id": "apm_004",
      "category": "Así eres tú",
      "prompt": "Cuando tienes que tomar una decisión importante, ¿qué haces más?",
      "options": [
        "Haces una lista mental de pros y contras",
        "Preguntas opiniones",
        "Sigues bastante tu intuición",
        "Necesitas dejar pasar un poco de tiempo"
      ]
    },
    {
      "id": "apm_005",
      "category": "Así eres tú",
      "prompt": "Cuando llegas a un sitio donde no conoces a casi nadie, ¿qué te sale más natural?",
      "options": [
        "Hablar con la primera persona que tengas cerca",
        "Esperar a que alguien te incluya",
        "Buscar a alguien con quien tengas algo en común",
        "Observar un poco antes de entrar en conversación"
      ]
    },
    {
      "id": "apm_006",
      "category": "Así eres tú",
      "prompt": "Cuando notas que tienes demasiadas cosas en la cabeza, ¿qué haces primero?",
      "options": [
        "Ordenas lo que tienes pendiente",
        "Te distraes un rato",
        "Lo hablas con alguien",
        "Empiezas por una tarea pequeña"
      ]
    },
    {
      "id": "apm_007",
      "category": "Así eres tú",
      "prompt": "Cuando alguien te hace un cumplido muy directo, ¿cómo reaccionas más a menudo?",
      "options": [
        "Das las gracias sin más",
        "Te ríes por vergüenza",
        "Le quitas importancia",
        "Devuelves otro cumplido"
      ]
    },
    {
      "id": "apm_008",
      "category": "Así eres tú",
      "prompt": "Cuando cometes un error pequeño delante de otra gente, ¿qué haces?",
      "options": [
        "Te ríes de ti mismo/a",
        "Intentas arreglarlo rápido",
        "Te da bastante vergüenza",
        "Sigues como si nada"
      ]
    },
    {
      "id": "apm_009",
      "category": "Así eres tú",
      "prompt": "En una reunión o comida con bastante gente, ¿qué papel te sale más natural?",
      "options": [
        "Hablar mucho y mover la conversación",
        "Escuchar y entrar cuando tienes algo que decir",
        "Hacer bromas",
        "Hablar sobre todo con la gente que tienes cerca"
      ]
    },
    {
      "id": "apm_010",
      "category": "Así eres tú",
      "prompt": "Cuando necesitas concentrarte de verdad, ¿qué te funciona mejor?",
      "options": [
        "Silencio total",
        "Música de fondo",
        "Tenerlo todo ordenado antes",
        "Ponerte directamente y aislarte del resto"
      ]
    },
    {
      "id": "apm_011",
      "category": "Así eres tú",
      "prompt": "Cuando alguien te hace una crítica que tiene parte de razón, ¿qué haces primero?",
      "options": [
        "La aceptas bastante rápido",
        "Te justificas un poco antes de aceptarla",
        "Necesitas pensarlo a solas",
        "Preguntas exactamente qué quiere decir"
      ]
    },
    {
      "id": "apm_012",
      "category": "Así eres tú",
      "prompt": "Si de repente tienes una hora libre, ¿qué te apetece más hacer?",
      "options": [
        "Tumbarte y no hacer nada",
        "Salir a dar una vuelta",
        "Mirar el móvil o ver algo",
        "Aprovechar para hacer algo pendiente"
      ]
    },
    {
      "id": "apm_013",
      "category": "Así eres tú",
      "prompt": "Cuando alguien llega tarde y tú ya estás esperando, ¿qué haces más?",
      "options": [
        "Miras el móvil tranquilamente",
        "Te impacientas bastante",
        "Aprovechas para dar una vuelta",
        "Mandas un mensaje para saber cuánto falta"
      ]
    },
    {
      "id": "apm_014",
      "category": "Así eres tú",
      "prompt": "Después de una discusión pequeña, ¿qué necesitas más para volver a estar bien?",
      "options": [
        "Hablarlo enseguida",
        "Un rato para bajar revoluciones",
        "Un gesto de cariño",
        "Pasar página sin darle más vueltas"
      ]
    },
    {
      "id": "apm_015",
      "category": "Así eres tú",
      "prompt": "Cuando estás estresado/a, ¿qué comportamiento aparece más en ti?",
      "options": [
        "Hablas más rápido",
        "Te quedas más callado/a",
        "Te cuesta decidir cosas pequeñas",
        "Te vuelves más organizado/a"
      ]
    },
    {
      "id": "apm_016",
      "category": "Así eres tú",
      "prompt": "Cuando tienes dos opciones que te gustan casi igual, ¿cómo sueles desempatar?",
      "options": [
        "Por precio",
        "Por comodidad",
        "Por intuición",
        "Preguntando a alguien"
      ]
    },
    {
      "id": "apm_017",
      "category": "Así eres tú",
      "prompt": "Por la mañana, ¿qué necesitas más para empezar bien?",
      "options": [
        "Desayunar",
        "Ducharte",
        "Un rato sin hablar demasiado",
        "Mirar el móvil y ponerte al día"
      ]
    },
    {
      "id": "apm_018",
      "category": "Así eres tú",
      "prompt": "Cuando te falta motivación para hacer algo, ¿qué te ayuda más?",
      "options": [
        "Que alguien te anime",
        "Empezar por cinco minutos",
        "Pensar en lo bien que te sentirás al acabar",
        "Ponerte una pequeña recompensa"
      ]
    },
    {
      "id": "apm_019",
      "category": "Te tengo calado",
      "prompt": "Cuando la carta de un restaurante es enorme, ¿cómo sueles decidir?",
      "options": [
        "Vas a algo que ya conoces",
        "Comparas varias opciones hasta decidir",
        "Preguntas qué recomienda alguien",
        "Eliges rápido por intuición"
      ]
    },
    {
      "id": "apm_020",
      "category": "Te tengo calado",
      "prompt": "¿Qué pequeño detalle te hace más ilusión recibir?",
      "options": [
        "Un mensaje espontáneo",
        "Algo de comer que te encanta",
        "Un plan pensado para ti",
        "Un gesto de cariño inesperado"
      ]
    },
    {
      "id": "apm_021",
      "category": "Te tengo calado",
      "prompt": "¿Qué elección te suele costar más?",
      "options": [
        "Qué peli o serie ver",
        "Dónde comer",
        "Qué ponerte",
        "Qué plan hacer"
      ]
    },
    {
      "id": "apm_022",
      "category": "Te tengo calado",
      "prompt": "Cuando estás cansado/a y nadie quiere decidir la cena, ¿qué opción te sale más fácil?",
      "options": [
        "Pedir algo conocido",
        "Hacer algo rápido en casa",
        "Dejar que el otro elija",
        "Mirar varias opciones hasta que alguna convenza"
      ]
    },
    {
      "id": "apm_023",
      "category": "Te tengo calado",
      "prompt": "En una cafetería nueva, ¿qué miras primero para decidir qué pedir?",
      "options": [
        "El café",
        "La bollería o dulce",
        "Las opciones saladas",
        "Las cosas especiales de la carta"
      ]
    },
    {
      "id": "apm_024",
      "category": "Te tengo calado",
      "prompt": "Cuando entras en una tienda de ropa sin buscar nada concreto, ¿qué te llama antes?",
      "options": [
        "Camisetas o partes de arriba",
        "Pantalones",
        "Zapatillas o zapatos",
        "Accesorios"
      ]
    },
    {
      "id": "apm_025",
      "category": "Te tengo calado",
      "prompt": "Al llegar a una habitación de hotel, ¿qué haces primero?",
      "options": [
        "Mirar las vistas",
        "Probar la cama",
        "Revisar el baño",
        "Dejar las cosas y seguir con el plan"
      ]
    },
    {
      "id": "apm_026",
      "category": "Te tengo calado",
      "prompt": "Si un día de plan se pone lluvioso, ¿qué cambio te apetecería más?",
      "options": [
        "Cafetería y charla",
        "Cine",
        "Centro comercial o tiendas",
        "Volver a casa y montar plan tranquilo"
      ]
    },
    {
      "id": "apm_027",
      "category": "Te tengo calado",
      "prompt": "Cuando eliges música para empezar un trayecto, ¿qué buscas más?",
      "options": [
        "Una playlist conocida",
        "Canciones animadas",
        "Algo tranquilo",
        "Lo último que estabas escuchando"
      ]
    },
    {
      "id": "apm_028",
      "category": "Te tengo calado",
      "prompt": "Cuando sales a tomar algo, ¿qué pesa más al elegir bebida?",
      "options": [
        "Que ya sabes que te gusta",
        "Que combine con la comida",
        "Probar algo diferente",
        "Que sea refrescante y fácil"
      ]
    },
    {
      "id": "apm_029",
      "category": "Te tengo calado",
      "prompt": "Si hay varios postres que te gustan, ¿cómo decides?",
      "options": [
        "El más chocolateado",
        "El más ligero o fresco",
        "El más especial de la casa",
        "El que mejor se pueda compartir"
      ]
    },
    {
      "id": "apm_030",
      "category": "Te tengo calado",
      "prompt": "Cuando recibes un regalo y te encanta, ¿qué reacción te sale primero?",
      "options": [
        "Sonreír muchísimo",
        "Abrazar a quien te lo da",
        "Empezar a hablar de por qué te gusta",
        "Quedarte un poco sin saber qué decir"
      ]
    },
    {
      "id": "apm_031",
      "category": "Te tengo calado",
      "prompt": "En un restaurante con mesas libres, ¿qué sitio escogerías antes?",
      "options": [
        "Junto a la ventana",
        "En una esquina tranquila",
        "En terraza",
        "Donde haya más ambiente"
      ]
    },
    {
      "id": "apm_032",
      "category": "Te tengo calado",
      "prompt": "Cuando el móvil baja del 15%, ¿qué haces normalmente?",
      "options": [
        "Buscas cargador enseguida",
        "Activas ahorro de batería",
        "Lo ignoras hasta que sea crítico",
        "Dejas de usarlo casi por completo"
      ]
    },
    {
      "id": "apm_033",
      "category": "Te tengo calado",
      "prompt": "Cuando haces una maleta para dos o tres días, ¿qué te pasa más?",
      "options": [
        "Llevas justo lo necesario",
        "Metes varios “por si acaso”",
        "Olvidas alguna cosa pequeña",
        "Preparas conjuntos completos"
      ]
    },
    {
      "id": "apm_034",
      "category": "Te tengo calado",
      "prompt": "Cuando tienes que esperar media hora inesperadamente, ¿cómo la llenas?",
      "options": [
        "Mirando el móvil",
        "Dando una vuelta",
        "Tomando algo",
        "Simplemente esperando y observando"
      ]
    },
    {
      "id": "apm_035",
      "category": "Te tengo calado",
      "prompt": "Cuando empiezas una serie que te engancha, ¿qué haces más?",
      "options": [
        "Ves varios capítulos seguidos",
        "Te administras los capítulos",
        "Buscas información sobre actores o trama",
        "Se la recomiendas enseguida a alguien"
      ]
    },
    {
      "id": "apm_036",
      "category": "Te tengo calado",
      "prompt": "Cuando ves algo bonito en una tienda pero no lo necesitas, ¿qué haces?",
      "options": [
        "Lo compras si no es caro",
        "Le haces foto para pensarlo",
        "Lo dejas sin darle muchas vueltas",
        "Buscas si existe más barato"
      ]
    },
    {
      "id": "apm_037",
      "category": "Te tengo calado",
      "prompt": "Cuando hay que elegir una foto de varias parecidas, ¿qué miras primero?",
      "options": [
        "Tu cara",
        "La cara del otro",
        "La luz y el fondo",
        "Que la foto se sienta natural"
      ]
    },
    {
      "id": "apm_038",
      "category": "Te tengo calado",
      "prompt": "En un atasco o trayecto lento, ¿qué te ayuda más a no desesperarte?",
      "options": [
        "Música",
        "Hablar",
        "Mirar el móvil si no conduces",
        "Aceptar que no hay nada que hacer"
      ]
    },
    {
      "id": "apm_039",
      "category": "Te tengo calado",
      "prompt": "Un sábado por la mañana sin prisa, ¿qué te apetece más?",
      "options": [
        "Desayunar fuera",
        "Quedarte un rato largo en la cama",
        "Salir pronto y aprovechar el día",
        "Hacer cosas en casa con calma"
      ]
    },
    {
      "id": "apm_040",
      "category": "Te tengo calado",
      "prompt": "Si en un sitio te atienden regular pero la comida está buenísima, ¿qué pesa más para decidir si volverías?",
      "options": [
        "La comida gana",
        "El trato pesa demasiado",
        "Depende del precio",
        "Depende de con quién vaya"
      ]
    },
    {
      "id": "apm_041",
      "category": "Te tengo calado",
      "prompt": "Cuando llevas un rato sin decidir entre dos cosas, ¿qué termina pasando más?",
      "options": [
        "Te quedas con la primera idea",
        "Cambias a la segunda",
        "Pides al otro que decida",
        "Buscas una tercera opción"
      ]
    },
    {
      "id": "apm_042",
      "category": "Te tengo calado",
      "prompt": "En una compra online, ¿qué miras más antes de pagar?",
      "options": [
        "Las reseñas",
        "El precio final",
        "Las fotos",
        "La política de devolución"
      ]
    },
    {
      "id": "apm_043",
      "category": "Te tengo calado",
      "prompt": "En una cafetería donde ya has estado muchas veces, ¿qué haces?",
      "options": [
        "Pides lo de siempre",
        "Cambias solo la bebida",
        "Pruebas algo nuevo si te llama mucho",
        "Preguntas si tienen algo diferente ese día"
      ]
    },
    {
      "id": "apm_044",
      "category": "Te tengo calado",
      "prompt": "Cuando el día está buenísimo fuera, ¿qué te apetece más hacer?",
      "options": [
        "Terraza",
        "Paseo largo",
        "Ir a algún sitio con vistas",
        "Aprovechar para hacer un plan que tenías pendiente"
      ]
    },
    {
      "id": "apm_045",
      "category": "Te tengo calado",
      "prompt": "Cuando ya estás en la cama y recuerdas algo pendiente, ¿qué haces?",
      "options": [
        "Te levantas y lo haces",
        "Lo apuntas para mañana",
        "Intentas resolverlo desde el móvil",
        "Lo dejas para el día siguiente sin apuntarlo"
      ]
    },
    {
      "id": "apm_046",
      "category": "Te tengo calado",
      "prompt": "Cuando te proponen un plan con gente que apenas conoces, ¿qué te hace decir que sí con más facilidad?",
      "options": [
        "Que vaya alguien de confianza",
        "Que el plan en sí te apetezca mucho",
        "Que sea algo corto y fácil",
        "Que no tengas nada mejor previsto"
      ]
    },
    {
      "id": "apm_047",
      "category": "Nosotros dos",
      "prompt": "En un plan juntos, ¿qué momento disfrutas más?",
      "options": [
        "Prepararte y esperar el plan",
        "El momento de encontraros",
        "Comer y hablar tranquilos",
        "El paseo o la sobremesa después"
      ]
    },
    {
      "id": "apm_048",
      "category": "Nosotros dos",
      "prompt": "Si tenéis una tarde juntos sin nada previsto, ¿qué te sale más natural?",
      "options": [
        "Proponer un plan enseguida",
        "Dejar que el otro proponga",
        "Quedaros tranquilos sin hacer gran cosa",
        "Salir y decidir sobre la marcha"
      ]
    },
    {
      "id": "apm_049",
      "category": "Nosotros dos",
      "prompt": "Antes de veros, ¿qué pequeña cosa te hace más ilusión?",
      "options": [
        "Pensar qué vais a hacer",
        "Arreglarte",
        "Recibir el mensaje de “ya estoy”",
        "El momento de ver al otro"
      ]
    },
    {
      "id": "apm_050",
      "category": "Nosotros dos",
      "prompt": "Cuando compartís comida, ¿qué disfrutas más?",
      "options": [
        "Pedir varias cosas para probar",
        "Elegir cada uno lo suyo",
        "Compartir solo el postre",
        "Ir probando del plato del otro"
      ]
    },
    {
      "id": "apm_051",
      "category": "Nosotros dos",
      "prompt": "Después de un pequeño pique, ¿qué gesto del otro te ayuda más a pasar página?",
      "options": [
        "Una broma",
        "Un abrazo",
        "Que lo hable claramente",
        "Que haga como siempre y normalice el ambiente"
      ]
    },
    {
      "id": "apm_052",
      "category": "Nosotros dos",
      "prompt": "Cuando os hacéis una foto juntos, ¿qué prefieres?",
      "options": [
        "Una foto bonita y preparada",
        "Una espontánea",
        "Una haciendo el tonto",
        "Varias para luego elegir"
      ]
    },
    {
      "id": "apm_053",
      "category": "Nosotros dos",
      "prompt": "¿Qué tipo de recuerdo de un día juntos guardas con más cariño?",
      "options": [
        "Una foto",
        "Una frase o conversación",
        "Algo que os hizo reír",
        "Un sitio concreto"
      ]
    },
    {
      "id": "apm_054",
      "category": "Nosotros dos",
      "prompt": "En un trayecto juntos, ¿qué te apetece más?",
      "options": [
        "Hablar todo el camino",
        "Escuchar música",
        "Ir comentando cosas que veis",
        "Un poco de todo sin forzarlo"
      ]
    },
    {
      "id": "apm_055",
      "category": "Nosotros dos",
      "prompt": "Cuando ninguno tiene claro qué hacer, ¿cómo prefieres decidir el plan?",
      "options": [
        "Uno propone y el otro acepta",
        "Cada uno da dos opciones",
        "Improvisáis al salir",
        "Buscáis ideas juntos en el móvil"
      ]
    },
    {
      "id": "apm_056",
      "category": "Nosotros dos",
      "prompt": "Cuando llega la hora de despedirse, ¿qué parte te cuesta más?",
      "options": [
        "Decir “venga, me voy” de verdad",
        "El último abrazo",
        "Empezar el camino de vuelta",
        "Nada especialmente; me quedo con el buen rato"
      ]
    },
    {
      "id": "apm_057",
      "category": "Nosotros dos",
      "prompt": "En un rato tranquilo juntos, ¿qué disfrutas más?",
      "options": [
        "Hablar de cualquier cosa",
        "Ver algo juntos",
        "Estar cerca aunque cada uno haga lo suyo",
        "Salir a pasear sin objetivo"
      ]
    },
    {
      "id": "apm_058",
      "category": "Nosotros dos",
      "prompt": "Si vais a pedir un postre para compartir, ¿qué prefieres?",
      "options": [
        "Chocolate",
        "Algo de tarta",
        "Helado",
        "Algo más ligero o frutal"
      ]
    },
    {
      "id": "apm_059",
      "category": "Nosotros dos",
      "prompt": "Cuando notas al otro estresado, ¿qué te sale primero?",
      "options": [
        "Preguntar qué pasa",
        "Dar cariño",
        "Intentar resolver el problema",
        "Darle espacio"
      ]
    },
    {
      "id": "apm_060",
      "category": "Nosotros dos",
      "prompt": "Para una cita sencilla entre semana, ¿qué te apetece más?",
      "options": [
        "Cena fuera",
        "Paseo y algo de beber",
        "Peli o serie juntos",
        "Probar un sitio nuevo sin hacer gran plan"
      ]
    },
    {
      "id": "apm_061",
      "category": "Nosotros dos",
      "prompt": "Cuando habláis de un plan futuro que os hace ilusión, ¿qué disfrutas más?",
      "options": [
        "Buscar sitios",
        "Imaginar cómo será",
        "Organizar fechas y detalles",
        "Guardar ideas para verlo más adelante"
      ]
    },
    {
      "id": "apm_062",
      "category": "Nosotros dos",
      "prompt": "¿Qué hace que un chiste interno entre vosotros te siga haciendo gracia meses después?",
      "options": [
        "Recordar exactamente cómo nació",
        "Que aparezca en momentos inesperados",
        "Que nadie más lo entienda",
        "Que haya ido evolucionando con nuevas bromas"
      ]
    },
    {
      "id": "apm_063",
      "category": "Pequeñas cosas",
      "prompt": "Cuando desayunas fuera, ¿qué te gana más?",
      "options": [
        "Algo dulce",
        "Algo salado",
        "Que haya buen café",
        "Que el sitio sea tranquilo y agradable"
      ]
    },
    {
      "id": "apm_064",
      "category": "Pequeñas cosas",
      "prompt": "Cuando recibes un mensaje mientras estás muy liado/a, ¿qué haces más a menudo?",
      "options": [
        "Respondes en cuanto lo ves",
        "Lo lees y respondes cuando puedes",
        "Lo dejas sin abrir hasta tener tiempo",
        "Mandas algo rápido para no dejarlo pendiente"
      ]
    },
    {
      "id": "apm_065",
      "category": "Pequeñas cosas",
      "prompt": "Cuando suena la alarma y aún tienes sueño, ¿qué haces?",
      "options": [
        "Te levantas a la primera",
        "La pospones una vez",
        "La pospones varias veces",
        "Miras el móvil antes de decidir"
      ]
    },
    {
      "id": "apm_066",
      "category": "Pequeñas cosas",
      "prompt": "En la ducha, ¿qué sueles hacer más?",
      "options": [
        "Ir rápido y salir",
        "Quedarte más de lo necesario",
        "Poner música",
        "Pensar en mil cosas"
      ]
    },
    {
      "id": "apm_067",
      "category": "Pequeñas cosas",
      "prompt": "Cuando vas al supermercado sin lista, ¿qué pasa más?",
      "options": [
        "Recuerdas casi todo",
        "Se te olvida justo algo importante",
        "Compras alguna cosa extra",
        "Terminas mirando el móvil para recordar qué faltaba"
      ]
    },
    {
      "id": "apm_068",
      "category": "Pequeñas cosas",
      "prompt": "Justo antes de salir de casa, ¿qué compruebas más?",
      "options": [
        "Llaves",
        "Móvil",
        "Cartera",
        "Que todo quede cerrado o apagado"
      ]
    },
    {
      "id": "apm_069",
      "category": "Pequeñas cosas",
      "prompt": "Cuando tu móvil está cargando, ¿qué haces más?",
      "options": [
        "Lo dejas tranquilo",
        "Lo sigues usando enchufado",
        "Esperas a que suba un poco y lo coges",
        "Te olvidas de él hasta mucho después"
      ]
    },
    {
      "id": "apm_070",
      "category": "Pequeñas cosas",
      "prompt": "Cuando pones una peli en casa, ¿qué necesitas más?",
      "options": [
        "Algo de comer",
        "Una manta o estar cómodo/a",
        "Tener el móvil cerca",
        "Luz muy baja o apagada"
      ]
    },
    {
      "id": "apm_071",
      "category": "Pequeñas cosas",
      "prompt": "Al hacer una maleta corta, ¿qué preparas primero?",
      "options": [
        "La ropa",
        "El neceser",
        "Los cargadores",
        "Los zapatos"
      ]
    },
    {
      "id": "apm_072",
      "category": "Pequeñas cosas",
      "prompt": "Cuando te pones a ordenar, ¿qué haces primero?",
      "options": [
        "Recoger lo que está a la vista",
        "Limpiar superficies",
        "Guardar ropa",
        "Empezar por una zona concreta"
      ]
    },
    {
      "id": "apm_073",
      "category": "Pequeñas cosas",
      "prompt": "En el súper, ¿qué sección te hace desviarte más fácil de la lista?",
      "options": [
        "Dulces y snacks",
        "Bebidas",
        "Productos nuevos",
        "Cosas de desayuno"
      ]
    },
    {
      "id": "apm_074",
      "category": "Pequeñas cosas",
      "prompt": "Cuando esperas a alguien en la calle, ¿qué haces casi siempre?",
      "options": [
        "Mirar el móvil",
        "Dar vueltas",
        "Mirar alrededor",
        "Escribir para saber por dónde viene"
      ]
    },
    {
      "id": "apm_075",
      "category": "Pequeñas cosas",
      "prompt": "Cuando acabas de comer y queda un poco en el plato, ¿qué haces?",
      "options": [
        "Te lo terminas aunque estés lleno/a",
        "Lo dejas",
        "Se lo ofreces al otro",
        "Picas un poco más mientras habláis"
      ]
    },
    {
      "id": "apm_076",
      "category": "Pequeñas cosas",
      "prompt": "Antes de salir, ¿cuánto caso haces a la previsión del tiempo?",
      "options": [
        "La miras siempre",
        "Solo si parece que puede llover",
        "Te asomas y decides",
        "Casi nunca la miras"
      ]
    },
    {
      "id": "apm_077",
      "category": "Pequeñas cosas",
      "prompt": "Cuando dudas entre dos conjuntos, ¿cómo decides?",
      "options": [
        "Por comodidad",
        "Por cuál te favorece más",
        "Por el plan que vais a hacer",
        "Preguntando al otro"
      ]
    },
    {
      "id": "apm_078",
      "category": "Pequeñas cosas",
      "prompt": "Con mensajes pendientes, ¿qué te da más pereza responder?",
      "options": [
        "Audios largos",
        "Grupos con muchos mensajes",
        "Mensajes que requieren pensar",
        "Conversaciones que se quedaron a medias"
      ]
    },
    {
      "id": "apm_079",
      "category": "Pequeñas cosas",
      "prompt": "Cuando te sientas en una cafetería, ¿dónde prefieres dejar el móvil?",
      "options": [
        "Encima de la mesa",
        "En el bolsillo o bolso",
        "Boca abajo en la mesa",
        "Depende de si esperas algún mensaje"
      ]
    },
    {
      "id": "apm_080",
      "category": "Pequeñas cosas",
      "prompt": "Cuando sabes que mañana madrugas, ¿qué haces por la noche?",
      "options": [
        "Te acuestas pronto de verdad",
        "Dices que te acostarás pronto y no pasa",
        "Dejas todo preparado para ahorrar tiempo",
        "Calculas exactamente cuántas horas vas a dormir"
      ]
    },
    {
      "id": "apm_081",
      "category": "Pequeñas cosas",
      "prompt": "A media tarde, ¿qué picoteo te apetece más?",
      "options": [
        "Algo dulce",
        "Algo salado",
        "Fruta o algo fresco",
        "Café o bebida y nada de comer"
      ]
    },
    {
      "id": "apm_082",
      "category": "Pequeñas cosas",
      "prompt": "Cuando vas andando a un sitio que no conoces, ¿cómo usas el mapa?",
      "options": [
        "Lo miras casi todo el rato",
        "Lo miras en cada cruce importante",
        "Memorizas el camino al principio",
        "Sigues al otro y apenas lo miras"
      ]
    },
    {
      "id": "apm_083",
      "category": "Pequeñas cosas",
      "prompt": "Cuando estás haciendo cosas en casa, ¿qué pones de fondo?",
      "options": [
        "Música",
        "Una serie o vídeo",
        "Podcast",
        "Nada"
      ]
    },
    {
      "id": "apm_084",
      "category": "Pequeñas cosas",
      "prompt": "Cuando ves una oferta buena de algo que usas, ¿qué haces?",
      "options": [
        "Compras más de una unidad",
        "Compras solo lo que necesitas",
        "Lo piensas bastante",
        "La ignoras si no ibas buscando eso"
      ]
    },
    {
      "id": "apm_085",
      "category": "Favoritos y preferencias",
      "prompt": "Cuando eliges una escapada, ¿qué te atrae más de primeras?",
      "options": [
        "Comer muy bien",
        "Paisajes y naturaleza",
        "Una ciudad con muchas cosas que ver",
        "Descansar y desconectar"
      ]
    },
    {
      "id": "apm_086",
      "category": "Favoritos y preferencias",
      "prompt": "Para un viernes por la tarde, ¿qué plan te entra mejor de primeras?",
      "options": [
        "Terraza o merienda",
        "Cine o peli en casa",
        "Cena fuera",
        "Paseo sin demasiados planes"
      ]
    },
    {
      "id": "apm_087",
      "category": "Favoritos y preferencias",
      "prompt": "¿Qué hace que tengas más ganas de volver a un sitio?",
      "options": [
        "La comida",
        "Cómo os trataron",
        "El ambiente",
        "El buen recuerdo que tienes de ese día"
      ]
    },
    {
      "id": "apm_088",
      "category": "Favoritos y preferencias",
      "prompt": "En un desayuno especial, ¿qué elegirías primero?",
      "options": [
        "Tostadas saladas",
        "Bollería",
        "Tortitas o algo muy dulce",
        "Un desayuno variado con un poco de todo"
      ]
    },
    {
      "id": "apm_089",
      "category": "Favoritos y preferencias",
      "prompt": "En un restaurante, ¿qué tipo de ambiente disfrutas más?",
      "options": [
        "Tranquilo e íntimo",
        "Animado y con gente",
        "Bonito y muy cuidado",
        "Informal y cómodo"
      ]
    },
    {
      "id": "apm_090",
      "category": "Favoritos y preferencias",
      "prompt": "Cuando eliges música para estar de buen humor, ¿qué te funciona mejor?",
      "options": [
        "Pop conocido",
        "Canciones que te recuerdan a algo",
        "Música muy movida",
        "Una mezcla de tus favoritas"
      ]
    },
    {
      "id": "apm_091",
      "category": "Favoritos y preferencias",
      "prompt": "Para ver algo por la noche, ¿qué género te entra mejor?",
      "options": [
        "Comedia",
        "Thriller o misterio",
        "Romance",
        "Acción o aventura"
      ]
    },
    {
      "id": "apm_092",
      "category": "Favoritos y preferencias",
      "prompt": "Cuando sales a tomar algo sin comer, ¿qué te apetece más?",
      "options": [
        "Café",
        "Refresco",
        "Batido o algo dulce",
        "Agua o bebida sencilla"
      ]
    },
    {
      "id": "apm_093",
      "category": "Favoritos y preferencias",
      "prompt": "¿Qué época del año disfrutas más por los planes que permite?",
      "options": [
        "Primavera",
        "Verano",
        "Otoño",
        "Invierno"
      ]
    },
    {
      "id": "apm_094",
      "category": "Favoritos y preferencias",
      "prompt": "Para desconectar un fin de semana, ¿qué entorno te atrae más?",
      "options": [
        "Playa",
        "Montaña o naturaleza",
        "Ciudad",
        "Pueblo tranquilo"
      ]
    },
    {
      "id": "apm_095",
      "category": "Favoritos y preferencias",
      "prompt": "En una tarde de compras, ¿qué tienda te entretiene más?",
      "options": [
        "Ropa",
        "Tecnología",
        "Decoración o cosas para casa",
        "Supermercado gourmet o comida"
      ]
    },
    {
      "id": "apm_096",
      "category": "Favoritos y preferencias",
      "prompt": "¿Qué tipo de foto te gusta más guardar de un plan?",
      "options": [
        "Una de los dos",
        "Una del sitio",
        "Una espontánea",
        "Una foto de algún detalle del día"
      ]
    },
    {
      "id": "apm_097",
      "category": "Favoritos y preferencias",
      "prompt": "Cuando hace buen tiempo, ¿qué mesa eliges antes?",
      "options": [
        "Terraza al sol",
        "Terraza a la sombra",
        "Dentro junto a una ventana",
        "Donde haya menos ruido"
      ]
    },
    {
      "id": "apm_098",
      "category": "Favoritos y preferencias",
      "prompt": "En un viaje, ¿qué comida disfrutas más?",
      "options": [
        "Un desayuno largo",
        "Una comida típica",
        "Una cena especial",
        "Ir picando cosas durante el día"
      ]
    },
    {
      "id": "apm_099",
      "category": "Favoritos y preferencias",
      "prompt": "¿Qué tipo de plan cultural te apetece más?",
      "options": [
        "Museo",
        "Concierto",
        "Cine",
        "Exposición o experiencia inmersiva"
      ]
    },
    {
      "id": "apm_100",
      "category": "Favoritos y preferencias",
      "prompt": "Cuando compras algo para darte un capricho, ¿qué te hace más ilusión?",
      "options": [
        "Estrenarlo cuanto antes",
        "Haber encontrado una buena oferta",
        "Que sea algo muy bonito",
        "Que sea algo que llevabas tiempo queriendo"
      ]
    },
    {
      "id": "apm_101",
      "category": "Favoritos y preferencias",
      "prompt": "Para una noche tranquila, ¿qué combinación te apetece más?",
      "options": [
        "Peli y comida a domicilio",
        "Serie y picoteo",
        "Música y charla",
        "Juego o actividad juntos"
      ]
    },
    {
      "id": "apm_102",
      "category": "Favoritos y preferencias",
      "prompt": "¿Qué tipo de sitio te llama más la atención al pasar por delante?",
      "options": [
        "Una cafetería bonita",
        "Un restaurante con buena pinta",
        "Una tienda curiosa",
        "Un lugar con buenas vistas"
      ]
    },
    {
      "id": "apm_103",
      "category": "Favoritos y preferencias",
      "prompt": "Cuando eliges postre, ¿qué familia te convence más?",
      "options": [
        "Chocolate",
        "Tartas o bizcochos",
        "Helados",
        "Postres de fruta o más frescos"
      ]
    },
    {
      "id": "apm_104",
      "category": "Favoritos y preferencias",
      "prompt": "¿Qué tipo de regalo disfrutas más recibir?",
      "options": [
        "Algo que querías",
        "Una experiencia",
        "Algo personalizado",
        "Algo útil pero de buena calidad"
      ]
    },
    {
      "id": "apm_105",
      "category": "Favoritos y preferencias",
      "prompt": "Si vais al cine, ¿qué pesa más para elegir película?",
      "options": [
        "La historia",
        "Los actores",
        "Las críticas",
        "Que apetezca a los dos"
      ]
    },
    {
      "id": "apm_106",
      "category": "Favoritos y preferencias",
      "prompt": "Para sentarte a hablar un buen rato, ¿qué lugar prefieres?",
      "options": [
        "Cafetería",
        "Parque o banco con vistas",
        "Terraza",
        "Sofá en casa"
      ]
    },
    {
      "id": "apm_107",
      "category": "Favoritos y preferencias",
      "prompt": "¿Qué tipo de paseo disfrutas más?",
      "options": [
        "Por una zona con tiendas y ambiente",
        "Por naturaleza",
        "Por un barrio bonito",
        "Sin ruta fija, simplemente andando"
      ]
    },
    {
      "id": "apm_108",
      "category": "Favoritos y preferencias",
      "prompt": "¿Qué te apetece más pedir cuando quieres darte un homenaje?",
      "options": [
        "Hamburguesa",
        "Sushi",
        "Pizza",
        "Un restaurante donde comer varios platos"
      ]
    },
    {
      "id": "apm_109",
      "category": "Favoritos y preferencias",
      "prompt": "¿Qué tipo de vacaciones te dejan mejor recuerdo?",
      "options": [
        "Las muy planificadas",
        "Las de descanso total",
        "Las de descubrir sitios",
        "Las que mezclan un poco de todo"
      ]
    },
    {
      "id": "apm_110",
      "category": "Favoritos y preferencias",
      "prompt": "¿Qué clase de canción acaba antes en tus favoritas?",
      "options": [
        "Una con letra que te toca",
        "Una muy pegadiza",
        "Una que te recuerda a alguien o algo",
        "Una que te pone de buen humor"
      ]
    },
    {
      "id": "apm_111",
      "category": "Favoritos y preferencias",
      "prompt": "En una feria o mercadillo, ¿qué te llama más?",
      "options": [
        "La comida",
        "Los puestos de ropa o accesorios",
        "Las cosas artesanales",
        "Simplemente pasear y mirar"
      ]
    },
    {
      "id": "apm_112",
      "category": "Favoritos y preferencias",
      "prompt": "Cuando eliges una mesa para dos, ¿qué detalle agradeces más?",
      "options": [
        "Que sea tranquila",
        "Que tenga buenas vistas",
        "Que tenga espacio",
        "Que esté en una zona con ambiente"
      ]
    },
    {
      "id": "apm_113",
      "category": "Prioridades",
      "prompt": "Al elegir alojamiento para una escapada, ¿qué pesa más para ti?",
      "options": [
        "La ubicación",
        "Una habitación muy cómoda",
        "Un buen desayuno y servicios",
        "El diseño y las vistas"
      ]
    },
    {
      "id": "apm_114",
      "category": "Prioridades",
      "prompt": "Cuando gastas dinero en ti, ¿qué te hace sentir más que ha merecido la pena?",
      "options": [
        "Vivir una experiencia",
        "Comprar algo que vas a usar muchísimo",
        "Comer especialmente bien",
        "Guardarlo para algo que quieres de verdad"
      ]
    },
    {
      "id": "apm_115",
      "category": "Prioridades",
      "prompt": "Al organizar un día libre, ¿qué necesitas más para disfrutarlo?",
      "options": [
        "Tener un plan claro",
        "No madrugar",
        "Dejar huecos sin organizar",
        "Hacer al menos una cosa especial"
      ]
    },
    {
      "id": "apm_116",
      "category": "Prioridades",
      "prompt": "En un viaje corto, ¿qué prefieres sacrificar antes?",
      "options": [
        "Dormir un poco menos",
        "Ver algún sitio",
        "Comer en un sitio especial",
        "Tiempo de descanso"
      ]
    },
    {
      "id": "apm_117",
      "category": "Prioridades",
      "prompt": "Al elegir restaurante, ¿qué manda si no podéis tenerlo todo?",
      "options": [
        "Comer muy bien",
        "Que sea cómodo y tranquilo",
        "Que no sea caro",
        "Que esté cerca"
      ]
    },
    {
      "id": "apm_118",
      "category": "Prioridades",
      "prompt": "Cuando tienes varias cosas pendientes, ¿qué priorizas primero?",
      "options": [
        "La más urgente",
        "La más fácil de quitarte de encima",
        "La que más te preocupa",
        "La que requiere más concentración"
      ]
    },
    {
      "id": "apm_119",
      "category": "Prioridades",
      "prompt": "Al comprar algo que usarás mucho, ¿qué valoras más?",
      "options": [
        "Durabilidad",
        "Precio",
        "Diseño",
        "Comodidad"
      ]
    },
    {
      "id": "apm_120",
      "category": "Prioridades",
      "prompt": "Cuando por fin tienes una tarde libre, ¿qué proteges más?",
      "options": [
        "Descansar",
        "Ver a gente",
        "Hacer un plan especial",
        "Ponerte al día con cosas pendientes"
      ]
    },
    {
      "id": "apm_121",
      "category": "Prioridades",
      "prompt": "Al elegir una zona de una ciudad para pasar el día, ¿qué te importa más?",
      "options": [
        "Que tenga sitios para comer",
        "Que sea bonita para pasear",
        "Que tenga cosas que hacer",
        "Que sea fácil llegar y moverse"
      ]
    },
    {
      "id": "apm_122",
      "category": "Prioridades",
      "prompt": "Al preparar un regalo para alguien cercano, ¿qué intentas conseguir sobre todo?",
      "options": [
        "Que le sea útil",
        "Que le emocione",
        "Que le sorprenda",
        "Que demuestre que le conoces"
      ]
    },
    {
      "id": "apm_123",
      "category": "Confesiones inocentes",
      "prompt": "¿Qué te cuesta más reconocer en voz alta?",
      "options": [
        "“Me he equivocado”",
        "“No sé hacerlo”",
        "“Necesito ayuda”",
        "“Esto me da miedo”"
      ]
    },
    {
      "id": "apm_124",
      "category": "Confesiones inocentes",
      "prompt": "Si te hacen una foto que no te gusta, ¿qué es lo primero que suele molestarte?",
      "options": [
        "La cara que has puesto",
        "El pelo o la ropa",
        "El ángulo",
        "La luz"
      ]
    },
    {
      "id": "apm_125",
      "category": "Confesiones inocentes",
      "prompt": "Cuando no entiendes algo a la primera, ¿qué haces normalmente?",
      "options": [
        "Preguntas enseguida",
        "Intentas deducirlo solo/a",
        "Buscas información",
        "Asientes un poco y luego lo averiguas"
      ]
    },
    {
      "id": "apm_126",
      "category": "Confesiones inocentes",
      "prompt": "Cuando necesitas pedir un favor, ¿qué te cuesta más?",
      "options": [
        "Empezar a pedirlo",
        "Explicar por qué lo necesitas",
        "Aceptar que te digan que no",
        "No sentir que molestas"
      ]
    },
    {
      "id": "apm_127",
      "category": "Confesiones inocentes",
      "prompt": "¿Qué tipo de cosa te pone más nervioso/a aunque sea una tontería?",
      "options": [
        "Llegar tarde",
        "Hablar delante de varias personas",
        "No saber qué va a pasar",
        "Tener que pedir algo incómodo"
      ]
    },
    {
      "id": "apm_128",
      "category": "Confesiones inocentes",
      "prompt": "¿Cuál de estos gustos defenderías con menos vergüenza aunque otros se rieran?",
      "options": [
        "Una canción muy comercial",
        "Una comida bastante infantil",
        "Una serie malísima que te engancha",
        "Una prenda o accesorio poco elegante pero comodísimo"
      ]
    },
    {
      "id": "apm_129",
      "category": "Confesiones inocentes",
      "prompt": "Cuando alguien te halaga mucho, ¿qué haces más?",
      "options": [
        "Sonríes y das las gracias",
        "Le quitas mérito",
        "Cambias de tema",
        "Haces una broma"
      ]
    },
    {
      "id": "apm_130",
      "category": "Confesiones inocentes",
      "prompt": "¿Qué tipo de favor te da más apuro pedir?",
      "options": [
        "Que te lleven a algún sitio",
        "Que te presten dinero o paguen algo",
        "Que cambien un plan por ti",
        "Que te ayuden con algo que podrías intentar solo/a"
      ]
    },
    {
      "id": "apm_131",
      "category": "Confesiones inocentes",
      "prompt": "Cuando una película te emociona mucho, ¿qué haces?",
      "options": [
        "Se te nota sin problema",
        "Intentas disimularlo",
        "Haces algún comentario para cortar el momento",
        "Te dejas llevar completamente"
      ]
    },
    {
      "id": "apm_132",
      "category": "Confesiones inocentes",
      "prompt": "Cuando te das cuenta de que estabas defendiendo algo equivocado, ¿qué haces?",
      "options": [
        "Lo reconoces enseguida",
        "Te ríes de ti mismo/a",
        "Intentas explicar por qué pensabas eso",
        "Cambias de tema con dignidad"
      ]
    },
    {
      "id": "apm_133",
      "category": "Confesiones inocentes",
      "prompt": "Si no recuerdas el nombre de alguien que claramente recuerda el tuyo, ¿qué haces?",
      "options": [
        "Preguntas directamente",
        "Intentas evitar decir su nombre",
        "Esperas a que otra persona lo diga",
        "Buscas una pista en la conversación"
      ]
    },
    {
      "id": "apm_134",
      "category": "Confesiones inocentes",
      "prompt": "Cuando algo te da un poco de miedo pero te apetece hacerlo, ¿qué necesitas más?",
      "options": [
        "Que alguien te acompañe",
        "Informarte bien antes",
        "Que te animen mucho",
        "Lanzarte rápido para no pensarlo"
      ]
    },
    {
      "id": "apm_135",
      "category": "Confesiones inocentes",
      "prompt": "¿Cuál de estas pequeñas cosas te da más rabia reconocer que haces?",
      "options": [
        "Mirar varias veces si has cerrado",
        "Volver a leer un mensaje que ya enviaste",
        "Buscar algo teniendo el móvil en la mano",
        "Abrir una app y olvidar para qué"
      ]
    },
    {
      "id": "apm_136",
      "category": "Confesiones inocentes",
      "prompt": "Cuando te das cuenta de que has hablado demasiado de un tema, ¿qué haces?",
      "options": [
        "Te ríes y lo reconoces",
        "Cambias de tema rápido",
        "Preguntas algo al otro",
        "Sigues porque ya estás metido/a"
      ]
    },
    {
      "id": "apm_137",
      "category": "Confesiones inocentes",
      "prompt": "¿Qué te cuesta más rechazar cuando no te apetece?",
      "options": [
        "Un plan con amigos",
        "Comida que te ofrecen",
        "Una petición de ayuda",
        "Una invitación que han preparado con ilusión"
      ]
    },
    {
      "id": "apm_138",
      "category": "Confesiones inocentes",
      "prompt": "Cuando te dicen “tenemos que hablar” sin más contexto, ¿qué piensas primero?",
      "options": [
        "Que pasa algo malo",
        "Que será una tontería",
        "Intentas adivinar qué puede ser",
        "Prefieres no pensar hasta saberlo"
      ]
    },
    {
      "id": "apm_139",
      "category": "Confesiones inocentes",
      "prompt": "Cuando te compras algo y luego dudas si debías haberlo hecho, ¿qué te dices?",
      "options": [
        "“Me lo merecía”",
        "“Lo voy a usar muchísimo”",
        "“Siempre puedo devolverlo”",
        "“Bueno, ya está hecho”"
      ]
    },
    {
      "id": "apm_140",
      "category": "Confesiones inocentes",
      "prompt": "Cuando alguien descubre una pequeña manía tuya, ¿cómo reaccionas?",
      "options": [
        "La defiendes",
        "Te ríes",
        "Dices que todo el mundo hace cosas parecidas",
        "Intentas cambiar de tema"
      ]
    },
    {
      "id": "apm_141",
      "category": "Caos y risas",
      "prompt": "¿Cuál de estos planes inesperados te haría más gracia aceptar una tarde cualquiera?",
      "options": [
        "Karaoke",
        "Bingo",
        "Recreativos",
        "Entrar en un mercadillo o tienda random sin buscar nada"
      ]
    },
    {
      "id": "apm_142",
      "category": "Caos y risas",
      "prompt": "Si acabas pidiendo algo completamente distinto de lo que creías en un restaurante, ¿qué haces?",
      "options": [
        "Te lo comes y te ríes",
        "Intentas cambiarlo",
        "Lo pruebas antes de decidir",
        "Se lo ofreces al otro y buscáis solución"
      ]
    },
    {
      "id": "apm_143",
      "category": "Caos y risas",
      "prompt": "Cuando os pasáis una salida o un giro por ir hablando, ¿qué reacción te sale más?",
      "options": [
        "Reírte",
        "Quejarte un poco",
        "Buscar ruta alternativa enseguida",
        "Decir “bueno, así vemos otra cosa”"
      ]
    },
    {
      "id": "apm_144",
      "category": "Caos y risas",
      "prompt": "Si empieza a llover y no llevas paraguas, ¿qué plan te sale más?",
      "options": [
        "Correr hasta cubierto",
        "Seguir andando y asumirlo",
        "Entrar en el primer sitio que parezca interesante",
        "Comprar un paraguas si encuentras uno"
      ]
    },
    {
      "id": "apm_145",
      "category": "Caos y risas",
      "prompt": "En unos recreativos, ¿qué máquina elegirías primero?",
      "options": [
        "Carreras",
        "Baloncesto o puntería",
        "Baile",
        "Alguna máquina absurda que no conoces"
      ]
    },
    {
      "id": "apm_146",
      "category": "Caos y risas",
      "prompt": "Si una persona desconocida empieza a contaros su vida, ¿qué haces?",
      "options": [
        "Le sigues la conversación encantado/a",
        "Escuchas por educación",
        "Intentas cerrar la charla con tacto",
        "Acabas haciendo preguntas y metiéndote más"
      ]
    },
    {
      "id": "apm_147",
      "category": "Caos y risas",
      "prompt": "¿Qué souvenir absurdo tendría más posibilidades de hacerte gracia comprar?",
      "options": [
        "Un imán horrible",
        "Una taza ridícula",
        "Una camiseta demasiado turística",
        "Un objeto que no sabes para qué sirve"
      ]
    },
    {
      "id": "apm_148",
      "category": "Caos y risas",
      "prompt": "Si veis algo curioso a cinco minutos del plan original, ¿qué haces?",
      "options": [
        "Propones desviaros",
        "Lo guardas para otro día",
        "Solo vais si al otro le apetece",
        "Le haces una foto y seguís"
      ]
    },
    {
      "id": "apm_149",
      "category": "Caos y risas",
      "prompt": "¿Qué apuesta tonta aceptarías con más facilidad?",
      "options": [
        "Quién encuentra antes algo concreto",
        "Quién aguanta más sin mirar el móvil",
        "Quién acierta qué va a pedir otra mesa",
        "Quién gana en un juego rápido"
      ]
    },
    {
      "id": "apm_150",
      "category": "Caos y risas",
      "prompt": "Si acabáis en un sitio mucho más cutre de lo esperado pero os estáis riendo, ¿qué haces?",
      "options": [
        "Te quedas y disfrutas la anécdota",
        "Propones cambiar de sitio",
        "Le das una oportunidad un rato",
        "Haces fotos porque ya es parte del recuerdo"
      ]
    }
  ],
  "rankings": [
    {
      "id": "rank_001",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos lo que más haces cuando conoces a alguien nuevo.",
      "items": [
        "Hacer preguntas",
        "Contar anécdotas",
        "Hacer bromas",
        "Escuchar y observar",
        "Buscar algo que tengáis en común"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_002",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos lo que mejor te ayuda a recuperar energía después de un día intenso.",
      "items": [
        "Dormir o tumbarte",
        "Estar a solas",
        "Hablar con alguien",
        "Salir a caminar",
        "Ver algo y desconectar"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_003",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos qué te cuesta más cuando tienes que decidir algo importante.",
      "items": [
        "Elegir entre dos buenas opciones",
        "Renunciar a una alternativa",
        "No saber qué pasará después",
        "Ignorar opiniones ajenas",
        "Dejar de darle vueltas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_004",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos qué suele influir más en tu humor durante un día normal.",
      "items": [
        "Dormir bien",
        "Tener hambre",
        "El tiempo que hace",
        "Cómo van tus planes",
        "El ambiente de la gente alrededor"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_005",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos qué papel te sale más natural cuando estás en un grupo.",
      "items": [
        "Iniciar conversaciones",
        "Escuchar",
        "Hacer bromas",
        "Organizar cosas",
        "Mediar cuando hay opiniones distintas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_006",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos qué te ayuda más a concentrarte de verdad.",
      "items": [
        "Silencio",
        "Música",
        "Tener el espacio ordenado",
        "Una lista de tareas",
        "Saber que tienes poco tiempo"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_007",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos qué notas primero al entrar en un sitio nuevo.",
      "items": [
        "La gente",
        "La decoración",
        "El ruido",
        "La luz",
        "El olor"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_008",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos qué te sale hacer cuando algo no te está saliendo bien.",
      "items": [
        "Seguir intentándolo",
        "Buscar otra forma",
        "Pedir ayuda",
        "Parar un rato",
        "Quejarte antes de seguir"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_009",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos qué disfrutas más de una mañana sin obligaciones.",
      "items": [
        "Dormir un poco más",
        "Desayunar con calma",
        "Salir a dar una vuelta",
        "No mirar la hora",
        "Hacer algo pendiente sin prisa"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_010",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos qué te molesta más cuando un plan cambia a última hora.",
      "items": [
        "Perder algo que te apetecía",
        "No saber qué hacer después",
        "Haber organizado tu tiempo para nada",
        "Tener que decidir otra vez",
        "Que nadie avise con margen"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_011",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos qué te describe mejor cuando algo te hace muchísima ilusión.",
      "items": [
        "Hablar mucho del tema",
        "Buscar información",
        "Empezar a organizarlo",
        "Imaginar cómo será",
        "Contárselo a alguien enseguida"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_012",
      "category": "Así eres tú",
      "prompt": "Ordena de más a menos qué haces cuando necesitas bajar revoluciones.",
      "items": [
        "Escuchar música",
        "Dar una vuelta",
        "Ducharte",
        "Tumbarte",
        "Hablar con alguien"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_013",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos lo que más te ayuda después de un día pesado.",
      "items": [
        "Hablar de lo que ha pasado",
        "Comer algo que te gusta",
        "Estar un rato a tu bola",
        "Salir a caminar",
        "Ver algo y desconectar"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_014",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos lo que más valoras en un regalo.",
      "items": [
        "Que sea muy personal",
        "Que sea útil",
        "Que no te lo esperes",
        "Que sea una experiencia",
        "Que sea especialmente bonito"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_015",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos lo que más pesa para ti al elegir un restaurante.",
      "items": [
        "La comida",
        "El ambiente",
        "El precio",
        "La ubicación",
        "Que sea un sitio nuevo"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_016",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué te da más sensación de “plan cómodo”.",
      "items": [
        "No tener prisa",
        "Conocer ya el sitio",
        "Poder sentarte tranquilo/a",
        "Saber que vas a comer bien",
        "No tener que organizar demasiado"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_017",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué hace que digas que sí más rápido a un plan.",
      "items": [
        "Que vaya gente que te apetece ver",
        "Que el sitio te guste",
        "Que no haya que madrugar",
        "Que sea algo diferente",
        "Que esté cerca"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_018",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué te llama antes la atención al entrar en una tienda sin buscar nada concreto.",
      "items": [
        "Ropa",
        "Zapatillas o zapatos",
        "Accesorios",
        "Cosas para casa",
        "Productos curiosos o nuevos"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_019",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué valoras en una habitación de hotel.",
      "items": [
        "Una cama cómoda",
        "Un baño bueno",
        "Buenas vistas",
        "Que sea silenciosa",
        "Que tenga espacio"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_020",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué picoteo te gana más cuando tienes hambre entre horas.",
      "items": [
        "Chocolate",
        "Patatas o algo salado",
        "Bollería",
        "Fruta",
        "Frutos secos"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_021",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué hace que vuelvas a ver una peli o serie que ya conoces.",
      "items": [
        "Te hace sentir bien",
        "Te recuerda a una época",
        "Te encanta algún personaje",
        "Es fácil de ver",
        "Quieres verla con otra persona"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_022",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué te ayuda a decidir entre dos opciones que te gustan.",
      "items": [
        "El precio",
        "La comodidad",
        "La opinión de alguien",
        "La intuición",
        "Pensar cuál vas a aprovechar más"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_023",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué te convence más para comprar una prenda.",
      "items": [
        "Que te quede muy bien",
        "Que sea cómoda",
        "Que combine con muchas cosas",
        "Que tenga buen precio",
        "Que sea diferente a lo que ya tienes"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_024",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué miras al elegir entre varias fotos parecidas.",
      "items": [
        "Tu cara",
        "La cara del otro",
        "La luz",
        "El fondo",
        "Que el momento parezca natural"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_025",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué hace que recuerdes especialmente un sitio.",
      "items": [
        "Lo bien que comiste",
        "La compañía",
        "Las vistas",
        "El ambiente",
        "Algo inesperado que pasó allí"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_026",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué hace que vuelvas a una cafetería.",
      "items": [
        "El café",
        "La comida",
        "El ambiente",
        "El trato",
        "La ubicación"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_027",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué sueles notar antes en una persona que acabas de conocer.",
      "items": [
        "Cómo habla",
        "Si hace reír",
        "Cómo trata a los demás",
        "Su forma de vestir",
        "Si transmite tranquilidad"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_028",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué te desespera más cuando estás esperando.",
      "items": [
        "No saber cuánto falta",
        "Que no contesten los mensajes",
        "Estar de pie",
        "Tener hambre",
        "No tener nada con lo que entretenerte"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_029",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué suele ganar cuando dos planes te apetecen parecido.",
      "items": [
        "El que está más cerca",
        "El que incluye mejor comida",
        "El que sale más barato",
        "El que parece más especial",
        "El que requiere menos organización"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_030",
      "category": "Te tengo calado",
      "prompt": "Ordena de más a menos qué detalle hace que un sitio te parezca acogedor.",
      "items": [
        "La iluminación",
        "La música",
        "Los asientos",
        "La decoración",
        "Que no haya demasiado ruido"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_031",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué parte de un plan juntos disfrutas más.",
      "items": [
        "Prepararos antes",
        "El camino hasta el sitio",
        "Comer o beber algo juntos",
        "Hacer la actividad o paseo",
        "La sobremesa o la vuelta a casa"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_032",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos lo que más hace que un plan juntos te parezca redondo.",
      "items": [
        "Tener buena conversación",
        "Que el sitio mole",
        "Comer bien",
        "Hacer algo diferente",
        "Estar sin prisas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_033",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué momentos juntos se te quedan más grabados.",
      "items": [
        "Los que os hacen reír muchísimo",
        "Los planes especiales",
        "Las conversaciones largas",
        "Los momentos tranquilos",
        "Las pequeñas improvisaciones"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_034",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué gesto del otro te hace más ilusión en un día normal.",
      "items": [
        "Un mensaje cariñoso",
        "Que te traiga algo que te gusta",
        "Que proponga veros",
        "Que recuerde algo que dijiste",
        "Un abrazo inesperado"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_035",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué tipo de plan os pega más cuando queréis estar tranquilos.",
      "items": [
        "Paseo",
        "Cena fuera",
        "Peli o serie",
        "Merienda o café",
        "Quedaros en casa hablando"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_036",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué convierte más fácilmente un día normal en un recuerdo bonito.",
      "items": [
        "Hacer algo inesperado",
        "Una conversación especial",
        "Descubrir un sitio",
        "Reíros mucho",
        "Hacer una foto que os encante"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_037",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué te ayuda más a arreglar el ambiente después de un pique pequeño.",
      "items": [
        "Hablarlo",
        "Un abrazo",
        "Una broma",
        "Dejar pasar un rato",
        "Hacer algo juntos con normalidad"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_038",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué pequeña cosa hace más especial estar juntos aunque no haya gran plan.",
      "items": [
        "Compartir comida",
        "Escuchar música",
        "Hablar sin mirar la hora",
        "Dar una vuelta",
        "Simplemente estar cerca"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_039",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos sobre qué os gusta más acabar hablando cuando tenéis tiempo.",
      "items": [
        "Planes futuros",
        "Recuerdos",
        "Cosas del día",
        "Gente y anécdotas",
        "Ideas random que se os ocurren"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_040",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué agradeces más del otro cuando viajáis o pasáis todo el día fuera.",
      "items": [
        "Que mantenga buen humor",
        "Que ayude a decidir",
        "Que sea flexible",
        "Que recuerde detalles prácticos",
        "Que proponga cosas nuevas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_041",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué forma de cariño disfrutas más recibir.",
      "items": [
        "Abrazos",
        "Palabras bonitas",
        "Pequeños detalles",
        "Tiempo juntos",
        "Que hagan cosas por ti"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_042",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué formato os gusta más para compartir comida.",
      "items": [
        "Pedir platos al centro",
        "Cada uno lo suyo y probar",
        "Compartir solo entrantes",
        "Compartir postre",
        "Ir de picoteo por varios sitios"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_043",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué hace más entretenido un trayecto juntos.",
      "items": [
        "Música",
        "Conversación",
        "Parar en algún sitio",
        "Comentar lo que veis",
        "Ir sin prisa"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_044",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué tipo de foto juntos te gusta más conservar.",
      "items": [
        "Una bonita y preparada",
        "Una espontánea",
        "Una haciendo el tonto",
        "Una del sitio donde estabais",
        "Una imperfecta pero con buena historia"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_045",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué tradición sencilla te gustaría repetir más entre vosotros.",
      "items": [
        "Volver a un sitio favorito",
        "Tener una comida especial de vez en cuando",
        "Hacer una escapada recurrente",
        "Guardar una foto de cada plan importante",
        "Reservar algún día solo para vosotros"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_046",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué hace que se te pase más rápido el tiempo cuando estás con el otro.",
      "items": [
        "Hablar",
        "Reír",
        "Pasear",
        "Comer juntos",
        "Hacer una actividad"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_047",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué valoras cuando el otro prepara un plan.",
      "items": [
        "Que haya pensado en tus gustos",
        "Que sea una sorpresa",
        "Que esté bien organizado",
        "Que sea algo nuevo",
        "Que sea sencillo y sin prisas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_048",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué método os funciona mejor cuando ninguno sabe qué hacer.",
      "items": [
        "Cada uno propone una opción",
        "Buscar ideas en el móvil",
        "Salir y decidir sobre la marcha",
        "Repetir un plan que sabéis que funciona",
        "Echarlo a suerte"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_049",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué tipo de cosa os hace reír más juntos.",
      "items": [
        "Chistes internos",
        "Cosas que pasan por accidente",
        "Vídeos o memes",
        "Imitar situaciones",
        "Recordar anécdotas antiguas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_050",
      "category": "Nosotros dos",
      "prompt": "Ordena de más a menos qué hace más agradable terminar un día juntos.",
      "items": [
        "Una cena tranquila",
        "Un paseo",
        "Quedaros hablando",
        "Ver algo juntos",
        "Un abrazo largo al despedirse"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_051",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos cuál de estas pequeñas molestias te fastidia más.",
      "items": [
        "Tener mucha hambre",
        "Quedarte casi sin batería",
        "Pasar demasiado calor",
        "Tener mucho ruido alrededor",
        "Esperar sin saber cuánto falta"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_052",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué cosa cotidiana te da más pereza.",
      "items": [
        "Madrugar",
        "Recoger y ordenar",
        "Hacer una maleta",
        "Responder mensajes pendientes",
        "Decidir qué cenar"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_053",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué parte de la mañana te cuesta más cuando vas con prisa.",
      "items": [
        "Levantarte",
        "Elegir ropa",
        "Desayunar",
        "Preparar lo que necesitas",
        "Salir a tiempo"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_054",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué objeto tienes más papeletas de olvidar al salir.",
      "items": [
        "Llaves",
        "Cartera",
        "Cargador",
        "Auriculares",
        "Botella de agua"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_055",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos para qué usas más el móvil cuando tienes cinco minutos muertos.",
      "items": [
        "Mensajes",
        "Redes sociales",
        "Vídeos",
        "Noticias o búsquedas",
        "Fotos y galería"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_056",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué tarea de casa te da menos pereza hacer.",
      "items": [
        "Poner una lavadora",
        "Recoger ropa",
        "Limpiar la cocina",
        "Ordenar una habitación",
        "Fregar o pasar aspiradora"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_057",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué haces más mientras esperas a alguien.",
      "items": [
        "Mirar el móvil",
        "Dar vueltas",
        "Mirar a la gente",
        "Escuchar música",
        "Escribir para preguntar cuánto falta"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_058",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué suele hacerte salir de casa más tarde de lo previsto.",
      "items": [
        "Cambiarte de ropa",
        "Buscar algo",
        "Mirar el móvil",
        "Ir al baño en el último momento",
        "Comprobar que llevas todo"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_059",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué zona del supermercado te entretiene más de la cuenta.",
      "items": [
        "Snacks",
        "Desayunos",
        "Bebidas",
        "Productos nuevos",
        "Dulces"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_060",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué intentas salvar primero cuando te queda poca batería.",
      "items": [
        "Mensajes",
        "Mapas",
        "Música",
        "Cámara",
        "Redes sociales"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_061",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué tipo de mensaje te da más pereza contestar.",
      "items": [
        "Un audio largo",
        "Un grupo con muchos mensajes",
        "Algo que exige decidir",
        "Un “tenemos que hablar”",
        "Una conversación que dejaste pendiente"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_062",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué pesa más cuando eliges qué ponerte.",
      "items": [
        "Comodidad",
        "Cómo te queda",
        "El tiempo que hace",
        "El tipo de plan",
        "Lo fácil que combina"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_063",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué te apetece picar cuando te entra hambre de repente.",
      "items": [
        "Chocolate",
        "Patatas o snacks salados",
        "Fruta",
        "Bollería",
        "Frutos secos"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_064",
      "category": "Pequeñas cosas",
      "prompt": "Ordena de más a menos qué haces más antes de dormir.",
      "items": [
        "Mirar el móvil",
        "Ver un capítulo o vídeo",
        "Hablar",
        "Preparar cosas para mañana",
        "Quedarte simplemente tumbado/a"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_065",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos estos planes según cuánto te apetecen normalmente un sábado.",
      "items": [
        "Comer fuera",
        "Dar un paseo largo",
        "Ir al cine",
        "Hacer una excursión",
        "Quedarte de sofá y peli"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_066",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué tipo de sitio elegirías para una escapada corta.",
      "items": [
        "Ciudad grande",
        "Pueblo bonito",
        "Playa",
        "Montaña",
        "Zona rural tranquila"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_067",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué comida del día disfrutas más cuando estás de viaje.",
      "items": [
        "Desayuno",
        "Aperitivo",
        "Comida",
        "Merienda",
        "Cena"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_068",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué buscas en unas vacaciones que te apetezcan de verdad.",
      "items": [
        "Descansar",
        "Comer bien",
        "Descubrir sitios",
        "Hacer actividades",
        "Tener tiempo para improvisar"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_069",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué tipo de música te apetece poner en un trayecto.",
      "items": [
        "Pop conocido",
        "Canciones nostálgicas",
        "Música muy animada",
        "Algo tranquilo",
        "Una playlist variada"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_070",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué género te apetece más para una noche de peli.",
      "items": [
        "Comedia",
        "Thriller",
        "Romance",
        "Acción",
        "Terror"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_071",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué te tienta más en una merienda.",
      "items": [
        "Tarta",
        "Bollería",
        "Helado",
        "Tostada salada",
        "Algo de fruta"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_072",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué característica te atrae de una ciudad para pasar unos días.",
      "items": [
        "Buena comida",
        "Barrios bonitos para pasear",
        "Museos y cultura",
        "Vida nocturna",
        "Naturaleza cerca"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_073",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué desayuno te apetecería más un día sin prisas.",
      "items": [
        "Tostadas",
        "Tortitas",
        "Bollería",
        "Huevos o desayuno salado",
        "Yogur y fruta"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_074",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué plan de cita sencilla te apetece más.",
      "items": [
        "Cena",
        "Merienda",
        "Paseo",
        "Cine",
        "Tomar algo con calma"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_075",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué tipo de foto te gusta más hacer durante un plan.",
      "items": [
        "De los dos",
        "Del paisaje",
        "De comida",
        "De detalles curiosos",
        "Espontáneas sin posar"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_076",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué merienda te apetecería más para sentarte un rato sin prisa.",
      "items": [
        "Café y tarta",
        "Chocolate con churros",
        "Helado",
        "Tostada y café",
        "Batido y algo dulce"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_077",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué tipo de tienda te entretiene más visitar.",
      "items": [
        "Ropa",
        "Tecnología",
        "Decoración",
        "Comida gourmet",
        "Libros o papelería"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_078",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué parte disfrutas más de un día de playa.",
      "items": [
        "Bañarte",
        "Tomar el sol",
        "Comer allí",
        "Pasear por la orilla",
        "Quedarte hasta el atardecer"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_079",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué tipo de cena te apetece más para darte un capricho.",
      "items": [
        "Sushi",
        "Hamburguesa",
        "Pizza",
        "Tapas o platos para compartir",
        "Un restaurante más especial"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_080",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué regalo te haría más ilusión recibir.",
      "items": [
        "Una experiencia",
        "Algo que llevas tiempo queriendo",
        "Algo personalizado",
        "Una sorpresa pequeña",
        "Algo útil de mucha calidad"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_081",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué plan cultural te llama más.",
      "items": [
        "Concierto",
        "Cine",
        "Museo",
        "Teatro o musical",
        "Exposición o experiencia inmersiva"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_082",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué tipo de paseo disfrutas más.",
      "items": [
        "Por naturaleza",
        "Por el centro de una ciudad",
        "Por un barrio bonito",
        "Por la playa",
        "Sin rumbo concreto"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_083",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué ambiente prefieres para cenar.",
      "items": [
        "Íntimo y tranquilo",
        "Moderno y cuidado",
        "Animado",
        "Informal",
        "Con buenas vistas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_084",
      "category": "Favoritos y preferencias",
      "prompt": "Ordena de más a menos qué hace que una canción se quede contigo.",
      "items": [
        "La letra",
        "El ritmo",
        "El recuerdo asociado",
        "La voz",
        "El estribillo"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_085",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos lo que más valoras cuando viajas.",
      "items": [
        "Comer bien",
        "Descansar",
        "Conocer muchos sitios",
        "Tener un alojamiento cómodo",
        "Tener margen para improvisar"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_086",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos lo que más buscas cuando tienes tiempo libre.",
      "items": [
        "Descansar",
        "Reírte y pasarlo bien",
        "Descubrir algo nuevo",
        "Estar con gente que quieres",
        "Sentir que has aprovechado el día"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_087",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos en qué te compensa gastar un poco más de dinero.",
      "items": [
        "Viajes",
        "Comida",
        "Ropa o calzado",
        "Tecnología",
        "Cosas para casa"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_088",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué valoras al elegir alojamiento.",
      "items": [
        "Ubicación",
        "Comodidad de la cama",
        "Precio",
        "Desayuno o servicios",
        "Diseño y vistas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_089",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué necesitas para sentir que un día libre ha merecido la pena.",
      "items": [
        "Descansar",
        "Hacer algo diferente",
        "Comer bien",
        "Ver a alguien que quieres",
        "No tener prisas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_090",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué pesa más si tienes que escoger restaurante con poco tiempo.",
      "items": [
        "Que esté cerca",
        "Que se coma bien",
        "Que tenga mesa enseguida",
        "Que tenga buen precio",
        "Que el sitio sea agradable"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_091",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué te importa más mantener en una semana normal.",
      "items": [
        "Dormir suficiente",
        "Tener ratos libres",
        "Ver a gente que quieres",
        "Llevar tus cosas al día",
        "Hacer algún plan que te ilusione"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_092",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué valoras al comprar algo que usarás mucho.",
      "items": [
        "Durabilidad",
        "Comodidad",
        "Precio",
        "Diseño",
        "Que sea fácil de mantener"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_093",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué hace atractiva una ciudad para vivir una temporada.",
      "items": [
        "Calidad de vida",
        "Oportunidades y cosas que hacer",
        "Buen clima",
        "Buena comida",
        "Facilidad para moverte"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_094",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué hace especial un plan de pareja.",
      "items": [
        "Estar sin prisas",
        "Hacer algo nuevo",
        "Tener buena conversación",
        "Comer bien",
        "Que haya algún detalle sorpresa"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_095",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué buscas al elegir un regalo importante.",
      "items": [
        "Que emocione",
        "Que sea útil",
        "Que sorprenda",
        "Que dure mucho",
        "Que tenga significado personal"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_096",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué te importa para disfrutar un fin de semana.",
      "items": [
        "Dormir bien",
        "Hacer algún plan",
        "Comer rico",
        "Tener tiempo para ti",
        "No tener horarios estrictos"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_097",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué sacrificarías menos cuando tienes un día muy lleno.",
      "items": [
        "Dormir",
        "Comer tranquilo/a",
        "Tiempo para ducharte y arreglarte",
        "Un rato de descanso",
        "Llegar con margen a los sitios"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_098",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué meterías primero en una maleta si tuvieras poco espacio.",
      "items": [
        "Ropa cómoda",
        "Calzado",
        "Neceser",
        "Cargadores",
        "Una prenda “por si acaso”"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_099",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué te importa al organizar un día de viaje.",
      "items": [
        "Ver lo imprescindible",
        "Comer en un sitio bueno",
        "No correr",
        "Dejar hueco para improvisar",
        "Volver al alojamiento con tiempo"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_100",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué pesa al escoger ropa para un plan largo.",
      "items": [
        "Comodidad",
        "Que te guste cómo te queda",
        "El clima",
        "Que aguante bien todo el día",
        "Que combine con el lugar"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_101",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué hace que una casa te parezca cómoda.",
      "items": [
        "Buena cama",
        "Sofá cómodo",
        "Buena temperatura",
        "Orden",
        "Buena luz"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_102",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué valoras al comprar tecnología.",
      "items": [
        "Que funcione bien",
        "Que dure",
        "Que sea fácil de usar",
        "El precio",
        "El diseño"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_103",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué te importa al sentarte en una cafetería.",
      "items": [
        "Poder hablar tranquilo/a",
        "Que el café esté bueno",
        "Tener un asiento cómodo",
        "Que sea bonita",
        "Que el servicio sea rápido"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_104",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué valoras al elegir cómo moveros por una ciudad.",
      "items": [
        "Rapidez",
        "Precio",
        "Comodidad",
        "No depender de horarios",
        "Poder ver cosas por el camino"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_105",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué valoras al pagar por una actividad durante un viaje.",
      "items": [
        "Que sea difícil de hacer en otro sitio",
        "Que deje un buen recuerdo",
        "Que dure bastante",
        "Que tenga buenas opiniones",
        "Que no obligue a organizar medio día alrededor"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_106",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos a qué dedicarías primero un dinero extra que no esperabas.",
      "items": [
        "Ahorrar",
        "Viajar",
        "Darte un capricho",
        "Invitar o regalar algo",
        "Mejorar algo que usas a diario"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_107",
      "category": "Prioridades",
      "prompt": "Si aparecen varias cosas compitiendo por tu fin de semana, ordénalas por la prioridad que suelen tener para ti.",
      "items": [
        "Pareja",
        "Amigos",
        "Familia",
        "Tiempo a solas",
        "Tareas pendientes"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_108",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué te hace aceptar un evento o plan con fecha cerrada.",
      "items": [
        "Que te apetezca mucho",
        "Quién va",
        "El precio",
        "La ubicación",
        "Que al día siguiente no madrugues"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_109",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué valoras en una comida especial.",
      "items": [
        "La calidad de la comida",
        "La compañía",
        "El ambiente",
        "El servicio",
        "Probar algo nuevo"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_110",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué te ayuda a organizarte sin agobiarte.",
      "items": [
        "Tener una lista",
        "Saber horarios",
        "Dejar huecos libres",
        "Preparar cosas el día anterior",
        "No tener demasiados planes"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_111",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué necesitas en una tarde libre entre semana.",
      "items": [
        "Descansar",
        "Moverte o salir",
        "Ver a alguien",
        "Hacer algo productivo",
        "Darte un capricho pequeño"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_112",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué miras al comprar una entrada para un espectáculo o actividad.",
      "items": [
        "El precio",
        "La fecha",
        "La ubicación del asiento",
        "La duración",
        "Las opiniones"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_113",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué forma de descanso te funciona mejor.",
      "items": [
        "Dormir",
        "No tener obligaciones",
        "Estar en casa",
        "Salir a caminar",
        "Desconectar del móvil"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_114",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué valoras al elegir una experiencia para hacer juntos.",
      "items": [
        "Que sea divertida",
        "Que sea nueva",
        "Que deje un buen recuerdo",
        "Que permita hablar",
        "Que no requiera demasiada organización"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_115",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué hace que una compra grande te parezca razonable.",
      "items": [
        "Que la vayas a usar mucho",
        "Que dure años",
        "Que mejore tu día a día",
        "Que tenga buen precio",
        "Que lleves tiempo queriéndola"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_116",
      "category": "Prioridades",
      "prompt": "Ordena de más a menos qué te importa cuando un plan ocupa casi todo el día.",
      "items": [
        "Tener tiempo para comer",
        "No madrugar demasiado",
        "Poder sentarte o descansar",
        "Que merezca realmente la pena",
        "Saber aproximadamente cuándo acaba"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_117",
      "category": "Confesiones inocentes",
      "prompt": "Si tuvieras que pedir una de estas cosas, ordénalas de la que más te cuesta a la que menos.",
      "items": [
        "Perdón",
        "Ayuda",
        "Un rato para ti",
        "Cariño",
        "Cambiar un plan que ya estaba decidido"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_118",
      "category": "Confesiones inocentes",
      "prompt": "Ordena de más a menos qué pequeña situación te da más vergüenza.",
      "items": [
        "Tropezar delante de gente",
        "No recordar un nombre",
        "Que te canten cumpleaños",
        "Tener que devolver algo",
        "Pedir que repitan algo varias veces"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_119",
      "category": "Confesiones inocentes",
      "prompt": "Ordena de más a menos qué “placer culpable” defenderías con menos problema.",
      "items": [
        "Canciones muy comerciales",
        "Comida infantil",
        "Reality o programa basura",
        "Dormir una siesta larguísima",
        "Ver vídeos absurdos durante demasiado rato"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_120",
      "category": "Confesiones inocentes",
      "prompt": "De estas confesiones pequeñas, ordénalas de la que más te cuesta reconocer a la que menos.",
      "items": [
        "Que te has equivocado",
        "Que estás celoso/a de una tontería",
        "Que algo te da miedo",
        "Que necesitas ayuda",
        "Que no entiendes algo"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_121",
      "category": "Confesiones inocentes",
      "prompt": "Ordena de más a menos qué pequeño fallo propio te da más rabia.",
      "items": [
        "Olvidar algo importante",
        "Llegar tarde",
        "Perder una cosa",
        "Mandar un mensaje con error",
        "Comprar algo que luego no usas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_122",
      "category": "Confesiones inocentes",
      "prompt": "Ordena de más a menos qué situación social te incomoda más.",
      "items": [
        "Llegar cuando todos están ya sentados",
        "Quedarte a solas con alguien que apenas conoces",
        "Tener que presentarte ante un grupo",
        "No saber cuándo despedirte",
        "Que haya un silencio largo"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_123",
      "category": "Confesiones inocentes",
      "prompt": "Ordénalas de la situación que más te cuesta rechazar a la que menos.",
      "items": [
        "Comida que te ofrecen",
        "Un plan con amigos",
        "Una petición de ayuda",
        "Un regalo que no te gusta",
        "Una conversación cuando tienes prisa"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_124",
      "category": "Confesiones inocentes",
      "prompt": "Ordena de más a menos qué pequeña manía tuya defenderías más.",
      "items": [
        "Tu forma de ordenar cosas",
        "Tu manera de dormir",
        "Cómo preparas alguna comida",
        "Tu rutina al salir de casa",
        "Cómo organizas el móvil"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_125",
      "category": "Confesiones inocentes",
      "prompt": "Ordena de más a menos qué te pone más nervioso/a de una sorpresa.",
      "items": [
        "No saber qué es",
        "No saber cómo reaccionarás",
        "Que haya más gente mirando",
        "No saber qué ropa llevar",
        "Tener que esperar mucho para descubrirla"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_126",
      "category": "Confesiones inocentes",
      "prompt": "Cuando algo puede esperar a mañana, ordena qué pendiente te cuesta más posponer.",
      "items": [
        "Un mensaje pendiente",
        "Una tarea doméstica",
        "Una compra necesaria",
        "Preparar algo del día siguiente",
        "Resolver una duda que te ronda"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_127",
      "category": "Confesiones inocentes",
      "prompt": "Ordena de más a menos qué te hace sentir más “me han pillado”.",
      "items": [
        "Que descubran que no sabías algo",
        "Que recuerden algo que negaste",
        "Que te vean mirando el móvil disimuladamente",
        "Que encuentren un capricho escondido",
        "Que adivinen exactamente lo que estabas pensando"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_128",
      "category": "Confesiones inocentes",
      "prompt": "Ordena de más a menos qué te cuesta más hacer cuando estás enfadado/a.",
      "items": [
        "Pedir perdón",
        "Escuchar sin interrumpir",
        "Reconocer la parte de razón del otro",
        "Dar un abrazo",
        "Dejar de darle vueltas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_129",
      "category": "Confesiones inocentes",
      "prompt": "Ordena de más a menos qué te da más pereza reconocer que necesitas.",
      "items": [
        "Dormir",
        "Comer",
        "Estar solo/a",
        "Moverte un poco",
        "Hablar con alguien"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_130",
      "category": "Confesiones inocentes",
      "prompt": "Ordena de más a menos qué comentario sobre ti te hace ponerte más colorado/a.",
      "items": [
        "Que digan que eres muy cariñoso/a",
        "Que te llamen guapo/a delante de gente",
        "Que elogien algo que haces bien",
        "Que cuenten una anécdota tierna tuya",
        "Que digan que estás enamorado/a"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_131",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos cuál de estos pequeños desastres acabaría haciéndote más gracia al recordarlo.",
      "items": [
        "Llegar al sitio equivocado",
        "Que empiece a llover sin paraguas",
        "Pedir algo pensando que era otra cosa",
        "Perderte por el camino",
        "Encontrar cerrado el sitio al que ibas"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_132",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos cuál de estos planes random aceptarías con más facilidad.",
      "items": [
        "Karaoke",
        "Minigolf",
        "Bolera",
        "Bingo",
        "Recreativos"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_133",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué suele tener más potencial para convertir un plan normal en una buena anécdota.",
      "items": [
        "Cambiar el plan sobre la marcha",
        "Conocer a alguien inesperadamente",
        "Perderos por el camino",
        "Equivocaros de sitio",
        "Hacer una apuesta tonta entre vosotros"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_134",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos en qué competición absurda te picarías más.",
      "items": [
        "Quién encuentra antes una calle",
        "Quién hace mejor una foto",
        "Quién adivina una canción antes",
        "Quién termina antes un snack",
        "Quién consigue más puntos en una máquina"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_135",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué reacción tendrías si os equivocáis de camino por bastante.",
      "items": [
        "Reírte",
        "Buscar solución inmediatamente",
        "Echar la culpa de broma al otro",
        "Aprovechar para ver dónde habéis acabado",
        "Parar a comer o beber algo antes de seguir"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_136",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué compra absurda te haría más gracia tener.",
      "items": [
        "Una taza ridícula",
        "Un peluche extraño",
        "Una camiseta turística",
        "Un imán horrible",
        "Un gadget que hace una sola cosa inútil"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_137",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué tipo de canción te atreverías antes a cantar en karaoke.",
      "items": [
        "Un clásico que conoce todo el mundo",
        "Una canción romántica",
        "Un temazo de fiesta",
        "Una canción de Disney",
        "Una canción que cantas fatal pero te encanta"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_138",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué juego de recreativos te engancharía más.",
      "items": [
        "Carreras",
        "Baloncesto",
        "Máquina de baile",
        "Hockey de aire",
        "Una máquina rara que nunca has probado"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_139",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué error de turista te daría menos vergüenza cometer.",
      "items": [
        "Pronunciar fatal un nombre",
        "Entrar por la puerta equivocada",
        "Pedir algo sin saber qué es",
        "Hacer una foto en un sitio poco interesante",
        "Confundirte de parada"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_140",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos dónde te refugiarías antes si os pilla un chaparrón sin paraguas.",
      "items": [
        "Cafetería",
        "Tienda",
        "Centro comercial",
        "Portal o soportales",
        "Seguir caminando y asumirlo"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_141",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué reto tonto aceptarías antes.",
      "items": [
        "No mirar el móvil durante una hora",
        "Hablar con un acento inventado cinco minutos",
        "Dejar que el otro elija tu snack",
        "Adivinar qué va a pedir alguien cercano",
        "Hacer una foto copiando una pose ridícula"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_142",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué tipo de foto fallida conservarías con más cariño.",
      "items": [
        "Una movida de risa",
        "Una con los ojos cerrados",
        "Una en la que alguien se cuela detrás",
        "Una pose que salió fatal",
        "Una selfie completamente torcida"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_143",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué motivo justificaría mejor desviaros del plan original.",
      "items": [
        "Un sitio con muy buena pinta",
        "Una tienda curiosa",
        "Música o ambiente en la calle",
        "Una vista bonita",
        "Olor a comida increíble"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_144",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué cosa harías antes si un artista callejero os mete en su espectáculo.",
      "items": [
        "Seguirle el juego",
        "Reírte desde tu sitio",
        "Intentar esconderte detrás del otro",
        "Grabar un poco",
        "Aplaudir esperando que no te llame otra vez"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_145",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué plan “de abuelo” te haría más gracia hacer sin ironía.",
      "items": [
        "Bingo",
        "Dominó",
        "Baile de salón",
        "Pasear mirando escaparates",
        "Merienda a las cinco en punto"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_146",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué souvenir comprarías antes por pura broma.",
      "items": [
        "Imán feísimo",
        "Gorra turística",
        "Taza con el nombre del sitio",
        "Mini monumento",
        "Llavero exagerado"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_147",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué interacción inesperada con un desconocido te haría más gracia.",
      "items": [
        "Que os recomiende un sitio",
        "Que os cuente una anécdota",
        "Que os pida hacerle una foto",
        "Que os confunda con alguien",
        "Que se una un momento a una broma"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_148",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué fallo de plan salvarías más fácilmente con buen humor.",
      "items": [
        "Que el sitio esté cerrado",
        "Que no haya reserva",
        "Que os perdáis",
        "Que llegue tarde el transporte",
        "Que haga peor tiempo del esperado"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_149",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué error al pedir comida te parecería más gracioso.",
      "items": [
        "Recibir un plato enorme sin esperarlo",
        "Pedir algo muchísimo más picante de lo pensado",
        "Confundir un entrante con un plato principal",
        "Pedir dos veces lo mismo",
        "Pronunciar fatal el nombre del plato"
      ],
      "direction": "1 = más / 5 = menos"
    },
    {
      "id": "rank_150",
      "category": "Caos y risas",
      "prompt": "Ordena de más a menos qué harías para entretenerte si tenéis que esperar mucho sin nada que hacer.",
      "items": [
        "Inventar historias sobre la gente",
        "Jugar a adivinar cosas",
        "Mirar fotos antiguas",
        "Hacer una lista absurda",
        "Buscar un juego rápido en el móvil"
      ],
      "direction": "1 = más / 5 = menos"
    }
  ]
};

  const who = source.who_of_two.map(entry => ({ ...entry }));
  const bet = source.bet_on_me.map(entry => ({ ...entry, options: [...entry.options] }));
  const ranking = source.rankings.map(entry => ({
    ...entry,
    items: [...entry.items],
    options: entry.items.map((label, index) => ({ id: `${entry.id}_${index + 1}`, label }))
  }));

  const messages = {
    match: ['Habéis coincidido ❤️', 'Aquí lo teníais clarísimo', 'Misma respuesta, misma intuición'],
    close: ['Casi', 'No estáis tan lejos', 'Os habéis quedado a medio paso'],
    opposite: ['Pensáis justo lo contrario 😂', 'Aquí hay debate', 'Esto necesita explicación'],
    hit: ['La has clavado 🎯', 'Te lo conoces demasiado bien', 'Predicción perfecta'],
    miss: ['Te ha sorprendido', 'Esa no te la esperabas', 'Hoy había giro de guion']
  };

  if (who.length !== 150 || bet.length !== 150 || ranking.length !== 150) {
    throw new Error('Entre tu y yo: distribucion editorial incorrecta');
  }

  window.JAVIEATS_BETWEEN_US = Object.freeze({
    meta: Object.freeze({ ...source.meta }),
    who,
    bet,
    ranking,
    messages
  });
})();

