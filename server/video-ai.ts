import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface VideoScene {
  id: string;
  type: 'hook' | 'content' | 'transition' | 'cta';
  duration: number;
  script: string;
  visualDescription: string;
  audioNotes: string;
  textOverlay?: string;
  cameraAngle?: string;
  timing: {
    start: number;
    end: number;
  };
}

export interface VideoProject {
  id: string;
  title: string;
  platform: string;
  duration: number;
  style: string;
  scenes: VideoScene[];
  soundtrack?: string;
  transitions: string[];
  thumbnail: {
    title: string;
    description: string;
    style: string;
  };
  metadata: {
    hashtags: string[];
    description: string;
    estimatedViews: number;
    engagementScore: number;
    viralPotential: number;
  };
}

export interface VideoEditRequest {
  operation: 'trim' | 'merge' | 'overlay' | 'transition' | 'audio' | 'effects';
  parameters: any;
  timestamp?: number;
}

// Platform-specific video requirements
const PLATFORM_SPECS = {
  TikTok: { maxDuration: 180, aspectRatio: '9:16', optimalLength: 30 },
  Instagram: { maxDuration: 90, aspectRatio: '9:16', optimalLength: 30 },
  YouTube: { maxDuration: 600, aspectRatio: '16:9', optimalLength: 180 },
  Facebook: { maxDuration: 240, aspectRatio: '16:9', optimalLength: 60 },
  Twitter: { maxDuration: 140, aspectRatio: '16:9', optimalLength: 45 },
  Snapchat: { maxDuration: 60, aspectRatio: '9:16', optimalLength: 15 }
};

export async function generateVideoProject(
  topic: string,
  platform: string,
  style: 'viral' | 'educational' | 'entertainment' | 'promotional' = 'viral',
  duration?: number
): Promise<VideoProject> {
  const specs = PLATFORM_SPECS[platform as keyof typeof PLATFORM_SPECS] || PLATFORM_SPECS.TikTok;
  const targetDuration = duration || specs.optimalLength;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert video creator specializing in viral ${platform} content. Create detailed video projects with scene-by-scene breakdowns that maximize engagement and shareability. Focus on authentic, high-quality content that naturally attracts views.`
        },
        {
          role: "user",
          content: `Create a ${targetDuration}-second ${style} video for ${platform} about "${topic}". 

Return a JSON object with this structure:
{
  "title": "Compelling video title",
  "platform": "${platform}",
  "duration": ${targetDuration},
  "style": "${style}",
  "scenes": [
    {
      "id": "scene_1",
      "type": "hook|content|transition|cta",
      "duration": seconds,
      "script": "What to say",
      "visualDescription": "What viewers see",
      "audioNotes": "Background music/sound effects",
      "textOverlay": "Text on screen",
      "cameraAngle": "Close-up/Wide/Medium",
      "timing": {"start": 0, "end": duration}
    }
  ],
  "soundtrack": "Music style recommendation",
  "transitions": ["Transition effects between scenes"],
  "thumbnail": {
    "title": "Thumbnail text",
    "description": "Visual description",
    "style": "Design style"
  },
  "metadata": {
    "hashtags": ["relevant", "hashtags"],
    "description": "Video description",
    "estimatedViews": estimated_number,
    "engagementScore": 1-100,
    "viralPotential": 1-100
  }
}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8
    });

    const videoProject = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      id: `video_${Date.now()}`,
      ...videoProject
    };

  } catch (error) {
    console.error('Error generating video project:', error);
    throw new Error('Failed to generate video project');
  }
}

export async function generateVideoScript(
  scenes: VideoScene[],
  platform: string,
  tone: 'casual' | 'professional' | 'energetic' | 'educational' = 'energetic'
): Promise<{ script: string; timing: any; hooks: string[] }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a viral content scriptwriter for ${platform}. Create engaging, natural scripts that hook viewers immediately and keep them watching. Focus on conversational, authentic language that drives engagement.`
        },
        {
          role: "user",
          content: `Create a detailed script for these video scenes with ${tone} tone:

${scenes.map((scene, i) => `Scene ${i + 1} (${scene.duration}s): ${scene.script}`).join('\n')}

Return JSON with:
{
  "script": "Complete formatted script with timing cues",
  "timing": {
    "totalDuration": seconds,
    "scenes": [{"start": 0, "end": 5, "text": "script text"}]
  },
  "hooks": ["Alternative opening hooks"]
}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    return JSON.parse(response.choices[0].message.content || '{}');

  } catch (error) {
    console.error('Error generating video script:', error);
    throw new Error('Failed to generate video script');
  }
}

