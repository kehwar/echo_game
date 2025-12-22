export interface Deck {
  id: string
  cards: string[]
}

export const decks: Deck[] = [
  {
    id: 'animals',
    cards: [
      'ELEPHANT', 'KANGAROO', 'PENGUIN', 'GIRAFFE', 'MONKEY',
      'DOLPHIN', 'BUTTERFLY', 'SNAKE', 'EAGLE', 'TIGER',
      'RABBIT', 'OCTOPUS', 'FLAMINGO', 'CROCODILE', 'KOALA',
      'CHEETAH', 'PEACOCK', 'SEAL', 'GORILLA', 'PARROT',
      'SLOTH', 'ZEBRA', 'OWL', 'WHALE', 'BEAR'
    ]
  },
  {
    id: 'actions',
    cards: [
      'DANCING', 'SWIMMING', 'COOKING', 'PAINTING', 'SINGING',
      'JUMPING', 'RUNNING', 'SLEEPING', 'READING', 'WRITING',
      'CLIMBING', 'SURFING', 'SKIING', 'FISHING', 'GARDENING',
      'BOXING', 'YOGA', 'JUGGLING', 'KNITTING', 'HIKING',
      'CYCLING', 'PHOTOGRAPHY', 'KARATE', 'MEDITATION', 'ROWING'
    ]
  },
  {
    id: 'food',
    cards: [
      'PIZZA', 'HAMBURGER', 'SPAGHETTI', 'TACO', 'SUSHI',
      'ICE CREAM', 'PANCAKES', 'POPCORN', 'SANDWICH', 'HOTDOG',
      'DONUT', 'CHOCOLATE', 'COFFEE', 'SMOOTHIE', 'COOKIE',
      'BURRITO', 'SALAD', 'CUPCAKE', 'MILKSHAKE', 'FRENCH FRIES',
      'WATERMELON', 'BANANA SPLIT', 'NACHOS', 'PRETZEL', 'BAGEL'
    ]
  },
  {
    id: 'professions',
    cards: [
      'DOCTOR', 'TEACHER', 'FIREFIGHTER', 'CHEF', 'ASTRONAUT',
      'PILOT', 'DENTIST', 'MUSICIAN', 'ARTIST', 'SCIENTIST',
      'POLICE OFFICER', 'NURSE', 'FARMER', 'MAGICIAN', 'DETECTIVE',
      'PHOTOGRAPHER', 'DANCER', 'CONSTRUCTION WORKER', 'LIBRARIAN', 'MAILMAN',
      'SUPERHERO', 'BAKER', 'MECHANIC', 'VETERINARIAN', 'ACTOR'
    ]
  },
  {
    id: 'sports',
    cards: [
      'BASKETBALL', 'SOCCER', 'TENNIS', 'BASEBALL', 'GOLF',
      'VOLLEYBALL', 'BOWLING', 'BOXING', 'WRESTLING', 'HOCKEY',
      'BADMINTON', 'TABLE TENNIS', 'ARCHERY', 'FENCING', 'RUGBY',
      'CRICKET', 'CHESS', 'CHECKERS', 'DARTS', 'BILLIARDS',
      'GYMNASTICS', 'SKATEBOARDING', 'SNOWBOARDING', 'PADDLEBOARDING', 'CHEERLEADING'
    ]
  },
  {
    id: 'objects',
    cards: [
      'GUITAR', 'PIANO', 'CAMERA', 'UMBRELLA', 'BICYCLE',
      'LAMP', 'CLOCK', 'MIRROR', 'TELEPHONE', 'COMPUTER',
      'TOOTHBRUSH', 'SCISSORS', 'HAMMER', 'PAINTBRUSH', 'VACUUM',
      'TELESCOPE', 'MICROPHONE', 'SUNGLASSES', 'BACKPACK', 'FLASHLIGHT',
      'TROPHY', 'BALLOON', 'KITE', 'BOOK', 'RAINBOW'
    ]
  },
  {
    id: 'movies',
    cards: [
      'SUPERHERO', 'WIZARD', 'PIRATE', 'NINJA', 'COWBOY',
      'PRINCESS', 'ROBOT', 'ZOMBIE', 'VAMPIRE', 'ALIEN',
      'DINOSAUR', 'DRAGON', 'MERMAID', 'KNIGHT', 'SPY',
      'MONSTER', 'CLOWN', 'MIME', 'BALLERINA', 'ROCKSTAR',
      'DJ', 'COMEDIAN', 'STUNT DOUBLE', 'BODYBUILDER', 'EXPLORER'
    ]
  }
]
