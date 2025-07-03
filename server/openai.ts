import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key",
  maxRetries: 1,
  timeout: 30000
});

export interface AppBranding {
  name: string;
  tagline: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  description: string;
}

export interface ContentGeneration {
  title: string;
  content: string;
  hashtags: string[];
  estimatedViews: number;
  qualityScore: number;
}

export interface ImageGeneration {
  url: string;
  description: string;
}

export async function generateAppBranding(): Promise<AppBranding> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a creative branding expert. Generate innovative app names and branding for social media growth platforms. Respond with JSON in this format: { 'name': string, 'tagline': string, 'colors': { 'primary': string, 'secondary': string, 'accent': string }, 'description': string }",
        },
        {
          role: "user",
          content: "Generate a creative and catchy name and branding for an AI-powered social media content creation and growth platform. The app should sound modern, tech-savvy, and trustworthy. Include hex color codes for the color scheme.",
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result;
  } catch (error: any) {
    throw new Error("Failed to generate app branding: " + error.message);
  }
}

export async function generateContent(
  platform: string,
  contentType: string,
  topic: string,
  style: string = "engaging"
): Promise<ContentGeneration> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert social media content creator specializing in ${platform}. Create ${style} ${contentType} content that follows ${platform}'s best practices and algorithm preferences. Respond with JSON in this format: { 'title': string, 'content': string, 'hashtags': string[], 'estimatedViews': number, 'qualityScore': number }`,
        },
        {
          role: "user",
          content: `Create a ${contentType} for ${platform} about "${topic}". Make it viral-worthy, platform-optimized, and include relevant hashtags. Estimate potential views based on quality and trending potential (0-1000000). Quality score should be 1-100 based on engagement potential.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return {
      title: result.title,
      content: result.content,
      hashtags: result.hashtags || [],
      estimatedViews: Math.max(0, Math.min(1000000, result.estimatedViews || 0)),
      qualityScore: Math.max(1, Math.min(100, result.qualityScore || 50)),
    };
  } catch (error: any) {
    throw new Error("Failed to generate content: " + error.message);
  }
}

export async function generateImage(prompt: string): Promise<ImageGeneration> {
  // Check if OpenAI API key is properly configured
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "default_key" || apiKey.includes("your-") || apiKey === "sk_test_" || apiKey.length < 20) {
    throw new Error("OpenAI API key not configured for image generation");
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a high-quality, realistic image of: ${prompt}. Make it visually appealing, detailed, and professionally composed.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (!response.data || !response.data[0] || !response.data[0].url) {
      throw new Error("Invalid response from OpenAI API");
    }

    return {
      url: response.data[0].url,
      description: prompt,
    };
  } catch (error: any) {
    // Better error handling for different types of OpenAI errors
    if (error.status === 400) {
      throw new Error(`Invalid prompt or request: ${error.message}`);
    } else if (error.status === 401) {
      throw new Error("Invalid API key or authentication failed");
    } else if (error.status === 429) {
      throw new Error("Rate limit exceeded or quota reached");
    } else if (error.status === 500) {
      throw new Error("OpenAI service temporarily unavailable");
    } else {
      throw new Error(`Image generation failed: ${error.message || 'Unknown error'}`);
    }
  }
}

export async function generateVideoScript(
  platform: string,
  topic: string,
  duration: string = "30 seconds"
): Promise<ContentGeneration> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a viral video script writer specializing in ${platform}. Create engaging ${duration} video scripts that hook viewers in the first 3 seconds and maintain engagement throughout. Respond with JSON in this format: { 'title': string, 'content': string, 'hashtags': string[], 'estimatedViews': number, 'qualityScore': number }`,
        },
        {
          role: "user",
          content: `Write a ${duration} video script for ${platform} about "${topic}". Include scene descriptions, dialogue, and visual cues. Make it viral-worthy with a strong hook, engaging middle, and memorable ending.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return {
      title: result.title,
      content: result.content,
      hashtags: result.hashtags || [],
      estimatedViews: Math.max(0, Math.min(1000000, result.estimatedViews || 0)),
      qualityScore: Math.max(1, Math.min(100, result.qualityScore || 50)),
    };
  } catch (error: any) {
    throw new Error("Failed to generate video script: " + error.message);
  }
}

export async function generateHashtags(
  platform: string,
  content: string,
  niche: string
): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a hashtag expert for ${platform}. Generate trending, relevant hashtags that maximize reach and engagement. Respond with JSON in this format: { 'hashtags': string[] }`,
        },
        {
          role: "user",
          content: `Generate 10-15 optimized hashtags for ${platform} in the ${niche} niche. Content context: "${content}". Include mix of trending, niche-specific, and broad hashtags for maximum reach.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.hashtags || [];
  } catch (error: any) {
    throw new Error("Failed to generate hashtags: " + error.message);
  }
}

export interface StrategyPlan {
  title: string;
  description: string;
  duration: string;
  platforms: string[];
  contentTypes: string[];
  postingSchedule: {
    platform: string;
    times: string[];
    frequency: string;
  }[];
  keyMetrics: string[];
  estimatedResults: {
    viewsIncrease: string;
    engagementBoost: string;
    followerGrowth: string;
    reachExpansion: string;
  };
  actionItems: {
    id: string;
    task: string;
    priority: 'high' | 'medium' | 'low';
    platform: string;
    contentType: string;
    deadline: string;
  }[];
  learningInsights: string[];
  trendingTopics: string[];
  competitorAnalysis: string[];
}

export interface TrendAnalysis {
  platform: string;
  trendingHashtags: string[];
  viralContentTypes: string[];
  optimalPostingTimes: string[];
  emergingTopics: string[];
  audienceBehavior: string[];
  algorithmChanges: string[];
}

export async function generateAIStrategy(
  userGoals: string,
  currentPerformance: any,
  platformData: any[],
  contentHistory: any[]
): Promise<StrategyPlan> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an elite social media strategist with deep expertise in viral content creation, platform algorithms, and growth hacking. You create comprehensive, data-driven strategies that adapt to current trends and platform changes. You understand TikTok, Instagram, Facebook, Snapchat, YouTube, and Twitter algorithms intimately.

Respond with a detailed strategy plan in JSON format: {
  "title": string,
  "description": string,
  "duration": string,
  "platforms": string[],
  "contentTypes": string[],
  "postingSchedule": [{"platform": string, "times": string[], "frequency": string}],
  "keyMetrics": string[],
  "estimatedResults": {"viewsIncrease": string, "engagementBoost": string, "followerGrowth": string, "reachExpansion": string},
  "actionItems": [{"id": string, "task": string, "priority": string, "platform": string, "contentType": string, "deadline": string}],
  "learningInsights": string[],
  "trendingTopics": string[],
  "competitorAnalysis": string[]
}`,
        },
        {
          role: "user",
          content: `Create a comprehensive AI-powered social media strategy based on:

Goals: ${userGoals}
Current Performance: ${JSON.stringify(currentPerformance)}
Platform Data: ${JSON.stringify(platformData.slice(0, 3))}
Content History: ${JSON.stringify(contentHistory.slice(0, 5))}

Focus on:
1. Latest 2024-2025 social media trends and algorithm updates
2. Self-learning recommendations that adapt based on performance
3. Platform-specific optimizations for maximum viral potential
4. Automated content scheduling and execution
5. Real-time trend incorporation and competitor analysis
6. AI-driven content personalization and A/B testing strategies

Create a strategy that evolves and learns from each post's performance to continuously improve results.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result;
  } catch (error: any) {
    throw new Error("Failed to generate AI strategy: " + error.message);
  }
}

export async function analyzeTrends(
  platforms: string[],
  niche: string,
  currentDate: Date = new Date()
): Promise<TrendAnalysis[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a real-time social media trend analyst with access to current platform data and algorithm insights. You track viral content patterns, emerging hashtags, optimal posting strategies, and platform algorithm changes.

Respond with trend analysis in JSON format: {
  "trendsData": [
    {
      "platform": string,
      "trendingHashtags": string[],
      "viralContentTypes": string[],
      "optimalPostingTimes": string[],
      "emergingTopics": string[],
      "audienceBehavior": string[],
      "algorithmChanges": string[]
    }
  ]
}`,
        },
        {
          role: "user",
          content: `Analyze current trends for ${platforms.join(', ')} in the ${niche} niche as of ${currentDate.toDateString()}.

Provide:
1. Latest trending hashtags and their growth momentum
2. Viral content formats performing well right now
3. Optimal posting times based on current algorithm preferences
4. Emerging topics and themes gaining traction
5. Recent audience behavior shifts and engagement patterns
6. Latest algorithm updates and how to leverage them

Focus on actionable insights that can be implemented immediately for maximum reach and engagement.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.trendsData || [];
  } catch (error: any) {
    throw new Error("Failed to analyze trends: " + error.message);
  }
}

export async function generateAIAssistantResponse(userMessage: string) {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert AI assistant for a social media content creation platform. You help users with:
        
        - Content strategy and ideas
        - Platform-specific best practices (TikTok, Instagram, YouTube, Twitter, Facebook, OnlyFans, Snapchat)
        - Hashtag research and optimization
        - Engagement tactics and growth strategies
        - Content scheduling and timing
        - Troubleshooting platform issues
        - Analytics interpretation
        - Viral content creation tips
        
        Always provide actionable, specific advice. Be encouraging and enthusiastic. Include relevant examples when helpful.
        Keep responses concise but comprehensive. End with helpful follow-up suggestions.`
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    max_tokens: 500,
    temperature: 0.7
  });

  const assistantResponse = response.choices[0].message.content;
  
  // Generate contextual suggestions based on the user's question
  const suggestions = generateContextualSuggestions(userMessage);
  
  return {
    response: assistantResponse,
    suggestions: suggestions
  };
}

