import React from 'react';
import { UserStats } from '../types';
import {
  Flame, Award, BarChart2, Clock, CheckCircle2, Bookmark, TrendingUp, Sparkles, Target, Calendar
} from 'lucide-react';

interface AnalyticsViewProps {
  stats: UserStats;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats }) => {
  const skills = [
    { name: '地道用词与表达 (Idiomatic Vocabulary)', score: 88, color: 'from-indigo-500 to-purple-500' },
    { name: '发音连读与语调 (Pronunciation & Liaison)', score: 92, color: 'from-emerald-500 to-teal-500' },
    { name: '语法准确度 (Grammar Precision)', score: 85, color: 'from-amber-500 to-orange-500' },
    { name: '即兴对答流畅度 (Response Fluency)', score: 89, color: 'from-pink-500 to-rose-500' },
  ];

  const daysOfWeek = [
    { day: '周一', date: '08-01', active: true },
    { day: '周二', date: '08-02', active: true },
    { day: '周三', date: '08-03', active: true },
    { day: '周四', date: '08-04', active: true },
    { day: '周五', date: '08-05', active: true },
    { day: '周六', date: '08-06', active: true },
    { day: '周日', date: '08-07', active: true },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-pink-400 font-semibold text-xs mb-1">
          <BarChart2 className="w-4 h-4" />
          <span>口语能力数据看板</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">英语口语成长与学习分析</h1>
      </div>

      {/* Hero Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <Flame className="w-5 h-5 fill-amber-500/20" />
            <span className="text-xs font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">连续打卡</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.currentStreakDays} <span className="text-sm font-medium text-slate-400">天</span></p>
          <p className="text-xs text-slate-500">保持状态，每日坚持口语训练</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-full">累计时长</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.totalMinutesPracticed} <span className="text-sm font-medium text-slate-400">分钟</span></p>
          <p className="text-xs text-slate-500">沉浸式模拟对话输入</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">通关场景</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.conversationsCompleted} <span className="text-sm font-medium text-slate-400">个</span></p>
          <p className="text-xs text-slate-500">涵盖日常生活与职场情境</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-teal-400">
            <Bookmark className="w-5 h-5" />
            <span className="text-xs font-semibold bg-teal-500/10 px-2 py-0.5 rounded-full">已掌握地道表达</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.expressionsSaved} <span className="text-sm font-medium text-slate-400">条</span></p>
          <p className="text-xs text-slate-500">随时可以在Vault中隐文复习</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fluency Dimensions */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>口语核心维度评估 (Fluency Radar)</span>
            </h3>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
              综合地道得分: {stats.averageFluencyScore} 分
            </span>
          </div>

          <div className="space-y-4">
            {skills.map((skill, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">{skill.name}</span>
                  <span className="text-white font-mono">{skill.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Streak Heatmap */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>近7天练习打卡日历</span>
              </h3>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-[11px] text-slate-400">{d.day}</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs shadow-md">
                    ✓
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>连续打卡进阶奖励</span>
            </div>
            <p className="text-slate-400">已连续打卡 {stats.currentStreakDays} 天，解锁【Silicon Valley 商务谈判与面试演练】高级外教特权！</p>
          </div>
        </div>
      </div>
    </div>
  );
};
