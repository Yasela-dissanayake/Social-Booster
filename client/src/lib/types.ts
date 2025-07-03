export interface DashboardStats {
  contentGenerated: number;
  totalViews: string;
  costSavings: string;
  qualityScore: string;
}

export interface PlatformPerformance {
  platform: {
    id: number;
    name: string;
    color: string;
    icon: string;
  };
  postsGenerated: number;
  totalViews: string;
  engagement: string;
}

export interface RecentContent {
  id: number;
  title: string;
  platform: {
    name: string;
    color: string;
    icon: string;
  };
  status: string;
  timeAgo: string;
  actualViews?: number;
  estimatedViews?: number;
}

export interface AIInsight {
  id: number;
  type: string;
  title: string;
  description: string;
  confidence?: string;
}

export interface CostBreakdown {
  contentAgencyCost: string;
  stockPhotosCost: string;
  copywritingCost: string;
  toolsCost: string;
  totalSaved: string;
}

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

export interface GeneratedContent {
  title: string;
  content: string;
  hashtags: string[];
  estimatedViews: number;
  qualityScore: number;
}
