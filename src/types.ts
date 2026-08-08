export type PracticeMode = 'scenarios' | 'tutor' | 'polish' | 'vault' | 'analytics';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Scenario {
  id: string;
  title: string;
  titleZh: string;
  category: 'Dining' | 'Travel' | 'Career' | 'Daily' | 'Social' | 'Business' | 'Medical';
  categoryZh: string;
  description: string;
  descriptionZh: string;
  difficulty: DifficultyLevel;
  userRole: string;
  aiRole: string;
  starterMessage: string;
  goal: string;
  goalZh: string;
  suggestedPhrases: string[];
  iconName: string;
  imagePrompt?: string;
}

export interface TutorPersona {
  id: string;
  name: string;
  title: string;
  accent: 'American' | 'British' | 'Australian' | 'Canadian';
  accentZh: string;
  avatarUrl: string;
  personality: string;
  personalityZh: string;
  voiceName: string;
  gender: 'female' | 'male';
  tagline: string;
}

export interface UserInputAnalysis {
  isGrammaticallyCorrect: boolean;
  userOriginal: string;
  nativePolished: string;
  grammarNotes: string;
  vocabularyHighlights: Array<{
    word: string;
    meaningZh: string;
    example: string;
  }>;
  pronunciationTips?: string;
  fluencyScore: number; // 0 - 100
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  textZh?: string;
  timestamp: string;
  audioUrl?: string;
  analysis?: UserInputAnalysis;
  suggestedNextPrompts?: string[];
}

export interface NativePolishResult {
  original: string;
  casualNative: {
    english: string;
    chinese: string;
    explanation: string;
  };
  professionalNative: {
    english: string;
    chinese: string;
    explanation: string;
  };
  colloquialSlang: {
    english: string;
    chinese: string;
    explanation: string;
  };
  keyVocabulary: Array<{
    phrase: string;
    phonetic: string;
    definitionZh: string;
    nativeExample: string;
  }>;
  commonChinglishPitfall?: string;
}

export interface SavedExpression {
  id: string;
  originalText: string;
  polishedText: string;
  chineseMeaning: string;
  category: string;
  savedAt: string;
  notes?: string;
}

export interface UserStats {
  totalMinutesPracticed: number;
  conversationsCompleted: number;
  expressionsSaved: number;
  currentStreakDays: number;
  averageFluencyScore: number;
}
