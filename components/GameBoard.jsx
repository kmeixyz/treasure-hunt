'use client';

import { useEffect, useReducer } from 'react';
import HUD from './HUD';
import Door from './Door';
import FeedbackPanel from './FeedbackPanel';
import ClueHistory from './ClueHistory';
import { getLevel } from '@/lib/levels';
import { computeFeedback, chooseTreasureIndex, relocateTreasureIfNeeded } from '@/lib/gameLogic';

// State shape:
//   level:           the active level config
//   treasureIndex:   which door hides the treasure (fixed at level start)
//   attempts:        array of { doorIndex, feedback } in click order
//   tried:           map of doorIndex -> attempt (for fast lookup)
//   lastFeedback:    the most recent feedback (for the big banner)
//   status:          'playing' | 'won' | 'lost' (lost = ran out of moves)

function init({ level }) {
  return {
    level,
    treasureIndex: chooseTreasureIndex(level),
    attempts: [],
    tried: {},
    lastFeedback: null,
    status: 'playing',
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN': {
      if (state.status !== 'playing') return state;
      const { doorIndex } = action;
      if (state.tried[doorIndex]) return state; // already tried; ignore

      const triedSet = new Set(Object.keys(state.tried).map(Number));
      const treasureIndex = relocateTreasureIfNeeded(
        state.level, doorIndex, state.treasureIndex, triedSet, state.attempts.length
      );
      const feedback = computeFeedback(state.level, doorIndex, treasureIndex);
      const attempt = { doorIndex, feedback };
      const attempts = [...state.attempts, attempt];
      const tried = { ...state.tried, [doorIndex]: attempt };

      let status = state.status;
      if (feedback.kind === 'found') status = 'won';
      else if (state.level.moveLimit && attempts.length >= state.level.moveLimit) status = 'lost';

      return { ...state, treasureIndex, attempts, tried, lastFeedback: feedback, status };
    }
    case 'RESET':
      return init({ level: state.level });
    default:
      return state;
  }
}

export default function GameBoard({ levelId, onComplete, onBack }) {
  const level = getLevel(levelId);
  const [state, dispatch] = useReducer(reducer, { level }, init);

  // When the round finishes, hand the result up after a short pause so the
  // player gets to see the final clue/celebration before the screen swaps.
  useEffect(() => {
    if (state.status === 'won' || state.status === 'lost') {
      const t = setTimeout(() => {
        onComplete({
          level: state.level,
          attempts: state.attempts,
          treasureIndex: state.treasureIndex,
          status: state.status,
          // import lazily to keep this component lean
          stars: computeStarsLocal(state),
        });
      }, state.status === 'won' ? 1100 : 600);
      return () => clearTimeout(t);
    }
  }, [state.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpen = (idx) => dispatch({ type: 'OPEN', doorIndex: idx });

  return (
    <>
      <HUD level={level} moves={state.attempts.length} onBack={onBack} />

      <FeedbackPanel feedback={state.lastFeedback} level={level} />

      <div className="hallway" role="group" aria-label={`${level.doorCount} doors`}>
        {Array.from({ length: level.doorCount }).map((_, i) => (
          <Door
            key={i}
            index={i}
            displayNumber={i + 1}
            attempt={state.tried[i]}
            disabled={state.status !== 'playing'}
            onOpen={handleOpen}
          />
        ))}
      </div>

      <ClueHistory attempts={state.attempts} />
    </>
  );
}

// Local star calculation so the game-over animation can pass it up.
function computeStarsLocal(state) {
  const { attempts, status, level } = state;
  if (status === 'lost') return 0;
  if (attempts.length <= level.perfectMoves) return 3;
  if (attempts.length <= level.optimalMoves) return 2;
  return 1;
}
