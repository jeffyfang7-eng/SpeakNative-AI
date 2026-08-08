import React, { useState } from 'react';
import { Scenario, DifficultyLevel } from '../types';
import { PRACTICE_SCENARIOS } from '../data/scenarios';
import {
  Coffee, Plane, Briefcase, Building, Utensils, Smile, Stethoscope, ShoppingBag, Compass,
  Sparkles, Plus, Search, Filter, CheckCircle2, ArrowRight, Wand2, Loader2, Target
} from 'lucide-react';

interface ScenarioSelectorProps {
  onSelectScenario: (scenario: Scenario) => void;
  activeScenarioId?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Coffee, Plane, Briefcase, Building, Utensils, Smile, Stethoscope, ShoppingBag
};

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  onSelectScenario,
  activeScenarioId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Custom Scenario Builder Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [scenariosList, setScenariosList] = useState<Scenario[]>(PRACTICE_SCENARIOS);

  const categories = [
    { key: 'All', nameZh: '全部场景' },
    { key: 'Dining', nameZh: '餐饮美食' },
    { key: 'Travel', nameZh: '旅游出行' },
    { key: 'Career', nameZh: '职场面试' },
    { key: 'Daily', nameZh: '日常生活' },
    { key: 'Social', nameZh: '社交闲聊' },
    { key: 'Medical', nameZh: '医疗健康' },
  ];

  const filteredScenarios = scenariosList.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || s.difficulty === selectedDifficulty;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.titleZh.includes(searchQuery) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.descriptionZh.includes(searchQuery);
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleGenerateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGeneratingCustom(true);
    try {
      const res = await fetch('/api/custom-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt }),
      });
      if (!res.ok) throw new Error('Failed to create scenario');
      const customScenario: Scenario = await res.json();
      
      // Ensure icon fallback
      if (!customScenario.iconName) customScenario.iconName = 'Sparkles';
      
      setScenariosList([customScenario, ...scenariosList]);
      setIsCustomModalOpen(false);
      setCustomPrompt('');
      onSelectScenario(customScenario);
    } catch (err) {
      console.error(err);
      alert('自定义场景生成失败，请重试');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Title Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>日常对话实景演练</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            选择对话场景，开启真实情境口语陪练
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">
            涵盖生活、职场、旅游、餐饮等多种高频原生场景，AI外教实时入戏引导与专业润色
          </p>
        </div>

        {/* AI Custom Scenario Generator Button */}
        <button
          id="custom-scenario-btn"
          onClick={() => setIsCustomModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Wand2 className="w-5 h-5" />
          <span>AI 一键定制任意专属场景</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 mb-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                {cat.nameZh}
              </button>
            ))}
          </div>

          {/* Search & Difficulty Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索场景关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl text-xs">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-slate-800 text-indigo-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {diff === 'All'
                    ? '不限难度'
                    : diff === 'Beginner'
                    ? '初级'
                    : diff === 'Intermediate'
                    ? '中级'
                    : '高级'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map((scenario) => {
          const IconComponent = ICON_MAP[scenario.iconName] || Sparkles;
          const isActive = activeScenarioId === scenario.id;

          const difficultyBadgeColor =
            scenario.difficulty === 'Beginner'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : scenario.difficulty === 'Intermediate'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

          return (
            <div
              key={scenario.id}
              className={`group relative bg-slate-900/80 border rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/10 ${
                isActive
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-slate-900'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-[11px] font-semibold border rounded-full ${difficultyBadgeColor}`}>
                      {scenario.difficulty === 'Beginner' ? '初级入门' : scenario.difficulty === 'Intermediate' ? '中级进阶' : '高阶地道'}
                    </span>
                    <span className="px-2.5 py-1 text-[11px] bg-slate-800 text-slate-300 rounded-full font-medium">
                      {scenario.categoryZh}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {scenario.titleZh}
                </h3>
                <p className="text-xs font-semibold text-indigo-400/90 mb-2">{scenario.title}</p>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {scenario.descriptionZh}
                </p>

                {/* Roles & Goal */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 font-medium">你的角色:</span>
                    <span className="font-semibold text-indigo-300">{scenario.userRole}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 font-medium">AI角色:</span>
                    <span className="font-semibold text-purple-300">{scenario.aiRole}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/60 flex items-start gap-1.5 text-slate-300">
                    <Target className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-amber-300">陪练目标:</strong> {scenario.goalZh}</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                id={`select-scenario-${scenario.id}`}
                onClick={() => onSelectScenario(scenario)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white'
                }`}
              >
                <span>{isActive ? '正在进行此场景对话' : '开启 AI 场景陪练'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom AI Scenario Builder Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">一键生成专属对话场景</h3>
                  <p className="text-xs text-slate-400">输入任意你想练习的真实生活或工作情境</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  场景需求描述 (例如: "在纽约租房向房东要求维修空调并协商租金", "在伦敦大英博物馆买票并询问导览")
                </label>
                <textarea
                  rows={4}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="请输入你想练习的具体场景、目标与角色关系..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingCustom || !customPrompt.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {isGeneratingCustom ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI 正在构建场景中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>生成并立即开启</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
