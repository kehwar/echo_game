export interface Theme {
  id: string
  words: Record<string, string[]>
}

export const themes: Theme[] = [
  {
    id: 'animals',
    words: {
      'en-US': [
        'ELEPHANT', 'KANGAROO', 'PENGUIN', 'GIRAFFE', 'MONKEY',
        'DOLPHIN', 'BUTTERFLY', 'SNAKE', 'EAGLE', 'TIGER',
        'RABBIT', 'OCTOPUS', 'FLAMINGO', 'CROCODILE', 'KOALA',
        'CHEETAH', 'PEACOCK', 'SEAL', 'GORILLA', 'PARROT',
        'SLOTH', 'ZEBRA', 'OWL', 'WHALE', 'BEAR'
      ],
      'es': [
        'ELEFANTE', 'CANGURO', 'PINGÜINO', 'JIRAFA', 'MONO',
        'DELFÍN', 'MARIPOSA', 'SERPIENTE', 'ÁGUILA', 'TIGRE',
        'CONEJO', 'PULPO', 'FLAMENCO', 'COCODRILO', 'KOALA',
        'GUEPARDO', 'PAVO REAL', 'FOCA', 'GORILA', 'LORO',
        'PEREZOSO', 'CEBRA', 'BÚHO', 'BALLENA', 'OSO'
      ]
    }
  },
  {
    id: 'actions',
    words: {
      'en-US': [
        'DANCING', 'SWIMMING', 'COOKING', 'PAINTING', 'SINGING',
        'JUMPING', 'RUNNING', 'SLEEPING', 'READING', 'WRITING',
        'CLIMBING', 'SURFING', 'SKIING', 'FISHING', 'GARDENING',
        'BOXING', 'YOGA', 'JUGGLING', 'KNITTING', 'HIKING',
        'CYCLING', 'PHOTOGRAPHY', 'KARATE', 'MEDITATION', 'ROWING'
      ],
      'es': [
        'BAILAR', 'NADAR', 'COCINAR', 'PINTAR', 'CANTAR',
        'SALTAR', 'CORRER', 'DORMIR', 'LEER', 'ESCRIBIR',
        'ESCALAR', 'SURFEAR', 'ESQUIAR', 'PESCAR', 'JARDINERÍA',
        'BOXEAR', 'YOGA', 'HACER MALABARES', 'TEJER', 'CAMINAR',
        'CICLISMO', 'FOTOGRAFÍA', 'KARATE', 'MEDITACIÓN', 'REMAR'
      ]
    }
  },
  {
    id: 'food',
    words: {
      'en-US': [
        'PIZZA', 'HAMBURGER', 'SPAGHETTI', 'TACO', 'SUSHI',
        'ICE CREAM', 'PANCAKES', 'POPCORN', 'SANDWICH', 'HOTDOG',
        'DONUT', 'CHOCOLATE', 'COFFEE', 'SMOOTHIE', 'COOKIE',
        'BURRITO', 'SALAD', 'CUPCAKE', 'MILKSHAKE', 'FRENCH FRIES',
        'WATERMELON', 'BANANA SPLIT', 'NACHOS', 'PRETZEL', 'BAGEL'
      ],
      'es': [
        'PIZZA', 'HAMBURGUESA', 'ESPAGUETI', 'TACO', 'SUSHI',
        'HELADO', 'PANQUEQUES', 'PALOMITAS', 'SÁNDWICH', 'PERRO CALIENTE',
        'DONA', 'CHOCOLATE', 'CAFÉ', 'BATIDO', 'GALLETA',
        'BURRITO', 'ENSALADA', 'MAGDALENA', 'MALTEADA', 'PAPAS FRITAS',
        'SANDÍA', 'BANANA SPLIT', 'NACHOS', 'PRETZEL', 'BAGEL'
      ]
    }
  },
  {
    id: 'professions',
    words: {
      'en-US': [
        'DOCTOR', 'TEACHER', 'FIREFIGHTER', 'CHEF', 'ASTRONAUT',
        'PILOT', 'DENTIST', 'MUSICIAN', 'ARTIST', 'SCIENTIST',
        'POLICE OFFICER', 'NURSE', 'FARMER', 'MAGICIAN', 'DETECTIVE',
        'PHOTOGRAPHER', 'DANCER', 'CONSTRUCTION WORKER', 'LIBRARIAN', 'MAILMAN',
        'SUPERHERO', 'BAKER', 'MECHANIC', 'VETERINARIAN', 'ACTOR'
      ],
      'es': [
        'DOCTOR', 'MAESTRO', 'BOMBERO', 'CHEF', 'ASTRONAUTA',
        'PILOTO', 'DENTISTA', 'MÚSICO', 'ARTISTA', 'CIENTÍFICO',
        'POLICÍA', 'ENFERMERO', 'GRANJERO', 'MAGO', 'DETECTIVE',
        'FOTÓGRAFO', 'BAILARÍN', 'OBRERO', 'BIBLIOTECARIO', 'CARTERO',
        'SUPERHÉROE', 'PANADERO', 'MECÁNICO', 'VETERINARIO', 'ACTOR'
      ]
    }
  },
  {
    id: 'sports',
    words: {
      'en-US': [
        'BASKETBALL', 'SOCCER', 'TENNIS', 'BASEBALL', 'GOLF',
        'VOLLEYBALL', 'BOWLING', 'BOXING', 'WRESTLING', 'HOCKEY',
        'BADMINTON', 'TABLE TENNIS', 'ARCHERY', 'FENCING', 'RUGBY',
        'CRICKET', 'CHESS', 'CHECKERS', 'DARTS', 'BILLIARDS',
        'GYMNASTICS', 'SKATEBOARDING', 'SNOWBOARDING', 'PADDLEBOARDING', 'CHEERLEADING'
      ],
      'es': [
        'BALONCESTO', 'FÚTBOL', 'TENIS', 'BÉISBOL', 'GOLF',
        'VOLEIBOL', 'BOLICHE', 'BOXEO', 'LUCHA', 'HOCKEY',
        'BÁDMINTON', 'TENIS DE MESA', 'TIRO CON ARCO', 'ESGRIMA', 'RUGBY',
        'CRICKET', 'AJEDREZ', 'DAMAS', 'DARDOS', 'BILLAR',
        'GIMNASIA', 'PATINAJE', 'SNOWBOARD', 'PADDLE SURF', 'PORRISTAS'
      ]
    }
  },
  {
    id: 'objects',
    words: {
      'en-US': [
        'GUITAR', 'PIANO', 'CAMERA', 'UMBRELLA', 'BICYCLE',
        'LAMP', 'CLOCK', 'MIRROR', 'TELEPHONE', 'COMPUTER',
        'TOOTHBRUSH', 'SCISSORS', 'HAMMER', 'PAINTBRUSH', 'VACUUM',
        'TELESCOPE', 'MICROPHONE', 'SUNGLASSES', 'BACKPACK', 'FLASHLIGHT',
        'TROPHY', 'BALLOON', 'KITE', 'BOOK', 'RAINBOW'
      ],
      'es': [
        'GUITARRA', 'PIANO', 'CÁMARA', 'PARAGUAS', 'BICICLETA',
        'LÁMPARA', 'RELOJ', 'ESPEJO', 'TELÉFONO', 'COMPUTADORA',
        'CEPILLO DE DIENTES', 'TIJERAS', 'MARTILLO', 'PINCEL', 'ASPIRADORA',
        'TELESCOPIO', 'MICRÓFONO', 'GAFAS DE SOL', 'MOCHILA', 'LINTERNA',
        'TROFEO', 'GLOBO', 'COMETA', 'LIBRO', 'ARCOÍRIS'
      ]
    }
  },
  {
    id: 'movies',
    words: {
      'en-US': [
        'SUPERHERO', 'WIZARD', 'PIRATE', 'NINJA', 'COWBOY',
        'PRINCESS', 'ROBOT', 'ZOMBIE', 'VAMPIRE', 'ALIEN',
        'DINOSAUR', 'DRAGON', 'MERMAID', 'KNIGHT', 'SPY',
        'MONSTER', 'CLOWN', 'MIME', 'BALLERINA', 'ROCKSTAR',
        'DJ', 'COMEDIAN', 'STUNT DOUBLE', 'BODYBUILDER', 'EXPLORER'
      ],
      'es': [
        'SUPERHÉROE', 'MAGO', 'PIRATA', 'NINJA', 'VAQUERO',
        'PRINCESA', 'ROBOT', 'ZOMBI', 'VAMPIRO', 'EXTRATERRESTRE',
        'DINOSAURIO', 'DRAGÓN', 'SIRENA', 'CABALLERO', 'ESPÍA',
        'MONSTRUO', 'PAYASO', 'MIMO', 'BAILARINA', 'ESTRELLA DE ROCK',
        'DJ', 'COMEDIANTE', 'DOBLE DE RIESGO', 'CULTURISTA', 'EXPLORADOR'
      ]
    }
  }
]
