/* JaviEats v2.7 · Baterías completas de Minijuegos
   225 conceptos dibujables + 225 cartas de No lo digas.
   Este archivo contiene solo datos; toda la lógica vive en minigames.js. */

window.JAVIEATS_DRAW_SECTIONS = [
  {
    "id": "futbol",
    "emoji": "⚽",
    "title": "Fútbol",
    "subtitle": "Territorio Javi · conceptos visuales",
    "cards": [
      "Balón de fútbol",
      "Portería",
      "Penalti",
      "Árbitro",
      "Tarjeta roja",
      "Tarjeta amarilla",
      "Copa del Mundo",
      "Trofeo de fútbol",
      "Estadio",
      "Banquillo",
      "Portero",
      "Chilena",
      "Córner",
      "Falta",
      "Saque de banda",
      "Botas de fútbol",
      "Guantes de portero",
      "Marcador",
      "Entrenamiento de fútbol",
      "Afición",
      "Brazalete de capitán",
      "Barrera en una falta",
      "Celebración de gol",
      "Fuera de juego",
      "VAR"
    ]
  },
  {
    "id": "pop-disney",
    "emoji": "✨",
    "title": "Pop & Disney",
    "subtitle": "Territorio Laura · personajes muy reconocibles",
    "cards": [
      "Rapunzel",
      "Stitch",
      "Mickey Mouse",
      "Minnie Mouse",
      "Olaf",
      "Elsa",
      "Simba",
      "Genio de Aladdín",
      "Ariel",
      "Buzz Lightyear",
      "Woody",
      "Rayo McQueen",
      "Nemo",
      "Dory",
      "Sulley",
      "Mike Wazowski",
      "Dumbo",
      "Aladdín",
      "Pinocho",
      "Peter Pan",
      "Campanilla",
      "Vaiana",
      "Blancanieves",
      "Cenicienta",
      "Mulan"
    ]
  },
  {
    "id": "series",
    "emoji": "📺",
    "title": "Series & TV",
    "subtitle": "Títulos y personajes fáciles de representar",
    "cards": [
      "Los Simpson",
      "Bob Esponja",
      "La Casa de Papel",
      "Prison Break",
      "Stranger Things",
      "Miércoles",
      "Juego de Tronos",
      "The Walking Dead",
      "El juego del calamar",
      "Pokémon",
      "Doraemon",
      "Peppa Pig",
      "South Park",
      "Tom y Jerry",
      "Scooby-Doo",
      "Padre de familia",
      "Breaking Bad",
      "Los Picapiedra",
      "La Pantera Rosa",
      "Dragon Ball",
      "Las Supernenas",
      "Los Teletubbies",
      "La Patrulla Canina",
      "Mr. Bean",
      "La que se avecina"
    ]
  },
  {
    "id": "peliculas",
    "emoji": "🎬",
    "title": "Películas",
    "subtitle": "Cine muy visual y reconocible",
    "cards": [
      "Titanic",
      "Shrek",
      "Jurassic Park",
      "Tiburón",
      "E.T.",
      "Cazafantasmas",
      "El Grinch",
      "Star Wars",
      "Piratas del Caribe",
      "101 Dálmatas",
      "Jumanji",
      "Up",
      "Ratatouille",
      "Matrix",
      "Rocky",
      "Barbie",
      "Los Minions",
      "Coco",
      "Ice Age",
      "Kung Fu Panda",
      "Madagascar",
      "Buscando a Nemo",
      "El Rey León",
      "Toy Story",
      "Regreso al futuro"
    ]
  },
  {
    "id": "musica",
    "emoji": "🎵",
    "title": "Música",
    "subtitle": "Cosas que se pueden dibujar de verdad",
    "cards": [
      "Micrófono",
      "Guitarra",
      "Piano",
      "Batería",
      "Auriculares",
      "Altavoz",
      "DJ",
      "Concierto",
      "Festival de música",
      "Disco de vinilo",
      "Karaoke",
      "Trompeta",
      "Saxofón",
      "Violín",
      "Maracas",
      "Flauta",
      "Nota musical",
      "Álbum de música",
      "Tocadiscos",
      "Bailar",
      "Cantante",
      "Escenario",
      "Partitura",
      "Teclado musical",
      "Grammy"
    ]
  },
  {
    "id": "sagas",
    "emoji": "🦸",
    "title": "Héroes & Sagas",
    "subtitle": "Personajes con una silueta o símbolo claro",
    "cards": [
      "Spider-Man",
      "Iron Man",
      "Hulk",
      "Thor",
      "Capitán América",
      "Thanos",
      "Wolverine",
      "Deadpool",
      "Groot",
      "Batman",
      "Superman",
      "Wonder Woman",
      "Darth Vader",
      "Yoda",
      "Harry Potter",
      "Voldemort",
      "Jack Sparrow",
      "Gollum",
      "Sonic",
      "Mario Bros",
      "Lara Croft",
      "Indiana Jones",
      "Optimus Prime",
      "Godzilla",
      "King Kong"
    ]
  },
  {
    "id": "casa-comida",
    "emoji": "🍕",
    "title": "Comida & Casa",
    "subtitle": "Objetos cotidianos y comida",
    "cards": [
      "Pizza",
      "Hamburguesa",
      "Kebab",
      "Paella",
      "Sushi",
      "Croissant",
      "Helado",
      "Palomitas",
      "Huevo frito",
      "Espaguetis",
      "Tortilla de patatas",
      "Taza de café",
      "Sofá",
      "Cama",
      "Ducha",
      "Lavadora",
      "Nevera",
      "Aspiradora",
      "Inodoro",
      "Lámpara",
      "Llave",
      "Puerta",
      "Tostadora",
      "Microondas",
      "Paraguas"
    ]
  },
  {
    "id": "internet-juegos",
    "emoji": "🎮",
    "title": "Internet & Juegos",
    "subtitle": "Pantallas, videojuegos y símbolos conocidos",
    "cards": [
      "Mando de PlayStation",
      "Nintendo Switch",
      "Super Mario",
      "Luigi",
      "Pikachu",
      "Minecraft",
      "Fortnite",
      "GTA",
      "Among Us",
      "Pac-Man",
      "Tetris",
      "WhatsApp",
      "Instagram",
      "TikTok",
      "YouTube",
      "Selfie",
      "Emoji",
      "Wi-Fi",
      "Código QR",
      "Ordenador portátil",
      "Teléfono móvil",
      "Robot",
      "Realidad virtual",
      "Videollamada",
      "Twitch"
    ]
  },
  {
    "id": "mix",
    "emoji": "🎲",
    "title": "Mix",
    "subtitle": "Cosas fáciles, pero puede salir de todo",
    "cards": [
      "Avión",
      "Playa",
      "Camping",
      "Boda",
      "Cumpleaños",
      "Gimnasio",
      "Discoteca",
      "Taxi",
      "Metro",
      "Hospital",
      "Policía",
      "Bombero",
      "Pirata",
      "Astronauta",
      "Dinosaurio",
      "Fantasma",
      "Alien",
      "Volcán",
      "Arcoíris",
      "Muñeco de nieve",
      "Bicicleta",
      "Montaña rusa",
      "Castillo",
      "Isla desierta",
      "Coche de carreras"
    ]
  }
];

