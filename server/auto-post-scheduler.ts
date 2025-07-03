import cron from 'node-cron';
import { db } from './db';
import { scheduledPosts, autoPostSettings, imageLibrary, platforms } from '@shared/schema';
import { eq, and, lte, desc } from 'drizzle-orm';
import { scheduleAutoPosts, generateCaptionForImage } from './image-service';
import { generateOptimizedContent } from './optimized-openai';

export class AutoPostScheduler {
  private isRunning = false;

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🤖 Auto-post scheduler started');

    // Check for pending posts every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.processPendingPosts();
    });

    // Generate new scheduled posts daily at 6 AM
    cron.schedule('0 6 * * *', async () => {
      await this.generateDailyPosts();
    });

    // Cleanup old completed posts weekly
    cron.schedule('0 2 * * 0', async () => {
      await this.cleanupOldPosts();
    });
  }

  stop() {
    this.isRunning = false;
    console.log('🛑 Auto-post scheduler stopped');
  }

  private async processPendingPosts() {
    try {
      const now = new Date();
      
      // Get posts that should be published now
      const pendingPosts = await db
        .select({
          id: scheduledPosts.id,
          userId: scheduledPosts.userId,
          imageId: scheduledPosts.imageId,
          platformId: scheduledPosts.platformId,
          caption: scheduledPosts.caption,
          hashtags: scheduledPosts.hashtags,
          scheduledTime: scheduledPosts.scheduledTime,
          postData: scheduledPosts.postData,
          platform: platforms.name,
          image: {
            id: imageLibrary.id,
            fileName: imageLibrary.fileName,
            filePath: imageLibrary.filePath,
            aiDescription: imageLibrary.aiDescription,
            mood: imageLibrary.mood
          }
        })
        .from(scheduledPosts)
        .leftJoin(platforms, eq(scheduledPosts.platformId, platforms.id))
        .leftJoin(imageLibrary, eq(scheduledPosts.imageId, imageLibrary.id))
        .where(and(
          eq(scheduledPosts.status, 'pending'),
          lte(scheduledPosts.scheduledTime, now)
        ))
        .limit(10);

      for (const post of pendingPosts) {
        await this.publishPost(post);
      }
    } catch (error) {
      console.error('Error processing pending posts:', error);
    }
  }

  private async publishPost(post: any) {
    try {
      // Simulate posting to platform (in real implementation, use platform APIs)
      const success = await this.simulatePostToSocialMedia(post);
      
      if (success) {
        // Mark as posted
        await db
          .update(scheduledPosts)
          .set({ 
            status: 'posted',
            postedAt: new Date()
          })
          .where(eq(scheduledPosts.id, post.id));
        
        console.log(`✅ Posted to ${post.platform}: ${post.caption.substring(0, 50)}...`);
      } else {
        // Mark as failed
        await db
          .update(scheduledPosts)
          .set({ 
            status: 'failed',
            errorMessage: 'Failed to connect to platform API'
          })
          .where(eq(scheduledPosts.id, post.id));
        
        console.log(`❌ Failed to post to ${post.platform}`);
      }
    } catch (error) {
      console.error(`Error publishing post ${post.id}:`, error);
      
      await db
        .update(scheduledPosts)
        .set({ 
          status: 'failed',
          errorMessage: error.message || 'Unknown error'
        })
        .where(eq(scheduledPosts.id, post.id));
    }
  }

  private async simulatePostToSocialMedia(post: any): Promise<boolean> {
    // Simulate API call delay and success/failure
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // 95% success rate for simulation
    const success = Math.random() > 0.05;
    
    if (success && post.image) {
      // In real implementation, upload image and post content to actual platform APIs
      console.log(`📱 Posting to ${post.platform}:`, {
        caption: post.caption,
        hashtags: post.hashtags,
        image: post.image.fileName,
        mood: post.image.mood
      });
    }
    
    return success;
  }

  private async generateDailyPosts() {
    try {
      console.log('🎯 Generating daily auto-posts...');
      
      // Get all users with auto-posting enabled
      const enabledUsers = await db
        .select()
        .from(autoPostSettings)
        .where(eq(autoPostSettings.isEnabled, true));

      for (const userSettings of enabledUsers) {
        await scheduleAutoPosts(userSettings.userId);
      }
      
      console.log(`✅ Generated auto-posts for ${enabledUsers.length} users`);
    } catch (error) {
      console.error('Error generating daily posts:', error);
    }
  }

  private async cleanupOldPosts() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const deleted = await db
        .delete(scheduledPosts)
        .where(and(
          eq(scheduledPosts.status, 'posted'),
          lte(scheduledPosts.postedAt, thirtyDaysAgo)
        ));
      
      console.log(`🧹 Cleaned up old posts`);
    } catch (error) {
      console.error('Error cleaning up old posts:', error);
    }
  }

  async getPostingStats(userId: number) {
    try {
      const now = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);

      const stats = await db
        .select({
          status: scheduledPosts.status,
          count: scheduledPosts.id
        })
        .from(scheduledPosts)
        .where(and(
          eq(scheduledPosts.userId, userId),
          lte(scheduledPosts.createdAt, now)
        ));

      const weeklyStats = await db
        .select({
          status: scheduledPosts.status,
          count: scheduledPosts.id
        })
        .from(scheduledPosts)
        .where(and(
          eq(scheduledPosts.userId, userId),
          lte(scheduledPosts.createdAt, lastWeek)
        ));

      return {
        total: {
          pending: stats.filter(s => s.status === 'pending').length,
          posted: stats.filter(s => s.status === 'posted').length,
          failed: stats.filter(s => s.status === 'failed').length
        },
        thisWeek: {
          pending: weeklyStats.filter(s => s.status === 'pending').length,
          posted: weeklyStats.filter(s => s.status === 'posted').length,
          failed: weeklyStats.filter(s => s.status === 'failed').length
        }
      };
    } catch (error) {
      console.error('Error getting posting stats:', error);
      return {
        total: { pending: 0, posted: 0, failed: 0 },
        thisWeek: { pending: 0, posted: 0, failed: 0 }
      };
    }
  }
}

export const autoPostScheduler = new AutoPostScheduler();