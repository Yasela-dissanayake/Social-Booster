// Standalone Storage System - Complete offline data management
export interface ContentItem {
  id: string;
  topic: string;
  platform: string;
  style: string;
  title: string;
  content: string;
  hashtags: string[];
  estimatedViews: number;
  qualityScore: number;
  viralPotential: number;
  createdAt: Date;
}

export interface StorageStats {
  contentGenerated: number;
  totalViews: number;
  platformsUsed: number;
  averageQuality: number;
  lastGenerated: Date | null;
}

export class StandaloneStorage {
  private storageKey = 'viral-ai-standalone';
  private data: {
    content: ContentItem[];
    stats: StorageStats;
    userSettings: any;
  };

  constructor() {
    this.data = this.loadData();
  }

  private loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.content?.forEach((item: any) => {
          item.createdAt = new Date(item.createdAt);
        });
        if (parsed.stats?.lastGenerated) {
          parsed.stats.lastGenerated = new Date(parsed.stats.lastGenerated);
        }
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load stored data:', error);
    }

    return {
      content: [],
      stats: {
        contentGenerated: 0,
        totalViews: 0,
        platformsUsed: 0,
        averageQuality: 0,
        lastGenerated: null
      },
      userSettings: {
        defaultPlatform: 'instagram',
        defaultStyle: 'viral',
        autoSave: true
      }
    };
  }

  private saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to save data:', error);
    }
  }

  async saveContent(content: Omit<ContentItem, 'id' | 'createdAt'>): Promise<ContentItem> {
    const newItem: ContentItem = {
      ...content,
      id: this.generateId(),
      createdAt: new Date()
    };

    this.data.content.unshift(newItem);
    
    // Keep only last 100 items to prevent storage bloat
    if (this.data.content.length > 100) {
      this.data.content = this.data.content.slice(0, 100);
    }

    // Update stats
    this.updateStats(newItem);
    this.saveData();

    return newItem;
  }

  getContent(limit: number = 20): ContentItem[] {
    return this.data.content.slice(0, limit);
  }

  getContentByPlatform(platform: string, limit: number = 10): ContentItem[] {
    return this.data.content
      .filter(item => item.platform === platform)
      .slice(0, limit);
  }

  deleteContent(id: string): boolean {
    const index = this.data.content.findIndex(item => item.id === id);
    if (index > -1) {
      this.data.content.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  getStats(): StorageStats & { mode: string; message: string } {
    return {
      ...this.data.stats,
      mode: 'standalone',
      message: '📱 Standalone Mode - No Internet Required'
    };
  }

  getPlatformAnalytics() {
    const platforms = ['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'linkedin', 'pinterest'];
    
    return platforms.map(platform => {
      const platformContent = this.data.content.filter(item => item.platform === platform);
      const totalViews = platformContent.reduce((sum, item) => sum + item.estimatedViews, 0);
      const avgQuality = platformContent.length > 0 
        ? platformContent.reduce((sum, item) => sum + item.qualityScore, 0) / platformContent.length 
        : 0;

      return {
        platform,
        contentCount: platformContent.length,
        totalViews,
        averageQuality: Math.round(avgQuality),
        lastPost: platformContent[0]?.createdAt || null
      };
    });
  }

  getTopPerformingContent(limit: number = 5): ContentItem[] {
    return [...this.data.content]
      .sort((a, b) => (b.viralPotential * b.qualityScore) - (a.viralPotential * a.qualityScore))
      .slice(0, limit);
  }

  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      
      // Validate structure
      if (imported.content && Array.isArray(imported.content)) {
        // Convert date strings back to Date objects
        imported.content.forEach((item: any) => {
          item.createdAt = new Date(item.createdAt);
        });
        
        this.data = imported;
        this.saveData();
        return true;
      }
    } catch (error) {
      console.warn('Failed to import data:', error);
    }
    return false;
  }

  clearAllData() {
    this.data = {
      content: [],
      stats: {
        contentGenerated: 0,
        totalViews: 0,
        platformsUsed: 0,
        averageQuality: 0,
        lastGenerated: null
      },
      userSettings: {
        defaultPlatform: 'instagram',
        defaultStyle: 'viral',
        autoSave: true
      }
    };
    this.saveData();
  }

  private updateStats(newItem: ContentItem) {
    this.data.stats.contentGenerated++;
    this.data.stats.totalViews += newItem.estimatedViews;
    this.data.stats.lastGenerated = newItem.createdAt;

    // Calculate platforms used
    const uniquePlatforms = new Set(this.data.content.map(item => item.platform));
    this.data.stats.platformsUsed = uniquePlatforms.size;

    // Calculate average quality
    const totalQuality = this.data.content.reduce((sum, item) => sum + item.qualityScore, 0);
    this.data.stats.averageQuality = Math.round(totalQuality / this.data.content.length);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // User settings management
  getUserSettings() {
    return this.data.userSettings;
  }

  updateUserSettings(settings: Partial<any>) {
    this.data.userSettings = { ...this.data.userSettings, ...settings };
    this.saveData();
  }

  // Search functionality
  searchContent(query: string): ContentItem[] {
    const searchTerm = query.toLowerCase();
    return this.data.content.filter(item => 
      item.topic.toLowerCase().includes(searchTerm) ||
      item.content.toLowerCase().includes(searchTerm) ||
      item.hashtags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Analytics helpers
  getContentByDateRange(startDate: Date, endDate: Date): ContentItem[] {
    return this.data.content.filter(item => 
      item.createdAt >= startDate && item.createdAt <= endDate
    );
  }

  getPerformanceMetrics() {
    const content = this.data.content;
    if (content.length === 0) {
      return {
        avgViralPotential: 0,
        avgQualityScore: 0,
        avgEstimatedViews: 0,
        topPlatform: 'instagram',
        topStyle: 'viral'
      };
    }

    const avgViralPotential = content.reduce((sum, item) => sum + item.viralPotential, 0) / content.length;
    const avgQualityScore = content.reduce((sum, item) => sum + item.qualityScore, 0) / content.length;
    const avgEstimatedViews = content.reduce((sum, item) => sum + item.estimatedViews, 0) / content.length;

    // Find most used platform and style
    const platformCounts = content.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const styleCounts = content.reduce((acc, item) => {
      acc[item.style] = (acc[item.style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPlatform = Object.keys(platformCounts).reduce((a, b) => 
      platformCounts[a] > platformCounts[b] ? a : b, 'instagram'
    );

    const topStyle = Object.keys(styleCounts).reduce((a, b) => 
      styleCounts[a] > styleCounts[b] ? a : b, 'viral'
    );

    return {
      avgViralPotential: Math.round(avgViralPotential),
      avgQualityScore: Math.round(avgQualityScore),
      avgEstimatedViews: Math.round(avgEstimatedViews),
      topPlatform,
      topStyle
    };
  }
}