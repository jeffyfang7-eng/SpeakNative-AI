import React, { useState } from 'react';
import { SavedExpression } from '../types';
import {
  Bookmark, Volume2, Trash2, Search, Filter, Eye, EyeOff, Layers, CheckCircle2, AlertTriangle, X
} from 'lucide-react';

interface SavedVaultProps {
  savedExpressions: SavedExpression[];
  onDeleteExpression: (id: string) => void;
  onSaveExpression?: (expr: Omit<SavedExpression, 'id' | 'savedAt'>) => void;
}

export const SavedVault: React.FC<SavedVaultProps> = ({
  savedExpressions,
  onDeleteExpression,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [revealEnglish, setRevealEnglish] = useState<Record<string, boolean>>({});
  const [flashcardMode, setFlashcardMode] = useState(false);

  // State for deletion confirmation dialog
  const [deletingItem, setDeletingItem] = useState<SavedExpression | null>(null);

  const categories = ['All', ...Array.from(new Set(savedExpressions.map((e) => e.category)))];

  const filtered = savedExpressions.filter((e) => {
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesSearch =
      e.polishedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.chineseMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.originalText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const toggleReveal = (id: string) => {
    setRevealEnglish((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs mb-1">
            <Bookmark className="w-4 h-4" />
            <span>地道表达收藏与复习本</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">生词短语与地道例句 Vault</h1>
          <p className="text-xs text-slate-400 mt-1">支持在AI陪练、句式润色时一键存入与随时复习</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFlashcardMode(!flashcardMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all border ${
              flashcardMode
                ? 'bg-teal-900/40 text-teal-300 border-teal-500/50 shadow-lg shadow-teal-500/10'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-400" />
            <span>{flashcardMode ? '切换至列表模式' : 'Flashcard 隐文复习模式'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96 md:w-[440px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索地道表达..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'All' ? '全部领域' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expressions Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm">暂无收藏表达。在【AI外教陪练】或【地道回复润色】中一键存入！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isHidden = flashcardMode && !revealEnglish[item.id];

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 shadow-xl transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-teal-300 font-semibold rounded-md">
                      {item.category}
                    </span>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="删除记录"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Polished Native English */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-teal-400 font-bold uppercase">地道英文表达</span>
                      <button onClick={() => speak(item.polishedText)} className="text-slate-400 hover:text-white">
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isHidden ? (
                      <div
                        onClick={() => toggleReveal(item.id)}
                        className="py-2 text-center text-xs font-semibold text-teal-400/80 bg-slate-900/80 rounded-lg cursor-pointer hover:bg-slate-800 flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>点击揭晓地道英文</span>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-white leading-snug">{item.polishedText}</p>
                    )}
                  </div>

                  {/* Meaning & Notes */}
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 font-medium block mb-0.5">中文含义/使用要领:</span>
                    <p>{item.chineseMeaning}</p>
                  </div>

                  {item.originalText && (
                    <p className="text-[11px] text-slate-500 italic">
                      原句/表达: "{item.originalText}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>收藏时间: {item.savedAt}</span>
                  {flashcardMode && (
                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="text-teal-400 hover:underline flex items-center gap-1"
                    >
                      {revealEnglish[item.id] ? '遮挡答案' : '显示答案'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog for Deleting Expression */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center relative">
            <button
              onClick={() => setDeletingItem(null)}
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">确认删除此地道表达？</h3>
              <p className="text-xs text-amber-300/90 font-medium mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 break-words">
                "{deletingItem.polishedText}"
              </p>
              <p className="text-[11px] text-slate-500 mt-2">删除后该表达将无法再还原</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onDeleteExpression(deletingItem.id);
                  setDeletingItem(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg shadow-rose-600/20"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
