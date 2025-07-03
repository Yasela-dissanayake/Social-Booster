import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TranslationRequest {
  content: string;
  fromLanguage: string;
  toLanguage: string;
  platform: string;
  contentType: string;
  preserveHashtags?: boolean;
  localizeForCulture?: boolean;
}

export interface TranslationResult {
  translatedContent: string;
  originalContent: string;
  fromLanguage: string;
  toLanguage: string;
  platform: string;
  localizedHashtags: string[];
  culturalAdaptations: string[];
  confidence: number;
  suggestions: string[];
}

// Comprehensive language support
export const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', flag: '🇺🇸', region: 'Global' },
  'es': { name: 'Spanish', flag: '🇪🇸', region: 'Spain/Latin America' },
  'fr': { name: 'French', flag: '🇫🇷', region: 'France/Francophone' },
  'de': { name: 'German', flag: '🇩🇪', region: 'Germany/DACH' },
  'it': { name: 'Italian', flag: '🇮🇹', region: 'Italy' },
  'pt': { name: 'Portuguese', flag: '🇵🇹', region: 'Portugal/Brazil' },
  'ru': { name: 'Russian', flag: '🇷🇺', region: 'Russia/CIS' },
  'ja': { name: 'Japanese', flag: '🇯🇵', region: 'Japan' },
  'ko': { name: 'Korean', flag: '🇰🇷', region: 'South Korea' },
  'zh': { name: 'Chinese (Simplified)', flag: '🇨🇳', region: 'China' },
  'zh-TW': { name: 'Chinese (Traditional)', flag: '🇹🇼', region: 'Taiwan/Hong Kong' },
  'ar': { name: 'Arabic', flag: '🇸🇦', region: 'Middle East/North Africa' },
  'hi': { name: 'Hindi', flag: '🇮🇳', region: 'India' },
  'th': { name: 'Thai', flag: '🇹🇭', region: 'Thailand' },
  'vi': { name: 'Vietnamese', flag: '🇻🇳', region: 'Vietnam' },
  'id': { name: 'Indonesian', flag: '🇮🇩', region: 'Indonesia' },
  'ms': { name: 'Malay', flag: '🇲🇾', region: 'Malaysia' },
  'tl': { name: 'Filipino', flag: '🇵🇭', region: 'Philippines' },
  'tr': { name: 'Turkish', flag: '🇹🇷', region: 'Turkey' },
  'pl': { name: 'Polish', flag: '🇵🇱', region: 'Poland' },
  'nl': { name: 'Dutch', flag: '🇳🇱', region: 'Netherlands' },
  'sv': { name: 'Swedish', flag: '🇸🇪', region: 'Sweden' },
  'no': { name: 'Norwegian', flag: '🇳🇴', region: 'Norway' },
  'da': { name: 'Danish', flag: '🇩🇰', region: 'Denmark' },
  'fi': { name: 'Finnish', flag: '🇫🇮', region: 'Finland' }
};

// Platform-specific translation considerations
const PLATFORM_TRANSLATION_RULES = {
  TikTok: {
    maxLength: 300,
    preserveHashtags: true,
    emphasizeEngagement: true,
    useLocalSlang: true
  },
  Instagram: {
    maxLength: 2200,
    preserveHashtags: true,
    includeEmojis: true,
    localizeHashtags: true
  },
  YouTube: {
    maxLength: 5000,
    preserveDescriptive: true,
    includeSEOKeywords: true,
    formalTone: true
  },
  Twitter: {
    maxLength: 280,
    conciseTranslation: true,
    preserveTrending: true,
    quickEngagement: true
  },
  Facebook: {
    maxLength: 1000,
    communityFriendly: true,
    localCulture: true,
    familyAppropriate: true
  },
  Snapchat: {
    maxLength: 100,
    casualTone: true,
    youthOriented: true,
    localSlang: true
  },
  OnlyFans: {
    maxLength: 1000,
    personalTone: true,
    engagementFocused: true,
    culturallySensitive: true
  }
};

// Advanced translation with cultural localization
export async function translateContent(request: TranslationRequest): Promise<TranslationResult> {
  const { content, fromLanguage, toLanguage, platform, contentType, preserveHashtags = true, localizeForCulture = true } = request;
  
  try {
    const platformRules = PLATFORM_TRANSLATION_RULES[platform as keyof typeof PLATFORM_TRANSLATION_RULES] || {};
    const targetLanguageInfo = SUPPORTED_LANGUAGES[toLanguage as keyof typeof SUPPORTED_LANGUAGES];
    
    const translationPrompt = `
    Translate and localize this ${platform} ${contentType} content with cultural adaptation:
    
    Original content: "${content}"
    From: ${fromLanguage} to ${toLanguage} (${targetLanguageInfo?.region})
    Platform: ${platform}
    
    Requirements:
    - Translate accurately while preserving meaning and tone
    - Adapt cultural references for ${targetLanguageInfo?.region}
    - Maintain platform-appropriate style for ${platform}
    ${preserveHashtags ? '- Preserve original hashtags and suggest localized alternatives' : ''}
    ${localizeForCulture ? '- Include cultural localization suggestions' : ''}
    - Keep within ${platformRules.maxLength || 1000} characters
    - Maintain engagement potential
    
    Provide response in JSON format:
    {
      "translatedContent": "...",
      "localizedHashtags": ["...", "..."],
      "culturalAdaptations": ["...", "..."],
      "confidence": 0.95,
      "suggestions": ["...", "..."]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert translator and cultural localization specialist. You understand social media platforms, cultural nuances, and how to adapt content for different regions while maintaining engagement and authenticity.`
        },
        {
          role: "user",
          content: translationPrompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      translatedContent: result.translatedContent || content,
      originalContent: content,
      fromLanguage,
      toLanguage,
      platform,
      localizedHashtags: result.localizedHashtags || [],
      culturalAdaptations: result.culturalAdaptations || [],
      confidence: result.confidence || 0.85,
      suggestions: result.suggestions || []
    };
    
  } catch (error) {
    console.error('Translation error:', error);
    
    // Fallback response
    return {
      translatedContent: content,
      originalContent: content,
      fromLanguage,
      toLanguage,
      platform,
      localizedHashtags: [],
      culturalAdaptations: [`Translation service temporarily unavailable for ${toLanguage}`],
      confidence: 0.0,
      suggestions: ['Please try again or check your API configuration']
    };
  }
}

