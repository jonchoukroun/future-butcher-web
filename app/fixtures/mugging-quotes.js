const playerName = localStorage.getItem('player_name');

const defeatQuotes = [
  "He kicks your ass!",
  "The Butcher drops you like day-old shit.",
  "You started something you couldn't finish. The Butcher, though, easily finishes you.",
  "The Butcher likes to kick ass and eat people. Lucky for you he wasn't hungry."
];

const defeatedButtonText = [
  "Keep on hustling",
  "Ain't got time to bleed",
  "Get back on the saddle",
  "Get back in the game",
  "Dust yourself off and go",
];

const victoryQuotes = [
  "You're here to get rich and kick ass - and getting rich can wait.",
  "You drop the Butcher like day-old shit.",
  `Nobody fucks with the ${playerName}!`,
  `You stomp the Butcher and shout, "${playerName}, remember the name!"`
]

export { defeatQuotes, defeatedButtonText, victoryQuotes };
