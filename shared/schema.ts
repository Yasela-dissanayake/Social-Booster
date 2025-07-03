import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  appName: text("app_name"),
  appBranding: jsonb("app_branding"),
  subscriptionTier: text("subscription_tier").default("free").notNull(), // free, pro, premium
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"), // active, inactive, canceled, past_due
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").default(true),
});

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platformId: integer("platform_id").notNull(),
  type: text("type").notNull(), // 'post', 'caption', 'hashtags', 'video_script', 'image'
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  hashtags: text("hashtags").array(),
  status: text("status").notNull().default("draft"), // 'draft', 'scheduled', 'published'
  aiGenerated: boolean("ai_generated").default(true),
  qualityScore: integer("quality_score"),
  estimatedViews: integer("estimated_views"),
  actualViews: integer("actual_views"),
  engagement: decimal("engagement", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platformId: integer("platform_id").notNull(),
  date: timestamp("date").notNull(),
  totalViews: integer("total_views").default(0),
  totalEngagement: decimal("total_engagement", { precision: 10, scale: 2 }).default("0"),
  postsGenerated: integer("posts_generated").default(0),
  avgQualityScore: decimal("avg_quality_score", { precision: 5, scale: 2 }),
});

export const costSavings = pgTable("cost_savings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  contentAgencyCost: decimal("content_agency_cost", { precision: 10, scale: 2 }).default("1500"),
  stockPhotosCost: decimal("stock_photos_cost", { precision: 10, scale: 2 }).default("299"),
  copywritingCost: decimal("copywriting_cost", { precision: 10, scale: 2 }).default("800"),
  toolsCost: decimal("tools_cost", { precision: 10, scale: 2 }).default("149"),
  totalSaved: decimal("total_saved", { precision: 10, scale: 2 }),
});

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'best_time', 'trending_hashtag', 'content_style'
  title: text("title").notNull(),
  description: text("description").notNull(),
  platformId: integer("platform_id"),
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  subscriptionEnabled: boolean("subscription_enabled").default(false),
  freePostLimit: integer("free_post_limit").default(5),
  proPriceGbp: decimal("pro_price_gbp", { precision: 10, scale: 2 }).default("24.00"),
  premiumPriceGbp: decimal("premium_price_gbp", { precision: 10, scale: 2 }).default("79.00"),
  proFeatures: jsonb("pro_features").default([]),
  premiumFeatures: jsonb("premium_features").default([]),
  maintenanceMode: boolean("maintenance_mode").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const imageLibrary = pgTable("image_library", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  width: integer("width"),
  height: integer("height"),
  tags: text("tags").array().default([]),
  aiDescription: text("ai_description"),
  mood: text("mood"), // happy, professional, energetic, calm, etc.
  colorPalette: jsonb("color_palette"), // dominant colors from image
  isActive: boolean("is_active").default(true),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const autoPostSettings = pgTable("auto_post_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  isEnabled: boolean("is_enabled").default(false),
  postFrequency: text("post_frequency").default("daily"), // daily, every_few_hours, weekly
  timeSlots: jsonb("time_slots").default([]), // preferred posting times
  platforms: text("platforms").array().default([]), // which platforms to post to
  contentStyle: text("content_style").default("engaging"), // engaging, professional, casual, viral
  useImageLibrary: boolean("use_image_library").default(true),
  generateCaptions: boolean("generate_captions").default(true),
  generateHashtags: boolean("generate_hashtags").default(true),
  maxPostsPerDay: integer("max_posts_per_day").default(3),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  imageId: integer("image_id"),
  platformId: integer("platform_id").notNull(),
  caption: text("caption").notNull(),
  hashtags: text("hashtags").array().default([]),
  scheduledTime: timestamp("scheduled_time").notNull(),
  status: text("status").default("pending"), // pending, posted, failed, cancelled
  autoGenerated: boolean("auto_generated").default(true),
  generatedCaption: text("generated_caption"),
  generatedHashtags: text("generated_hashtags").array().default([]),
  postData: jsonb("post_data"), // platform-specific data
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  postedAt: timestamp("posted_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPlatformSchema = createInsertSchema(platforms).omit({
  id: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

export const insertCostSavingsSchema = createInsertSchema(costSavings).omit({
  id: true,
});

export const insertInsightSchema = createInsertSchema(insights).omit({
  id: true,
  createdAt: true,
});

export const insertAppSettingsSchema = createInsertSchema(appSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertImageLibrarySchema = createInsertSchema(imageLibrary).omit({
  id: true,
  uploadedAt: true,
});

export const insertAutoPostSettingsSchema = createInsertSchema(autoPostSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertScheduledPostsSchema = createInsertSchema(scheduledPosts).omit({
  id: true,
  createdAt: true,
  postedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;

export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type CostSavings = typeof costSavings.$inferSelect;
export type InsertCostSavings = z.infer<typeof insertCostSavingsSchema>;

export type Insight = typeof insights.$inferSelect;
export type InsertInsight = z.infer<typeof insertInsightSchema>;

export type AppSettings = typeof appSettings.$inferSelect;
export type InsertAppSettings = z.infer<typeof insertAppSettingsSchema>;

export type ImageLibrary = typeof imageLibrary.$inferSelect;
export type InsertImageLibrary = z.infer<typeof insertImageLibrarySchema>;

export type AutoPostSettings = typeof autoPostSettings.$inferSelect;
export type InsertAutoPostSettings = z.infer<typeof insertAutoPostSettingsSchema>;

export type ScheduledPosts = typeof scheduledPosts.$inferSelect;
export type InsertScheduledPosts = z.infer<typeof insertScheduledPostsSchema>;
