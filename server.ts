import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy-initialized Gemini AI client
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment variables.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper function with retry and fallback model support (gemini-3.6-flash -> gemini-2.5-flash)
async function generateContentWithFallback(params: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
}) {
  const ai = getAI();
  const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    // Try up to 2 attempts per model
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            responseMimeType: params.responseMimeType,
            responseSchema: params.responseSchema,
          },
        });
        return response;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt ${attempt} failed: ${err?.message || err}`);
        const status = err?.status || err?.code;
        // If 503/UNAVAILABLE or rate-limited, wait briefly before retrying or switching model
        if (attempt < 2 && (status === 503 || status === 'UNAVAILABLE' || status === 429)) {
          await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
        }
      }
    }
  }

  throw lastError;
}
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. AI Tutor Dialogue Endpoint (Roleplay + Native Polishing Analysis)
app.post('/api/chat', async (req, res) => {
  try {
    const { scenarioTitle, scenarioContext, tutorName, tutorAccent, tutorPersonality, conversationHistory, userMessage } = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    const ai = getAI();

    const systemInstruction = `
You are an expert AI Native English Speaking Coach & Roleplay Partner named ${tutorName || 'Alex'} (${tutorAccent || 'American Accent'}).
Your personality: ${tutorPersonality || 'Encouraging, patient, native speaker'}.

Current Roleplay Scenario: "${scenarioTitle || 'General Spoken Practice'}"
Scenario Context & Goal: ${scenarioContext || 'Engage in natural everyday conversational English.'}

YOUR DUAL ROLE IN THIS RESPONSE:
1. In-Character Partner: Respond naturally in English to the user's latest input, maintaining your persona and keeping the conversation moving forward smoothly.
2. Pedagogical Native Coach: Analyze the user's latest input ("${userMessage}"). Evaluate its naturalness, grammar, and native tone. Provide a polished native version that sounds like a native speaker would say it in real life.

IMPORTANT RULES FOR ANALYSIS:
- Never mock the user.
- If the user's message is already native and perfect, praise it in grammarNotes and give an alternative native phrasing.
- If the user wrote Chinglish or awkward phrasing, politely fix it in nativePolished and explain why in grammarNotes.
- Provide 3 helpful next suggested prompts for the user to help them continue the conversation seamlessly.

Provide your output strictly in JSON format.
`;

    const contents = `
Previous Conversation Context:
${(conversationHistory || []).map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}

LATEST USER INPUT TO ANALYZE AND REPLY TO:
"${userMessage}"
`;

    const response = await generateContentWithFallback({
      contents,
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          replyText: {
            type: Type.STRING,
            description: 'Your in-character conversational response in English.'
          },
          translation: {
            type: Type.STRING,
            description: 'Chinese translation of your replyText.'
          },
          analysis: {
            type: Type.OBJECT,
            description: 'Pedagogical feedback on user message.',
            properties: {
              isGrammaticallyCorrect: { type: Type.BOOLEAN },
              userOriginal: { type: Type.STRING },
              nativePolished: {
                type: Type.STRING,
                description: 'How a native speaker would express this idea naturally in this scenario.'
              },
              grammarNotes: {
                type: Type.STRING,
                description: 'Constructive feedback in Chinese explaining grammar, word choice, or native nuance.'
              },
              vocabularyHighlights: {
                type: Type.ARRAY,
                description: 'Key native phrases or idioms introduced or corrected.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    meaningZh: { type: Type.STRING },
                    example: { type: Type.STRING }
                  },
                  required: ['word', 'meaningZh', 'example']
                }
              },
              pronunciationTips: { type: Type.STRING, description: 'Phonetic or liaison advice for tricky words in user message.' },
              fluencyScore: { type: Type.INTEGER, description: 'Score from 0 to 100 for this turn.' }
            },
            required: ['isGrammaticallyCorrect', 'userOriginal', 'nativePolished', 'grammarNotes', 'vocabularyHighlights', 'fluencyScore']
          },
          nextSuggestedPrompts: {
            type: Type.ARRAY,
            description: '3 recommended response hints for the user in English.',
            items: { type: Type.STRING }
          }
        },
        required: ['replyText', 'translation', 'analysis', 'nextSuggestedPrompts']
      }
    });

    const jsonText = response.text || '{}';
    const result = JSON.parse(jsonText);
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({
      error: 'Failed to process AI chat response',
      details: err.message || 'Unknown error'
    });
  }
});

// 3. Dedicated AI Native Expression Polish Endpoint
app.post('/api/polish', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text input is required' });
    }

    const ai = getAI();

    const systemInstruction = `
You are an elite English Linguistics Coach & Native Expression Polisher.
The user will input a sentence, fragment, or idea in Chinese, Chinglish, or rough English ("${text}").
Your goal is to transform this input into 3 DISTINCT native expression tiers:
1. Casual Native: Conversational, everyday relaxed native phrasing.
2. Professional Native: Polite, workplace, business, or elegant phrasing.
3. Colloquial Slang: Idiomatic, authentic, trendy or street native phrasing.

Also provide:
- Chinese translations and explanations for each tier.
- Key vocabulary/phrases breakdown with phonetics.
- A explanation of common Chinglish pitfalls if applicable.

Return strictly JSON matching the responseSchema.
`;

    const response = await generateContentWithFallback({
      contents: `Input to polish: "${text}"`,
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          casualNative: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              chinese: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ['english', 'chinese', 'explanation']
          },
          professionalNative: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              chinese: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ['english', 'chinese', 'explanation']
          },
          colloquialSlang: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              chinese: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ['english', 'chinese', 'explanation']
          },
          keyVocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phrase: { type: Type.STRING },
                phonetic: { type: Type.STRING },
                definitionZh: { type: Type.STRING },
                nativeExample: { type: Type.STRING }
              },
              required: ['phrase', 'phonetic', 'definitionZh', 'nativeExample']
            }
          },
          commonChinglishPitfall: { type: Type.STRING }
        },
        required: ['original', 'casualNative', 'professionalNative', 'colloquialSlang', 'keyVocabulary']
      }
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/polish:', err);
    return res.status(500).json({ error: 'Failed to polish expression', details: err.message });
  }
});

// 4. Custom Scenario Builder Endpoint
app.post('/api/custom-scenario', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAI();

    const systemInstruction = `
You are a curriculum designer for English language immersion programs.
The user wants to generate a customized real-life conversation scenario based on their custom topic/request: "${prompt}".
Generate a structured Scenario object with clear roles, goals, starter message, and suggested phrases.
`;

    const response = await generateContentWithFallback({
      contents: `Create scenario for: "${prompt}"`,
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          titleZh: { type: Type.STRING },
          category: { type: Type.STRING },
          categoryZh: { type: Type.STRING },
          description: { type: Type.STRING },
          descriptionZh: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          userRole: { type: Type.STRING },
          aiRole: { type: Type.STRING },
          starterMessage: { type: Type.STRING },
          goal: { type: Type.STRING },
          goalZh: { type: Type.STRING },
          suggestedPhrases: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          iconName: { type: Type.STRING }
        },
        required: ['id', 'title', 'titleZh', 'category', 'categoryZh', 'description', 'descriptionZh', 'difficulty', 'userRole', 'aiRole', 'starterMessage', 'goal', 'goalZh', 'suggestedPhrases', 'iconName']
      }
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/custom-scenario:', err);
    return res.status(500).json({ error: 'Failed to generate custom scenario', details: err.message });
  }
});

// Server Initialization
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
