import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { StatsCard } from "@/components/stats-card";
import { PlatformPerformanceCard } from "@/components/platform-performance";
import { AIGeneratorPanel } from "@/components/ai-generator-panel";
import { RecentContentCard } from "@/components/recent-content";
import { AIInsightsCard } from "@/components/ai-insights";
import { CostBreakdownCard } from "@/components/cost-breakdown";
import { TutorialWalkthrough, TutorialTrigger } from "@/components/tutorial-walkthrough";
import { Button } from "@/components/ui/button";
import { Bell, Plus, Play, BookOpen } from "lucide-react";
import { Wand2, Eye, DollarSign, Star } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useLocation } from "wouter";
import type { DashboardStats } from "@/lib/types";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const userId = 1; // Demo user

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats/" + userId],
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h2 className="text-2xl font-bold text-slate-900">Content Dashboard</h2>
              <p className="text-slate-600">Generate viral content across all platforms</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
                onClick={() => setLocation("/generator")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-slate-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    <p className="text-sm text-muted-foreground">Stay updated with your content performance</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-3 border-b hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">🎬 TikTok video reached 10K views!</p>
                          <p className="text-xs text-muted-foreground mt-1">Your "AI Content Creation Tips" is trending</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-b hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">💰 Cost savings milestone achieved</p>
                          <p className="text-xs text-muted-foreground mt-1">You've saved $2,500 this month using AI generation</p>
                          <p className="text-xs text-muted-foreground">4 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-b hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">🌟 New AI feature available</p>
                          <p className="text-xs text-muted-foreground mt-1">Try the multilingual translator for global reach</p>
                          <p className="text-xs text-muted-foreground">6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t">
                    <Button variant="ghost" className="w-full text-sm" onClick={() => setLocation("/analytics")}>
                      View all notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* New User Tutorial Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
                  <Play className="h-6 w-6" />
                  Learn AI Content Creation in 5 Minutes!
                </h2>
                <p className="text-purple-100 mb-4 max-w-lg">
                  Master our AI-powered platform with an interactive tutorial. Create your first viral post step-by-step with expert guidance.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Interactive Guide
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    5 Min Tutorial
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Real Examples
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <TutorialTrigger onClick={() => setIsTutorialOpen(true)} />
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Examples
                </Button>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))
            ) : (
              <>
                <StatsCard
                  title="Content Generated"
                  value={stats?.contentGenerated.toString() || "0"}
                  change="+23%"
                  icon={Wand2}
                  iconColor="bg-green-100 text-green-600"
                />
                <StatsCard
                  title="Total Views"
                  value={stats?.totalViews || "0"}
                  change="+45%"
                  description="engagement boost"
                  icon={Eye}
                  iconColor="bg-pink-100 text-pink-600"
                />
                <StatsCard
                  title="Cost Savings"
                  value={stats?.costSavings || "$0"}
                  description="vs hiring agencies"
                  icon={DollarSign}
                  iconColor="bg-green-100 text-green-600"
                />
                <StatsCard
                  title="AI Quality Score"
                  value={stats?.qualityScore || "0%"}
                  change="+8%"
                  description="this week"
                  icon={Star}
                  iconColor="bg-purple-100 text-purple-600"
                />
              </>
            )}
          </div>

          {/* Platform Performance & AI Generator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PlatformPerformanceCard userId={userId} />
            <AIGeneratorPanel />
          </div>

          {/* Recent AI Generated Content */}
          <RecentContentCard userId={userId} />

          {/* AI Insights & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIInsightsCard userId={userId} />
            <CostBreakdownCard userId={userId} />
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Tutorial Walkthrough Modal */}
      <TutorialWalkthrough 
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onComplete={() => {
          setIsTutorialOpen(false);
          // Could add completion celebration or redirect to content creation
        }}
      />
    </div>
  );
}