window.JAVIEATS_TABOO_SECTIONS = [
  {
    "id": "futbol",
    "emoji": "⚽",
    "title": "Fútbol",
    "cards": [
      {
        "word": "Kylian Mbappé",
        "banned": [
          "Real Madrid",
          "Francia",
          "delantero"
        ]
      },
      {
        "word": "Lamine Yamal",
        "banned": [
          "Barcelona",
          "España",
          "joven"
        ]
      },
      {
        "word": "Cristiano Ronaldo",
        "banned": [
          "Portugal",
          "Real Madrid",
          "Messi"
        ]
      },
      {
        "word": "Lionel Messi",
        "banned": [
          "Argentina",
          "Barcelona",
          "Cristiano"
        ]
      },
      {
        "word": "Vinícius Jr.",
        "banned": [
          "Real Madrid",
          "Brasil",
          "extremo"
        ]
      },
      {
        "word": "Erling Haaland",
        "banned": [
          "Manchester City",
          "Noruega",
          "delantero"
        ]
      },
      {
        "word": "Jude Bellingham",
        "banned": [
          "Real Madrid",
          "Inglaterra",
          "centrocampista"
        ]
      },
      {
        "word": "Rodri",
        "banned": [
          "Manchester City",
          "España",
          "Balón de Oro"
        ]
      },
      {
        "word": "Antoine Griezmann",
        "banned": [
          "Atlético de Madrid",
          "Francia",
          "delantero"
        ]
      },
      {
        "word": "Pedri",
        "banned": [
          "Barcelona",
          "Canarias",
          "centrocampista"
        ]
      },
      {
        "word": "Neymar",
        "banned": [
          "Brasil",
          "PSG",
          "Barcelona"
        ]
      },
      {
        "word": "Robert Lewandowski",
        "banned": [
          "Barcelona",
          "Polonia",
          "delantero"
        ]
      },
      {
        "word": "Sergio Ramos",
        "banned": [
          "defensa",
          "Real Madrid",
          "Sevilla"
        ]
      },
      {
        "word": "Luka Modrić",
        "banned": [
          "Croacia",
          "Real Madrid",
          "centrocampista"
        ]
      },
      {
        "word": "Andrés Iniesta",
        "banned": [
          "España",
          "Barcelona",
          "Mundial"
        ]
      },
      {
        "word": "Pep Guardiola",
        "banned": [
          "entrenador",
          "Manchester City",
          "Barcelona"
        ]
      },
      {
        "word": "José Mourinho",
        "banned": [
          "entrenador",
          "Real Madrid",
          "Portugal"
        ]
      },
      {
        "word": "Diego Simeone",
        "banned": [
          "Atlético de Madrid",
          "entrenador",
          "Cholo"
        ]
      },
      {
        "word": "Carlo Ancelotti",
        "banned": [
          "entrenador",
          "Real Madrid",
          "italiano"
        ]
      },
      {
        "word": "Real Madrid",
        "banned": [
          "Bernabéu",
          "blanco",
          "Champions"
        ]
      },
      {
        "word": "FC Barcelona",
        "banned": [
          "Camp Nou",
          "azulgrana",
          "Cataluña"
        ]
      },
      {
        "word": "Atlético de Madrid",
        "banned": [
          "Metropolitano",
          "Simeone",
          "rojiblanco"
        ]
      },
      {
        "word": "Champions League",
        "banned": [
          "Europa",
          "orejona",
          "clubes"
        ]
      },
      {
        "word": "Copa del Mundo",
        "banned": [
          "selecciones",
          "Mundial",
          "FIFA"
        ]
      },
      {
        "word": "VAR",
        "banned": [
          "árbitro",
          "vídeo",
          "revisión"
        ]
      }
    ]
  },
  {
    "id": "pop-disney",
    "emoji": "✨",
    "title": "Pop & Disney",
    "cards": [
      {
        "word": "TINI",
        "banned": [
          "Violetta",
          "Argentina",
          "cantante"
        ]
      },
      {
        "word": "Violetta",
        "banned": [
          "Disney",
          "TINI",
          "serie"
        ]
      },
      {
        "word": "Emilia",
        "banned": [
          "Argentina",
          "cantante",
          "TINI"
        ]
      },
      {
        "word": "Justin Bieber",
        "banned": [
          "Canadá",
          "Baby",
          "Hailey"
        ]
      },
      {
        "word": "Rapunzel",
        "banned": [
          "Enredados",
          "pelo",
          "princesa"
        ]
      },
      {
        "word": "Flynn Rider",
        "banned": [
          "Enredados",
          "Rapunzel",
          "ladrón"
        ]
      },
      {
        "word": "Stitch",
        "banned": [
          "Lilo",
          "azul",
          "alien"
        ]
      },
      {
        "word": "Elsa",
        "banned": [
          "Frozen",
          "hielo",
          "Anna"
        ]
      },
      {
        "word": "Olaf",
        "banned": [
          "Frozen",
          "muñeco de nieve",
          "Elsa"
        ]
      },
      {
        "word": "Simba",
        "banned": [
          "El Rey León",
          "Mufasa",
          "león"
        ]
      },
      {
        "word": "Genio",
        "banned": [
          "Aladdín",
          "lámpara",
          "azul"
        ]
      },
      {
        "word": "Ariel",
        "banned": [
          "La Sirenita",
          "mar",
          "pelirroja"
        ]
      },
      {
        "word": "Buzz Lightyear",
        "banned": [
          "Toy Story",
          "espacio",
          "Woody"
        ]
      },
      {
        "word": "Woody",
        "banned": [
          "Toy Story",
          "vaquero",
          "Buzz"
        ]
      },
      {
        "word": "Rayo McQueen",
        "banned": [
          "Cars",
          "coche",
          "carreras"
        ]
      },
      {
        "word": "Hannah Montana",
        "banned": [
          "Miley Cyrus",
          "Disney",
          "doble vida"
        ]
      },
      {
        "word": "High School Musical",
        "banned": [
          "Troy",
          "Gabriella",
          "Disney"
        ]
      },
      {
        "word": "Camp Rock",
        "banned": [
          "Demi Lovato",
          "Jonas Brothers",
          "Disney"
        ]
      },
      {
        "word": "Miley Cyrus",
        "banned": [
          "Hannah Montana",
          "cantante",
          "Disney"
        ]
      },
      {
        "word": "Selena Gomez",
        "banned": [
          "Disney",
          "cantante",
          "Wizards"
        ]
      },
      {
        "word": "Demi Lovato",
        "banned": [
          "Camp Rock",
          "Disney",
          "cantante"
        ]
      },
      {
        "word": "Jonas Brothers",
        "banned": [
          "hermanos",
          "Disney",
          "banda"
        ]
      },
      {
        "word": "Mickey Mouse",
        "banned": [
          "Disney",
          "ratón",
          "Minnie"
        ]
      },
      {
        "word": "Cenicienta",
        "banned": [
          "princesa",
          "zapatilla",
          "medianoche"
        ]
      },
      {
        "word": "Vaiana",
        "banned": [
          "Disney",
          "océano",
          "Maui"
        ]
      }
    ]
  },
  {
    "id": "series",
    "emoji": "📺",
    "title": "Series",
    "cards": [
      {
        "word": "La Casa de Papel",
        "banned": [
          "atraco",
          "Profesor",
          "Netflix"
        ]
      },
      {
        "word": "El Profesor",
        "banned": [
          "La Casa de Papel",
          "Sergio",
          "atraco"
        ]
      },
      {
        "word": "Tokio",
        "banned": [
          "La Casa de Papel",
          "Úrsula Corberó",
          "narradora"
        ]
      },
      {
        "word": "Berlín",
        "banned": [
          "La Casa de Papel",
          "Profesor",
          "Andrés"
        ]
      },
      {
        "word": "Nairobi",
        "banned": [
          "La Casa de Papel",
          "Alba Flores",
          "dinero"
        ]
      },
      {
        "word": "Río",
        "banned": [
          "La Casa de Papel",
          "Tokio",
          "hacker"
        ]
      },
      {
        "word": "Outer Banks",
        "banned": [
          "Pogues",
          "tesoro",
          "John B"
        ]
      },
      {
        "word": "John B",
        "banned": [
          "Outer Banks",
          "Sarah",
          "Pogues"
        ]
      },
      {
        "word": "Sarah Cameron",
        "banned": [
          "Outer Banks",
          "John B",
          "Cameron"
        ]
      },
      {
        "word": "JJ Maybank",
        "banned": [
          "Outer Banks",
          "Pogues",
          "John B"
        ]
      },
      {
        "word": "Rafe Cameron",
        "banned": [
          "Outer Banks",
          "Sarah",
          "Cameron"
        ]
      },
      {
        "word": "Kiara",
        "banned": [
          "Outer Banks",
          "Pogues",
          "Kie"
        ]
      },
      {
        "word": "Prison Break",
        "banned": [
          "cárcel",
          "fuga",
          "Michael Scofield"
        ]
      },
      {
        "word": "Michael Scofield",
        "banned": [
          "Prison Break",
          "tatuaje",
          "Lincoln"
        ]
      },
      {
        "word": "Lincoln Burrows",
        "banned": [
          "Prison Break",
          "Michael",
          "hermano"
        ]
      },
      {
        "word": "Vis a Vis",
        "banned": [
          "cárcel",
          "Macarena",
          "Zulema"
        ]
      },
      {
        "word": "Zulema",
        "banned": [
          "Vis a Vis",
          "Najwa Nimri",
          "presa"
        ]
      },
      {
        "word": "Gossip Girl",
        "banned": [
          "Blair",
          "Serena",
          "Nueva York"
        ]
      },
      {
        "word": "Blair Waldorf",
        "banned": [
          "Gossip Girl",
          "Serena",
          "Upper East Side"
        ]
      },
      {
        "word": "Breaking Bad",
        "banned": [
          "Walter White",
          "metanfetamina",
          "química"
        ]
      },
      {
        "word": "Walter White",
        "banned": [
          "Breaking Bad",
          "Heisenberg",
          "profesor"
        ]
      },
      {
        "word": "Stranger Things",
        "banned": [
          "Once",
          "Hawkins",
          "Demogorgon"
        ]
      },
      {
        "word": "Miércoles",
        "banned": [
          "Addams",
          "Netflix",
          "Thing"
        ]
      },
      {
        "word": "Los Simpson",
        "banned": [
          "Homer",
          "Springfield",
          "amarillos"
        ]
      },
      {
        "word": "La que se avecina",
        "banned": [
          "Montepinár",
          "vecinos",
          "Antonio Recio"
        ]
      }
    ]
  },
  {
    "id": "peliculas",
    "emoji": "🎬",
    "title": "Películas",
    "cards": [
      {
        "word": "Titanic",
        "banned": [
          "barco",
          "iceberg",
          "Jack"
        ]
      },
      {
        "word": "Shrek",
        "banned": [
          "ogro",
          "Fiona",
          "Burro"
        ]
      },
      {
        "word": "Jurassic Park",
        "banned": [
          "dinosaurios",
          "isla",
          "Spielberg"
        ]
      },
      {
        "word": "Avatar",
        "banned": [
          "Pandora",
          "Na'vi",
          "azul"
        ]
      },
      {
        "word": "Gladiator",
        "banned": [
          "Roma",
          "Máximo",
          "coliseo"
        ]
      },
      {
        "word": "Matrix",
        "banned": [
          "Neo",
          "pastilla",
          "realidad"
        ]
      },
      {
        "word": "Rocky",
        "banned": [
          "boxeo",
          "Stallone",
          "Filadelfia"
        ]
      },
      {
        "word": "Solo en casa",
        "banned": [
          "Kevin",
          "Navidad",
          "ladrones"
        ]
      },
      {
        "word": "El Señor de los Anillos",
        "banned": [
          "anillo",
          "Frodo",
          "Mordor"
        ]
      },
      {
        "word": "Piratas del Caribe",
        "banned": [
          "Jack Sparrow",
          "piratas",
          "barco"
        ]
      },
      {
        "word": "Joker",
        "banned": [
          "payaso",
          "Batman",
          "Gotham"
        ]
      },
      {
        "word": "Barbie",
        "banned": [
          "rosa",
          "muñeca",
          "Ken"
        ]
      },
      {
        "word": "Oppenheimer",
        "banned": [
          "bomba",
          "nuclear",
          "Nolan"
        ]
      },
      {
        "word": "El lobo de Wall Street",
        "banned": [
          "DiCaprio",
          "bolsa",
          "Jordan Belfort"
        ]
      },
      {
        "word": "Crepúsculo",
        "banned": [
          "vampiro",
          "Bella",
          "Edward"
        ]
      },
      {
        "word": "Los juegos del hambre",
        "banned": [
          "Katniss",
          "distritos",
          "arco"
        ]
      },
      {
        "word": "Top Gun",
        "banned": [
          "aviones",
          "Tom Cruise",
          "piloto"
        ]
      },
      {
        "word": "Misión Imposible",
        "banned": [
          "Tom Cruise",
          "Ethan Hunt",
          "espía"
        ]
      },
      {
        "word": "El Padrino",
        "banned": [
          "mafia",
          "Corleone",
          "familia"
        ]
      },
      {
        "word": "Tiburón",
        "banned": [
          "Spielberg",
          "mar",
          "tiburón"
        ]
      },
      {
        "word": "Regreso al futuro",
        "banned": [
          "DeLorean",
          "Marty",
          "tiempo"
        ]
      },
      {
        "word": "Forrest Gump",
        "banned": [
          "Tom Hanks",
          "correr",
          "banco"
        ]
      },
      {
        "word": "E.T.",
        "banned": [
          "alien",
          "bicicleta",
          "teléfono"
        ]
      },
      {
        "word": "Karate Kid",
        "banned": [
          "karate",
          "Miyagi",
          "Daniel"
        ]
      },
      {
        "word": "Resacón en Las Vegas",
        "banned": [
          "Las Vegas",
          "despedida",
          "tigre"
        ]
      }
    ]
  },
  {
    "id": "musica",
    "emoji": "🎵",
    "title": "Música",
    "cards": [
      {
        "word": "Quevedo",
        "banned": [
          "Canarias",
          "Bizarrap",
          "Quédate"
        ]
      },
      {
        "word": "Bad Bunny",
        "banned": [
          "Puerto Rico",
          "conejo",
          "reguetón"
        ]
      },
      {
        "word": "Eladio Carrión",
        "banned": [
          "Puerto Rico",
          "trap",
          "rapero"
        ]
      },
      {
        "word": "La Pantera",
        "banned": [
          "Canarias",
          "rapero",
          "Quevedo"
        ]
      },
      {
        "word": "Lucho RK",
        "banned": [
          "Canarias",
          "cantante",
          "La Pantera"
        ]
      },
      {
        "word": "Feid",
        "banned": [
          "Colombia",
          "verde",
          "Ferxxo"
        ]
      },
      {
        "word": "Myke Towers",
        "banned": [
          "Puerto Rico",
          "rapero",
          "La Playa"
        ]
      },
      {
        "word": "Rauw Alejandro",
        "banned": [
          "Puerto Rico",
          "Rosalía",
          "Todo de Ti"
        ]
      },
      {
        "word": "Mora",
        "banned": [
          "Puerto Rico",
          "reguetón",
          "Memorias"
        ]
      },
      {
        "word": "Duki",
        "banned": [
          "Argentina",
          "trap",
          "Bizarrap"
        ]
      },
      {
        "word": "Bizarrap",
        "banned": [
          "sesiones",
          "gorra",
          "productor"
        ]
      },
      {
        "word": "Karol G",
        "banned": [
          "Colombia",
          "Bichota",
          "cantante"
        ]
      },
      {
        "word": "Anuel AA",
        "banned": [
          "Puerto Rico",
          "Real Hasta La Muerte",
          "reguetón"
        ]
      },
      {
        "word": "Ozuna",
        "banned": [
          "Puerto Rico",
          "reguetón",
          "Negrito de ojos claros"
        ]
      },
      {
        "word": "J Balvin",
        "banned": [
          "Colombia",
          "reguetón",
          "Mi Gente"
        ]
      },
      {
        "word": "Maluma",
        "banned": [
          "Colombia",
          "Hawái",
          "cantante"
        ]
      },
      {
        "word": "Young Miko",
        "banned": [
          "Puerto Rico",
          "rapera",
          "trap"
        ]
      },
      {
        "word": "Omar Courtz",
        "banned": [
          "Puerto Rico",
          "reguetón",
          "cantante"
        ]
      },
      {
        "word": "Saiko",
        "banned": [
          "Granada",
          "Polaris",
          "cantante"
        ]
      },
      {
        "word": "JC Reyes",
        "banned": [
          "Sevilla",
          "rapero",
          "urbano"
        ]
      },
      {
        "word": "Daddy Yankee",
        "banned": [
          "Gasolina",
          "Puerto Rico",
          "reguetón"
        ]
      },
      {
        "word": "Don Omar",
        "banned": [
          "Dale Don Dale",
          "Puerto Rico",
          "reguetón"
        ]
      },
      {
        "word": "Rosalía",
        "banned": [
          "Motomami",
          "Barcelona",
          "cantante"
        ]
      },
      {
        "word": "Aitana",
        "banned": [
          "Operación Triunfo",
          "España",
          "cantante"
        ]
      },
      {
        "word": "Lola Índigo",
        "banned": [
          "Granada",
          "bailarina",
          "cantante"
        ]
      }
    ]
  },
  {
    "id": "sagas",
    "emoji": "🦸",
    "title": "Marvel & Sagas",
    "cards": [
      {
        "word": "Los Vengadores",
        "banned": [
          "Marvel",
          "superhéroes",
          "Thanos"
        ]
      },
      {
        "word": "Iron Man",
        "banned": [
          "Tony Stark",
          "armadura",
          "Marvel"
        ]
      },
      {
        "word": "Spider-Man",
        "banned": [
          "Peter Parker",
          "araña",
          "Marvel"
        ]
      },
      {
        "word": "Hulk",
        "banned": [
          "verde",
          "Bruce Banner",
          "Marvel"
        ]
      },
      {
        "word": "Thor",
        "banned": [
          "martillo",
          "Asgard",
          "Marvel"
        ]
      },
      {
        "word": "Capitán América",
        "banned": [
          "escudo",
          "Steve Rogers",
          "Marvel"
        ]
      },
      {
        "word": "Thanos",
        "banned": [
          "guantelete",
          "gemas",
          "Marvel"
        ]
      },
      {
        "word": "Doctor Strange",
        "banned": [
          "portal",
          "magia",
          "Marvel"
        ]
      },
      {
        "word": "Loki",
        "banned": [
          "Thor",
          "Asgard",
          "engaño"
        ]
      },
      {
        "word": "Deadpool",
        "banned": [
          "rojo",
          "Marvel",
          "Ryan Reynolds"
        ]
      },
      {
        "word": "Wolverine",
        "banned": [
          "garras",
          "X-Men",
          "Logan"
        ]
      },
      {
        "word": "Fast & Furious",
        "banned": [
          "coches",
          "Toretto",
          "familia"
        ]
      },
      {
        "word": "Dominic Toretto",
        "banned": [
          "Fast & Furious",
          "Vin Diesel",
          "familia"
        ]
      },
      {
        "word": "Brian O'Conner",
        "banned": [
          "Fast & Furious",
          "Paul Walker",
          "coche"
        ]
      },
      {
        "word": "Harry Potter",
        "banned": [
          "Hogwarts",
          "mago",
          "Voldemort"
        ]
      },
      {
        "word": "Voldemort",
        "banned": [
          "Harry Potter",
          "nariz",
          "villano"
        ]
      },
      {
        "word": "Hermione Granger",
        "banned": [
          "Harry Potter",
          "Hogwarts",
          "Emma Watson"
        ]
      },
      {
        "word": "Star Wars",
        "banned": [
          "Jedi",
          "espacio",
          "Darth Vader"
        ]
      },
      {
        "word": "Darth Vader",
        "banned": [
          "Star Wars",
          "Luke",
          "negro"
        ]
      },
      {
        "word": "Yoda",
        "banned": [
          "Star Wars",
          "verde",
          "Jedi"
        ]
      },
      {
        "word": "Jack Sparrow",
        "banned": [
          "Piratas del Caribe",
          "Johnny Depp",
          "pirata"
        ]
      },
      {
        "word": "Transformers",
        "banned": [
          "robots",
          "Optimus Prime",
          "coches"
        ]
      },
      {
        "word": "Frodo",
        "banned": [
          "anillo",
          "hobbit",
          "Mordor"
        ]
      },
      {
        "word": "Gollum",
        "banned": [
          "anillo",
          "precioso",
          "Señor de los Anillos"
        ]
      },
      {
        "word": "Katniss Everdeen",
        "banned": [
          "Juegos del Hambre",
          "arco",
          "Distrito 12"
        ]
      }
    ]
  },
  {
    "id": "famosos",
    "emoji": "🌟",
    "title": "Famosos & públicos",
    "cards": [
      {
        "word": "Donald Trump",
        "banned": [
          "Estados Unidos",
          "presidente",
          "republicano"
        ]
      },
      {
        "word": "Pedro Sánchez",
        "banned": [
          "presidente",
          "España",
          "PSOE"
        ]
      },
      {
        "word": "Javier Milei",
        "banned": [
          "Argentina",
          "presidente",
          "motosierra"
        ]
      },
      {
        "word": "Elon Musk",
        "banned": [
          "Tesla",
          "SpaceX",
          "X"
        ]
      },
      {
        "word": "Jeff Bezos",
        "banned": [
          "Amazon",
          "multimillonario",
          "Blue Origin"
        ]
      },
      {
        "word": "Mark Zuckerberg",
        "banned": [
          "Facebook",
          "Meta",
          "Instagram"
        ]
      },
      {
        "word": "Felipe VI",
        "banned": [
          "rey",
          "España",
          "Letizia"
        ]
      },
      {
        "word": "Letizia Ortiz",
        "banned": [
          "reina",
          "España",
          "Felipe VI"
        ]
      },
      {
        "word": "Ibai Llanos",
        "banned": [
          "streamer",
          "Twitch",
          "Velada"
        ]
      },
      {
        "word": "David Broncano",
        "banned": [
          "La Revuelta",
          "presentador",
          "televisión"
        ]
      },
      {
        "word": "MrBeast",
        "banned": [
          "YouTube",
          "retos",
          "dinero"
        ]
      },
      {
        "word": "Shakira",
        "banned": [
          "Colombia",
          "Piqué",
          "cantante"
        ]
      },
      {
        "word": "Taylor Swift",
        "banned": [
          "Estados Unidos",
          "Eras Tour",
          "cantante"
        ]
      },
      {
        "word": "Beyoncé",
        "banned": [
          "cantante",
          "Jay-Z",
          "Estados Unidos"
        ]
      },
      {
        "word": "Rihanna",
        "banned": [
          "Barbados",
          "cantante",
          "Fenty"
        ]
      },
      {
        "word": "Dwayne Johnson",
        "banned": [
          "La Roca",
          "actor",
          "lucha libre"
        ]
      },
      {
        "word": "Leonardo DiCaprio",
        "banned": [
          "Titanic",
          "actor",
          "Oscar"
        ]
      },
      {
        "word": "Will Smith",
        "banned": [
          "actor",
          "Oscar",
          "El Príncipe de Bel-Air"
        ]
      },
      {
        "word": "Tom Cruise",
        "banned": [
          "Misión Imposible",
          "actor",
          "Top Gun"
        ]
      },
      {
        "word": "Kim Kardashian",
        "banned": [
          "reality",
          "Kanye West",
          "familia"
        ]
      },
      {
        "word": "Zendaya",
        "banned": [
          "actriz",
          "Euphoria",
          "Spider-Man"
        ]
      },
      {
        "word": "Jenna Ortega",
        "banned": [
          "Miércoles",
          "actriz",
          "Wednesday"
        ]
      },
      {
        "word": "Pedro Pascal",
        "banned": [
          "actor",
          "The Last of Us",
          "Chile"
        ]
      },
      {
        "word": "Georgina Rodríguez",
        "banned": [
          "Cristiano Ronaldo",
          "modelo",
          "Netflix"
        ]
      },
      {
        "word": "Rafa Nadal",
        "banned": [
          "tenis",
          "Mallorca",
          "Roland Garros"
        ]
      }
    ]
  },
  {
    "id": "tendencias",
    "emoji": "🔥",
    "title": "Internet & Tendencias",
    "cards": [
      {
        "word": "ChatGPT",
        "banned": [
          "OpenAI",
          "inteligencia artificial",
          "chatbot"
        ]
      },
      {
        "word": "TikTok",
        "banned": [
          "vídeos",
          "vertical",
          "ByteDance"
        ]
      },
      {
        "word": "Instagram",
        "banned": [
          "Meta",
          "stories",
          "fotos"
        ]
      },
      {
        "word": "Twitch",
        "banned": [
          "streaming",
          "directos",
          "Amazon"
        ]
      },
      {
        "word": "YouTube",
        "banned": [
          "Google",
          "vídeos",
          "canal"
        ]
      },
      {
        "word": "Netflix",
        "banned": [
          "series",
          "streaming",
          "películas"
        ]
      },
      {
        "word": "Spotify",
        "banned": [
          "música",
          "streaming",
          "playlist"
        ]
      },
      {
        "word": "WhatsApp",
        "banned": [
          "mensajes",
          "Meta",
          "chat"
        ]
      },
      {
        "word": "Meme",
        "banned": [
          "internet",
          "viral",
          "imagen"
        ]
      },
      {
        "word": "Influencer",
        "banned": [
          "redes sociales",
          "seguidores",
          "contenido"
        ]
      },
      {
        "word": "Streamer",
        "banned": [
          "directo",
          "Twitch",
          "cámara"
        ]
      },
      {
        "word": "Podcast",
        "banned": [
          "audio",
          "episodios",
          "micrófono"
        ]
      },
      {
        "word": "Deepfake",
        "banned": [
          "IA",
          "vídeo",
          "cara"
        ]
      },
      {
        "word": "ASMR",
        "banned": [
          "sonidos",
          "susurros",
          "relajación"
        ]
      },
      {
        "word": "Unboxing",
        "banned": [
          "caja",
          "vídeo",
          "producto"
        ]
      },
      {
        "word": "Rubius",
        "banned": [
          "YouTube",
          "streamer",
          "España"
        ]
      },
      {
        "word": "Plex",
        "banned": [
          "streamer",
          "YouTube",
          "La Vuelta al Mundo"
        ]
      },
      {
        "word": "AuronPlay",
        "banned": [
          "streamer",
          "Twitch",
          "YouTube"
        ]
      },
      {
        "word": "TheGrefg",
        "banned": [
          "streamer",
          "Murcia",
          "Fortnite"
        ]
      },
      {
        "word": "IlloJuan",
        "banned": [
          "streamer",
          "Málaga",
          "Twitch"
        ]
      },
      {
        "word": "IShowSpeed",
        "banned": [
          "streamer",
          "Cristiano Ronaldo",
          "Estados Unidos"
        ]
      },
      {
        "word": "La Velada del Año",
        "banned": [
          "Ibai",
          "boxeo",
          "streamers"
        ]
      },
      {
        "word": "Kings League",
        "banned": [
          "Piqué",
          "fútbol",
          "presidentes"
        ]
      },
      {
        "word": "Judeline",
        "banned": [
          "cantante",
          "España",
          "Rusowsky"
        ]
      },
      {
        "word": "Rusowsky",
        "banned": [
          "artista",
          "España",
          "Judeline"
        ]
      }
    ]
  },
  {
    "id": "mix",
    "emoji": "🎲",
    "title": "Mix",
    "cards": [
      {
        "word": "Mercadona",
        "banned": [
          "supermercado",
          "Hacendado",
          "Juan Roig"
        ]
      },
      {
        "word": "McDonald's",
        "banned": [
          "hamburguesa",
          "Big Mac",
          "comida rápida"
        ]
      },
      {
        "word": "Kebab",
        "banned": [
          "carne",
          "durum",
          "comida"
        ]
      },
      {
        "word": "Paella",
        "banned": [
          "arroz",
          "Valencia",
          "comida"
        ]
      },
      {
        "word": "Gimnasio",
        "banned": [
          "pesas",
          "entrenar",
          "máquinas"
        ]
      },
      {
        "word": "Discoteca",
        "banned": [
          "baile",
          "noche",
          "DJ"
        ]
      },
      {
        "word": "Aeropuerto",
        "banned": [
          "avión",
          "maleta",
          "viaje"
        ]
      },
      {
        "word": "Boda",
        "banned": [
          "novios",
          "anillos",
          "casarse"
        ]
      },
      {
        "word": "Resaca",
        "banned": [
          "alcohol",
          "mañana",
          "dolor de cabeza"
        ]
      },
      {
        "word": "Guardia Civil",
        "banned": [
          "policía",
          "España",
          "verde"
        ]
      },
      {
        "word": "Fórmula 1",
        "banned": [
          "coches",
          "circuito",
          "piloto"
        ]
      },
      {
        "word": "Tinder",
        "banned": [
          "citas",
          "match",
          "aplicación"
        ]
      },
      {
        "word": "Amazon",
        "banned": [
          "compras",
          "Bezos",
          "paquetes"
        ]
      },
      {
        "word": "IKEA",
        "banned": [
          "muebles",
          "Suecia",
          "montar"
        ]
      },
      {
        "word": "Wallapop",
        "banned": [
          "segunda mano",
          "comprar",
          "vender"
        ]
      },
      {
        "word": "Vinted",
        "banned": [
          "ropa",
          "segunda mano",
          "vender"
        ]
      },
      {
        "word": "PlayStation",
        "banned": [
          "Sony",
          "consola",
          "mando"
        ]
      },
      {
        "word": "Nintendo Switch",
        "banned": [
          "Nintendo",
          "consola",
          "Joy-Con"
        ]
      },
      {
        "word": "Pikachu",
        "banned": [
          "Pokémon",
          "amarillo",
          "eléctrico"
        ]
      },
      {
        "word": "GTA",
        "banned": [
          "Rockstar",
          "videojuego",
          "coches"
        ]
      },
      {
        "word": "Minecraft",
        "banned": [
          "bloques",
          "Steve",
          "videojuego"
        ]
      },
      {
        "word": "Fortnite",
        "banned": [
          "Battle Royale",
          "Epic Games",
          "videojuego"
        ]
      },
      {
        "word": "Monopoly",
        "banned": [
          "tablero",
          "dinero",
          "casas"
        ]
      },
      {
        "word": "Lotería",
        "banned": [
          "números",
          "premio",
          "sorteo"
        ]
      },
      {
        "word": "Festival",
        "banned": [
          "música",
          "conciertos",
          "escenario"
        ]
      }
    ]
  }
];