function generateContextualSuggestions(userMessage: string): string[] {
  const messageLower = userMessage.toLowerCase();
  
  if (messageLower.includes('tiktok') || messageLower.includes('viral')) {
    return [
      "Best TikTok trending hashtags this week",
      "How to optimize TikTok posting times",
      "TikTok video length best practices"
    ];
  }
  
  if (messageLower.includes('instagram') || messageLower.includes('reels')) {
    return [
      "Instagram Reels vs Posts strategy",
      "Best Instagram hashtag combinations",
      "Instagram Story engagement tips"
    ];
  }
  
  if (messageLower.includes('youtube') || messageLower.includes('video')) {
    return [
      "YouTube thumbnail optimization",
      "Video SEO best practices",
      "YouTube Shorts vs long-form content"
    ];
  }
  
  if (messageLower.includes('hashtag')) {
    return [
      "Research trending hashtags for my niche",
      "Hashtag strategy for different platforms",
      "How many hashtags should I use?"
    ];
  }
  
  if (messageLower.includes('engagement') || messageLower.includes('growth')) {
    return [
      "Increase engagement rate strategies",
      "Best times to post for maximum reach",
      "Community building tactics"
    ];
  }
  
  // Default suggestions
  return [
    "Create a content calendar strategy",
    "Analyze my competitor's success",
    "Generate content ideas for my brand",
    "Optimize my posting schedule"
  ];
}

