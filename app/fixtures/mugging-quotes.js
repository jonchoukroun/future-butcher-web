const playerName = localStorage.getItem('player_name');

const defeatQuotes = [
  "He kicks your ass!",
  "The mugger drops you like day-old shit.",
  "You started something you couldn't finish. The mugger, though, finishes you.",
  "The mugger likes to kick ass and eat people. Lucky for you he wasn't hungry.",
  "Maybe fighting isn’t your thing. It’s definitely the mugger’s thing.",
  "The mugger lays you out cold.",
  "Stick to hustling, because you don’t know how to fight.",
  "Nice try, tough guy. You’re no match for the mugger.",
  "Local street kids eat popcorn and watch you take a beating."
];

const defeatedButtonText = [
  "Keep on hustling",
  "Ain't got time to bleed",
  "Get back on the saddle",
  "Get back in the game",
  "Dust yourself off",
  "Get back into it"
];

const victoryQuotes = [
  "You're here to get rich and kick ass - and getting rich can wait.",
  "You drop the mugger like day-old shit.",
  `Nobody fucks with the ${playerName}!`,
  `You stomp the mugger and shout, "${playerName}, remember the name!"`,
  "You just taught the mugger a lesson!",
  "Who’s tougher than you? Not the mugger, who you just wrecked.",
  "It wasn’t a fair fight. You took out that mugger in no time.",
  "Damn! The local street kids stare at the beatdown you gave that mugger."
]

export { defeatQuotes, defeatedButtonText, victoryQuotes };
