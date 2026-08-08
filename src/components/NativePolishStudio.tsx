import React, { useState } from 'react';
import { NativePolishResult, SavedExpression } from '../types';
import {
  Sparkles, Volume2, Copy, Bookmark, Check, ArrowRight, Lightbulb, RefreshCw, Wand2, BookOpen, CheckCircle2
} from 'lucide-react';

interface NativePolishStudioProps {
  onSaveExpression: (expr: Omit<SavedExpression, 'id' | 'savedAt'>) => void;
  savedExpressions: SavedExpression[];
}

export const NativePolishStudio: React.FC<NativePolishStudioProps> = ({
  onSaveExpression,
  savedExpressions,
}) => {
  const [inputText, setInputText] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [result, setResult] = useState<NativePolishResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to check if an expression is already in saved vault
  const isSaved = (text: string) => {
    return savedExpressions.some(
      (e) => e.polishedText.trim().toLowerCase() === text.trim().toLowerCase()
    );
  };

  // Preset example Chinglish prompts for quick testing
  const presets = [
    'My English is very poor.',
    'I very like eat hot pot in winter.',
    'I will try my best to finish this job tomorrow.',
    'Tomorrow I have something to do so I cannot come.',
    'Can you give me a discount for this shirt?'
  ];

  const handlePolish = async (textToPolish?: string) => {
    const text = textToPolish || inputText;
    if (!text.trim() || isPolishing) return;

    setIsPolishing(true);
    try {
      const res = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) throw new Error('Polish failed');
      const data: NativePolishResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('润色失败，请重试');
    } finally {
      setIsPolishing(false);
    }
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (englishText: string, meaning: string, catTag: string) => {
    const savedAlready = isSaved(englishText);
    onSaveExpression({
      originalText: inputText || result?.original || '',
      polishedText: englishText,
      chineseMeaning: meaning,
      category: catTag,
    });

    if (savedAlready) {
      setToastMessage(`表达已存在，已为您在【生词与表达】中更新位置！`);
    } else {
      setToastMessage(`已成功将地道表达存入【生词与表达】！`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      {/* Fixed Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-teal-500 text-teal-200 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-teal-400" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI 地道表达三重升级 Lab</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          一键把“中式英语”重构为“老外地道表达”
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          输入任何句式草稿或中文意图，AI 将提供【日常地道】、【职场商务】与【流行俚语】三种语境的升华版本
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            输入你要润色的英文原句或中文想法
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="例如: I very like this movie... 或 '我明天可能没时间参加会议，要怎么礼貌拒绝？'"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium">常见中式表达试一试:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(preset);
                handlePolish(preset);
              }}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 rounded-lg transition-all"
            >
              "{preset}"
            </button>
          ))}
        </div>

        {/* Submit CTA */}
        <div className="flex justify-end pt-2">
          <button
            id="start-polish-btn"
            onClick={() => handlePolish()}
            disabled={isPolishing || !inputText.trim()}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isPolishing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI 正在地道升华中...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>立即地道润色</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>三阶地道表达方案 (Polished Tiers)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Casual Native */}
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-indigo-500 transition-all">
              <div className="space-y-3 flex-1 mb-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                    💬 日常口语 (Casual)
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => speak(result.casualNative.english)} className="p-1.5 text-slate-400 hover:text-white">
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(result.casualNative.english, 'casual')}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'casual' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-base font-bold text-white leading-snug">{result.casualNative.english}</p>
                  <p className="text-xs text-slate-400 mt-1">{result.casualNative.chinese}</p>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {result.casualNative.explanation}
                </p>
              </div>

              <button
                onClick={() => handleSave(result.casualNative.english, result.casualNative.chinese, '日常生活')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  isSaved(result.casualNative.english)
                    ? 'bg-teal-950/60 border-teal-500/40 text-teal-300'
                    : 'bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border-transparent'
                }`}
              >
                {isSaved(result.casualNative.english) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>已存入【生词与表达】</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>收藏此表达</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. Professional Workplace */}
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-purple-500 transition-all">
              <div className="space-y-3 flex-1 mb-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                    💼 职场商务 (Professional)
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => speak(result.professionalNative.english)} className="p-1.5 text-slate-400 hover:text-white">
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(result.professionalNative.english, 'pro')}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'pro' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-base font-bold text-white leading-snug">{result.professionalNative.english}</p>
                  <p className="text-xs text-slate-400 mt-1">{result.professionalNative.chinese}</p>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {result.professionalNative.explanation}
                </p>
              </div>

              <button
                onClick={() => handleSave(result.professionalNative.english, result.professionalNative.chinese, '职场商务')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  isSaved(result.professionalNative.english)
                    ? 'bg-teal-950/60 border-teal-500/40 text-teal-300'
                    : 'bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white border-transparent'
                }`}
              >
                {isSaved(result.professionalNative.english) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>已存入【生词与表达】</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>收藏此表达</span>
                  </>
                )}
              </button>
            </div>

            {/* 3. Colloquial Slang */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-amber-500 transition-all">
              <div className="space-y-3 flex-1 mb-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                    💥 地道俚语 (Idiomatic)
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => speak(result.colloquialSlang.english)} className="p-1.5 text-slate-400 hover:text-white">
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(result.colloquialSlang.english, 'slang')}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'slang' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-base font-bold text-white leading-snug">{result.colloquialSlang.english}</p>
                  <p className="text-xs text-slate-400 mt-1">{result.colloquialSlang.chinese}</p>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {result.colloquialSlang.explanation}
                </p>
              </div>

              <button
                onClick={() => handleSave(result.colloquialSlang.english, result.colloquialSlang.chinese, '地道俚语')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  isSaved(result.colloquialSlang.english)
                    ? 'bg-teal-950/60 border-teal-500/40 text-teal-300'
                    : 'bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white border-transparent'
                }`}
              >
                {isSaved(result.colloquialSlang.english) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>已存入【生词与表达】</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>收藏此表达</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Key Vocabulary & Pitfall Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Vocabulary Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>核心地道短语拆解 (Key Vocabulary)</span>
              </h3>
              <div className="space-y-3">
                {result.keyVocabulary.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300 text-sm">{item.phrase}</span>
                      <span className="text-slate-500 font-mono">{item.phonetic}</span>
                    </div>
                    <p className="text-slate-300 font-medium">{item.definitionZh}</p>
                    <p className="text-slate-400 italic">"例句: {item.nativeExample}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chinglish Pitfall Explanation */}
            {result.commonChinglishPitfall && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>中式思维避坑解析 (Chinglish Pitfalls)</span>
                </h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                  {result.commonChinglishPitfall}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
