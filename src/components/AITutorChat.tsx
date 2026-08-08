import React, { useState, useEffect, useRef } from 'react';
import { Scenario, TutorPersona, ChatMessage, UserInputAnalysis, SavedExpression } from '../types';
import { TUTOR_PERSONAS } from '../data/tutors';
import {
  Mic, MicOff, Send, Volume2, Sparkles, Languages, Check, Copy, Bookmark,
  RefreshCw, Lightbulb, User, Bot, AlertCircle, ChevronDown, ChevronUp, Play, Pause, RotateCcw, Award
} from 'lucide-react';

interface AITutorChatProps {
  activeScenario: Scenario;
  onSaveExpression: (expr: Omit<SavedExpression, 'id' | 'savedAt'>) => void;
  savedExpressions: SavedExpression[];
}

// Robust Tutor Avatar Component with onError fallback and flag badge
const TutorAvatar: React.FC<{
  tutor: TutorPersona;
  sizeClass?: string;
  ringClass?: string;
}> = ({ tutor, sizeClass = 'w-9 h-9', ringClass = '' }) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getFlag = (id: string) => {
    if (id === 'emma-uk') return '🇬🇧';
    if (id === 'david-au') return '🇦🇺';
    if (id === 'sarah-biz') return '💼';
    return '🇺🇸';
  };

  if (hasError) {
    return (
      <div className="relative inline-block shrink-0">
        <div
          className={`${sizeClass} rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs shadow-md ${ringClass}`}
        >
          <span>{getInitials(tutor.name)}</span>
        </div>
        <span className="absolute -bottom-1 -right-1 text-[10px] leading-none bg-slate-900 border border-slate-700 p-0.5 rounded-full shadow">
          {getFlag(tutor.id)}
        </span>
      </div>
    );
  }

  return (
    <div className="relative inline-block shrink-0">
      <img
        src={tutor.avatarUrl}
        alt={tutor.name}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`${sizeClass} rounded-2xl object-cover shadow-md ${ringClass}`}
      />
      <span className="absolute -bottom-1 -right-1 text-[10px] leading-none bg-slate-900 border border-slate-700 p-0.5 rounded-full shadow">
        {getFlag(tutor.id)}
      </span>
    </div>
  );
};