export async function optimizeVideoForPlatform(
  videoProject: VideoProject,
  targetPlatform: string
): Promise<VideoProject> {
  const specs = PLATFORM_SPECS[targetPlatform as keyof typeof PLATFORM_SPECS];
  if (!specs) {
    throw new Error(`Unsupported platform: ${targetPlatform}`);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a platform optimization expert. Adapt video content to maximize performance on ${targetPlatform} while maintaining quality and engagement.`
        },
        {
          role: "user",
          content: `Optimize this video for ${targetPlatform} (max ${specs.maxDuration}s, ${specs.aspectRatio}, optimal ${specs.optimalLength}s):

Current video: ${JSON.stringify(videoProject, null, 2)}

Return the optimized video project as JSON, adjusting:
- Scene timing and duration
- Script for platform-specific language
- Hashtags for platform algorithms
- Thumbnail strategy
- Call-to-action placement

Keep the same JSON structure but optimize all content for ${targetPlatform}.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6
    });

    const optimized = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      ...optimized,
      id: `${videoProject.id}_${targetPlatform.toLowerCase()}`,
      platform: targetPlatform
    };

  } catch (error) {
    console.error('Error optimizing video:', error);
    throw new Error('Failed to optimize video for platform');
  }
}

export async function generateVideoThumbnail(
  title: string,
  style: string,
  platform: string
): Promise<{ url: string; description: string; elements: string[] }> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a compelling ${platform} video thumbnail for "${title}". Style: ${style}. Make it eye-catching, high-contrast, and optimized for mobile viewing. Include engaging facial expressions, bold text, and vibrant colors that stand out in feeds.`,
      n: 1,
      size: platform === 'YouTube' ? "1792x1024" : "1024x1792",
      quality: "hd"
    });

    return {
      url: response.data[0].url || '',
      description: `${style} thumbnail for ${platform}`,
      elements: ['Bold text', 'Engaging expression', 'High contrast colors', 'Clear focal point']
    };

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw new Error('Failed to generate video thumbnail');
  }
}

export async function analyzeVideoPerformance(
  videoProject: VideoProject,
  actualViews?: number,
  actualEngagement?: number
): Promise<{
  score: number;
  insights: string[];
  improvements: string[];
  nextTopics: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a viral content analyst. Analyze video performance and provide actionable insights for improvement."
        },
        {
          role: "user",
          content: `Analyze this video project:
${JSON.stringify(videoProject, null, 2)}

Actual performance:
- Views: ${actualViews || 'Not available'}
- Engagement: ${actualEngagement || 'Not available'}

Return JSON with:
{
  "score": 1-100,
  "insights": ["Key performance insights"],
  "improvements": ["Specific improvement suggestions"],
  "nextTopics": ["Related topic suggestions for next videos"]
}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    return JSON.parse(response.choices[0].message.content || '{}');

  } catch (error) {
    console.error('Error analyzing video performance:', error);
    throw new Error('Failed to analyze video performance');
  }
}

export async function generateVideoSeries(
  mainTopic: string,
  platform: string,
  episodeCount: number = 5
): Promise<VideoProject[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a content series strategist. Create cohesive video series that build audience and maintain engagement across multiple episodes.`
        },
        {
          role: "user",
          content: `Create a ${episodeCount}-part video series about "${mainTopic}" for ${platform}. Each video should be connected but standalone.

Return an array of video project outlines following the same structure as generateVideoProject, but focus on series cohesion and progressive value delivery.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8
    });

    const seriesData = JSON.parse(response.choices[0].message.content || '{}');
    const series: VideoProject[] = [];

    for (let i = 0; i < episodeCount; i++) {
      if (seriesData.episodes && seriesData.episodes[i]) {
        const episode = await generateVideoProject(
          seriesData.episodes[i].topic,
          platform,
          'educational',
          PLATFORM_SPECS[platform as keyof typeof PLATFORM_SPECS]?.optimalLength
        );
        series.push({
          ...episode,
          title: `${seriesData.seriesTitle} - Part ${i + 1}: ${episode.title}`
        });
      }
    }

    return series;

  } catch (error) {
    console.error('Error generating video series:', error);
    throw new Error('Failed to generate video series');
  }
}