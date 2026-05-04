'use client';

import { useState, useCallback } from 'react';
import StartScreen from '@/components/StartScreen';
import GameBoard from '@/components/GameBoard';
import LevelComplete from '@/components/LevelComplete';
import GameComplete from '@/components/GameComplete';
import { LEVELS } from '@/lib/levels';

// Three high-level screens. We keep it dead simple: a screen string + payload.
const SCREENS = {
  START: 'start',
  GAME: 'game',
  COMPLETE: 'complete',
  FINISHED: 'finished',
};

export default function Page() {
  const [screen, setScreen] = useState(SCREENS.START);
  const [activeLevelId, setActiveLevelId] = useState(1);
  const [lastResult, setLastResult] = useState(null);
  // Track best stars per level so the start screen can show progress.
  const [progress, setProgress] = useState({}); // { [levelId]: stars }

  const handleStart = useCallback((id) => {
    setActiveLevelId(id);
    setScreen(SCREENS.GAME);
  }, []);

  const handleLevelDone = useCallback((result) => {
    setLastResult(result);
    setProgress((prev) => {
      const prior = prev[result.level.id] || 0;
      return prior >= result.stars ? prev : { ...prev, [result.level.id]: result.stars };
    });
    setScreen(SCREENS.COMPLETE);
  }, []);

  const handleNext = useCallback(() => {
    const idx = LEVELS.findIndex((l) => l.id === activeLevelId);
    if (idx < 0 || idx >= LEVELS.length - 1) {
      setScreen(SCREENS.FINISHED);
      return;
    }
    setActiveLevelId(LEVELS[idx + 1].id);
    setScreen(SCREENS.GAME);
  }, [activeLevelId]);

  const handleReplay = useCallback(() => {
    setScreen(SCREENS.GAME);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setScreen(SCREENS.START);
  }, []);

  return (
    <main className="shell">
      {screen === SCREENS.START && (
        <StartScreen onStart={handleStart} progress={progress} />
      )}
      {screen === SCREENS.GAME && (
        <GameBoard
          key={`${activeLevelId}-${Date.now()}`}
          levelId={activeLevelId}
          onComplete={handleLevelDone}
          onBack={handleBackToMenu}
        />
      )}
      {screen === SCREENS.COMPLETE && lastResult && (
        <LevelComplete
          result={lastResult}
          hasNext={LEVELS.findIndex((l) => l.id === activeLevelId) < LEVELS.length - 1}
          onNext={handleNext}
          onReplay={handleReplay}
          onMenu={handleBackToMenu}
        />
      )}
      {screen === SCREENS.FINISHED && (
        <GameComplete progress={progress} onMenu={handleBackToMenu} />
      )}
    </main>
  );
}
