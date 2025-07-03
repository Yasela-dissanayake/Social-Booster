import { 
  users, platforms, content, analytics, costSavings, insights, appSettings,
  type User, type InsertUser, type Platform, type InsertPlatform,
  type Content, type InsertContent, type Analytics, type InsertAnalytics,
  type CostSavings, type InsertCostSavings, type Insight, type InsertInsight,
  type AppSettings, type InsertAppSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Platforms
  getAllPlatforms(): Promise<Platform[]>;
  getPlatform(id: number): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;

  // Content
  getContent(id: number): Promise<Content | undefined>;
  getContentByUser(userId: number): Promise<Content[]>;
  getContentByPlatform(userId: number, platformId: number): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, updates: Partial<Content>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;

  // Analytics
  getAnalyticsByUser(userId: number): Promise<Analytics[]>;
  getAnalyticsByPlatform(userId: number, platformId: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(id: number, updates: Partial<Analytics>): Promise<Analytics | undefined>;

  // Cost Savings
  getCostSavingsByUser(userId: number): Promise<CostSavings[]>;
  getCostSavingsForMonth(userId: number, month: number, year: number): Promise<CostSavings | undefined>;
  createCostSavings(costSavings: InsertCostSavings): Promise<CostSavings>;
  updateCostSavings(id: number, updates: Partial<CostSavings>): Promise<CostSavings | undefined>;

  // Insights
  getInsightsByUser(userId: number): Promise<Insight[]>;
  getActiveInsightsByUser(userId: number): Promise<Insight[]>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  updateInsight(id: number, updates: Partial<Insight>): Promise<Insight | undefined>;

  // App Settings
  getAppSettings(): Promise<AppSettings | undefined>;
  updateAppSettings(updates: Partial<AppSettings>): Promise<AppSettings>;
  initializeAppSettings(): Promise<AppSettings>;
}

export class DatabaseStorage implements IStorage {
  async initializePlatforms() {
    // Check if platforms already exist
    const existingPlatforms = await this.getAllPlatforms();
    if (existingPlatforms.length > 0) return;

    const defaultPlatforms: InsertPlatform[] = [
      { name: "TikTok", color: "#000000", icon: "fab fa-tiktok", isActive: true },
      { name: "Instagram", color: "#E4405F", icon: "fab fa-instagram", isActive: true },
      { name: "Facebook", color: "#1877F2", icon: "fab fa-facebook", isActive: true },
      { name: "Snapchat", color: "#FFFC00", icon: "fab fa-snapchat", isActive: true },
      { name: "YouTube", color: "#FF0000", icon: "fab fa-youtube", isActive: true },
      { name: "Twitter", color: "#1DA1F2", icon: "fab fa-twitter", isActive: true },
    ];

    for (const platform of defaultPlatforms) {
      await db.insert(platforms).values(platform);
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Platforms
  async getAllPlatforms(): Promise<Platform[]> {
    return await db.select().from(platforms);
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    const [platform] = await db.select().from(platforms).where(eq(platforms.id, id));
    return platform || undefined;
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const [platform] = await db
      .insert(platforms)
      .values(insertPlatform)
      .returning();
    return platform;
  }

  // Content
  async getContent(id: number): Promise<Content | undefined> {
    const [contentItem] = await db.select().from(content).where(eq(content.id, id));
    return contentItem || undefined;
  }

  async getContentByUser(userId: number): Promise<Content[]> {
    return await db.select().from(content).where(eq(content.userId, userId));
  }

  async getContentByPlatform(userId: number, platformId: number): Promise<Content[]> {
    return await db.select().from(content)
      .where(and(eq(content.userId, userId), eq(content.platformId, platformId)));
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const [contentItem] = await db
      .insert(content)
      .values(insertContent)
      .returning();
    return contentItem;
  }

  async updateContent(id: number, updates: Partial<Content>): Promise<Content | undefined> {
    const [contentItem] = await db
      .update(content)
      .set(updates)
      .where(eq(content.id, id))
      .returning();
    return contentItem || undefined;
  }

  async deleteContent(id: number): Promise<boolean> {
    const result = await db.delete(content).where(eq(content.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Analytics
  async getAnalyticsByUser(userId: number): Promise<Analytics[]> {
    return await db.select().from(analytics).where(eq(analytics.userId, userId));
  }

  async getAnalyticsByPlatform(userId: number, platformId: number): Promise<Analytics[]> {
    return await db.select().from(analytics)
      .where(and(eq(analytics.userId, userId), eq(analytics.platformId, platformId)));
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const [analyticsItem] = await db
      .insert(analytics)
      .values(insertAnalytics)
      .returning();
    return analyticsItem;
  }

  async updateAnalytics(id: number, updates: Partial<Analytics>): Promise<Analytics | undefined> {
    const [analyticsItem] = await db
      .update(analytics)
      .set(updates)
      .where(eq(analytics.id, id))
      .returning();
    return analyticsItem || undefined;
  }

  // Cost Savings
  async getCostSavingsByUser(userId: number): Promise<CostSavings[]> {
    return await db.select().from(costSavings).where(eq(costSavings.userId, userId));
  }

  async getCostSavingsForMonth(userId: number, month: number, year: number): Promise<CostSavings | undefined> {
    const [costSavingsItem] = await db.select().from(costSavings)
      .where(and(
        eq(costSavings.userId, userId),
        eq(costSavings.month, month),
        eq(costSavings.year, year)
      ));
    return costSavingsItem || undefined;
  }

  async createCostSavings(insertCostSavings: InsertCostSavings): Promise<CostSavings> {
    const [costSavingsItem] = await db
      .insert(costSavings)
      .values(insertCostSavings)
      .returning();
    return costSavingsItem;
  }

  async updateCostSavings(id: number, updates: Partial<CostSavings>): Promise<CostSavings | undefined> {
    const [costSavingsItem] = await db
      .update(costSavings)
      .set(updates)
      .where(eq(costSavings.id, id))
      .returning();
    return costSavingsItem || undefined;
  }

  // Insights
  async getInsightsByUser(userId: number): Promise<Insight[]> {
    return await db.select().from(insights).where(eq(insights.userId, userId));
  }

  async getActiveInsightsByUser(userId: number): Promise<Insight[]> {
    return await db.select().from(insights)
      .where(and(eq(insights.userId, userId), eq(insights.isActive, true)));
  }

  async createInsight(insertInsight: InsertInsight): Promise<Insight> {
    const [insight] = await db
      .insert(insights)
      .values(insertInsight)
      .returning();
    return insight;
  }

  async updateInsight(id: number, updates: Partial<Insight>): Promise<Insight | undefined> {
    const [insight] = await db
      .update(insights)
      .set(updates)
      .where(eq(insights.id, id))
      .returning();
    return insight || undefined;
  }

  async getAppSettings(): Promise<AppSettings | undefined> {
    const [settings] = await db.select().from(appSettings).limit(1);
    return settings || undefined;
  }

  async updateAppSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    const existingSettings = await this.getAppSettings();
    
    if (existingSettings) {
      const [updated] = await db
        .update(appSettings)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(appSettings.id, existingSettings.id))
        .returning();
      return updated;
    } else {
      return await this.initializeAppSettings();
    }
  }

  async initializeAppSettings(): Promise<AppSettings> {
    const defaultSettings = {
      subscriptionEnabled: false,
      freePostLimit: 5,
      proPriceGbp: "24.00",
      premiumPriceGbp: "79.00",
      proFeatures: [
        "Unlimited AI Content Generation",
        "Advanced Analytics",
        "Multi-Platform Publishing",
        "Priority Support"
      ],
      premiumFeatures: [
        "Everything in Pro",
        "AI Video Studio",
        "Custom Branding",
        "API Access",
        "White-label Solution"
      ],
      maintenanceMode: false
    };

    const [settings] = await db
      .insert(appSettings)
      .values(defaultSettings)
      .returning();
    return settings;
  }
}

export const storage = new DatabaseStorage();
