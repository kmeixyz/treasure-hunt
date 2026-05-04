// Pure functions for computing feedback and scoring.
// No randomness during play; the treasure index is fixed when the level starts.

// Distance feedback ladder. Scales with door count so it works for any size.
export const TEMPERATURE_LEVELS = [
  { key: "found",     label: "FOUND IT!",  color: "#FFB627", emoji: "💎", threshold: 0    },
  { key: "blazing",   label: "BLAZING",    color: "#DC2626", emoji: "🔥", threshold: 0.10 },
  { key: "hot",       label: "HOT",        color: "#F97316", emoji: "🥵", threshold: 0.25 },
  { key: "warm",      label: "WARM",       color: "#FBBF24", emoji: "😊", threshold: 0.45 },
  { key: "cool",      label: "COOL",       color: "#60A5FA", emoji: "🙂", threshold: 0.70 },
  { key: "cold",      label: "COLD",       color: "#2563EB", emoji: "🥶", threshold: 1.01 },
];

export function getTemperature(doorIndex, treasureIndex, totalDoors) {
  const distance = Math.abs(doorIndex - treasureIndex);
  if (distance === 0) return TEMPERATURE_LEVELS[0];
  // Distance as a fraction of the maximum possible distance.
  const ratio = distance / Math.max(1, totalDoors - 1);
  // Skip the "found" entry since we already handled distance 0.
  for (let i = 1; i < TEMPERATURE_LEVELS.length; i++) {
    if (ratio <= TEMPERATURE_LEVELS[i].threshold) return TEMPERATURE_LEVELS[i];
  }
  return TEMPERATURE_LEVELS[TEMPERATURE_LEVELS.length - 1];
}

export function getDirection(doorIndex, treasureIndex) {
  if (doorIndex === treasureIndex) {
    return { key: "found", label: "FOUND IT!", emoji: "💎" };
  }
  if (treasureIndex > doorIndex) {
    return { key: "right", label: "Treasure is to the RIGHT →", emoji: "👉" };
  }
  return { key: "left", label: "← Treasure is to the LEFT", emoji: "👈" };
}

// Compute the feedback object for a given attempt based on level type.
export function computeFeedback(level, doorIndex, treasureIndex) {
  if (doorIndex === treasureIndex) {
    return { kind: "found", label: "FOUND IT!", color: "#FFB627", emoji: "💎" };
  }
  switch (level.feedbackType) {
    case "distance": {
      const t = getTemperature(doorIndex, treasureIndex, level.doorCount);
      return { kind: "distance", ...t };
    }
    case "direction": {
      const d = getDirection(doorIndex, treasureIndex);
      return { kind: "direction", ...d, color: "#475569" };
    }
    case "none":
    default:
      return { kind: "empty", label: "Empty room.", color: "#94A3B8", emoji: "🚪" };
  }
}

// Star rating based on move count. 3 stars = perfect, 2 = good, 1 = completed.
export function computeStars(moves, level) {
  if (moves <= level.perfectMoves) return 3;
  if (moves <= level.optimalMoves) return 2;
  return 1;
}

// Pick a treasure index. We avoid the very first/last positions on later
// levels so a learner who always tries index 0 or N-1 doesn't accidentally
// "win" without using the strategy. Level 1 is fully fair (any index).
export function chooseTreasureIndex(level) {
  const n = level.doorCount;
  if (level.id === 1) return Math.floor(Math.random() * n);
  // For clue-based levels, pick anywhere from index 1 to n-2.
  return 1 + Math.floor(Math.random() * (n - 2));
}

// For Level 1, the treasure placement is lazy: the treasure is only "locked in"
// after the player has made 3 wrong guesses. If they happen to click the treasure
// door on attempt 1, 2, or 3, we silently relocate it to any untried door.
// Since Level 1 gives no feedback (all wrong doors say "Empty room"), this is
// invisible to the player — guaranteed minimum 4 guesses no matter what they pick.
export function relocateTreasureIfNeeded(level, doorIndex, currentTreasureIndex, triedSet, totalAttemptsSoFar) {
  // Level 1: locked after 3 wrong guesses (min 4 tries)
  // Levels 2–4: locked after 2 wrong guesses (min 3 tries)
  const minGuesses = level.id === 1 ? 3 : 2;
  if (totalAttemptsSoFar >= minGuesses) return currentTreasureIndex;
  if (doorIndex !== currentTreasureIndex) return currentTreasureIndex; // not the treasure door

  // Player found the treasure too early — move it to a random untried door.
  const untried = [];
  for (let i = 0; i < level.doorCount; i++) {
    if (i !== doorIndex && !triedSet.has(i)) untried.push(i);
  }
  if (untried.length === 0) return currentTreasureIndex; // nowhere to hide (shouldn't happen)
  return untried[Math.floor(Math.random() * untried.length)];
}