export async function executeStrategyActions(
  strategy: StrategyPlan,
  platformId: number,
  userId: number
): Promise<any[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an AI content execution specialist. You take strategic plans and generate specific, ready-to-publish content pieces. Create multiple content variations optimized for different platforms and audience segments.

Respond with executable content in JSON format: {
  "generatedContent": [
    {
      "title": string,
      "content": string,
      "contentType": string,
      "hashtags": string[],
      "platform": string,
      "scheduledTime": string,
      "estimatedViews": number,
      "qualityScore": number,
      "aiOptimizations": string[]
    }
  ]
}`,
        },
        {
          role: "user",
          content: `Execute the following strategy by generating specific content pieces:

Strategy: ${JSON.stringify(strategy)}
Platform ID: ${platformId}
User ID: ${userId}

Generate 5-7 diverse content pieces that implement this strategy, including:
1. Hook-driven posts optimized for each platform's algorithm
2. Trending topic integrations with viral potential
3. Engagement-driving questions and calls-to-action
4. Platform-specific content formats (short videos, carousels, stories)
5. AI-optimized hashtag combinations for maximum discoverability

Each piece should be ready for immediate publishing with optimal scheduling recommendations.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.generatedContent || [];
  } catch (error: any) {
    throw new Error("Failed to execute strategy actions: " + error.message);
  }
}

export async function generateInsights(
  platformData: any[],
  contentHistory: any[]
): Promise<any[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media analytics expert. Analyze performance data and provide actionable insights. Respond with JSON in this format: { 'insights': [{ 'type': string, 'title': string, 'description': string, 'confidence': number }] }",
        },
        {
          role: "user",
          content: `Analyze this social media performance data and content history to generate 3-5 actionable insights: Platform Data: ${JSON.stringify(platformData.slice(0, 5))} Content History: ${JSON.stringify(contentHistory.slice(0, 10))}. Focus on posting times, content types, hashtag performance, and engagement patterns.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.insights || [];
  } catch (error: any) {
    throw new Error("Failed to generate insights: " + error.message);
  }
}
