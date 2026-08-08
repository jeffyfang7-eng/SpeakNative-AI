import React, { useState } from 'react';
import { PracticeMode, Scenario, SavedExpression, UserStats } from './types';
import { PRACTICE_SCENARIOS } from './data/scenarios';
import { Header } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { AITutorChat } from './components/AITutorChat';
import { NativePolishStudio } from './components/NativePolishStudio';
import { SavedVault } from './components/SavedVault';
import { AnalyticsView } from './components/AnalyticsView';

export default function App() {
  const [currentMode, setCurrentMode] = useState<PracticeMode>('tutor');
  const [activeScenario, setActiveScenario] = useState<Scenario>(PRACTICE_SCENARIOS[0]);

  // Initial pre-populated native expressions with localStorage persistence
  const [savedExpressions, setSavedExpressions] = useState<SavedExpression[]>(() => {
    try {
      const localData = localStorage.getItem('speaknative_saved_expressions');
      if (localData) {
        return JSON.parse(localData);
      }
    } catch (e) {
      console.error('Failed to load saved expressions from localStorage', e);
    }
    return [
      {
        id: 'saved-1',
        originalText: 'My English is very poor.',
        polishedText: "I'm still working on getting my English fluent.",
        chineseMeaning: '用工作进行中/提升中代替否定性的poor，语气更自信积极',
        category: '日常生活',
        savedAt: '2026-08-07'
      },
      {
        id: 'saved-2',
        originalText: 'Can you give me a discount?',
        polishedText: "Is there any room for flexibility on the price?",
        chineseMeaning: '商务及日常购物礼貌地询问讨价还价余地',
        category: '地道润色',
        savedAt: '2026-08-07'
      },
      {
        id: 'saved-3',
        originalText: 'I will try my best to finish tomorrow.',
        polishedText: "I'll do everything I can to get this wrapped up by tomorrow.",
        chineseMeaning: '用wrap up表达完成并交付，显得地道专业',
        category: '职场面试',
        savedAt: '2026-08-07'
      }
    ];
  });

  // Persist to localStorage whenever savedExpressions change
  React.useEffect(() => {
    try {
      localStorage.setItem('speaknative_saved_expressions', JSON.stringify(savedExpressions));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedExpressions]);

  const [stats, setStats] = useState<UserStats>({
    totalMinutesPracticed: 145,
    conversationsCompleted: 8,
    expressionsSaved: 3,
    currentStreakDays: 7,
    averageFluencyScore: 88,
  });

  const handleSelectScenario = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setCurrentMode('tutor'); // Auto switch to tutor chat view
  };

  const handleSaveExpression = (newExpr: Omit<SavedExpression, 'id' | 'savedAt'>) => {
    const expr: SavedExpression = {
      ...newExpr,
      id: `saved-${Date.now()}`,
      savedAt: new Date().toISOString().split('T')[0],
    };
    setSavedExpressions((prev) => [expr, ...prev]);
    setStats((prev) => ({
      ...prev,
      expressionsSaved: prev.expressionsSaved + 1,
    }));
  };

  const handleDeleteExpression = (id: string) => {
    setSavedExpressions((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        streakDays={stats.currentStreakDays}
        savedCount={savedExpressions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 sm:pb-12">
        <div className={currentMode === 'tutor' ? 'block' : 'hidden'}>
          <AITutorChat
            activeScenario={activeScenario}
            onSaveExpression={handleSaveExpression}
            savedExpressions={savedExpressions}
          />
        </div>

        {currentMode === 'scenarios' && (
          <ScenarioSelector
            onSelectScenario={handleSelectScenario}
            activeScenarioId={activeScenario.id}
          />
        )}

        <div className={currentMode === 'polish' ? 'block' : 'hidden'}>
          <NativePolishStudio
            onSaveExpression={handleSaveExpression}
            savedExpressions={savedExpressions}
          />
        </div>

        {currentMode === 'vault' && (
          <SavedVault
            savedExpressions={savedExpressions}
            onDeleteExpression={handleDeleteExpression}
          />
        )}

        {currentMode === 'analytics' && (
          <AnalyticsView stats={stats} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>SpeakNative AI Coach — Powered by Gemini 3.6 & Native Dialogue Engine</p>
      </footer>
    </div>
  );
}
