// Utilities for the Maker Flow — code generation, level encoding, and math hints.

const ADJECTIVES = [
  'BRAVE','SNEAKY','GOLDEN','FUZZY','SILLY','BOUNCY','WILD','CLEVER',
  'TINY','MIGHTY','GRUMPY','LUCKY','SHINY','SWIFT','JOLLY','WOBBLY',
  'PURPLE','ANCIENT','COSMIC','SPARKY','DIZZY','FANCY','SPOOKY','GROOVY','ZIPPY',
];

const NOUNS = [
  'TIGER','TURTLE','PENGUIN','WIZARD','CACTUS','ROBOT','DRAGON','PIRATE',
  'MANGO','PANDA','ROCKET','NINJA','TOASTER','BISCUIT','COMET','GOBLIN',
  'PARROT','MONKEY','COOKIE','HAMMER','LLAMA','DONUT','GHOST','VIKING','PICKLE',
];

export function generateCode() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}-${noun}`;
}

// Minimum moves required for binary search on N doors.
export function minMoves(doorCount) {
  return Math.ceil(Math.log2(Math.max(doorCount, 2)));
}

// Build a full level config object from maker inputs (same shape as LEVELS entries).
// treasureOverride is 0-based door index, or null for random placement each game.
export function buildCustomLevel({ code, doorCount, treasureMode, treasureDoor, feedbackType, hasLimit, moveLimit }) {
  const n = Math.max(2, Math.min(500, doorCount));
  const perfect = minMoves(n);
  return {
    id: 'custom',
    code,
    name: 'Custom Maze',
    subtitle: `Room: ${code}`,
    doorCount: n,
    feedbackType,
    moveLimit: hasLimit ? Math.max(1, moveLimit) : null,
    optimalMoves: perfect + 2,
    perfectMoves: perfect,
    intro: `A custom maze with ${n} doors. Good luck!`,
    // 0-based index, or null for random
    treasureOverride: treasureMode === 'specific'
      ? Math.max(0, Math.min(n - 1, treasureDoor - 1))
      : null,
  };
}

// Serialise/deserialise the raw maker config (not the full level object) for storage.
export function encodeConfig({ doorCount, treasureMode, treasureDoor, feedbackType, hasLimit, moveLimit }) {
  return { doorCount, treasureMode, treasureDoor, feedbackType, hasLimit, moveLimit };
}
