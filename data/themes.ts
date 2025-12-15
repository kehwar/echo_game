export interface Theme {
  id: string
  name: string
  description: string
  words: string[]
}

export const themes: Theme[] = [
  {
    id: 'animals',
    name: 'Animals',
    description: 'Act out your favorite animals - from tiny insects to giant elephants!',
    words: [
      'ELEPHANT', 'KANGAROO', 'PENGUIN', 'GIRAFFE', 'MONKEY',
      'DOLPHIN', 'BUTTERFLY', 'SNAKE', 'EAGLE', 'TIGER',
      'RABBIT', 'OCTOPUS', 'FLAMINGO', 'CROCODILE', 'KOALA',
      'CHEETAH', 'PEACOCK', 'SEAL', 'GORILLA', 'PARROT',
      'SLOTH', 'ZEBRA', 'OWL', 'WHALE', 'BEAR'
    ]
  },
  {
    id: 'actions',
    name: 'Actions & Activities',
    description: 'Perform everyday activities and fun actions!',
    words: [
      'DANCING', 'SWIMMING', 'COOKING', 'PAINTING', 'SINGING',
      'JUMPING', 'RUNNING', 'SLEEPING', 'READING', 'WRITING',
      'CLIMBING', 'SURFING', 'SKIING', 'FISHING', 'GARDENING',
      'BOXING', 'YOGA', 'JUGGLING', 'KNITTING', 'HIKING',
      'CYCLING', 'PHOTOGRAPHY', 'KARATE', 'MEDITATION', 'ROWING'
    ]
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    description: 'Show your love for delicious food and tasty drinks!',
    words: [
      'PIZZA', 'HAMBURGER', 'SPAGHETTI', 'TACO', 'SUSHI',
      'ICE CREAM', 'PANCAKES', 'POPCORN', 'SANDWICH', 'HOTDOG',
      'DONUT', 'CHOCOLATE', 'COFFEE', 'SMOOTHIE', 'COOKIE',
      'BURRITO', 'SALAD', 'CUPCAKE', 'MILKSHAKE', 'FRENCH FRIES',
      'WATERMELON', 'BANANA SPLIT', 'NACHOS', 'PRETZEL', 'BAGEL'
    ]
  },
  {
    id: 'professions',
    name: 'Professions',
    description: 'Act out different jobs and careers!',
    words: [
      'DOCTOR', 'TEACHER', 'FIREFIGHTER', 'CHEF', 'ASTRONAUT',
      'PILOT', 'DENTIST', 'MUSICIAN', 'ARTIST', 'SCIENTIST',
      'POLICE OFFICER', 'NURSE', 'FARMER', 'MAGICIAN', 'DETECTIVE',
      'PHOTOGRAPHER', 'DANCER', 'CONSTRUCTION WORKER', 'LIBRARIAN', 'MAILMAN',
      'SUPERHERO', 'BAKER', 'MECHANIC', 'VETERINARIAN', 'ACTOR'
    ]
  },
  {
    id: 'sports',
    name: 'Sports & Games',
    description: 'Show off your athletic moves and game skills!',
    words: [
      'BASKETBALL', 'SOCCER', 'TENNIS', 'BASEBALL', 'GOLF',
      'VOLLEYBALL', 'BOWLING', 'BOXING', 'WRESTLING', 'HOCKEY',
      'BADMINTON', 'TABLE TENNIS', 'ARCHERY', 'FENCING', 'RUGBY',
      'CRICKET', 'CHESS', 'CHECKERS', 'DARTS', 'BILLIARDS',
      'GYMNASTICS', 'SKATEBOARDING', 'SNOWBOARDING', 'PADDLEBOARDING', 'CHEERLEADING'
    ]
  },
  {
    id: 'objects',
    name: 'Objects & Things',
    description: 'Act out everyday objects and special items!',
    words: [
      'GUITAR', 'PIANO', 'CAMERA', 'UMBRELLA', 'BICYCLE',
      'LAMP', 'CLOCK', 'MIRROR', 'TELEPHONE', 'COMPUTER',
      'TOOTHBRUSH', 'SCISSORS', 'HAMMER', 'PAINTBRUSH', 'VACUUM',
      'TELESCOPE', 'MICROPHONE', 'SUNGLASSES', 'BACKPACK', 'FLASHLIGHT',
      'TROPHY', 'BALLOON', 'KITE', 'BOOK', 'RAINBOW'
    ]
  },
  {
    id: 'movies',
    name: 'Movies & Entertainment',
    description: 'Act out famous movie scenes and entertainment themes!',
    words: [
      'SUPERHERO', 'WIZARD', 'PIRATE', 'NINJA', 'COWBOY',
      'PRINCESS', 'ROBOT', 'ZOMBIE', 'VAMPIRE', 'ALIEN',
      'DINOSAUR', 'DRAGON', 'MERMAID', 'KNIGHT', 'SPY',
      'MONSTER', 'CLOWN', 'MIME', 'BALLERINA', 'ROCKSTAR',
      'DJ', 'COMEDIAN', 'STUNT DOUBLE', 'BODYBUILDER', 'EXPLORER'
    ]
  }
]
