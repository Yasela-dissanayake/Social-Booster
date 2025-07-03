import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp, TrendingDown, Zap, Target, Clock, Users, 
  Lightbulb, Flame, ChartBar, Globe, Eye, Hash,
  Calendar, Sparkles, Brain, Rocket
} from "lucide-react";

interface TrendAnalyzerProps {
  userId: number;
}

export function TrendAnalyzer({ userId }: TrendAnalyzerProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [analysisType, setAnalysisType] = useState("trending");

  const { data: trendData, isLoading } = useQuery({
    queryKey: ['/api/trends/analyze', userId, selectedPlatform, analysisType],
    enabled: !!userId
  });

  const { data: contentSuggestions } = useQuery({
    queryKey: ['/api/trends/suggestions', userId, selectedPlatform],
    enabled: !!userId
  });

  const { data: viralOpportunities } = useQuery({
    queryKey: ['/api/trends/viral-opportunities', userId],
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-20 bg-slate-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const platforms = [
    { id: "all", name: "All Platforms", color: "#6366f1" },
    { id: "tiktok", name: "TikTok", color: "#000000" },
    { id: "instagram", name: "Instagram", color: "#E4405F" },
    { id: "youtube", name: "YouTube", color: "#FF0000" },
    { id: "twitter", name: "Twitter", color: "#1DA1F2" }
  ];

  const trendingTopics = trendData?.trending || [
    { topic: "AI Productivity", score: 95, growth: "+127%", timeLeft: "2 days", difficulty: "Medium" },
    { topic: "Morning Routines", score: 89, growth: "+89%", timeLeft: "5 days", difficulty: "Easy" },
    { topic: "iPhone Tips", score: 83, growth: "+65%", timeLeft: "1 week", difficulty: "Easy" },
    { topic: "Study Methods", score: 78, growth: "+45%", timeLeft: "3 days", difficulty: "Medium" }
  ];

  const emergingTrends = trendData?.emerging || [
    { topic: "Micro Habits", score: 72, potential: "High", audience: "Young Adults", platform: "TikTok" },
    { topic: "Remote Work Setups", score: 68, potential: "Medium", audience: "Professionals", platform: "LinkedIn" },
    { topic: "Quick Recipes", score: 85, potential: "Very High", audience: "Food Lovers", platform: "Instagram" }
  ];

  const contentIdeas = contentSuggestions?.ideas || [
    {
      title: "5 AI Tools That Will Change Your Life",
      platform: "TikTok",
      viralScore: 92,
      difficulty: "Easy",
      estimatedViews: "2.5M",
      tags: ["#ai", "#productivity", "#tech"]
    },
    {
      title: "My Morning Routine for Success",
      platform: "Instagram",
      viralScore: 87,
      difficulty: "Easy",
      estimatedViews: "1.8M",
      tags: ["#morningroutine", "#productivity", "#lifestyle"]
    },
    {
      title: "Hidden iPhone Features You Didn't Know",
      platform: "YouTube",
      viralScore: 81,
      difficulty: "Medium",
      estimatedViews: "1.2M",
      tags: ["#iphone", "#tips", "#technology"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Button
            key={platform.id}
            variant={selectedPlatform === platform.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatform(platform.id)}
            className="flex items-center gap-2"
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: platform.color }}
            ></div>
            {platform.name}
          </Button>
        ))}
      </div>

      <Tabs value={analysisType} onValueChange={setAnalysisType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trending">Trending Now</TabsTrigger>
          <TabsTrigger value="emerging">Emerging Trends</TabsTrigger>
          <TabsTrigger value="opportunities">Viral Opportunities</TabsTrigger>
          <TabsTrigger value="ideas">Content Ideas</TabsTrigger>
        </TabsList>

        {/* Trending Topics */}
        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-red-500" />
                Hot Trending Topics
              </CardTitle>
              <CardDescription>
                Topics that are trending right now with high viral potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingTopics.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{trend.topic}</h4>
                        <Badge variant={trend.score > 85 ? "default" : "secondary"}>
                          {trend.score}/100
                        </Badge>
                        <Badge variant="outline" className="text-green-600">
                          {trend.growth}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Peak in {trend.timeLeft}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{trend.difficulty} difficulty</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Progress value={trend.score} className="w-20" />
                      <Button size="sm" variant="outline">
                        <Rocket className="mr-2 h-4 w-4" />
                        Create Content
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emerging Trends */}
        <TabsContent value="emerging" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Emerging Opportunities
              </CardTitle>
              <CardDescription>
                Early trends with high growth potential - get in before they explode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergingTrends.map((trend, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{trend.topic}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={trend.potential === "Very High" ? "default" : trend.potential === "High" ? "secondary" : "outline"}>
                          {trend.potential} Potential
                        </Badge>
                        <span className="text-sm font-medium text-green-600">{trend.score}/100</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Target Audience:</span>
                        <p className="font-medium">{trend.audience}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Best Platform:</span>
                        <p className="font-medium">{trend.platform}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Competition:</span>
                        <p className="font-medium text-green-600">Low</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button size="sm" className="mr-2">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Generate Ideas
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Monitor Trend
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Viral Opportunities */}
        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Viral Opportunities
              </CardTitle>
              <CardDescription>
                AI-identified opportunities with highest viral potential for your niche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Immediate Opportunity</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Act Now</Badge>
                  </div>
                  <h4 className="font-semibold mb-2">React to Trending News: Tech CEO Announcement</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Create reaction content to major tech announcement happening in next 6 hours. High engagement window.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>Est. 5M+ views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>6 hour window</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>98% viral score</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Algorithm Opportunity</span>
                    <Badge variant="outline" className="border-blue-300">This Week</Badge>
                  </div>
                  <h4 className="font-semibold mb-2">Platform Algorithm Favors: Educational Short-Form</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    TikTok algorithm currently boosting educational content under 60 seconds. Perfect timing for how-to videos.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>2M+ reach potential</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>+340% boost</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Seasonal Opportunity</span>
                    <Badge variant="outline" className="border-green-300">Next 2 Weeks</Badge>
                  </div>
                  <h4 className="font-semibold mb-2">Back-to-School Content Wave</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Study tips, productivity, and organizational content will peak. Early content gets better reach.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>3M+ potential views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <span>Global audience</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Content Ideas */}
        <TabsContent value="ideas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Content Suggestions
              </CardTitle>
              <CardDescription>
                Personalized content ideas based on trending topics and your performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentIdeas.map((idea, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{idea.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{idea.platform}</Badge>
                          <Badge variant={idea.viralScore > 85 ? "default" : "secondary"}>
                            {idea.viralScore}/100 viral score
                          </Badge>
                          <span className="text-sm text-muted-foreground">{idea.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>Est. {idea.estimatedViews} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Hash className="h-4 w-4" />
                            <span>{idea.tags.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{idea.viralScore}</div>
                        <div className="text-xs text-muted-foreground">viral score</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Rocket className="mr-2 h-4 w-4" />
                        Generate Content
                      </Button>
                      <Button size="sm" variant="outline">
                        <Brain className="mr-2 h-4 w-4" />
                        Get Script
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">Want More Personalized Ideas?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Tell us your niche or interests for highly targeted content suggestions
                </p>
                <div className="flex gap-2">
                  <Input placeholder="e.g., tech reviews, cooking, fitness..." className="flex-1" />
                  <Button>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}