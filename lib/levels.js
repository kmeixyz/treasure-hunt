// Level definitions. Each level introduces a new layer of information,
// gently nudging the player from random guessing toward binary search.

export const LEVELS = [
  {
    id: 1,
    name: "The Maze",
    subtitle: "No clues. Just go.",
    doorCount: 10,
    feedbackType: "none",
    moveLimit: null,
    optimalMoves: 5, // average for blind search of 10 doors
    perfectMoves: 1, // pure luck
    intro: "A treasure is hidden behind one of these doors. Find it!",
  },
  {
    id: 2,
    name: "Hot or Cold",
    subtitle: "The doors whisper how close you are.",
    doorCount: 10,
    feedbackType: "distance",
    moveLimit: null,
    optimalMoves: 4,
    perfectMoves: 2,
    intro: "Each door tells you how close you are. Listen carefully!",
  },
  {
    id: 3,
    name: "The Friendly Ghost",
    subtitle: "Left or right? That's all you need.",
    doorCount: 12,
    feedbackType: "direction",
    moveLimit: null,
    optimalMoves: 4, // ceil(log2(12)) = 4
    perfectMoves: 4,
    intro: "A ghost will tell you which side the treasure is on.",
  },
  {
    id: 4,
    name: "The Master Hunter",
    subtitle: "Only 5 moves. Choose wisely.",
    doorCount: 20,
    feedbackType: "direction",
    moveLimit: 5, // ceil(log2(20)) = 5
    optimalMoves: 5,
    perfectMoves: 5,
    intro: "20 doors. 5 moves. The ghost still helps. Can you do it?",
  },
];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) || LEVELS[0];
}
