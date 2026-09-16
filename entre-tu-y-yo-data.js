/* Bateria editorial de Entre tu y yo. Se genera de forma determinista y se valida al cargar. */
(() => {
  'use strict';

  const specs = [
    ['Así eres tú',28,18,12],['Te tengo calado',14,28,18],['Nosotros dos',24,16,20],
    ['Pequeñas cosas',24,22,14],['Favoritos y preferencias',12,28,20],['Prioridades',8,10,32],
    ['Confesiones inocentes',16,18,14],['Caos y risas',24,10,20]
  ];

  const themes = {
    'Así eres tú': ['empezar el día','resolver un problema','conocer gente nueva','recibir un cumplido','tener un rato a solas','organizar la semana','probar algo nuevo','defender una idea','pedir ayuda','tomar una decisión rápida','guardar un secreto','llegar a un sitio desconocido','animar a alguien','aceptar una crítica','celebrar una buena noticia','cambiar de opinión','hacer una compra importante','ponerse una meta','aprender una habilidad','elegir ropa para salir','hablar en público','preparar una sorpresa','perder la paciencia','reconocer un error','descansar de verdad','improvisar un plan','competir por diversión','hacer reír al grupo'],
    'Te tengo calado': ['una tarde libre','un desayuno especial','un domingo lluvioso','una compra impulsiva','un viaje corto','una noche de película','un regalo inesperado','un día estresante','una celebración pequeña','un restaurante nuevo','una canción pegadiza','una foto espontánea','una sobremesa larga','una siesta improvisada','un paseo sin rumbo','una llamada sorpresa','un capricho dulce','una maleta por hacer','un mensaje cariñoso','una espera larga','un cambio de planes','una tarde de compras','un día sin alarma','una visita inesperada','una serie nueva','un recuerdo bonito','una fiesta con amigos','un rato de silencio'],
    'Nosotros dos': ['elegir el próximo plan','reconciliarnos después de una tontería','decidir qué cenamos','preparar una escapada','recordar nuestra primera cita','montar una tarde en casa','hacernos una foto juntos','repartir las tareas','elegir música en el coche','celebrar un aniversario','conocer un lugar nuevo','tener una conversación pendiente','elegir un regalo para el otro','pasar un día sin móvil','organizar un fin de semana','cuidarnos cuando estamos malos','reírnos de una anécdota','decidir dónde sentarnos','compartir el último bocado','planear unas vacaciones','ver una serie juntos','guardar un recuerdo','salir con amigos','tener una cita improvisada'],
    'Pequeñas cosas': ['dejar una taza sin recoger','buscar las llaves','poner una alarma','contestar un mensaje','elegir lado de la cama','regular la temperatura','abrir una ventana','hacer la compra','doblar la ropa','poner la mesa','cargar el móvil','elegir una taza','pedir la cuenta','guardar un ticket','hacer una lista','buscar aparcamiento','elegir asiento','preparar café','dejar algo para mañana','mirar el tiempo','cambiar de canción','poner una lavadora','apagar las luces','recordar una contraseña'],
    'Favoritos y preferencias': ['elegir un postre','pedir una bebida','escoger destino de playa','ver una película','elegir música','comprar un aperitivo','escoger restaurante','elegir estación del año','pedir desayuno','escoger un color','elegir un olor','preparar una merienda','escoger un paisaje','elegir un animal','pedir una pizza','escoger una serie','elegir una ciudad','preparar una cena','escoger un helado','elegir un día festivo','comprar flores','escoger un juego','elegir un recuerdo para enmarcar','pedir comida a domicilio','escoger una ruta','elegir una prenda cómoda','preparar un picnic','escoger un concierto'],
    'Prioridades': ['tener tiempo juntos','sentir tranquilidad','cuidar la salud','ahorrar para un proyecto','ver a la familia','mantener amistades','crecer profesionalmente','viajar más','descansar bien','aprender cosas','cuidar la casa','tener libertad','crear recuerdos','cumplir una promesa','ayudar al otro','resolver lo urgente','disfrutar el presente','planear el futuro','sentirse escuchado','mantener rutinas','tener espacio propio','celebrar logros','compartir aficiones','probar experiencias','ser puntual','hacer las cosas bien','evitar discusiones inútiles','terminar lo empezado','guardar energía','decir lo que sentimos','mantener el humor','cuidar los detalles'],
    'Confesiones inocentes': ['mirar el móvil nada más despertar','comerse el último trozo','fingir que no oye la alarma','repetir una canción','ver un capítulo de más','comprar un capricho','hablar solo en casa','guardar cajas bonitas','cotillear una carta de restaurante','ensayar una conversación','poner una excusa para no salir','emocionarse con un anuncio','buscar su propio nombre','hacer una foto y no subirla','leer el final antes de tiempo','dejar un mensaje sin responder','volver a mirar una serie','cantar cuando nadie escucha'],
    'Caos y risas': ['perderse con el GPS','tropezar en público','inventar una excusa absurda','bailar sin música','confundir a una persona','quemar la cena','mandar un mensaje al chat equivocado','reírse en un momento serio','hacer una imitación','improvisar un disfraz','quedarse encerrado fuera','olvidar dónde dejó el coche','saludar a quien no era','romper algo intentando arreglarlo','montar un karaoke','contar un chiste malo','hacer una foto desastrosa','equivocarse de puerta','crear una palabra nueva','organizar una competición ridícula','hacer drama por una tontería','ponerse a cantar en el coche','convertir un fallo en anécdota','proponer un plan disparatado']
  };

  const whoTexts = {
    'Así eres tú': [
      '¿Quién arranca el día con mejor humor?','¿Quién mantiene más la calma cuando algo sale mal?','¿Quién hace amistad antes en un sitio nuevo?','¿Quién se emociona más al recibir un cumplido?','¿Quién necesita más ratos a solas para recargar pilas?','¿Quién organiza mejor su semana?','¿Quién se anima antes a probar algo nuevo?','¿Quién defiende sus ideas con más pasión?','¿Quién pide ayuda con menos rodeos?','¿Quién decide más rápido bajo presión?','¿Quién guarda mejor una sorpresa?','¿Quién se orienta mejor en un lugar desconocido?','¿Quién sabe animar mejor a alguien que está de bajón?','¿Quién encaja mejor una crítica constructiva?','¿Quién celebra una buena noticia por todo lo alto?','¿Quién cambia antes de opinión cuando ve buenos argumentos?','¿Quién compara más antes de una compra importante?','¿Quién es más constante con una meta nueva?','¿Quién aprende antes una habilidad práctica?','¿Quién tarda más en decidir qué ponerse?','¿Quién se defendería mejor hablando ante mucha gente?','¿Quién prepara sorpresas con más detalle?','¿Quién pierde antes la paciencia con una espera absurda?','¿Quién reconoce antes que se ha equivocado?','¿Quién sabe desconectar mejor sin sentirse culpable?','¿Quién improvisa mejor cuando no hay ningún plan?','¿Quién se pica más en una competición amistosa?','¿Quién hace reír al grupo sin proponérselo?'
    ],
    'Te tengo calado': [
      '¿Quién elegiría sofá antes que salir en una tarde agotadora?','¿Quién pediría algo dulce aunque dijera que no quería postre?','¿Quién se quedaría dormido antes durante una película?','¿Quién compraría un capricho y luego intentaría justificarlo?','¿Quién metería más cosas de la cuenta en una maleta?','¿Quién volvería a ver una serie que ya conoce de memoria?','¿Quién acertaría antes el regalo perfecto para el otro?','¿Quién necesita más silencio después de un día estresante?','¿Quién alargaría más una sobremesa agradable?','¿Quién elegiría siempre su plato favorito en un restaurante nuevo?','¿Quién repetiría una canción hasta cansar al otro?','¿Quién haría más fotos durante una escapada?','¿Quién propondría dar un paseo sin rumbo?','¿Quién respondería antes a un mensaje cariñoso?'
    ],
    'Nosotros dos': [
      '¿Quién suele proponer el siguiente plan juntos?','¿Quién da antes el primer paso para arreglar una discusión tonta?','¿Quién cede más veces al elegir qué cenar?','¿Quién se ilusiona antes preparando una escapada?','¿Quién recuerda más detalles de vuestra primera cita?','¿Quién convierte una tarde cualquiera en un plan especial?','¿Quién insiste más en repetir una foto de pareja?','¿Quién reparte mejor las tareas cuando hay mucho que hacer?','¿Quién acaba controlando la música en el coche?','¿Quién prepara con más ilusión un aniversario?','¿Quién propone antes conocer un sitio nuevo?','¿Quién saca antes una conversación que teníais pendiente?','¿Quién encuentra antes un regalo que encaja con el otro?','¿Quién aguantaría mejor un día entero sin móvil?','¿Quién organiza más cosas para el fin de semana?','¿Quién cuida con más mimos al otro cuando está malo?','¿Quién recuerda antes una anécdota que os hace reír?','¿Quién se acerca más al otro en una foto sin darse cuenta?','¿Quién ofrece de verdad el último bocado?','¿Quién sueña más a lo grande al planear vacaciones?','¿Quién propone seguir viendo capítulos cuando es tarde?','¿Quién guarda más entradas, notas o pequeños recuerdos?','¿Quién anima antes al otro a salir con amigos?','¿Quién montaría una cita improvisada con cuatro cosas?'
    ],
    'Pequeñas cosas': [
      '¿Quién deja más veces una taza pendiente de recoger?','¿Quién encuentra antes unas llaves perdidas?','¿Quién pone más alarmas para despertarse?','¿Quién responde antes los mensajes importantes?','¿Quién defiende más su lado de la cama?','¿Quién nota antes que la habitación está demasiado fría?','¿Quién abre una ventana nada más llegar a casa?','¿Quién recuerda mejor lo que falta en la compra?','¿Quién dobla la ropa con más paciencia?','¿Quién pone la mesa sin que se lo pidan?','¿Quién llega más veces al final del día con poca batería?','¿Quién tiene una taza favorita más intocable?','¿Quién pide antes la cuenta en un restaurante?','¿Quién guarda tickets que ya no sirven?','¿Quién hace listas hasta para cosas pequeñas?','¿Quién pierde antes la paciencia buscando aparcamiento?','¿Quién escoge asiento nada más entrar?','¿Quién prepara mejor el café del otro?','¿Quién deja más cosas para mañana?','¿Quién consulta más veces el tiempo antes de salir?','¿Quién cambia antes una canción que no le convence?','¿Quién se acuerda antes de poner una lavadora?','¿Quién vuelve a comprobar si apagó las luces?','¿Quién recuerda más contraseñas sin ayuda?'
    ],
    'Favoritos y preferencias': [
      '¿Quién elegiría un postre de chocolate antes que uno de fruta?','¿Quién pediría antes una bebida que nunca ha probado?','¿Quién prefiere más un día de playa que uno de montaña?','¿Quién escogería una comedia para ver juntos?','¿Quién se adueña antes de la música del viaje?','¿Quién elegiría algo salado antes que algo dulce?','¿Quién arriesga más al pedir en un restaurante?','¿Quién disfruta más del otoño que del verano?','¿Quién convertiría el desayuno en la mejor comida del día?','¿Quién tiene más claro cuál es su color favorito?','¿Quién se fija más en que un sitio huela bien?','¿Quién disfruta más preparando una merienda especial?'
    ],
    'Prioridades': [
      '¿Quién protege más el tiempo de calidad juntos?','¿Quién prioriza antes la tranquilidad que un plan espectacular?','¿Quién se toma más en serio descansar bien?','¿Quién piensa más en ahorrar para proyectos compartidos?','¿Quién hace más hueco para ver a la familia?','¿Quién cuida más mantener el contacto con sus amigos?','¿Quién pone más energía en crecer profesionalmente?','¿Quién sacrificaría antes comodidad por viajar más?'
    ],
    'Confesiones inocentes': [
      '¿Quién mira antes el móvil al despertarse?','¿Quién se comería el último trozo sin preguntar dos veces?','¿Quién finge más veces no haber oído la alarma?','¿Quién escucha una canción favorita en bucle?','¿Quién cae antes en ver un capítulo más?','¿Quién compra más caprichos pequeños?','¿Quién habla más consigo mismo cuando está solo?','¿Quién guarda cajas bonitas por si algún día sirven?','¿Quién cotillea toda la carta antes de decidir?','¿Quién ensaya mentalmente una conversación importante?','¿Quién inventa antes una excusa para cancelar un plan?','¿Quién se emociona más con un anuncio bonito?','¿Quién ha buscado más veces su propio nombre en internet?','¿Quién hace más fotos que nunca llega a publicar?','¿Quién mira antes el final de algo por impaciencia?','¿Quién deja más mensajes para responder luego?'
    ],
    'Caos y risas': [
      '¿Quién acabaría perdido incluso siguiendo el GPS?','¿Quién tropieza más en el peor momento posible?','¿Quién inventaría la excusa más absurda sobre la marcha?','¿Quién empezaría a bailar aunque no hubiera música?','¿Quién saludaría con más seguridad a alguien que no conoce?','¿Quién tiene más papeletas de quemar la cena por distraerse?','¿Quién mandaría un mensaje al chat equivocado?','¿Quién se reiría antes en un momento demasiado serio?','¿Quién hace las imitaciones más reconocibles?','¿Quién improvisaría mejor un disfraz con cosas de casa?','¿Quién se dejaría las llaves dentro?','¿Quién olvidaría antes dónde dejó el coche?','¿Quién mantendría más tiempo una conversación con la persona equivocada?','¿Quién rompería algo intentando arreglarlo?','¿Quién montaría antes un karaoke sin que nadie lo pidiera?','¿Quién cuenta más chistes malos con orgullo?','¿Quién sale peor en las fotos espontáneas?','¿Quién se equivocaría de puerta con más naturalidad?','¿Quién inventa más palabras que solo entendéis vosotros?','¿Quién convertiría cualquier juego en una competición ridícula?','¿Quién haría más drama por una tontería doméstica?','¿Quién canta con más entusiasmo en el coche?','¿Quién convierte antes un desastre en una buena anécdota?','¿Quién propondría el plan más disparatado solo por reíros?'
    ]
  };

  const categoryChoices = {
    'Así eres tú': [
      ['Con calma','Con decisión','Con humor','Pidiendo opinión'],['Se lanza','Lo piensa mucho','Busca compañía','Lo aplaza'],['Por intuición','Con una lista','Comparando opciones','Improvisando'],['Habla claro','Escucha primero','Le quita hierro','Busca una solución'],['Se entusiasma','Mantiene la calma','Se pone exigente','Se adapta']
    ],
    'Te tengo calado': [
      ['Plan fuera de casa','Sofá y manta','Algo rico','Lo que surja'],['Su opción de siempre','Probar algo nuevo','La opción cómoda','Dejar que el otro elija'],['Prepararlo con tiempo','Decidir en el momento','Preguntar recomendaciones','Repetir un favorito'],['Algo tranquilo','Algo especial','Algo divertido','Nada de planes'],['Darse un capricho','Guardarlo para después','Compartirlo','Decir que no y caer igual']
    ],
    'Nosotros dos': [
      ['Hablarlo juntos','Tomar la iniciativa','Turnarnos','Echarlo a suertes'],['Plan romántico','Plan divertido','Plan tranquilo','Plan improvisado'],['Cuidar el detalle','Buscar comodidad','Crear una sorpresa','Ir a lo sencillo'],['Decidir rápido','Comparar ideas','Ceder al otro','Mezclar las dos propuestas'],['Hacerlo en equipo','Repartir tareas','Que lo lidere el otro','Resolverlo sobre la marcha']
    ],
    'Pequeñas cosas': [
      ['Hacerlo al momento','Dejarlo para luego','Pedir ayuda','Esperar que se resuelva solo'],['Seguir una rutina','Improvisar','Hacer una lista','Copiar al otro'],['Elegir lo práctico','Elegir lo bonito','Elegir lo de siempre','No darle importancia'],['Revisarlo dos veces','Confiar en la memoria','Apuntarlo','Preguntar al otro'],['Tomárselo con calma','Quejarse un poco','Reírse','Solucionarlo rápido']
    ],
    'Favoritos y preferencias': [
      ['El clásico de siempre','Una novedad','Lo más bonito','Lo que recomiende el otro'],['Algo dulce','Algo salado','Algo ligero','Un capricho completo'],['La opción tranquila','La opción animada','La opción romántica','La opción aventurera'],['Elegir por el sabor','Elegir por el ambiente','Elegir por comodidad','Elegir por sorpresa'],['Repetir un favorito','Descubrir algo','Compartir dos opciones','Dejarse aconsejar']
    ],
    'Prioridades': [
      ['Protegerlo siempre','Buscar equilibrio','Adaptarlo al momento','Ceder si hace falta'],['Pensar a largo plazo','Disfrutar el presente','Hablarlo juntos','Decidir según la situación'],['Tiempo','Tranquilidad','Seguridad','Libertad'],['Cumplir el plan','Cuidar a las personas','Evitar estrés','Aprovechar la oportunidad'],['Resolver lo urgente','Mantener el compromiso','Escuchar lo que necesita','Buscar un punto medio']
    ],
    'Confesiones inocentes': [
      ['Admitirlo riéndose','Negarlo un poco','Echarle la culpa al momento','Confesar que lo hace siempre'],['Decir “solo esta vez”','Prometer que es la última','Invitar al otro a hacerlo','No arrepentirse nada'],['Contarlo enseguida','Esperar a que se note','Guardárselo','Convertirlo en broma'],['Sentir un poco de culpa','Disfrutarlo sin culpa','Intentar compensarlo','Hacer como si nada'],['Repetirlo mañana','Poner un límite','Compartir el secreto','Cambiar de costumbre']
    ],
    'Caos y risas': [
      ['Reírse primero','Intentar disimular','Buscar una solución','Hacer el drama completo'],['Pedir ayuda','Improvisar','Culpar a la mala suerte','Convertirlo en una historia'],['Salir corriendo','Mantener la dignidad','Grabar el momento','Arrastrar al otro al caos'],['Arreglarlo como pueda','Empezar de nuevo','Fingir que era intencionado','Celebrar el desastre'],['Ponerse nervioso','Quedarse muy serio','Soltar un chiste','Resolverlo sorprendentemente bien']
    ]
  };

  const categoryRanks = {
    'Así eres tú': [['Calma','Iniciativa','Humor','Paciencia','Creatividad'],['Seguridad','Curiosidad','Constancia','Flexibilidad','Valentía'],['Pensarlo','Actuar','Preguntar','Observar','Improvisar']],
    'Te tengo calado': [['Comodidad','Diversión','Sorpresa','Calidad','Buen ambiente'],['Su favorito','Una novedad','Algo compartido','Un capricho','Lo más práctico'],['Plan tranquilo','Plan espontáneo','Plan especial','Plan activo','No hacer nada']],
    'Nosotros dos': [['Complicidad','Risas','Calma','Sorpresa','Tiempo sin prisa'],['Hablar','Escuchar','Abrazar','Dar espacio','Hacer reír'],['Organizar','Improvisar','Compartir','Descubrir','Recordar']],
    'Pequeñas cosas': [['Hacerlo ya','Apuntarlo','Pedir ayuda','Improvisar','Dejarlo para luego'],['Rapidez','Orden','Comodidad','Costumbre','Buen humor'],['Revisar','Recordar','Preguntar','Resolver','Reírse']],
    'Favoritos y preferencias': [['Sabor','Ambiente','Comodidad','Novedad','Precio'],['Dulce','Salado','Clásico','Original','Para compartir'],['Tranquilo','Animado','Romántico','Aventurero','Improvisado']],
    'Prioridades': [['Tiempo juntos','Salud','Familia','Trabajo','Descanso'],['Tranquilidad','Libertad','Seguridad','Crecimiento','Diversión'],['Presente','Futuro','Compromisos','Personas','Experiencias']],
    'Confesiones inocentes': [['Confesarlo','Disimular','Reírse','Compensarlo','Repetirlo'],['Culpa','Capricho','Curiosidad','Costumbre','Diversión'],['Contarlo','Guardarlo','Compartirlo','Cambiarlo','Asumirlo']],
    'Caos y risas': [['Reírse','Disimular','Arreglarlo','Pedir ayuda','Salir corriendo'],['Improvisar','Mantener la calma','Hacer drama','Grabarlo','Contarlo después'],['Rapidez','Ingenio','Suerte','Ayuda del otro','Sentido del humor']]
  };

  const betPrompt = {
    'Así eres tú': theme => `Cuando toca ${theme}, ¿qué estilo encaja más con {name}?`,
    'Te tengo calado': theme => `Pensando en ${theme}, ¿qué elegiría {name}?`,
    'Nosotros dos': theme => `Cuando pensáis en ${theme}, ¿qué preferiría {name}?`,
    'Pequeñas cosas': theme => `Con algo tan cotidiano como ${theme}, ¿qué haría {name}?`,
    'Favoritos y preferencias': theme => `Si pudiera ${theme}, ¿qué escogería {name}?`,
    'Prioridades': theme => `Al hablar de ${theme}, ¿qué postura representa mejor a {name}?`,
    'Confesiones inocentes': theme => `Si {name} confesara lo de ${theme}, ¿qué diría?`,
    'Caos y risas': theme => `Si {name} acaba por ${theme}, ¿cómo reaccionaría?`
  };
  const rankPrompt = {
    'Así eres tú': theme => `Ordena de más a menos lo que valoras al ${theme}.`,
    'Te tengo calado': theme => `Pensando en ${theme}, ordena estas opciones de favorita a última.`,
    'Nosotros dos': theme => `Ordena lo que más suma para vosotros al ${theme}.`,
    'Pequeñas cosas': theme => `Ante algo cotidiano como ${theme}, ordena qué valoras más.`,
    'Favoritos y preferencias': theme => `Al ${theme}, ordena lo que más influye en tu elección.`,
    'Prioridades': theme => `Pensando en ${theme}, ordena lo que más pesa para ti.`,
    'Confesiones inocentes': theme => `Pensando en ${theme}, ordena estas reacciones de más a menos probable.`,
    'Caos y risas': theme => `Si toca ${theme}, ordena cómo preferirías salir del paso.`
  };

  const makeOptions = values => values.map((label, index) => ({ id: `o${index + 1}`, label }));
  const who = [], bet = [], ranking = [];
  specs.forEach(([category, whoCount, betCount, rankCount], categoryIndex) => {
    const list = themes[category];
    for (let i = 0; i < whoCount; i += 1) who.push({ id: `w-${categoryIndex + 1}-${i + 1}`, category, prompt: whoTexts[category][i] });
    for (let i = 0; i < betCount; i += 1) bet.push({ id: `b-${categoryIndex + 1}-${i + 1}`, category, prompt: betPrompt[category](list[i]), options: [...categoryChoices[category][i % categoryChoices[category].length]] });
    for (let i = 0; i < rankCount; i += 1) ranking.push({ id: `r-${categoryIndex + 1}-${i + 1}`, category, prompt: rankPrompt[category](list[i]), options: makeOptions(categoryRanks[category][i % categoryRanks[category].length]) });
  });

  const messages = {
    match: ['Habéis coincidido ❤️','Aquí lo teníais clarísimo','Misma respuesta, misma intuición'],
    close: ['Casi','No estáis tan lejos','Os habéis quedado a medio paso'],
    opposite: ['Pensáis justo lo contrario 😂','Aquí hay debate','Esto necesita explicación'],
    hit: ['La has clavado 🎯','Te lo conoces demasiado bien','Predicción perfecta'],
    miss: ['Te ha sorprendido','Esa no te la esperabas','Hoy había giro de guion']
  };

  if (who.length !== 150 || bet.length !== 150 || ranking.length !== 150) throw new Error('Entre tu y yo: distribucion editorial incorrecta');
  window.JAVIEATS_BETWEEN_US = Object.freeze({ who, bet, ranking, messages });
})();
