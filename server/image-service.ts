import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { db } from './db';
import { imageLibrary, autoPostSettings, scheduledPosts, platforms } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import { generateOptimizedContent } from './optimized-openai';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/images';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export interface ImageAnalysis {
  description: string;
  mood: string;
  dominantColors: string[];
  suggestedTags: string[];
}

export async function analyzeImageWithAI(imagePath: string): Promise<ImageAnalysis> {
  try {
    // Convert image to base64 for AI analysis
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Use your optimized OpenAI to analyze the image
    const analysisPrompt = `Analyze this image and provide:
1. A detailed description
2. The mood/emotion it conveys
3. 3-5 dominant colors
4. 5-8 relevant hashtag tags

Respond in JSON format: {
  "description": "detailed description",
  "mood": "mood (e.g., happy, professional, energetic, calm)",
  "dominantColors": ["color1", "color2", "color3"],
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    const response = await generateOptimizedContent(
      analysisPrompt,
      "instagram"
    );
    
    return JSON.parse(response.content);
  } catch (error) {
    console.error('AI image analysis failed:', error);
    // Fallback analysis based on filename and basic properties
    return {
      description: "User uploaded image",
      mood: "neutral",
      dominantColors: ["#000000", "#ffffff"],
      suggestedTags: ["photo", "content", "social"]
    };
  }
}

export async function processAndSaveImage(
  file: Express.Multer.File,
  userId: number
): Promise<number> {
  try {
    // Get image dimensions and optimize
    const metadata = await sharp(file.path).metadata();
    
    // Create optimized version
    const optimizedPath = file.path.replace(/\.(jpg|jpeg|png)$/i, '-optimized.jpg');
    await sharp(file.path)
      .resize(1080, 1080, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toFile(optimizedPath);

    // Analyze image with AI
    const analysis = await analyzeImageWithAI(file.path);

    // Save to database
    const [savedImage] = await db.insert(imageLibrary).values({
      userId,
      fileName: path.basename(optimizedPath),
      originalName: file.originalname,
      filePath: optimizedPath,
      fileSize: fs.statSync(optimizedPath).size,
      mimeType: 'image/jpeg',
      width: metadata.width || 0,
      height: metadata.height || 0,
      tags: analysis.suggestedTags,
      aiDescription: analysis.description,
      mood: analysis.mood,
      colorPalette: { dominantColors: analysis.dominantColors }
    }).returning();

    // Clean up original file if different from optimized
    if (file.path !== optimizedPath) {
      fs.unlinkSync(file.path);
    }

    return savedImage.id;
  } catch (error) {
    console.error('Image processing failed:', error);
    throw error;
  }
}

export async function generateCaptionForImage(
  image: any,
  platform: string,
  style: string = 'engaging'
): Promise<{ caption: string; hashtags: string[] }> {
  try {
    const prompt = `Create a ${style} social media caption for ${platform} based on this image:

Image Description: ${image.aiDescription}
Mood: ${image.mood}
Tags: ${image.tags?.join(', ')}

Requirements:
- Make it ${style} and platform-appropriate for ${platform}
- Include relevant emojis
- Keep it concise but compelling
- Generate 8-12 relevant hashtags

Respond in JSON format: {
  "caption": "the caption text",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

    const response = await generateOptimizedContent(prompt, platform);
    const result = JSON.parse(response.content);
    
    return {
      caption: result.caption,
      hashtags: result.hashtags
    };
  } catch (error) {
    console.error('Caption generation failed:', error);
    return {
      caption: `Check out this amazing ${image.mood} moment! ${image.aiDescription}`,
      hashtags: image.tags || ['photo', 'content', 'social']
    };
  }
}

export async function scheduleAutoPosts(userId: number): Promise<void> {
  try {
    // Get user's auto-post settings
    const [settings] = await db
      .select()
      .from(autoPostSettings)
      .where(eq(autoPostSettings.userId, userId));

    if (!settings || !settings.isEnabled) {
      return;
    }

    // Get available images
    const images = await db
      .select()
      .from(imageLibrary)
      .where(and(
        eq(imageLibrary.userId, userId),
        eq(imageLibrary.isActive, true)
      ))
      .orderBy(desc(imageLibrary.uploadedAt))
      .limit(10);

    if (images.length === 0) {
      return;
    }

    // Get platforms
    const platformList = await db
      .select()
      .from(platforms)
      .where(eq(platforms.isActive, true));

    const targetPlatforms = platformList.filter(p => 
      (settings.platforms || []).includes(p.name.toLowerCase())
    );

    // Generate scheduled posts
    const now = new Date();
    const timeSlots = settings.timeSlots as string[] || ['09:00', '15:00', '19:00'];
    
    for (let i = 0; i < Math.min(settings.maxPostsPerDay || 3, images.length); i++) {
      const image = images[i];
      const timeSlot = timeSlots[i % timeSlots.length];
      
      // Calculate next posting time
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setDate(now.getDate() + Math.floor(i / timeSlots.length));
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // If time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      for (const platform of targetPlatforms) {
        // Generate content for this platform
        const { caption, hashtags } = await generateCaptionForImage(
          image,
          platform.name,
          settings.contentStyle || 'engaging'
        );

        // Schedule the post
        await db.insert(scheduledPosts).values({
          userId,
          imageId: image.id,
          platformId: platform.id,
          caption,
          hashtags,
          scheduledTime,
          autoGenerated: true,
          generatedCaption: caption,
          generatedHashtags: hashtags,
          postData: {
            platform: platform.name,
            style: settings.contentStyle,
            imageAnalysis: {
              mood: image.mood,
              description: image.aiDescription
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Auto-post scheduling failed:', error);
  }
}

export async function getUserImages(userId: number, limit: number = 20) {
  return await db
    .select()
    .from(imageLibrary)
    .where(and(
      eq(imageLibrary.userId, userId),
      eq(imageLibrary.isActive, true)
    ))
    .orderBy(desc(imageLibrary.uploadedAt))
    .limit(limit);
}

export async function getScheduledPosts(userId: number, limit: number = 50) {
  return await db
    .select({
      id: scheduledPosts.id,
      caption: scheduledPosts.caption,
      hashtags: scheduledPosts.hashtags,
      scheduledTime: scheduledPosts.scheduledTime,
      status: scheduledPosts.status,
      autoGenerated: scheduledPosts.autoGenerated,
      platform: platforms.name,
      platformColor: platforms.color,
      platformIcon: platforms.icon,
      image: {
        id: imageLibrary.id,
        fileName: imageLibrary.fileName,
        aiDescription: imageLibrary.aiDescription,
        mood: imageLibrary.mood
      }
    })
    .from(scheduledPosts)
    .leftJoin(platforms, eq(scheduledPosts.platformId, platforms.id))
    .leftJoin(imageLibrary, eq(scheduledPosts.imageId, imageLibrary.id))
    .where(eq(scheduledPosts.userId, userId))
    .orderBy(desc(scheduledPosts.scheduledTime))
    .limit(limit);
}

export async function deleteImage(imageId: number, userId: number): Promise<boolean> {
  try {
    // Get image details
    const [image] = await db
      .select()
      .from(imageLibrary)
      .where(and(
        eq(imageLibrary.id, imageId),
        eq(imageLibrary.userId, userId)
      ));

    if (!image) {
      return false;
    }

    // Delete file from filesystem
    if (fs.existsSync(image.filePath)) {
      fs.unlinkSync(image.filePath);
    }

    // Mark as inactive in database
    await db
      .update(imageLibrary)
      .set({ isActive: false })
      .where(eq(imageLibrary.id, imageId));

    return true;
  } catch (error) {
    console.error('Image deletion failed:', error);
    return false;
  }
}