// Batch translation for multiple languages
export async function batchTranslateContent(
  content: string,
  fromLanguage: string,
  targetLanguages: string[],
  platform: string,
  contentType: string
): Promise<{ [language: string]: TranslationResult }> {
  
  const batchPrompt = `
  Translate this ${platform} content to multiple languages with cultural localization:
  
  Original: "${content}" (${fromLanguage})
  Target languages: ${targetLanguages.map(lang => `${lang} (${SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]?.region})`).join(', ')}
  Platform: ${platform}
  
  For each language, provide culturally appropriate translation and localization.
  
  JSON format:
  {
    "${targetLanguages[0]}": {
      "translatedContent": "...",
      "localizedHashtags": ["..."],
      "culturalAdaptations": ["..."],
      "confidence": 0.95
    },
    "${targetLanguages[1]}": {
      "translatedContent": "...",
      "localizedHashtags": ["..."],
      "culturalAdaptations": ["..."],
      "confidence": 0.92
    }
    // ... continue for all languages
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a multilingual content localization expert specializing in social media content adaptation across cultures."
        },
        {
          role: "user",
          content: batchPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const batchResults = JSON.parse(response.choices[0].message.content || "{}");
    const results: { [language: string]: TranslationResult } = {};
    
    targetLanguages.forEach(lang => {
      const langResult = batchResults[lang];
      if (langResult) {
        results[lang] = {
          translatedContent: langResult.translatedContent || content,
          originalContent: content,
          fromLanguage,
          toLanguage: lang,
          platform,
          localizedHashtags: langResult.localizedHashtags || [],
          culturalAdaptations: langResult.culturalAdaptations || [],
          confidence: langResult.confidence || 0.85,
          suggestions: langResult.suggestions || []
        };
      }
    });
    
    return results;
    
  } catch (error) {
    console.error('Batch translation error:', error);
    
    // Create fallback results for each language
    const fallbackResults: { [language: string]: TranslationResult } = {};
    targetLanguages.forEach(lang => {
      fallbackResults[lang] = {
        translatedContent: content,
        originalContent: content,
        fromLanguage,
        toLanguage: lang,
        platform,
        localizedHashtags: [],
        culturalAdaptations: ['Translation temporarily unavailable'],
        confidence: 0.0,
        suggestions: ['Please try again later']
      };
    });
    
    return fallbackResults;
  }
}

// Generate multilingual content variations
export async function generateMultilingualContent(
  topic: string,
  languages: string[],
  platform: string,
  style: string = "engaging"
): Promise<{ [language: string]: any }> {
  
  const multilingualPrompt = `
  Generate ${platform} content about "${topic}" in multiple languages with cultural adaptation:
  
  Languages: ${languages.map(lang => `${lang} (${SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]?.region})`).join(', ')}
  Platform: ${platform}
  Style: ${style}
  
  For each language:
  1. Create culturally appropriate content
  2. Include region-specific references where relevant
  3. Use appropriate hashtags for that market
  4. Adapt style to local preferences
  
  JSON format:
  {
    "${languages[0]}": {
      "content": "...",
      "hashtags": ["..."],
      "culturalNotes": ["..."],
      "engagementTips": ["..."]
    }
    // ... for all languages
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a multilingual content creator who understands cultural nuances and creates engaging, locally relevant content for different markets."
        },
        {
          role: "user",
          content: multilingualPrompt
        }
      ],
      max_tokens: 1200,
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
    
  } catch (error) {
    console.error('Multilingual generation error:', error);
    
    // Fallback with basic structure
    const fallback: { [language: string]: any } = {};
    languages.forEach(lang => {
      fallback[lang] = {
        content: `[${SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]?.flag}] Content about ${topic} - Translation service temporarily unavailable`,
        hashtags: [`#${topic.replace(/\s+/g, '')}`, "#global"],
        culturalNotes: ["Translation service unavailable"],
        engagementTips: ["Please try again later"]
      };
    });
    
    return fallback;
  }
}

// Detect language of content
export async function detectLanguage(content: string): Promise<{ language: string; confidence: number; suggestions: string[] }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a language detection expert. Identify the language of text content accurately."
        },
        {
          role: "user",
          content: `Detect the language of this content: "${content}"\n\nProvide JSON: {"language": "language_code", "confidence": 0.95, "suggestions": ["alternative_languages_if_uncertain"]}`
        }
      ],
      max_tokens: 150,
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      language: result.language || 'en',
      confidence: result.confidence || 0.8,
      suggestions: result.suggestions || []
    };
    
  } catch (error) {
    console.error('Language detection error:', error);
    return {
      language: 'en',
      confidence: 0.5,
      suggestions: ['Language detection temporarily unavailable']
    };
  }
}

export default {
  translateContent,
  batchTranslateContent,
  generateMultilingualContent,
  detectLanguage,
  SUPPORTED_LANGUAGES
};