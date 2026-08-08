import React from 'react';
import { PracticeMode } from '../types';
import { MessageSquare, Compass, Sparkles, Bookmark, Flame, Award, BarChart2 } from 'lucide-react';

interface HeaderProps {
  currentMode: PracticeMode;
  onSelectMode: (mode: PracticeMode) => void;
  streakDays: number;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  streakDays,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectMode('tutor')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  SpeakNative
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  AI Coach
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI 地道英语口语陪练 & 场景润色</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-tutor-btn"
              onClick={() => onSelectMode('tutor')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentMode === 'tutor'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-300" />
              <span>AI外教陪练</span>
            </button>

            <button
              id="nav-scenarios-btn"
              onClick={() => onSelectMode('scenarios')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentMode === 'scenarios'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4 text-purple-300" />
              <span>日常对话场景</span>
            </button>

            <button
              id="nav-polish-btn"
              onClick={() => onSelectMode('polish')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentMode === 'polish'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>地道回复润色</span>
            </button>

            <button
              id="nav-vault-btn"
              onClick={() => onSelectMode('vault')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all relative ${
                currentMode === 'vault'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="w-4 h-4 text-teal-300" />
              <span className="hidden md:inline">生词与表达</span>
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              id="nav-analytics-btn"
              onClick={() => onSelectMode('analytics')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentMode === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-pink-300" />
              <span className="hidden lg:inline">学习统计</span>
            </button>
          </nav>

          {/* User Streak & Profile Stats */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-full text-xs text-amber-400 font-semibold shadow-inner">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{streakDays} 天连续打卡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Native App Style) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 flex justify-around items-center px-2 py-2 shadow-2xl">
        <button
          onClick={() => onSelectMode('tutor')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
            currentMode === 'tutor' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">AI外教</span>
        </button>

        <button
          onClick={() => onSelectMode('scenarios')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
            currentMode === 'scenarios' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">情景选择</span>
        </button>

        <button
          onClick={() => onSelectMode('polish')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
            currentMode === 'polish' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">表达润色</span>
        </button>

        <button
          onClick={() => onSelectMode('vault')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all relative ${
            currentMode === 'vault' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px]">生词表达</span>
          {savedCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-teal-400 rounded-full animate-ping" />
          )}
        </button>

        <button
          onClick={() => onSelectMode('analytics')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
            currentMode === 'analytics' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px]">学习统计</span>
        </button>
      </nav>
    </header>
  );
};
