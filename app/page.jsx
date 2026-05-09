'use client';

import { useState, useCallback } from 'react';
import StartScreen from '@/components/StartScreen';
import GameBoard from '@/components/GameBoard';
import LevelComplete from '@/components/LevelComplete';
import GameComplete from '@/components/GameComplete';
import Level6Choice from '@/components/Level6Choice';
import MakerFlow from '@/components/MakerFlow';
import JoinFlow from '@/components/JoinFlow';
import StrategyJournal from '@/components/StrategyJournal';
import { LEVELS } from '@/lib/levels';

const SCREENS = {
  START:   'start',
  LEVEL6:  'level6',
  MAKER:   'maker',
  JOIN:    'join',
  GAME:    'game',
  COMPLETE:'complete',
  FINISHED:'finished',
};

export default function Page() {
  const [screen, setScreen] = useState(SCREENS.START);
  const [activeLevelId, setActiveLevelId] = useState(1);
  const [customLevel, setCustomLevel] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [progress, setProgress] = useState({});

  // Journal state
  const [journal, setJournal] = useState([]);
  const [journalOpen, setJournalOpen] = useState(false);

  const handleStart = useCallback((id) => {
    setCustomLevel(null);
    setActiveLevelId(id);
    setScreen(SCREENS.GAME);
  }, []);

  const handlePlayCustom = useCallback((levelConfig) => {
    setCustomLevel(levelConfig);
    setScreen(SCREENS.GAME);
  }, []);

  const handleLevelDone = useCallback((result) => {
    setLastResult(result);
    if (result.level.id !== 'custom') {
      setProgress((prev) => {
        const prior = prev[result.level.id] || 0;
        return prior >= result.stars ? prev : { ...prev, [result.level.id]: result.stars };
      });
    }
    setScreen(SCREENS.COMPLETE);
  }, []);

  const handleNext = useCallback(() => {
    const idx = LEVELS.findIndex((l) => l.id === activeLevelId);
    if (idx < 0 || idx >= LEVELS.length - 1) {
      setScreen(SCREENS.FINISHED);
      return;
    }
    setCustomLevel(null);
    setActiveLevelId(LEVELS[idx + 1].id);
    setScreen(SCREENS.GAME);
  }, [activeLevelId]);

  const handleReplay = useCallback(() => setScreen(SCREENS.GAME), []);
  const handleBackToMenu = useCallback(() => {
    setCustomLevel(null);
    setScreen(SCREENS.START);
  }, []);

  const handleJournalAdd = useCallback((entry) => {
    setJournal((prev) => [...prev, entry]);
  }, []);

  const isCustomGame = customLevel !== null;

  return (
    <main className="shell">
      {screen === SCREENS.START && (
        <StartScreen
          onStart={handleStart}
          progress={progress}
          onLevel6={() => setScreen(SCREENS.LEVEL6)}
        />
      )}

      {screen === SCREENS.LEVEL6 && (
        <Level6Choice
          onMaker={() => setScreen(SCREENS.MAKER)}
          onJoin={() => setScreen(SCREENS.JOIN)}
          onBack={handleBackToMenu}
        />
      )}

      {screen === SCREENS.MAKER && (
        <MakerFlow onPlay={handlePlayCustom} onBack={() => setScreen(SCREENS.LEVEL6)} />
      )}

      {screen === SCREENS.JOIN && (
        <JoinFlow onPlay={handlePlayCustom} onBack={() => setScreen(SCREENS.LEVEL6)} />
      )}

      {screen === SCREENS.GAME && (
        <GameBoard
          key={isCustomGame ? `custom-${customLevel.code}-${Date.now()}` : `${activeLevelId}-${Date.now()}`}
          levelId={isCustomGame ? undefined : activeLevelId}
          levelConfig={isCustomGame ? customLevel : undefined}
          onComplete={handleLevelDone}
          onBack={handleBackToMenu}
          onJournalOpen={() => setJournalOpen(true)}
          journalCount={journal.length}
        />
      )}

      {screen === SCREENS.COMPLETE && lastResult && (
        <LevelComplete
          result={lastResult}
          hasNext={
            !isCustomGame &&
            LEVELS.findIndex((l) => l.id === activeLevelId) < LEVELS.length - 1
          }
          isCustom={isCustomGame}
          onNext={handleNext}
          onReplay={handleReplay}
          onMenu={handleBackToMenu}
          onJournalAdd={handleJournalAdd}
          onJournalOpen={() => setJournalOpen(true)}
          journalCount={journal.length}
        />
      )}

      {screen === SCREENS.FINISHED && (
        <GameComplete progress={progress} onMenu={handleBackToMenu} />
      )}

      {journalOpen && (
        <StrategyJournal entries={journal} onClose={() => setJournalOpen(false)} />
      )}
    </main>
  );
}
