'use client';

import { useEffect, useReducer } from 'react';
import HUD from './HUD';
import Door from './Door';
import FeedbackPanel from './FeedbackPanel';
import ClueHistory from './ClueHistory';
import SearchBracket from './SearchBracket';
import { getLevel } from '@/lib/levels';
import { computeFeedback, chooseTreasureIndex, relocateTreasureIfNeeded, computeStarsAdvanced } from '@/lib/gameLogic';

function init({ level }) {
  const treasureIndex =
    level.treasureOverride !== undefined && level.treasureOverride !== null
      ? level.treasureOverride
      : chooseTreasureIndex(level);
  return {
    level,
    treasureIndex,
    attempts: [],
    tried: {},
    lastFeedback: null,
    status: 'playing',
    searchBounds: level.feedbackType === 'direction'
      ? { left: 0, right: level.doorCount - 1 }
      : null,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN': {
      if (state.status !== 'playing') return state;
      const { doorIndex } = action;
      if (state.tried[doorIndex]) return state;

      const triedSet = new Set(Object.keys(state.tried).map(Number));
      const treasureIndex = relocateTreasureIfNeeded(
        state.level, doorIndex, state.treasureIndex, triedSet,
        state.attempts.length, state.searchBounds
      );
      const feedback = computeFeedback(state.level, doorIndex, treasureIndex);
      const attempt = { doorIndex, feedback };
      const attempts = [...state.attempts, attempt];
      const tried = { ...state.tried, [doorIndex]: attempt };

      let status = state.status;
      if (feedback.kind === 'found') status = 'won';
      else if (state.level.moveLimit && attempts.length >= state.level.moveLimit) status = 'lost';

      let searchBounds = state.searchBounds;
      if (searchBounds && feedback.kind === 'direction') {
        if (feedback.key === 'right') searchBounds = { left: doorIndex + 1, right: searchBounds.right };
        else if (feedback.key === 'left') searchBounds = { left: searchBounds.left, right: doorIndex - 1 };
      }

      return { ...state, treasureIndex, attempts, tried, lastFeedback: feedback, status, searchBounds };
    }
    case 'RESET':
      return init({ level: state.level });
    default:
      return state;
  }
}

// levelConfig overrides levelId — pass a full level object for custom mazes.
export default function GameBoard({ levelId, levelConfig, onComplete, onBack, onJournalOpen, journalCount }) {
  const level = levelConfig || getLevel(levelId);
  const [state, dispatch] = useReducer(reducer, { level }, init);

  useEffect(() => {
    if (state.status === 'won' || state.status === 'lost') {
      const { stars } = computeStarsAdvanced(state.attempts, state.level, state.status);
      const t = setTimeout(() => {
        onComplete({
          level: state.level,
          attempts: state.attempts,
          treasureIndex: state.treasureIndex,
          status: state.status,
          stars,
        });
      }, state.status === 'won' ? 1100 : 1400);
      return () => clearTimeout(t);
    }
  }, [state.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpen = (idx) => dispatch({ type: 'OPEN', doorIndex: idx });
  const isLarge = level.doorCount > 20;

  return (
    <>
      <HUD
        level={level}
        moves={state.attempts.length}
        onBack={onBack}
        onJournalOpen={onJournalOpen}
        journalCount={journalCount}
      />

      <FeedbackPanel feedback={state.lastFeedback} level={level} />

      <SearchBracket bounds={state.searchBounds} doorCount={level.doorCount} />

      <div
        className={`hallway${isLarge ? ' hallway--large' : ''}`}
        role="group"
        aria-label={`${level.doorCount} doors`}
      >
        {Array.from({ length: level.doorCount }).map((_, i) => {
          const inBounds = !state.searchBounds ||
            (i >= state.searchBounds.left && i <= state.searchBounds.right);
          const eliminated = state.searchBounds !== null && !state.tried[i] && !inBounds;
          const isReveal = state.status === 'lost' && i === state.treasureIndex;
          return (
            <Door
              key={i}
              index={i}
              displayNumber={i + 1}
              attempt={state.tried[i]}
              disabled={state.status !== 'playing'}
              eliminated={eliminated}
              isReveal={isReveal}
              onOpen={handleOpen}
            />
          );
        })}
      </div>

      <ClueHistory attempts={state.attempts} />
    </>
  );
}
