import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Brain, TrendingUp, Calendar, Zap, Target, BarChart3, Rocket, Globe, Clock, Users } from "lucide-react";

interface AIAnalyticsDashboardProps {
  userId: number;
}

export function AIAnalyticsDashboard({ userId }: AIAnalyticsDashboardProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["TikTok", "Instagram", "YouTube"]);
  const [campaignTopic, setCampaignTopic] = useState("");
  const [calendarDays, setCalendarDays] = useState(30);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch viral trends
  const { data: viralTrends } = useQuery({
    queryKey: ["/api/trends/viral"],
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  // Performance analytics
  const performanceQuery = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/analytics/performance", { userId });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "📊 Performance Analysis Complete!",
        description: `Analyzed ${data.totalContentAnalyzed} pieces of content`,
      });
    },
  });

  // Generate optimized content
  const optimizedContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/optimized", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🚀 Optimized Content Generated!",
        description: `${data.improvement} improvement expected`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content/recent/" + userId] });
    },
  });

  // Generate content calendar
  const calendarMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/calendar/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "📅 Content Calendar Generated!",
        description: `Created ${data.totalPosts} posts for ${calendarDays} days`,
      });
    },
  });

  // Cross-platform campaign
  const campaignMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/campaign/cross-platform", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🌐 Cross-Platform Campaign Launched!",
        description: `${data.totalPlatforms} platforms, ${data.expectedReach.toLocaleString()} expected reach`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content/recent/" + userId] });
    },
  });

  const handleAnalyzePerformance = () => {
    performanceQuery.mutate();
  };

  const handleGenerateOptimized = () => {
    if (!campaignTopic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for optimized content",
        variant: "destructive",
      });
      return;
    }

    optimizedContentMutation.mutate({
      userId,
      topic: campaignTopic,
      platform: selectedPlatforms[0],
      performanceData: performanceQuery.data?.performanceMetrics || {}
    });
  };

  const handleGenerateCalendar = () => {
    calendarMutation.mutate({
      userId,
      startDate: new Date().toISOString(),
      days: calendarDays
    });
  };

  const handleLaunchCampaign = () => {
    if (!campaignTopic.trim() || selectedPlatforms.length === 0) {
      toast({
        title: "Campaign Details Required",
        description: "Please enter a topic and select platforms",
        variant: "destructive",
      });
      return;
    }

    campaignMutation.mutate({
      userId,
      topic: campaignTopic,
      platforms: selectedPlatforms,
      style: "growth"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Brain className="w-8 h-8" />
            AI Analytics & Growth Command Center
            <Badge className="bg-white/20 text-white">All Features</Badge>
          </CardTitle>
          <p className="text-indigo-100 text-lg">
            Complete AI-powered analytics, optimization, and growth acceleration suite
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">🔥 Viral Trends</TabsTrigger>
          <TabsTrigger value="analytics">📊 Performance</TabsTrigger>
          <TabsTrigger value="calendar">📅 Smart Calendar</TabsTrigger>
          <TabsTrigger value="campaigns">🚀 Campaigns</TabsTrigger>
        </TabsList>

        {/* Viral Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Real-Time Viral Trend Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viralTrends ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{viralTrends.totalTrends}</div>
                      <div className="text-sm text-gray-600">Active Trends</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{Math.round(viralTrends.averageViralScore)}%</div>
                      <div className="text-sm text-gray-600">Avg Viral Score</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2h</div>
                      <div className="text-sm text-gray-600">Update Frequency</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {viralTrends.trends?.map((trend: any, idx: number) => (
                      <Card key={idx} className="border-l-4 border-red-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{trend.topic}</CardTitle>
                            <Badge className="bg-red-100 text-red-800">
                              {trend.viralScore}% Viral Score
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">Growth: {trend.growthRate}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium mb-2">🎯 Suggested Hooks</h5>
                              <div className="text-sm space-y-1">
                                {trend.suggestedHooks?.map((hook: string, hookIdx: number) => (
                                  <div key={hookIdx} className="bg-gray-50 p-2 rounded border">
                                    "{hook}"
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">📱 Best Platforms</h5>
                              <div className="flex gap-2">
                                {trend.platforms?.map((platform: string, pIdx: number) => (
                                  <Badge key={pIdx} variant="secondary">{platform}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2"># Trending Hashtags</h5>
                              <div className="flex flex-wrap gap-1">
                                {trend.hashtags?.map((tag: string, tIdx: number) => (
                                  <Badge key={tIdx} className="bg-blue-100 text-blue-800 text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Loading viral trends...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                AI Performance Analytics & Auto-Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleAnalyzePerformance}
                disabled={performanceQuery.isPending}
                className="w-full"
                size="lg"
              >
                {performanceQuery.isPending ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing Performance...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Content Performance
                  </>
                )}
              </Button>

              {performanceQuery.data && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">🎯 Top Performing Hooks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {performanceQuery.data.performanceMetrics.topPerformingHooks?.slice(0, 3).map((hook: string, idx: number) => (
                            <div key={idx} className="text-xs bg-green-50 p-2 rounded">
                              "{hook}"
                            </div>
                          )) || <p className="text-sm text-gray-500">No data yet</p>}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">⏰ Optimal Posting Times</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {performanceQuery.data.performanceMetrics.bestPostingTimes?.slice(0, 3).map((time: string, idx: number) => (
                            <div key={idx} className="text-xs bg-blue-50 p-2 rounded">
                              {time}
                            </div>
                          )) || <p className="text-sm text-gray-500">No data yet</p>}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Label htmlFor="optimized-topic">Generate Optimized Content</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="optimized-topic"
                        placeholder="Enter topic for optimized content..."
                        value={campaignTopic}
                        onChange={(e) => setCampaignTopic(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleGenerateOptimized}
                        disabled={optimizedContentMutation.isPending}
                      >
                        {optimizedContentMutation.isPending ? (
                          <Zap className="w-4 h-4 animate-pulse" />
                        ) : (
                          <>
                            <Target className="w-4 h-4 mr-1" />
                            Optimize
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Automated Content Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calendar-days">Calendar Duration (Days)</Label>
                  <Select value={calendarDays.toString()} onValueChange={(value) => setCalendarDays(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleGenerateCalendar}
                    disabled={calendarMutation.isPending}
                    className="w-full"
                  >
                    {calendarMutation.isPending ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-pulse" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Generate Smart Calendar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {calendarMutation.data && (
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-lg">📅 Generated Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-xl font-bold text-purple-600">{calendarMutation.data.totalPosts}</div>
                        <div className="text-xs text-gray-600">Total Posts</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-xl font-bold text-green-600">
                          {Math.round(calendarMutation.data.expectedTotalReach / 1000000 * 10) / 10}M
                        </div>
                        <div className="text-xs text-gray-600">Expected Reach</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-xl font-bold text-blue-600">{calendarDays}</div>
                        <div className="text-xs text-gray-600">Days Planned</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="text-xl font-bold text-orange-600">5</div>
                        <div className="text-xs text-gray-600">Platforms</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Smart calendar generated with optimal posting times based on your performance data
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cross-Platform Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Cross-Platform Growth Accelerator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaign-topic">Campaign Topic</Label>
                  <Input
                    id="campaign-topic"
                    placeholder="Enter your campaign topic..."
                    value={campaignTopic}
                    onChange={(e) => setCampaignTopic(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Select Platforms</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {["TikTok", "Instagram", "YouTube", "Twitter", "Facebook", "Snapchat"].map((platform) => (
                      <Button
                        key={platform}
                        variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedPlatforms(prev => 
                            prev.includes(platform) 
                              ? prev.filter(p => p !== platform)
                              : [...prev, platform]
                          );
                        }}
                      >
                        {platform}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {selectedPlatforms.length} platforms
                  </p>
                </div>

                <Button 
                  onClick={handleLaunchCampaign}
                  disabled={campaignMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {campaignMutation.isPending ? (
                    <>
                      <Globe className="w-4 h-4 mr-2 animate-pulse" />
                      Launching Campaign...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Launch Cross-Platform Campaign
                    </>
                  )}
                </Button>
              </div>

              {campaignMutation.data && (
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg">🚀 Campaign Launched!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-xl font-bold text-green-600">{campaignMutation.data.totalPlatforms}</div>
                        <div className="text-xs text-gray-600">Platforms</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-xl font-bold text-blue-600">
                          {Math.round(campaignMutation.data.expectedReach / 1000)}K
                        </div>
                        <div className="text-xs text-gray-600">Expected Reach</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-xl font-bold text-purple-600">48h</div>
                        <div className="text-xs text-gray-600">Full Rollout</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="text-xl font-bold text-orange-600">95%</div>
                        <div className="text-xs text-gray-600">Viral Potential</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Campaign content created and scheduled with staggered launch times for maximum impact
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}