export const AITutorChat: React.FC<AITutorChatProps> = ({
  activeScenario,
  onSaveExpression,
  savedExpressions,
}) => {
  const [selectedTutor, setSelectedTutor] = useState<TutorPersona>(TUTOR_PERSONAS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<string | null>(null);
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Starter Message ONLY when active scenario changes
  useEffect(() => {
    const starter: ChatMessage = {
      id: `msg-starter-${Date.now()}`,
      sender: 'ai',
      text: activeScenario.starterMessage,
      textZh: '你好！欢迎来到本次的口语场景，准备好开始对话了吗？',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedNextPrompts: activeScenario.suggestedPhrases.slice(0, 3)
    };
    setMessages([starter]);
    if (autoPlayAudio) {
      speakText(activeScenario.starterMessage);
    }
  }, [activeScenario]);

  // Smooth scroll ONLY inside internal chat container (prevents window scrolling down)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  // Web Speech API Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('您的浏览器暂不支持语音识别，请直接在文本框中输入或更换Chrome浏览器。');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Text-to-Speech Handler
  const speakText = (text: string, id?: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop current playing

    if (id && currentlyPlayingId === id) {
      setCurrentlyPlayingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedTutor.accent === 'British' ? 'en-GB' : 'en-US';
    utterance.rate = speechSpeed;

    utterance.onend = () => setCurrentlyPlayingId(null);
    utterance.onerror = () => setCurrentlyPlayingId(null);

    if (id) setCurrentlyPlayingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Send Message Handler (Call Backend /api/chat)
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsgId = `msg-user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: activeScenario.titleZh,
          scenarioContext: `${activeScenario.descriptionZh} Goal: ${activeScenario.goalZh}`,
          tutorName: selectedTutor.name,
          tutorAccent: selectedTutor.accent,
          tutorPersonality: selectedTutor.personality,
          conversationHistory: newHistory.map((m) => ({ sender: m.sender, text: m.text })),
          userMessage: text.trim(),
        }),
      });

      if (!response.ok) throw new Error('API server error');

      const data = await response.json();

      // Attach analysis to the last user message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMsgId
            ? { ...msg, analysis: data.analysis }
            : msg
        )
      );

      // Add AI reply message
      const aiMsgId = `msg-ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: data.replyText,
        textZh: data.translation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedNextPrompts: data.nextSuggestedPrompts || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
      setExpandedAnalysisId(userMsgId); // Auto-expand analysis card for user feedback

      if (autoPlayAudio) {
        speakText(data.replyText, aiMsgId);
      }
    } catch (err) {
      console.error(err);
      // Fallback response if network fails
      const fallbackAiMsg: ChatMessage = {
        id: `msg-ai-err-${Date.now()}`,
        sender: 'ai',
        text: "That's very interesting! Could you tell me a bit more about that?",
        textZh: "这很有趣！你能再多告诉我一些吗？",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToVault = (analysis: UserInputAnalysis) => {
    onSaveExpression({
      originalText: analysis.userOriginal || '',
      polishedText: analysis.nativePolished,
      chineseMeaning: analysis.grammarNotes || 'AI地道润色与语法指导',
      category: activeScenario.categoryZh,
    });
    setToastMessage('已成功存入【生词与表达】！');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleTranslation = (id: string) => {
    setShowTranslations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500 text-emerald-200 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Tutor Selector & Scenario Goals */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Tutor Card & Switcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">选择你的 AI 外教导师</span>
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                {selectedTutor.accentZh}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <TutorAvatar tutor={selectedTutor} sizeClass="w-16 h-16" ringClass="ring-2 ring-indigo-500/50" />
              <div>
                <h3 className="font-bold text-white text-base">{selectedTutor.name}</h3>
                <p className="text-xs text-indigo-300 font-medium">{selectedTutor.title}</p>
                <p className="text-xs text-slate-400 mt-1 italic">"{selectedTutor.tagline}"</p>
              </div>
            </div>

            {/* Tutor List Thumbnails */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
              {TUTOR_PERSONAS.map((tutor) => (
                <button
                  key={tutor.id}
                  onClick={() => {
                    if (selectedTutor.id !== tutor.id) {
                      setSelectedTutor(tutor);
                      setToastMessage(`已切换为外教 ${tutor.name} (${tutor.accentZh})`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left border transition-all ${
                    selectedTutor.id === tutor.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <TutorAvatar tutor={tutor} sizeClass="w-8 h-8" />
                  <div className="truncate">
                    <p className="text-xs font-semibold truncate">{tutor.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{tutor.accentZh}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Scenario Info & Goals */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">当前演练场景</span>
              <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-md font-medium">
                {activeScenario.categoryZh}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{activeScenario.titleZh}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{activeScenario.descriptionZh}</p>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">你的身份:</span>
                <span className="font-semibold text-indigo-300">{activeScenario.userRole}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">AI导师身份:</span>
                <span className="font-semibold text-purple-300">{activeScenario.aiRole}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-amber-300">
                <strong>通关目标:</strong> {activeScenario.goalZh}
              </div>
            </div>

            {/* Audio & Speed Controls */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">朗读语速:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {[0.8, 1.0, 1.2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSpeechSpeed(speed)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      speechSpeed === speed ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Column: Interactive Chat Stream */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[700px] overflow-hidden">
          {/* Top Bar */}
          <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>与 {selectedTutor.name} 对话中</span>
                  <span className="text-xs font-normal text-slate-400">({activeScenario.titleZh})</span>
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages([]);
                const starter: ChatMessage = {
                  id: `msg-starter-${Date.now()}`,
                  sender: 'ai',
                  text: activeScenario.starterMessage,
                  textZh: '你好！欢迎来到本次的口语场景，准备好开始对话了吗？',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  suggestedNextPrompts: activeScenario.suggestedPhrases.slice(0, 3)
                };
                setMessages([starter]);
              }}
              className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置对话</span>
            </button>
          </div>

          {/* Messages Timeline */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isPlaying = currentlyPlayingId === msg.id;
              const isSaved = msg.analysis && savedExpressions.some((e) => e.originalText === msg.analysis?.userOriginal);

              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className="shrink-0">
                      {isUser ? (
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          You
                        </div>
                      ) : (
                        <TutorAvatar tutor={selectedTutor} sizeClass="w-9 h-9" ringClass="ring-2 ring-purple-500/40" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className="space-y-2">
                      <div
                        className={`rounded-2xl p-4 shadow-md ${
                          isUser
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                            : 'bg-slate-800 border border-slate-700/70 text-slate-100 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm sm:text-base leading-relaxed font-medium">{msg.text}</p>

                        {/* Translation reveal for AI message */}
                        {!isUser && msg.textZh && (
                          <div className="mt-2 pt-2 border-t border-slate-700/60">
                            <button
                              onClick={() => toggleTranslation(msg.id)}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                            >
                              <Languages className="w-3.5 h-3.5" />
                              <span>{showTranslations[msg.id] ? '隐藏中文翻译' : '查看中文翻译'}</span>
                            </button>
                            {showTranslations[msg.id] && (
                              <p className="text-xs text-slate-300 mt-1 leading-normal font-normal bg-slate-900/60 p-2 rounded-lg">
                                {msg.textZh}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Bubble Audio & Action bar */}
                        <div className="flex items-center justify-between gap-4 mt-2 pt-1">
                          <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                          <button
                            onClick={() => speakText(msg.text, msg.id)}
                            className={`p-1 rounded-md text-xs transition-colors flex items-center gap-1 ${
                              isPlaying ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white'
                            }`}
                            title="播放发音"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isPlaying ? '朗读中...' : '朗读'}</span>
                          </button>
                        </div>
                      </div>

                      {/* AI Native Expression Polish Card (If attached to User message) */}
                      {isUser && msg.analysis && (() => {
                        const isSaved = savedExpressions.some(
                          (e) => e.polishedText.trim().toLowerCase() === msg.analysis!.nativePolished.trim().toLowerCase()
                        );

                        return (
                          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 mt-2 text-left animate-fade-in">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-bold text-amber-300">AI 地道表达润色评估</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                                  原生拟真度 {msg.analysis.fluencyScore}%
                                </span>
                                <button
                                  onClick={() =>
                                    setExpandedAnalysisId(expandedAnalysisId === msg.id ? null : msg.id)
                                  }
                                  className="text-slate-400 hover:text-white p-1"
                                >
                                  {expandedAnalysisId === msg.id ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Polish comparison highlight */}
                            <div className="space-y-2">
                              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400 font-medium">地道老外这样说:</span>
                                  {/* Prominent Save to Notebook Button ALWAYS visible */}
                                  <button
                                    onClick={() => handleSaveToVault(msg.analysis!)}
                                    disabled={isSaved}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                      isSaved
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95'
                                    }`}
                                  >
                                    <Bookmark className="w-3.5 h-3.5" />
                                    <span>{isSaved ? '已存入表达本' : '存入地道表达本'}</span>
                                  </button>
                                </div>
                                <p className="text-sm font-semibold text-emerald-400 flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                                  <span>"{msg.analysis.nativePolished}"</span>
                                  <button
                                    onClick={() => speakText(msg.analysis!.nativePolished)}
                                    className="text-slate-400 hover:text-emerald-300 p-1 shrink-0"
                                    title="播放发音"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                </p>
                              </div>

                              {/* Detailed Explanation Accordion */}
                              {expandedAnalysisId === msg.id && (
                                <div className="space-y-2 pt-1 text-xs">
                                  <div className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                    <strong className="text-indigo-400 block mb-1">语法与修辞建议:</strong>
                                    {msg.analysis.grammarNotes}
                                  </div>

                                  {msg.analysis.vocabularyHighlights.length > 0 && (
                                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                      <strong className="text-purple-400 block mb-1">核心地道用词/地道搭配:</strong>
                                      <div className="flex flex-wrap gap-1.5 mt-1">
                                        {msg.analysis.vocabularyHighlights.map((vocab, i) => (
                                          <span
                                            key={i}
                                            className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-md font-mono"
                                            title={vocab.example}
                                          >
                                            {vocab.word} ({vocab.meaningZh})
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* AI Suggested Response Hints Pills (for AI messages) */}
                  {!isUser && msg.suggestedNextPrompts && msg.suggestedNextPrompts.length > 0 && (
                    <div className="mt-3 ml-12 max-w-[80%]">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 mb-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>你可以接着这样说 (点击直接填写):</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedNextPrompts.map((hint, i) => (
                          <button
                            key={i}
                            onClick={() => setInputText(hint)}
                            className="px-3 py-1.5 bg-slate-950 border border-indigo-500/30 hover:border-indigo-500 text-slate-300 hover:text-white rounded-xl text-xs text-left transition-all hover:bg-indigo-600/20"
                          >
                            "{hint}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 text-slate-400 text-xs italic bg-slate-950/60 p-3 rounded-2xl border border-slate-800 w-fit">
                <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>{selectedTutor.name} 正在思考回复并进行地道润色分析...</span>
              </div>
            )}
          </div>

          {/* Bottom Audio Recording & Input Bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              {/* Voice Recording Mic Button */}
              <button
                id="mic-speech-input-btn"
                onClick={toggleMic}
                className={`p-3.5 rounded-2xl flex items-center justify-center transition-all shadow-lg shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
                title={isListening ? '点击停止录音' : '点击开始语音输入'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Input Area */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    isListening ? '正在倾听您的英文发音...' : '用英文输入你的回答，或使用左侧语音按钮...'
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-4 pr-12 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  id="send-chat-btn"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-40 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isListening && (
              <div className="flex items-center justify-between text-xs text-rose-400 px-2 animate-fade-in">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  麦克风录音中，请对准话筒大声说英语...
                </span>
                <span className="text-slate-500">点击红色按钮可随时结束录音</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
